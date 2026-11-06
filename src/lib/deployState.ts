/**
 * 배포 실행 상태 (서버 전용) — scripts/00_deploy.sh 와 약속한 파일/마커를 해석한다.
 *
 * - .deploy.run          : 현재(마지막) 실행의 run_id
 * - .deploy.log          : 현재 실행 로그 (실행 시작 시 새로 씀)
 * - .deploy.lock/info    : 실행 중 잠금 — "pid run_id 시작시각(epoch)"
 * - 로그 마커            : "[DEPLOY_DONE] run=<id> ..." / "[DEPLOY_FAILED] run=<id> step=<단계> exit=<코드>"
 */
import { readFileSync, existsSync, rmSync, statSync } from "fs";
import path from "path";

const ROOT = process.cwd();
export const DEPLOY_SCRIPT = path.join(ROOT, "scripts", "00_deploy.sh");
export const LOG_PATH = path.join(ROOT, ".deploy.log");
export const RUN_PATH = path.join(ROOT, ".deploy.run");
const LOCK_DIR = path.join(ROOT, ".deploy.lock");
const LOCK_INFO = path.join(LOCK_DIR, "info");

export type DeployStatus = "running" | "success" | "failed" | "idle";

export interface DeployLock {
  pid: number;
  runId: string;
  startedAt: number;
}

function readText(p: string): string {
  try {
    return readFileSync(p, "utf-8");
  } catch {
    return "";
  }
}

export function readRunId(): string {
  return readText(RUN_PATH).trim();
}

export function readLock(): DeployLock | null {
  const [pid, runId, startedAt] = readText(LOCK_INFO).trim().split(/\s+/);
  if (!pid) return null;
  return { pid: Number(pid), runId: runId || "", startedAt: Number(startedAt) || 0 };
}

/** PID가 살아 있고 실제로 배포 스크립트를 실행 중인 프로세스인지 (PID 재사용 오판 방지) */
function isDeployProcess(pid: number): boolean {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
  } catch {
    return false;
  }
  const cmdline = readText(`/proc/${pid}/cmdline`).replace(/\0/g, " ");
  // /proc 이 없는 환경(맥 개발)에서는 생존 여부만으로 판단
  return cmdline === "" ? true : cmdline.includes("00_deploy.sh");
}

/** 실행 중인 배포의 잠금. 죽은 프로세스가 남긴 잠금(stale)은 정리하고 null 반환 */
export function activeLock(): DeployLock | null {
  if (!existsSync(LOCK_DIR)) return null;
  const lock = readLock();
  if (lock && isDeployProcess(lock.pid)) return lock;
  // 잠금 생성 직후(info 기록 전) 짧은 순간은 살려 둔다
  if (!lock) {
    try {
      const age = Date.now() - statSync(LOCK_DIR).mtimeMs;
      if (age < 10_000) return { pid: 0, runId: readRunId(), startedAt: Date.now() };
    } catch {
      /* ignore */
    }
  }
  rmSync(LOCK_DIR, { recursive: true, force: true });
  return null;
}

export interface DeployState {
  runId: string;
  status: DeployStatus;
  step: string;
  log: string;
  message: string;
}

/** 현재 run_id 기준으로 로그 마커·잠금을 해석해 상태를 확정 */
export function getDeployState(): DeployState {
  const runId = readRunId();
  const log = readText(LOG_PATH);
  const steps = log.match(/^\[\d+\/\d+\][^\n]*/gm);
  const step = steps ? steps[steps.length - 1] : "";

  if (!runId) {
    return { runId, status: "idle", step, log, message: "" };
  }

  const done = log.match(new RegExp(`\\[DEPLOY_DONE\\] run=${runId}[^\\n]*`));
  if (done) {
    return { runId, status: "success", step, log, message: done[0] };
  }
  const failed = log.match(new RegExp(`\\[DEPLOY_FAILED\\] run=${runId}[^\\n]*`));
  if (failed) {
    return { runId, status: "failed", step, log, message: failed[0] };
  }

  const lock = activeLock();
  if (lock && (!lock.runId || lock.runId === runId)) {
    return { runId, status: "running", step, log, message: "" };
  }

  // 마커 없이 프로세스가 사라짐 → 비정상 종료로 확정
  return {
    runId,
    status: "failed",
    step,
    log,
    message: "배포 프로세스가 완료 표시 없이 종료되었습니다 (비정상 종료).",
  };
}
