#!/usr/bin/env bash
# 1: 로컬 빌드 → 확인 후  2: 배포(푸시)
# 사용법: ./scripts/00_deploy.sh [1|2] ["커밋 메시지"]
# 인자 없으면 대화형 선택. 인자 1 또는 2면 해당 옵션 실행 (백그라운드 가능).
#
# 배포(2)는 웹의 "배포" 버튼(/api/deploy)에서도 실행된다. 약속:
#   - 잠금 .deploy.lock/info = "pid run_id 시작시각"  (웹에서 실행 시 DEPLOY_LOCK_HELD=1 로 이미 잡혀 있음)
#   - 종료 시 마지막 줄에 항상 "[DEPLOY_DONE] run=<id> ..." 또는 "[DEPLOY_FAILED] run=<id> step=<단계> exit=<코드>"
#   - 검증 빌드는 .next-deploy 에서 수행 → 실행 중인 NAS 서버(.next)를 건드리지 않음

set -eo pipefail
cd "$(dirname "$0")/.."

case "${1:-}" in
  1|2) choice="$1" ;;
  *)
    echo ""
    echo "  [1] 로컬 빌드  — 빌드만 수행 (로컬에서 확인용)"
    echo "  [2] 배포      — 빌드 후 Git 푸시 → GitHub Pages 자동 배포"
    echo ""
    read -p "선택 (1 또는 2): " choice
    ;;
