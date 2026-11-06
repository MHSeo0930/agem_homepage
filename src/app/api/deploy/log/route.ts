import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getDeployState } from "@/lib/deployState";

export const dynamic = "force-dynamic";

/** 현재 배포 실행(run_id)의 로그와 확정 상태(running/success/failed/idle) */
export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(getDeployState(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read deploy log";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
