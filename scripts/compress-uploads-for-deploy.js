#!/usr/bin/env node
/**
 * 배포용: public/uploads 내 이미지를 압축해 덮어씀.
 * NAS 원본은 00_deploy.sh에서 백업 후 이 스크립트 실행 → 푸시 후 복원하므로 손실 없음.
 * - JPEG/PNG/WebP: 최대 1920px, 포맷별 압축 (동일 확장자 유지)
 * - GIF: 건드리지 않음 (애니메이션 유지)
 */

const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let pipeline = sharp(filePath)
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true });

  if (ext === '.gif') return; // 스킵
  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 82 });
  } else return;

  const buf = await pipeline.toBuffer();
  await fs.writeFile(filePath, buf);
}

async function main() {
  let entries;
  try {
    entries = await fs.readdir(UPLOADS_DIR, { withFileTypes: true });
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('public/uploads 없음, 압축 생략');
      process.exit(0);
    }
    throw e;
  }

  const files = entries
    .filter((ent) => ent.isFile() && IMAGE_EXT.test(ent.name))
    .map((ent) => ent.name);

  if (files.length === 0) {
    console.log('압축할 이미지 없음');
    process.exit(0);
  }

  console.log(`배포용 이미지 압축 중: ${files.length}개`);
  for (const name of files) {
    const filePath = path.join(UPLOADS_DIR, name);
    try {
      await compressImage(filePath);
      process.stdout.write('.');
    } catch (err) {
      console.warn(`\n경고: ${name} 압축 실패`, err.message);
    }
  }
  console.log(' 완료.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
