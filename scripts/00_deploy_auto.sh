#!/usr/bin/env bash
# DSM 작업 스케줄러 등에서 사용. 대화 없이 배포(2번)만 실행.
# 사용법: ./scripts/00_deploy_auto.sh ["커밋 메시지"]

set -e
cd "$(dirname "$0")/.."

MSG="${1:-Deploy $(date +%Y-%m-%d\ %H:%M)}"

echo "[배포]"
echo "[1/4] 빌드 중..."
npm run build

echo "[2/4] 전체 변경사항 스테이징..."
git add .

echo "[3/4] 커밋: $MSG"
if git diff --staged --quiet 2>/dev/null; then
  echo "변경된 파일이 없습니다. (이미 모두 커밋된 상태)"
  exit 0
fi
git commit -m "$MSG"

echo "[4/4] 푸시 (origin main)..."
git push origin main

echo ""
echo "배포 요청 완료. Git + Vercel에 반영 (Vercel 1~2분). 업로드 사진은 public/uploads/ 포함 시 NAS·Vercel 모두 반영."
echo "  커밋: $(git log -1 --oneline)"
