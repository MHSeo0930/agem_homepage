#!/usr/bin/env bash
# 1: 로컬 빌드 → 확인 후  2: 배포(푸시)
# 사용법: ./scripts/00_deploy.sh [1|2]
# 인자 없으면 대화형 선택. 인자 1 또는 2면 해당 옵션 실행 (백그라운드 가능).

set -e
cd "$(dirname "$0")/.."

if [ -n "$1" ] && [ "$1" = "1" ] || [ "$1" = "2" ]; then
  choice="$1"
else
  echo ""
  echo "  [1] 로컬 빌드  — 빌드만 수행 (로컬에서 확인용)"
  echo "  [2] 배포      — 빌드 후 Git 푸시 → GitHub Pages 자동 배포"
  echo ""
  read -p "선택 (1 또는 2): " choice
fi

# 3000 포트 사용 프로세스 종료 (기존 것 끊고 3000 그대로 사용)
kill_port_3000() {
  local pids=""
  if command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -ti :3000 2>/dev/null || true)
  fi
  if [ -z "$pids" ] && command -v fuser >/dev/null 2>&1; then
    fuser -k 3000/tcp 2>/dev/null || true
    sleep 2
    return
  fi
  if [ -z "$pids" ] && command -v ss >/dev/null 2>&1; then
    pids=$(ss -tlnp 2>/dev/null | grep ':3000' | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | tr '\n' ' ')
  fi
  if [ -z "$pids" ] && command -v netstat >/dev/null 2>&1; then
    pids=$(netstat -tlnp 2>/dev/null | grep ':3000' | awk '{print $7}' | cut -d'/' -f1 | tr '\n' ' ')
  fi
  if [ -n "$pids" ]; then
    echo "기존 3000 포트 프로세스 종료 중... (PID: $pids)"
    for pid in $pids; do
      [ "$pid" -gt 0 ] 2>/dev/null && kill -9 "$pid" 2>/dev/null || true
    done
    sleep 2
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
    if [ -z "$_ip" ]; then
      _ip=$(ip -4 addr show 2>/dev/null | grep -oP 'inet \K[\d.]+' | grep -v '^127\.' | head -1 || true)
    fi
    echo ""
    echo "  === 로컬 접속 주소 (basePath: /agem_homepage) ==="
    echo "  이 PC에서:     http://localhost:3000/agem_homepage"
    if [ -n "$_ip" ]; then
      echo "  같은 네트워크: http://${_ip}:3000/agem_homepage"
    else
      echo "  같은 네트워크: http://<이_PC_IP>:3000/agem_homepage  (NAS면 10.146.146.234 등)"
    fi
    echo "  ================================================"
    echo ""
    echo "  백그라운드에서 서버를 시작했습니다. 로그: /tmp/deploy-start.log"
    nohup npm run start >> /tmp/deploy-start.log 2>&1 &
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
    echo "배포 요청 완료. Git + GitHub Pages + Vercel에 반영됩니다 (Vercel 1~2분 소요)."
    echo "  커밋: $(git log -1 --oneline)"
    echo "  업로드 사진이 포함돼 있으면 public/uploads/ 도 푸시됨 → NAS·Vercel 모두 반영."
    echo "  콘텐츠·사진만 푸시할 때: ./scripts/push-content.sh"
    ;;
  *)
    echo "1 또는 2를 입력하세요."
    exit 1
    ;;
esac
