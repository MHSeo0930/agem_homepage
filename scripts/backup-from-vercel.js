/**
 * Vercel(Redis)에 저장된 콘텐츠를 로컬 data/content.json 으로 백업합니다.
 * 백업 후 git add / commit / push 하면 콘텐츠가 Git에 버전으로 남습니다.
 *
 * 사용법:
 *   BACKUP_SOURCE_URL=https://agem-homepage-xxx.vercel.app/agem_homepage node scripts/backup-from-vercel.js
 *   또는
 *   node scripts/backup-from-vercel.js https://agem-homepage-xxx.vercel.app/agem_homepage
 *
 * npm run backup:vercel  (이 경우 .env에 BACKUP_SOURCE_URL 설정 필요)
 */

const fs = require("fs");
const path = require("path");

const baseUrl = process.env.BACKUP_SOURCE_URL || process.argv[2];
if (!baseUrl) {
  console.error("Usage: BACKUP_SOURCE_URL=<url> node scripts/backup-from-vercel.js");
  console.error("   or: node scripts/backup-from-vercel.js <baseUrl>");
  console.error("Example: node scripts/backup-from-vercel.js https://agem-homepage-xxx.vercel.app/agem_homepage");
  process.exit(1);
}

const apiUrl = baseUrl.replace(/\/$/, "") + "/api/content";
const dataDir = path.join(process.cwd(), "data");
const outFile = path.join(dataDir, "content.json");

async function run() {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    const content = await res.json();
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(outFile, JSON.stringify(content, null, 2), "utf8");
    console.log("Backup done:", outFile);
  } catch (e) {
    console.error("Backup failed:", e.message);
    process.exit(1);
  }
}

run();
