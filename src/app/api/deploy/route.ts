import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { DEPLOY_SCRIPT, LOG_PATH, RUN_PATH, activeLock } from "@/lib/deployState";

export const dynamic = "force-dynamic";

const LOCK_DIR = path.join(process.cwd(), ".deploy.lock");

/** 다른 사이트에서 관리자 쿠키로 배포를 호출하는 것(CSRF) 방지: Origin 호스트가 요청 호스트와 같아야 함 */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // 같은 출처 fetch 일부 환경은 Origin 생략
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
    }

    // 이미 실행 중이면 새로 시작하지 않고 진행 중인 실행을 알려준다 (탭·브라우저 간 중복 방지)
    const running = activeLock();
    if (running) {
      return NextResponse.json(
        { error: "이미 배포가 진행 중입니다.", runId: running.runId },
        { status: 409 }
      );
    }

    // 잠금 원자적 획득 (동시 요청 중 하나만 통과)
    try {
      fs.mkdirSync(LOCK_DIR);
    } catch {
      return NextResponse.json({ error: "이미 배포가 진행 중입니다." }, { status: 409 });
    }

    const runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    fs.writeFileSync(RUN_PATH, runId);
    fs.writeFileSync(LOG_PATH, `[RUN ${runId}] 배포 시작 ${new Date().toLocaleString("ko-KR")}\n`);

    // 로그 파일에 직접 기록 + detached: 웹 서버가 재시작돼도 배포는 끝까지 진행
    const logFd = fs.openSync(LOG_PATH, "a");
    const child = spawn("bash", [DEPLOY_SCRIPT, "2"], {
      cwd: process.cwd(),
      stdio: ["ignore", logFd, logFd],
      detached: true,
      env: { ...process.env, DEPLOY_RUN_ID: runId, DEPLOY_LOCK_HELD: "1" },
    });
    fs.closeSync(logFd);
    fs.writeFileSync(path.join(LOCK_DIR, "info"), `${child.pid} ${runId} ${Math.floor(Date.now() / 1000)}`);
    child.unref();

    return NextResponse.json({
      success: true,
      runId,
      message: "배포를 시작했습니다. 아래 진행 상황을 확인하세요.",
    });
  } catch (error) {
    fs.rmSync(LOCK_DIR, { recursive: true, force: true });
    const message = error instanceof Error ? error.message : "Failed to start deploy";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
