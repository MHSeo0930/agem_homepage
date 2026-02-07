#!/usr/bin/env bash
# 로컬/NAS에서 편집한 콘텐츠·엑셀·업로드 이미지를 Git에 올려 NAS·Vercel 모두 반영합니다.

set -e
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "사용법:"
  echo "  npm run push:content                    # 기본 메시지로 커밋·푸시"
  echo "  npm run push:content -- \"메인 문구 수정\"  # 커밋 메시지 지정"
  echo "  ./scripts/push-content.sh [커밋 메시지]"
  echo ""
  echo "  data/content.json, data/journals.xlsx, public/uploads/ 를 스테이징 후"
  echo "  커밋·푸시 → Git에 반영되고, Vercel은 자동 재배포, NAS는 git pull 로 동기화."
  exit 0
fi

cd "$(dirname "$0")/.."

MSG="${1:-Update content $(date +%Y-%m-%d\ %H:%M)}"

echo "[1/4] 대상 파일 상태 확인..."
git status --short data/content.json data/journals.xlsx public/uploads/ 2>/dev/null || true
if [ ! -f data/content.json ]; then
  echo "  경고: data/content.json 이 없습니다. 로컬에서 npm run dev 후 편집·저장하면 생성됩니다."
fi

echo "[2/4] 스테이징: data/content.json, data/journals.xlsx, public/uploads/"
git add -f data/content.json data/journals.xlsx 2>/dev/null || true
git add public/uploads/ 2>/dev/null || true

if git diff --staged --quiet 2>/dev/null; then
  echo ""
  echo "변경된 내용이 없습니다. 아래를 확인하세요."
  echo "  - 로컬에서 npm run dev 실행 후 http://localhost:3000/agem_homepage 에서 편집·저장했나요?"
  echo "    (Vercel 사이트에서 수정한 내용은 로컬 파일에 없습니다.)"
  echo "  - data/content.json 파일이 존재하고 수정되었나요?"
  echo "  - 이미 변경분을 이전에 커밋했나요? (git log -1 --oneline 로 확인)"
  exit 1
fi

echo "[3/4] 커밋: $MSG"
git commit -m "$MSG"

echo "[4/4] 푸시 (origin main)..."
git push origin main

echo ""
echo "푸시 완료. 업로드 사진·콘텐츠가 Git + Vercel에 반영됩니다."
echo "  - Git: $(git log -1 --oneline)"
echo "  - Vercel: 1~2분 내 자동 재배포 (Deployments 탭 확인)"
echo "  - NAS: 다른 쪽에서 푸시했으면 이 기기에서 'git pull' 로 동기화"
