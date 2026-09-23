#!/usr/bin/env node
/**
 * public/uploads 감사 목록 생성 (삭제하지 않음).
 * - data/content.json, src/**, public/**(uploads 제외), backup/**의 참조를 모두 검색
 * - 내용 해시로 중복 파일 묶음
 * - 결과: backup/uploads-audit-<날짜>.txt  (정리 여부는 사람이 판단)
 * 사용법: node scripts/audit-uploads.js
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT, 'public', 'uploads');
const SEARCH_DIRS = ['data', 'src', 'scripts', '.github'];
const SEARCH_FILES = ['README.md', 'NAS_DEPLOY.md', 'VERCEL_DEPLOY.md'];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.next', '.git', 'uploads'].includes(ent.name)) continue;
      walk(p, out);
    } else if (ent.isFile() && fs.statSync(p).size < 20 * 1024 * 1024) {
      out.push(p);
    }
  }
  return out;
}

function main() {
  const uploads = fs.readdirSync(UPLOADS_DIR).filter((f) => fs.statSync(path.join(UPLOADS_DIR, f)).isFile());

  const haystackFiles = [
    ...SEARCH_DIRS.filter((d) => fs.existsSync(path.join(ROOT, d))).flatMap((d) => walk(path.join(ROOT, d))),
    ...SEARCH_FILES.map((f) => path.join(ROOT, f)).filter((f) => fs.existsSync(f)),
  ];
  const haystack = haystackFiles.map((f) => fs.readFileSync(f, 'utf-8')).join('\n');
  const decoded = (() => {
    try {
      return decodeURIComponent(haystack);
    } catch {
      return haystack;
    }
  })();

  const byHash = new Map();
  const referenced = [];
  const unreferenced = [];

  for (const name of uploads) {
    const full = path.join(UPLOADS_DIR, name);
    const size = fs.statSync(full).size;
    const hash = crypto.createHash('sha1').update(fs.readFileSync(full)).digest('hex');
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push(name);

    const used =
      haystack.includes(name) || decoded.includes(name) || haystack.includes(encodeURIComponent(name));
    (used ? referenced : unreferenced).push({ name, size, hash });
  }

  const mb = (b) => (b / 1048576).toFixed(1) + 'MB';
  const sum = (list) => list.reduce((a, x) => a + x.size, 0);
  const dupGroups = [...byHash.entries()].filter(([, names]) => names.length > 1);

  const lines = [];
  lines.push(`# public/uploads 감사 — ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`);
  lines.push(`전체 ${uploads.length}개 ${mb(sum([...referenced, ...unreferenced]))}`);
  lines.push(`참조됨 ${referenced.length}개 ${mb(sum(referenced))}`);
  lines.push(`참조 없음 ${unreferenced.length}개 ${mb(sum(unreferenced))}  ← 삭제하지 말고 검토만`);
  lines.push(`내용이 같은 중복 묶음 ${dupGroups.length}개`);
  lines.push('');
  lines.push('## 참조 없음 (크기순)');
  for (const f of [...unreferenced].sort((a, b) => b.size - a.size)) {
    const dup = byHash.get(f.hash).filter((n) => n !== f.name);
    lines.push(`- ${f.name}  ${mb(f.size)}${dup.length ? `  (동일내용: ${dup.join(', ')})` : ''}`);
  }
  lines.push('');
  lines.push('## 중복 묶음 (같은 내용, 다른 파일명)');
  for (const [hash, names] of dupGroups) {
    lines.push(`- ${hash.slice(0, 8)}: ${names.join(', ')}`);
  }

  const outDir = path.join(ROOT, 'backup');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `uploads-audit-${new Date().toISOString().slice(0, 10)}.txt`);
  fs.writeFileSync(outPath, lines.join('\n') + '\n');
  console.log(lines.slice(0, 6).join('\n'));
  console.log(`\n목록 저장: ${path.relative(ROOT, outPath)} (삭제는 하지 않음)`);
}

main();