esac

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
    RUN_ID="${DEPLOY_RUN_ID:-cli-$(date +%s)}"
    LOCK_DIR=".deploy.lock"
    BACKUP_DIR=".deploy-uploads-backup"
    UPLOADS_DIR="public/uploads"
    BUILD_DIR=".next-deploy"
    STEP="시작"
    SUCCESS=0
    RESULT=""
    OWN_LOCK=0

    # --- 잠금 (죽은 프로세스가 남긴 잠금은 PID·명령 확인 후 회수) ---
    if [ "${DEPLOY_LOCK_HELD:-}" = "1" ]; then
      OWN_LOCK=1
    elif mkdir "$LOCK_DIR" 2>/dev/null; then
      OWN_LOCK=1
    else
      old_pid=$(cut -d' ' -f1 "$LOCK_DIR/info" 2>/dev/null || true)
      if [ -n "$old_pid" ] && kill -0 "$old_pid" 2>/dev/null && grep -q "00_deploy.sh" "/proc/$old_pid/cmdline" 2>/dev/null; then
        echo "!! 다른 배포가 진행 중입니다 (pid $old_pid). 중단."
        echo "[DEPLOY_FAILED] run=$RUN_ID step=잠금 exit=3"
        exit 3
      fi
      echo "이전 배포가 남긴 잠금을 정리합니다."
      rm -rf "$LOCK_DIR"
      mkdir "$LOCK_DIR"
      OWN_LOCK=1
    fi
    echo "$$ $RUN_ID $(date +%s)" > "$LOCK_DIR/info"
    # 터미널 실행도 웹 배포 창이 현재 실행으로 인식하도록 run_id 기록
    [ -z "${DEPLOY_RUN_ID:-}" ] && echo "$RUN_ID" > .deploy.run

    # --- 종료 처리: 어떤 경로로 끝나도 원본 복원·정리·결과 마커 기록 ---
    finish() {
      local rc=$?
      trap - EXIT
      if [ -d "$BACKUP_DIR" ]; then
        rm -rf "$UPLOADS_DIR"
        mv "$BACKUP_DIR" "$UPLOADS_DIR"
        echo "  uploads 원본 복원함."
      fi
      rm -rf "$BUILD_DIR"
      [ "$OWN_LOCK" = "1" ] && rm -rf "$LOCK_DIR"
      if [ "$rc" -eq 0 ] && [ "$SUCCESS" = "1" ]; then
        echo "[DEPLOY_DONE] run=$RUN_ID $RESULT"
      else
        [ "$rc" -eq 0 ] && rc=1
        echo "[DEPLOY_FAILED] run=$RUN_ID step=$STEP exit=$rc"
      fi
      exit "$rc"
    }
    trap finish EXIT
    trap 'exit 130' INT TERM HUP

    echo ""
    echo "[배포] run=$RUN_ID"

    STEP="빌드 검증"
    echo "[1/6] 빌드 검증 중... (별도 폴더 $BUILD_DIR — 실행 중인 NAS 서버에 영향 없음)"
    rm -rf "$BUILD_DIR"
    NEXT_DIST_DIR="$BUILD_DIR" npm run build

    STEP="사진 압축"
    # 이전 배포가 압축 도중 강제 종료돼 백업이 남아 있으면, 그 백업이 원본이다 → 먼저 복원
    # (그냥 지우고 새로 백업하면 압축본을 원본으로 착각해 원본이 사라짐)
    if [ -d "$BACKUP_DIR" ]; then
      echo "  이전 배포가 남긴 uploads 백업(원본)을 먼저 복원합니다."
      rm -rf "$UPLOADS_DIR"
      mv "$BACKUP_DIR" "$UPLOADS_DIR"
    fi
    if [ -d "$UPLOADS_DIR" ] && [ -n "$(ls -A "$UPLOADS_DIR" 2>/dev/null)" ]; then
      echo "[2/6] public/uploads 백업 후 배포용 압축..."
      cp -r "$UPLOADS_DIR" "$BACKUP_DIR"
      node scripts/compress-uploads-for-deploy.js
    else
      echo "[2/6] public/uploads 없음, 압축 단계 생략"
    fi

    MSG="${2:-Deploy $(date +%Y-%m-%d\ %H:%M)}"
    STEP="스테이징"
    echo "[3/6] 전체 변경사항 스테이징..."
    git add .

    STEP="커밋"
    echo "[4/6] 커밋: $MSG"
    if git diff --staged --quiet 2>/dev/null; then
      echo "변경된 파일이 없습니다. (이미 모두 커밋된 상태)"
      SUCCESS=1
      RESULT="변경 없음 — 온라인은 이미 최신 상태입니다."
      exit 0
    fi
    git commit -m "$MSG"

    STEP="원격 변경사항 반영(pull)"
    echo "[5/6] 원격 변경사항 반영 중 (pull --rebase)..."
    if ! git pull --rebase origin main; then
      echo ""
      echo "  !! pull 실패 (원격에 새 커밋이 있어 충돌 가능). 수동으로 해결 후 다시 배포하세요."
      echo "  예: git rebase --abort   또는 충돌 해결 후  git rebase --continue"
      exit 1
    fi

    STEP="푸시"
    echo "[6/6] 푸시 (origin main)..."
    if ! git push origin main; then
      echo ""
      echo "  !! 푸시 실패. Vercel/GitHub에 반영되지 않습니다."
      echo "  원인: Git 인증(토큰·SSH) 또는 origin URL 확인. 터미널에서 직접 실행해 오류 메시지를 확인하세요."
      exit 1
    fi

    COMMIT="$(git log -1 --format=%h)"
    NEED_RESTART=""
    if git diff --name-only HEAD~1 HEAD 2>/dev/null | grep -qE '^(src/|next\.config|package(-lock)?\.json|tailwind|postcss)'; then
      NEED_RESTART=" / 코드가 바뀌었으므로 NAS 편집 서버는 재시작해야 반영됩니다 (00_deploy.sh 1)."
    fi

    echo ""
    echo "배포 요청 완료. Git + GitHub Pages + Vercel에 반영됩니다 (Vercel 1~2분 소요)."
    echo "  커밋: $(git log -1 --oneline)"
    echo "  NAS는 원본 무손실 유지, 배포본만 압축되어 푸시됨."
    echo "  [Vercel에 안 뜨면] Vercel 대시보드 → Deployments 에서 새 배포가 생성됐는지, 빌드가 성공(초록)인지 확인하세요."

    SUCCESS=1
    RESULT="온라인 반영 요청 완료 (커밋 $COMMIT, Vercel 1~2분 후 반영)${NEED_RESTART}"
    ;;
  *)
    echo "1 또는 2를 입력하세요."
    exit 1
    ;;
esac
