import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

const EXCEL_FILE_PATH = path.join(process.cwd(), "data", "journals.xlsx");

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

// GET: 엑셀 파일 읽기 또는 다운로드
export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await ensureDataDir();

    const { searchParams } = new URL(request.url);
    const download = searchParams.get("download") === "true";

    // 다운로드 모드: 엑셀 파일 직접 반환
    if (download) {
      if (!existsSync(EXCEL_FILE_PATH)) {
        // 파일이 없으면 빈 엑셀 파일 생성
        const XLSX = await import("xlsx");
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Journals");
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        await writeFile(EXCEL_FILE_PATH, buffer);
      }

      const buffer = await readFile(EXCEL_FILE_PATH);
      const filename = `journals_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // 일반 모드: JSON 데이터 반환
    if (!existsSync(EXCEL_FILE_PATH)) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "엑셀 파일이 없습니다. 새로 생성하세요.",
      });
    }

    // xlsx 라이브러리 동적 import
    const XLSX = await import("xlsx");
    const buffer = await readFile(EXCEL_FILE_PATH);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Excel read error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "엑셀 파일을 읽는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
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

    await ensureDataDir();

    // xlsx 라이브러리 동적 import
    const XLSX = await import("xlsx");
    
    // 엑셀 파일 저장
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Journals");

    // 엑셀 파일을 버퍼로 변환하여 저장
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    await writeFile(EXCEL_FILE_PATH, buffer);

    // publications 업데이트가 요청된 경우
    if (updatePublications) {
      // content.json에서 publications 데이터 가져오기
      const contentPath = path.join(process.cwd(), "data", "content.json");
      let content: any = {};
      
      if (existsSync(contentPath)) {
        const contentData = await readFile(contentPath, "utf-8");
        content = JSON.parse(contentData);
      }

      // journalPublications 가져오기
      let publications: any[] = [];
      if (content.journalPublications) {
        try {
          publications = JSON.parse(content.journalPublications);
        } catch (e) {
          console.error("Failed to parse journalPublications:", e);
        }
      }

      // 엑셀 데이터를 맵으로 변환 (저널 이름 -> IF, JCR %)
      const journalMap = new Map<string, { if?: number; jcrRanking?: string }>();
      data.forEach((row: any) => {
        const journalName = row["Journal Name"] || row["저널 이름"];
        if (journalName && journalName.trim()) {
          const ifValue = row["IF"] || row["Impact Factor"];
          const jcrValue = row["JCR %"] || row["JCR Ranking"] || row["JCR%"];
          
          journalMap.set(journalName.trim(), {
            if: ifValue !== undefined && ifValue !== null && ifValue !== "" ? parseFloat(String(ifValue)) : undefined,
            jcrRanking: jcrValue !== undefined && jcrValue !== null && jcrValue !== "" ? String(jcrValue) : undefined,
          });
        }
      });

      // publications 업데이트
      const updatedPublications = publications.map((pub) => {
        const journalInfo = journalMap.get(pub.journal?.trim());
        if (journalInfo) {
          const updated: any = { ...pub };
          if (journalInfo.if !== undefined && journalInfo.if !== null && !isNaN(journalInfo.if)) {
            updated.if = journalInfo.if;
          }
          if (journalInfo.jcrRanking !== undefined && journalInfo.jcrRanking !== null && journalInfo.jcrRanking !== "") {
            updated.jcrRanking = journalInfo.jcrRanking;
          }
          return updated;
        }
        return pub;
      });

      // content.json에 저장
      content.journalPublications = JSON.stringify(updatedPublications);
      await writeFile(contentPath, JSON.stringify(content, null, 2), "utf-8");
    }

    return NextResponse.json({
      success: true,
      message: updatePublications ? "엑셀 파일이 저장되고 publications가 업데이트되었습니다." : "엑셀 파일이 저장되었습니다.",
    });
  } catch (error: any) {
    console.error("Excel save error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "엑셀 파일 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
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
      return NextResponse.json(
        { success: false, error: "파일이 없습니다." },
        { status: 400 }
      );
    }

    await ensureDataDir();

    // xlsx 라이브러리 동적 import
    const XLSX = await import("xlsx");
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // 기존 엑셀 파일 삭제 후 새 파일 저장 (완전 교체)
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    await writeFile(EXCEL_FILE_PATH, excelBuffer);

    // 업로드된 데이터로 publications 자동 업데이트
    const contentPath = path.join(process.cwd(), "data", "content.json");
    let content: any = {};
    
    if (existsSync(contentPath)) {
      const contentData = await readFile(contentPath, "utf-8");
      content = JSON.parse(contentData);
    }

    // journalPublications 가져오기
    let publications: any[] = [];
    if (content.journalPublications) {
      try {
        publications = JSON.parse(content.journalPublications);
      } catch (e) {
        console.error("Failed to parse journalPublications:", e);
      }
    }

    // 엑셀 데이터를 맵으로 변환 (저널 이름 -> IF, JCR %)
    const journalMap = new Map<string, { if?: number; jcrRanking?: string }>();
    data.forEach((row: any) => {
      const journalName = row["Journal Name"] || row["저널 이름"];
      if (journalName && journalName.trim()) {
        const ifValue = row["IF"] || row["Impact Factor"];
        const jcrValue = row["JCR %"] || row["JCR Ranking"] || row["JCR%"];
        
        journalMap.set(journalName.trim(), {
          if: ifValue !== undefined && ifValue !== null && ifValue !== "" ? parseFloat(String(ifValue)) : undefined,
          jcrRanking: jcrValue !== undefined && jcrValue !== null && jcrValue !== "" ? String(jcrValue) : undefined,
        });
      }
    });

    // publications 업데이트
    const updatedPublications = publications.map((pub) => {
      const journalInfo = journalMap.get(pub.journal?.trim());
      if (journalInfo) {
        const updated: any = { ...pub };
        if (journalInfo.if !== undefined && journalInfo.if !== null && !isNaN(journalInfo.if)) {
          updated.if = journalInfo.if;
        }
        if (journalInfo.jcrRanking !== undefined && journalInfo.jcrRanking !== null && journalInfo.jcrRanking !== "") {
          updated.jcrRanking = journalInfo.jcrRanking;
        }
        return updated;
      }
      return pub;
    });

    // content.json에 저장
    content.journalPublications = JSON.stringify(updatedPublications);
    await writeFile(contentPath, JSON.stringify(content, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      data: data,
      message: "엑셀 파일이 업로드되었고, 기존 데이터가 새 데이터로 교체되었습니다. Publications도 자동으로 업데이트되었습니다.",
    });
  } catch (error: any) {
    console.error("Excel upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "엑셀 파일 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE: 엑셀 데이터 초기화
export async function DELETE() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await ensureDataDir();

    // xlsx 라이브러리 동적 import
    const XLSX = await import("xlsx");
    
    // 빈 엑셀 파일 생성 (초기화)
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Journals");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    await writeFile(EXCEL_FILE_PATH, buffer);

    return NextResponse.json({
      success: true,
      data: [],
      message: "엑셀 데이터가 초기화되었습니다.",
    });
  } catch (error: any) {
    console.error("Excel reset error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "엑셀 데이터 초기화 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

