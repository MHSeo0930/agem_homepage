/** basePath와 동일. Vercel 등에서 API 요청 404 방지 (next.config.js basePath 참고) */
export function getApiBase(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASEPATH) {
    return process.env.NEXT_PUBLIC_BASEPATH;
  }
  return "/agem_homepage";
}
