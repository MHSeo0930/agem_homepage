#!/usr/bin/env node
/**
 * 배포용: public/uploads 내 이미지를 압축해 덮어씀.
 * NAS 원본은 00_deploy.sh에서 백업 후 이 스크립트 실행 → 푸시 후 복원하므로 손실 없음.
 * - JPEG/PNG/WebP: 최대 1920px, 포맷별 압축 (동일 확장자 유지)
 * - EXIF 방향 적용: .rotate()로 휴대폰 등에서 찍은 사진이 눕거나 뒤집히지 않도록 픽셀에 반영
 * - GIF/애니메이션 WebP: 건드리지 않음 (애니메이션 유지)
 * - 압축 결과가 원본보다 작을 때만 교체 (이미 최적화된 작은 파일이 오히려 커지는 것 방지)
 * - 교체 전 결과 버퍼를 다시 디코딩해 손상 여부 확인, 임시 파일에 쓰고 rename (원자적 교체)
 */

const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
/** 이보다 작으면 재인코딩 이득이 거의 없어 건너뜀 */
const MIN_SIZE_BYTES = 80 * 1024;
/** 최소 이 비율 이상 줄어야 교체 (미미한 차이로 매번 파일이 바뀌는 것 방지) */
const MIN_GAIN = 0.02;

const stats = { compressed: 0, kept: 0, skipped: 0, failed: 0, savedBytes: 0 };

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const originalSize = (await fs.stat(filePath)).size;

  if (originalSize < MIN_SIZE_BYTES) {
    stats.skipped++;
    return;
  }

  const meta = await sharp(filePath).metadata();
  if (meta.pages && meta.pages > 1) {
    stats.skipped++; // 애니메이션(WebP 등)
    return;
  }

  let pipeline = sharp(filePath)
    .rotate() // EXIF orientation 적용 (휴대폰 사진 눕는/뒤집힘 방지)
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true });

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 82 });
  } else {
    stats.skipped++;
    return;
  }

  const buf = await pipeline.toBuffer();

  if (buf.length >= originalSize * (1 - MIN_GAIN)) {
    stats.kept++; // 압축해도 이득 없음 → 원본 유지
    return;
  }

  // 손상 검증: 결과 버퍼가 정상 디코딩되는지 확인
  const outMeta = await sharp(buf).metadata();
  if (!outMeta.width || !outMeta.height) {
    throw new Error('압축 결과 디코딩 실패');
  }

  const tmpPath = `${filePath}.tmp-compress`;
  await fs.writeFile(tmpPath, buf);
  await fs.rename(tmpPath, filePath);
  stats.compressed++;
  stats.savedBytes += originalSize - buf.length;
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
  for (const [i, name] of files.entries()) {
    const filePath = path.join(UPLOADS_DIR, name);
    try {
      await compressImage(filePath);
      // 진행 표시: 웹 배포 창에서도 멈춘 것처럼 보이지 않도록 20개마다 줄 단위 출력
      if ((i + 1) % 20 === 0 || i + 1 === files.length) {
        console.log(`  사진 압축 ${i + 1}/${files.length}`);
      }
    } catch (err) {
      stats.failed++;
      console.warn(`\n경고: ${name} 압축 실패`, err.message);
      await fs.unlink(`${filePath}.tmp-compress`).catch(() => {});
    }
  }
  console.log(
    `완료. 압축 ${stats.compressed}개(${(stats.savedBytes / 1048576).toFixed(1)}MB 절감), ` +
      `원본 유지 ${stats.kept}개, 건너뜀 ${stats.skipped}개, 실패 ${stats.failed}개`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
