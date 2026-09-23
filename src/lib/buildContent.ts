/**
 * 빌드(정적 prerender) 시 사용할 초기 콘텐츠 — Git에 커밋된 data/content.json만 읽는다.
 * Redis 등 런타임 저장소는 읽지 않음 (빌드 결과가 커밋 내용과 항상 일치하도록).
 * 서버 전용 (fs 사용). 클라이언트 컴포넌트에서 import 금지.
 */
import { readFileSync } from "fs";
import path from "path";

if (typeof window !== "undefined") {
  throw new Error("[buildContent] 서버 전용 모듈입니다. 클라이언트 컴포넌트에서 import하지 마세요.");
}

const CONTENT_FILE = path.join(process.cwd(), "data", "content.json");

type Schema = { kind: "array" | "object" | "html"; min: number; fields?: string[] };

/**
 * 정적 HTML에 반드시 들어가야 하는 키 — 누락·형식 오류·항목 부족이면 빌드를 실패시킨다.
 * (옛 하드코딩 데이터나 빈 화면이 조용히 배포되는 것을 방지)
 */
const SCHEMAS: Record<string, Schema> = {
  journalPublications: { kind: "array", min: 1, fields: ["number", "title"] },
  news: { kind: "array", min: 1, fields: ["title"] },
  gallery: { kind: "array", min: 1, fields: ["title"] },
  members: { kind: "array", min: 1, fields: ["name"] },
  alumni: { kind: "array", min: 1, fields: ["name"] },
  conferences: { kind: "array", min: 1, fields: ["title"] },
  professor: { kind: "object", min: 1, fields: ["name"] },
  contact: { kind: "object", min: 1 },
  research: { kind: "object", min: 1 },
  hero: { kind: "html", min: 10 },
};

function validate(key: string, value: unknown) {
  const schema = SCHEMAS[key];
  if (!schema) return; // 선택적 UI 설정(publications, journalsPage 등)은 검증 대상 아님
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`[buildContent] content.json 필수 키 누락/빈 값: ${key}`);
  }
  if (schema.kind === "html") {
    if (value.trim().length < schema.min) {
      throw new Error(`[buildContent] content.json 값이 너무 짧음: ${key}`);
    }
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`[buildContent] content.json 키 JSON 파싱 실패: ${key}`);
  }

  if (schema.kind === "array") {
    if (!Array.isArray(parsed)) {
      throw new Error(`[buildContent] content.json 키가 배열이 아님: ${key}`);
    }
    if (parsed.length < schema.min) {
      throw new Error(`[buildContent] content.json 항목 수 부족: ${key} (${parsed.length}개)`);
    }
    for (const field of schema.fields ?? []) {
      const missing = parsed.findIndex(
        (item) => !item || typeof item !== "object" || (item as Record<string, unknown>)[field] === undefined
      );
      if (missing >= 0) {
        throw new Error(`[buildContent] ${key}[${missing}]에 필수 필드 없음: ${field}`);
      }
    }
    return;
  }

  // object
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`[buildContent] content.json 키가 객체가 아님: ${key}`);
  }
  for (const field of schema.fields ?? []) {
    if ((parsed as Record<string, unknown>)[field] === undefined) {
      throw new Error(`[buildContent] ${key}에 필수 필드 없음: ${field}`);
    }
  }
}

/** content.json에서 지정한 키만 원본 형태(대부분 JSON 문자열) 그대로 반환 — /api/content 응답과 같은 모양 */
export function readBuildContent(keys: string[]): Record<string, unknown> {
  const all = JSON.parse(readFileSync(CONTENT_FILE, "utf-8")) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    const value = all[key];
    validate(key, value);
    if (value !== undefined && value !== null) out[key] = value;
  }
  return out;
}
