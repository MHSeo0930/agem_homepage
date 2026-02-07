#!/usr/bin/env bash
# 로컬 전체를 빌드한 뒤 Git에 통째로 푸시. Git·Vercel 동시 반영.
# 사용법: npm run deploy
#        npm run deploy -- "커밋 메시지"

set -e
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "사용법: npm run deploy  [\"커밋 메시지\"]"
  echo "  로컬에서 빌드 후 전체를 Git에 푸시 → Vercel이 자동 배포합니다."
  exit 0
fi

cd "$(dirname "$0")/.."

MSG="${1:-Deploy $(date +%Y-%m-%d\ %H:%M)}"

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
echo "완료. Git과 Vercel에 동일하게 반영됩니다."
echo "  커밋: $(git log -1 --oneline)"
echo "  Vercel은 1~2분 내 자동 배포됩니다."
