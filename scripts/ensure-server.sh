#!/usr/bin/env bash
# NAS 편집용 홈페이지 서버(:3000)가 꺼져 있으면 다시 띄운다. 이미 떠 있으면 아무것도 하지 않음.
# DSM 작업 스케줄러에 등록해 사용:
#   - 트리거된 작업 → 부트업 (재부팅 후 자동 시작)
#   - 예약된 작업 → 10분마다 (서버가 죽었을 때 자동 복구)
# 사용자: AGEM / 명령: bash /var/services/homes/Share/Homepage/scripts/ensure-server.sh

cd "$(dirname "$0")/.."
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
LOG="$(pwd)/.server.log"

if curl -s -m 5 -o /dev/null http://127.0.0.1:3000/agem_homepage; then
  exit 0
fi

# 응답은 없는데 프로세스만 남은 경우 정리
# (pkill -f 는 이 문자열이 든 다른 셸까지 죽일 수 있으므로 프로세스 이름(comm)으로만 찾는다)
for pid in $(ps -u "$(id -u)" -o pid=,comm= | awk '$2=="next-server"{print $1}'); do
  kill "$pid" 2>/dev/null
done
sleep 2

# 빌드가 없으면 먼저 빌드
if [ ! -f .next/BUILD_ID ]; then
  echo "[$(date '+%F %T')] .next 없음 → 빌드" >> "$LOG"
  npm run build >> "$LOG" 2>&1 || { echo "[$(date '+%F %T')] 빌드 실패" >> "$LOG"; exit 1; }
fi

echo "[$(date '+%F %T')] 서버 시작" >> "$LOG"
nohup npm run start >> "$LOG" 2>&1 < /dev/null &
