import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const logPath = path.join(process.cwd(), ".deploy.log");
    const log = await fs.readFile(logPath, "utf-8").catch(() => "");
    return NextResponse.json({ log });
  } catch (error) {
    return NextResponse.json({ log: "" });
  }
}
