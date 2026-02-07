const FALLBACK_BASEPATH = "/agem_homepage";

/** basePath와 동일. Vercel 등에서 API 요청 404 방지 (next.config.js basePath 참고) */
export function getApiBase(): string {
  const envBase =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_BASEPATH : undefined;
  if (envBase && typeof envBase === "string" && envBase.trim() !== "") {
    return envBase.trim();
  }
  // 브라우저: 현재 경로에서 basePath 추론 (배포 시 env 누락 대비)
  if (typeof window !== "undefined" && window.location?.pathname) {
    const path = window.location.pathname;
    if (path.startsWith("/agem_homepage") || path === "/agem_homepage") {
      return "/agem_homepage";
    }
    const firstSegment = path.split("/")[1];
    if (firstSegment === "agem_homepage") return "/agem_homepage";
  }
  return FALLBACK_BASEPATH;
}
