import { getApiBase } from "./apiBase";

/**
 * POST /api/content 호출. 실패 시 서버가 반환한 error 메시지를 그대로 throw.
 * (Vercel Redis 미연결 시 안내 문구가 사용자에게 표시되도록)
 */
export async function postContent(body: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${getApiBase()}/api/content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = typeof (data as { error?: string }).error === "string"
      ? (data as { error: string }).error
      : "Failed to save content";
    throw new Error(message);
  }
}
