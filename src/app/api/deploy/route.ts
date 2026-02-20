import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectRoot = process.cwd();
    const scriptPath = path.join(projectRoot, "scripts", "00_deploy.sh");
    const logPath = path.join(projectRoot, ".deploy.log");
    const logStream = fs.createWriteStream(logPath, { flags: "w" });

    const child = spawn("bash", [scriptPath, "2"], {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout?.pipe(logStream, { end: false });
    child.stderr?.pipe(logStream);
    child.on("close", () => {
      logStream.end();
    });
    child.unref();

    return NextResponse.json({
      success: true,
      message: "배포를 시작했습니다. 아래 진행 상황을 확인하세요.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start deploy";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
