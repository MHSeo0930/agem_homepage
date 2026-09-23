/**
 * 업로드 이미지 표시 URL 정규화 — 서버 렌더와 클라이언트 첫 렌더가 같은 결과를 내야 하므로
 * 모든 페이지가 이 함수 하나만 사용한다 (basePath 중복/누락 방지).
 *
 * - NAS(next start): /api/uploads/<file> → 서버 재시작 없이 새 업로드를 바로 표시
 * - Vercel·GitHub Pages(NEXT_PUBLIC_STATIC_UPLOADS=1): /uploads/<file> → CDN이 정적 파일로 서빙
 *   (서버리스 함수 호출·함수 번들 크기·대역폭 절감. 정적 export에는 API 자체가 없음)
 */
import { getApiBase } from "@/lib/apiBase";

export function useStaticUploads(): boolean {
  return process.env.NEXT_PUBLIC_STATIC_UPLOADS === "1";
}

export function normalizeUploadUrl(image?: string | null): string | undefined {
  if (!image || typeof image !== "string") return image ?? undefined;
  if (/^https?:\/\//i.test(image)) return image;

  const base = getApiBase();
  let url = image;

  // basePath 보정: "/uploads/..." 또는 "/api/uploads/..." 로만 저장된 경우
  if (url.startsWith("/uploads/")) url = `${base}${url}`;
  else if (url.startsWith("/api/uploads/")) url = `${base}${url}`;

  if (useStaticUploads()) {
    // 정적 서빙 환경: 함수 경로를 쓰지 않는다
    url = url.replace("/api/uploads/", "/uploads/");
  } else if (url.includes("/uploads/") && !url.includes("/api/uploads/")) {
    // NAS: 정적 경로는 서버 재시작 전까지 새 파일을 못 찾으므로 API 경로 사용
    url = url.replace("/uploads/", "/api/uploads/");
  }
  return url;
}
