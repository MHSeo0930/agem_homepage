import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectRoot = process.cwd();
    const scriptPath = path.join(projectRoot, "scripts", "00_deploy.sh");

    const child = spawn("bash", [scriptPath, "2"], {
      cwd: projectRoot,
      detached: true,
      stdio: "ignore",
    });
    child.unref();

    return NextResponse.json({
      success: true,
      message: "배포가 백그라운드에서 시작되었습니다. 빌드 후 Git 푸시까지 수 분 소요될 수 있습니다.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start deploy";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
