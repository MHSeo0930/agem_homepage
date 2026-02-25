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
    echo "[1/5] 빌드 중..."
    npm run build

    BACKUP_DIR=".deploy-uploads-backup"
    UPLOADS_DIR="public/uploads"
    if [ -d "$UPLOADS_DIR" ] && [ -n "$(ls -A "$UPLOADS_DIR" 2>/dev/null)" ]; then
      echo "[2/5] public/uploads 백업 후 배포용 압축..."
      rm -rf "$BACKUP_DIR"
      cp -r "$UPLOADS_DIR" "$BACKUP_DIR"
      node scripts/compress-uploads-for-deploy.js
    else
      echo "[2/5] public/uploads 없음, 압축 단계 생략"
    fi

    MSG="${2:-Deploy $(date +%Y-%m-%d\ %H:%M)}"
    echo "[3/5] 전체 변경사항 스테이징..."
    git add .

    echo "[4/5] 커밋: $MSG"
    if git diff --staged --quiet 2>/dev/null; then
      echo "변경된 파일이 없습니다. (이미 모두 커밋된 상태)"
      [ -d "$BACKUP_DIR" ] && rm -rf "$UPLOADS_DIR" && mv "$BACKUP_DIR" "$UPLOADS_DIR" && echo "  uploads 원본 복원함."
      exit 0
    fi
    git commit -m "$MSG"

    echo "[5/5] 푸시 (origin main)..."
    if ! git push origin main; then
      echo ""
      echo "  !! 푸시 실패. Vercel/GitHub에 반영되지 않습니다."
      echo "  원인: Git 인증(토큰·SSH) 또는 origin URL 확인. 터미널에서 직접 실행해 오류 메시지를 확인하세요."
      [ -d "$BACKUP_DIR" ] && rm -rf "$UPLOADS_DIR" && mv "$BACKUP_DIR" "$UPLOADS_DIR"
      exit 1
    fi

    if [ -d "$BACKUP_DIR" ]; then
      echo "  uploads 원본 복원 중..."
      rm -rf "$UPLOADS_DIR"
      mv "$BACKUP_DIR" "$UPLOADS_DIR"
    fi

    echo ""
    echo "배포 요청 완료. Git + GitHub Pages + Vercel에 반영됩니다 (Vercel 1~2분 소요)."
    echo "  커밋: $(git log -1 --oneline)"
    echo "  NAS는 원본 무손실 유지, 배포본만 압축되어 푸시됨 (250MB 제한 완화)."
    echo "  콘텐츠·사진만 푸시할 때: ./scripts/push-content.sh"
    echo ""
    echo "  [Vercel에 안 뜨면] Vercel 대시보드 → Deployments 에서 새 배포가 생성됐는지, 빌드가 성공(초록)인지 확인하세요."
    echo "  GitHub에 커밋이 올라갔는지: 저장소 → Commits 에서 방금 커밋이 보여야 합니다."
    ;;
  *)
    echo "1 또는 2를 입력하세요."
    exit 1
    ;;
esac
