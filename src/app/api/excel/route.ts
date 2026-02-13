import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/contentStore";
import { JOURNAL_ABBR_TO_FULL } from "@/lib/journalNames";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

const EXCEL_FILE_PATH = path.join(process.cwd(), "data", "journals.xlsx");
const EXCEL_BLOB_PATH = "data/journals.xlsx";

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

/** 엑셀 파일 버퍼 가져오기: Blob URL 또는 로컬/배포본 파일. Vercel에서도 Git에 포함된 파일은 읽기 가능 */
async function getExcelBuffer(): Promise<Buffer | null> {
  const content = (await getContent()) as { excelBlobUrl?: string };
  if (content.excelBlobUrl) {
    try {
      const res = await fetch(content.excelBlobUrl);
      if (!res.ok) return null;
      const ab = await res.arrayBuffer();
      return Buffer.from(ab);
    } catch {
      return null;
    }
  }
  if (existsSync(EXCEL_FILE_PATH)) {
    return readFile(EXCEL_FILE_PATH);
  }
  return null;
}

/** 엑셀 버퍼 저장: Vercel이면 Blob + content.excelBlobUrl, 로컬이면 파일 */
async function saveExcelBuffer(buffer: Buffer): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(EXCEL_BLOB_PATH, buffer, {
      access: "public",
      allowOverwrite: true,
    });
    const c = (await getContent()) as Record<string, unknown>;
    c.excelBlobUrl = blob.url;
    await saveContent(c);
  } else if (process.env.VERCEL === "1") {
    throw new Error(
      "배포 사이트에서는 엑셀 저장이 되지 않습니다. 로컬에서 수정한 뒤 data/journals.xlsx를 Git에 푸시해 주세요."
    );
  } else {
    await ensureDataDir();
    await writeFile(EXCEL_FILE_PATH, buffer);
  }
}

// GET: 엑셀 파일 읽기 또는 다운로드
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const download = searchParams.get("download") === "true";

    if (download) {
      let buffer = await getExcelBuffer();
      if (!buffer) {
        const XLSX = await import("xlsx");
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Journals");
        buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        await saveExcelBuffer(buffer);
      }
      const filename = `journals_${new Date().toISOString().split("T")[0]}.xlsx`;
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const buffer = await getExcelBuffer();
    if (!buffer) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "엑셀 파일이 없습니다. 새로 생성하세요.",
      });
    }

    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "엑셀 파일을 읽는 중 오류가 발생했습니다.";
    console.error("Excel read error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

async function updatePublicationsFromExcelData(data: any[], content: Record<string, unknown>) {
  let publications: any[] = [];
  if (content.journalPublications && typeof content.journalPublications === "string") {
    try {
      const parsed = JSON.parse(content.journalPublications);
      publications = Array.isArray(parsed) ? parsed : Object.values(parsed).filter((p: any) => p && p.number != null);
    } catch (e) {
      console.error("Failed to parse journalPublications:", e);
    }
  }

  const journalMap = new Map<string, { if?: number; jcrRanking?: string }>();
  data.forEach((row: any) => {
    const journalName = (row["Journal Name"] || row["저널 이름"] || "").toString().trim();
    const abbrRaw = row["Abbreviation"] || row["약어"] || row["Short name"] || "";
    const abbreviations = abbrRaw
      ? String(abbrRaw)
          .split(/[,;]/)
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];
    if (!journalName) return;
    const ifValue = row["IF"] || row["Impact Factor"];
    const jcrValue = row["JCR %"] || row["JCR Ranking"] || row["JCR%"];
    const info = {
      if: ifValue !== undefined && ifValue !== null && ifValue !== "" ? parseFloat(String(ifValue)) : undefined,
      jcrRanking: jcrValue !== undefined && jcrValue !== null && jcrValue !== "" ? String(jcrValue) : undefined,
    };
    journalMap.set(journalName, info);
    abbreviations.forEach((abbr: string) => journalMap.set(abbr, info));
  });
  // 엑셀에 정식명만 있을 때: 약어로 저장된 논문도 매칭되도록 공용 약어→정식명으로 행 연결
  Object.entries(JOURNAL_ABBR_TO_FULL).forEach(([abbr, fullName]) => {
    if (!journalMap.has(abbr) && journalMap.has(fullName)) {
      journalMap.set(abbr, journalMap.get(fullName)!);
    }
  });

  const journalMapKeysLower = new Map<string, string>();
  journalMap.forEach((_, key) => {
    journalMapKeysLower.set(key.toLowerCase(), key);
  });
  const getJournalInfo = (rawJournal: string) => {
    let info = journalMap.get(rawJournal);
    if (info) return info;
    const fullName = JOURNAL_ABBR_TO_FULL[rawJournal];
    if (fullName) info = journalMap.get(fullName);
    if (info) return info;
    const lower = rawJournal.toLowerCase();
    const canonicalKey = journalMapKeysLower.get(lower);
    if (canonicalKey) return journalMap.get(canonicalKey);
    return undefined;
  };

  const updatedPublications = publications.map((pub: any) => {
    const rawJournal = pub.journal?.trim();
    if (!rawJournal) return pub;
    const journalInfo = getJournalInfo(rawJournal);
    if (journalInfo) {
      const updated = { ...pub };
      if (journalInfo.if !== undefined && journalInfo.if !== null && !isNaN(journalInfo.if)) updated.if = journalInfo.if;
      if (journalInfo.jcrRanking !== undefined && journalInfo.jcrRanking !== null && journalInfo.jcrRanking !== "")
        updated.jcrRanking = journalInfo.jcrRanking;
      return updated;
    }
    return pub;
  });

  content.journalPublications = JSON.stringify(updatedPublications);
  await saveContent(content);
}

// POST: 엑셀 파일 저장 및 publications 업데이트
export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data, updatePublications } = body;

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: "데이터가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Journals");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    await saveExcelBuffer(buffer);

    if (updatePublications) {
      const content = (await getContent()) as Record<string, unknown>;
      await updatePublicationsFromExcelData(data, content);
    }

    return NextResponse.json({
      success: true,
      message: updatePublications ? "엑셀 파일이 저장되고 publications가 업데이트되었습니다." : "엑셀 파일이 저장되었습니다.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "엑셀 파일 저장 중 오류가 발생했습니다.";
    console.error("Excel save error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT: 엑셀 파일 업로드 (기존 데이터 삭제 후 새 데이터로 교체)
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, error: "파일이 없습니다." }, { status: 400 });
    }

    const XLSX = await import("xlsx");
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    await saveExcelBuffer(excelBuffer);

    const content = (await getContent()) as Record<string, unknown>;
    await updatePublicationsFromExcelData(data, content);

    return NextResponse.json({
      success: true,
      data,
      message: "엑셀 파일이 업로드되었고, 기존 데이터가 새 데이터로 교체되었습니다. Publications도 자동으로 업데이트되었습니다.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "엑셀 파일 업로드 중 오류가 발생했습니다.";
    console.error("Excel upload error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE: 엑셀 데이터 초기화
export async function DELETE() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Journals");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    await saveExcelBuffer(buffer);

    return NextResponse.json({
      success: true,
      data: [],
      message: "엑셀 데이터가 초기화되었습니다.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "엑셀 데이터 초기화 중 오류가 발생했습니다.";
    console.error("Excel reset error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
