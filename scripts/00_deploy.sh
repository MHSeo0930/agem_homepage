#!/usr/bin/env bash
# 1: 로컬 빌드 → 확인 후  2: 배포(푸시)
# 사용법: ./scripts/00_deploy.sh

set -e
cd "$(dirname "$0")/.."

echo ""
echo "  [1] 로컬 빌드  — 빌드만 수행 (로컬에서 확인용)"
echo "  [2] 배포      — 빌드 후 Git 푸시 → GitHub Pages 자동 배포"
echo ""
read -p "선택 (1 또는 2): " choice

# 3000 포트 사용 프로세스 종료 (Mac: lsof, NAS/리눅스: fuser 등)
kill_port_3000() {
  if command -v lsof >/dev/null 2>&1; then
    if lsof -ti :3000 >/dev/null 2>&1; then
      echo "기존 3000 포트 프로세스 종료 중..."
      kill $(lsof -ti :3000) 2>/dev/null || true
      sleep 1
    fi
  elif command -v fuser >/dev/null 2>&1; then
    if fuser 3000/tcp >/dev/null 2>&1; then
      echo "기존 3000 포트 프로세스 종료 중..."
      fuser -k 3000/tcp 2>/dev/null || true
      sleep 1
    fi
  fi
}

case "$choice" in
  1)
    echo ""
    echo "[로컬 빌드]"
    kill_port_3000
    echo "[1/2] 빌드 중..."
    npm run build
    echo "[2/2] 서버 시작 (종료: Ctrl+C)"
    # 로컬 접속 주소 안내 (NAS: IP로 접속, 맥: localhost)
    _ip=$(hostname -I 2>/dev/null | awk '{print $1}' || true)
    if [ -z "$_ip" ]; then
      _ip=$(ip route get 1 2>/dev/null | awk '{print $7; exit}' || true)
    fi
    echo ""
    echo "  로컬 접속: http://localhost:3000/agem_homepage"
    if [ -n "$_ip" ]; then
      echo "  같은 네트워크: http://${_ip}:3000/agem_homepage"
    fi
    echo ""
    npm run start
    ;;
  2)
    echo ""
    echo "[배포]"
    echo "[1/4] 빌드 중..."
    npm run build

    MSG="${1:-Deploy $(date +%Y-%m-%d\ %H:%M)}"
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
    echo "배포 요청 완료. GitHub Pages가 자동으로 배포합니다 (1~2분 소요)."
    echo "  커밋: $(git log -1 --oneline)"
    ;;
  *)
    echo "1 또는 2를 입력하세요."
    exit 1
    ;;
esac
