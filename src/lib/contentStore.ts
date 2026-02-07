/**
 * 콘텐츠 저장소: Vercel 배포 시 Upstash Redis 사용, 로컬은 파일 시스템
 * 환경변수 UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN 이 있으면 Redis 사용
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const CONTENT_KEY = "agem_content";
const CONTENT_FILE = path.join(process.cwd(), "data", "content.json");

function useRedis(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

export async function getContent(): Promise<Record<string, unknown>> {
  if (useRedis()) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
      const data = await redis.get<Record<string, unknown>>(CONTENT_KEY);
      return data ?? {};
    } catch (e) {
      console.error("Redis getContent error:", e);
      return {};
    }
  }

  await ensureDataDir();
  if (existsSync(CONTENT_FILE)) {
    const fileContent = await readFile(CONTENT_FILE, "utf-8");
    return JSON.parse(fileContent) as Record<string, unknown>;
  }
  return {};
}

/** Vercel 배포 시 Redis 미연결로 저장 불가일 때 사용하는 에러 메시지 (로컬 작업 후 배포 방식 안내) */
export const VERCEL_REDIS_REQUIRED_MESSAGE =
  "배포 사이트에서는 저장되지 않습니다. 로컬에서 수정한 뒤 data/content.json을 Git에 푸시해 주세요.";

export async function saveContent(content: Record<string, unknown>): Promise<void> {
  if (useRedis()) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
      await redis.set(CONTENT_KEY, content);
      return;
    } catch (e) {
      console.error("Redis saveContent error:", e);
      throw e;
    }
  }

  // Vercel은 디스크에 영구 저장되지 않음 → Redis 필수
  if (process.env.VERCEL === "1") {
    throw new Error(VERCEL_REDIS_REQUIRED_MESSAGE);
  }

  await ensureDataDir();
  await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));
}
