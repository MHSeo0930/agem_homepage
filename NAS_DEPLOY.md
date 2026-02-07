# Synology NAS에서 배포하기

**목적**: 로컬 맥(`/Users/foifrit/00_Coding/02_Homepage`)에서 실행하던 배포·푸시를 **NAS에서 실행**해서 사용하기.  
코드는 이미 Git에 있으므로, NAS에서는 저장소를 클론한 뒤 맥에서 쓰던 스크립트를 그대로 실행하면 됩니다.

| 구분 | 맥 (로컬) | NAS |
|------|-----------|-----|
| 프로젝트 경로 | `/Users/foifrit/00_Coding/02_Homepage` | `/var/services/homes/Share/Homepage` |
| 실행 | 터미널에서 `./scripts/00_deploy.sh`, `./scripts/push-content.sh` 등 | SSH 접속 후 같은 명령 실행 |

- **NAS DSM 주소**: http://218.146.146.234:5000/#/signin  
- **터미널(SSH) 접속**: `ssh foifrit@10.146.146.234` (또는 `ssh foifrit@218.146.146.234`)

**이 프로젝트**
- **Git**: https://github.com/MHSeo0930/agem_homepage  
- **Vercel**: https://agem-homepage-1yybmz9j5-min-ho-seos-projects.vercel.app (배포 확인용)

---

## 1. NAS에서 SSH 활성화

1. DSM에 로그인 → **제어판** → **터미널 및 SNMP**
2. **SSH 서비스 활성화** 체크 후 포트 확인(기본 22)
3. 적용

접속 예:

```bash
ssh admin@218.146.146.234
# 또는 SSH 포트가 다르면
ssh -p 22 admin@218.146.146.234
```

---

## 2. Node.js 설치 (NAS에서 빌드하려면)

Synology에서 Node를 쓰는 방법은 두 가지입니다.

### 방법 A: Package Center에서 Node.js (가능한 경우)

- **패키지 센터** → "Node.js" 검색 → 설치  
- 일부 모델/DSM 버전에는 없을 수 있음. 설치 후 터미널에서 `node -v`, `npm -v` 확인.

### 방법 B: Docker(Container Manager) 사용 (권장)

1. **패키지 센터**에서 **Container Manager**(또는 Docker) 설치
2. 프로젝트 폴더를 공유 폴더에 두고, Node 컨테이너에서 해당 경로를 마운트해 `npm run build` 등 실행  
- 상세한 Docker 실행 예는 아래 "5. NAS에서 배포 스크립트 실행" 참고.

### 방법 C: nvm 또는 바이너리 직접 설치

SSH로 NAS에 접속한 뒤:

- [nvm](https://github.com/nvm-sh/nvm) 설치 후 `nvm install 20`  
- 또는 Node 공식 사이트에서 Linux 바이너리 다운로드 후 경로 설정  

NAS 아키텍처(arm64/x64 등)에 맞는 버전을 선택해야 합니다. `uname -m`으로 확인.

---

## 3. Git 설치

SSH로 접속한 뒤:

```bash
git --version
```

없으면:

- **Package Center**에서 "Git" 검색 후 설치(있을 경우),  
- 또는 **Entware** 등으로 `opkg install git`  
- 또는 Docker 안에서만 Git을 쓰는 방식으로 진행.

---

## 4. 저장소 클론 및 설정

NAS 작업 경로는 **`/var/services/homes/Share/Homepage`** 입니다. 여기로 이동한 뒤 클론(또는 이미 있으면 `git pull`):

```bash
cd /var/services/homes/Share/Homepage
git clone https://github.com/MHSeo0930/agem_homepage.git .
# 이미 폴더가 있으면: git pull origin main
```

**Git 사용자 설정**(최초 1회, 푸시 시 필요):

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

**GitHub 인증**:

- HTTPS: 푸시 시 사용자명 + Personal Access Token 입력  
- SSH: `ssh-keygen`으로 키 생성 후 공개키를 GitHub 계정에 등록하고 `git remote set-url origin git@github.com:사용자명/저장소명.git`

---

## 5. NAS에서 배포 스크립트 실행

맥에서 쓰던 스크립트를 그대로 NAS에서 사용할 수 있습니다.

### 전체 배포 (빌드 + Git 푸시 → GitHub Pages + Vercel)

```bash
cd /var/services/homes/Share/Homepage
npm install                   # 최초 1회 또는 package 변경 시
./scripts/00_deploy.sh
# 또는
npm run deploy
```

- **1** 입력: 로컬 빌드 후 `npm run start` (NAS에서 사이트 미리보기)  
- **2** 입력: 빌드 후 `git add .` → `git commit` → `git push origin main` → GitHub Actions(GitHub Pages) 및 Vercel 자동 배포

커밋 메시지를 인자로 주려면(선택 2일 때):

```bash
./scripts/00_deploy.sh "2025-02-07 NAS에서 배포"
```

### 콘텐츠만 푸시 (Vercel 자동 재배포)

`data/content.json`, `data/journals.xlsx`, `public/uploads/` 만 커밋·푸시할 때:

```bash
./scripts/push-content.sh
# 또는 메시지 지정
./scripts/push-content.sh "콘텐츠 업데이트"
```

푸시 후 1~2분 내에 Vercel Deployments에 새 배포가 뜹니다.

---

## 6. 스크립트 호환성

- `00_deploy.sh`: 3000 포트 정리는 **lsof**(맥) 또는 **fuser**(일부 리눅스/NAS)가 있으면 자동으로 동작합니다. 둘 다 없으면 "로컬 빌드" 시 3000 포트가 이미 사용 중일 때만 수동으로 프로세스를 종료하면 됩니다.
- `push-content.sh`: Git만 사용하므로 NAS 환경에서 그대로 사용 가능합니다.

---

## 7. 워크플로우 요약 (맥에서 하던 것 = NAS에서 실행)

NAS SSH 접속 후 프로젝트 폴더(`02_Homepage`)로 이동한 뒤, 맥에서 하던 것과 동일한 명령을 실행합니다.

| 맥에서 하던 일 | NAS에서 실행할 명령 |
|----------------|---------------------|
| 전체 배포 (빌드 후 푸시) | `cd /var/services/homes/Share/Homepage` 후 `./scripts/00_deploy.sh` → **2** 입력 |
| 로컬 빌드/미리보기 | `./scripts/00_deploy.sh` → **1** 입력 |
| NAS 로컬 홈페이지(편집용) | 아래 "NAS 로컬 홈페이지 접속" 참고 |
| 콘텐츠만 푸시 | `./scripts/push-content.sh` |
| 개발 서버 (편집용) | `npm run dev` (Node 설치된 경우) |

푸시 후:

- **GitHub**: `main` 브랜치 푸시 → `.github/workflows/deploy.yml` 실행 → GitHub Pages 배포  
- **Vercel**: 같은 저장소 연결 시 푸시만 하면 Vercel이 자동으로 다시 배포

---

## 7-1. NAS 로컬 홈페이지 접속 (편집용)

NAS에서 서버를 띄운 뒤 **같은 네트워크의 PC/맥 브라우저**로 접속해 편집할 수 있습니다.

### 1) NAS 터미널에서 실행

```bash
ssh foifrit@10.146.146.234
cd /var/services/homes/Share/Homepage
./scripts/00_deploy.sh
```

- **1** 입력 → 빌드 후 `npm run start` (프로덕션 서버, 포트 3000)
- 서버가 떠 있는 동안 터미널은 그대로 두세요. 종료하려면 **Ctrl+C**.

**편집 시 코드 반영을 바로 보려면** (선택):

```bash
cd /var/services/homes/Share/Homepage
npm run dev
```

→ 개발 서버(핫 리로드)로 실행됩니다. 역시 포트 3000.

### 2) 브라우저에서 접속

같은 LAN에 있는 컴퓨터 브라우저에서:

| 용도 | 주소 |
|------|------|
| 홈페이지 | **http://10.146.146.234:3000/agem_homepage** |
| 관리자 로그인 후 편집 | **http://10.146.146.234:3000/agem_homepage/admin/login** |

※ NAS IP가 다르면(예: 218.146.146.234) 해당 IP로 바꿔서 접속하면 됩니다.

### 3) 편집 후 배포

편집·저장이 끝나면 같은 NAS 터미널에서:

- **콘텐츠만 반영**: `./scripts/push-content.sh` (다른 터미널 탭에서 실행하거나, 서버를 Ctrl+C로 멈춘 뒤 실행)
- **전체 배포**: `./scripts/00_deploy.sh` → **2** 입력 (역시 서버 중지 후 실행하거나 새 SSH 세션에서)

**참고**: NAS 방화벽에서 **3000 포트**가 허용되어 있어야 외부(같은 네트워크)에서 접속됩니다. DSM → 제어판 → 보안 → 방화벽에서 3000 포트 규칙 추가.

---

## 7-2. DSM에서 배포 스크립트 실행하기

**File Station(파일 스테이션)에서는 .sh 파일을 "실행"하는 메뉴가 없습니다.** 우클릭해도 실행/열기 옵션이 없으므로, 아래 방법 중 하나를 사용하세요.

### 방법 1: 작업 스케줄러로 "바로 실행" (권장)

`00_deploy.sh`는 실행 시 **1 또는 2를 입력**받기 때문에, DSM에서는 **비대화형 스크립트** `00_deploy_auto.sh`를 작업 스케줄러에 등록해 두고 **실행** 버튼으로 돌리면 됩니다.

1. **DSM** 로그인 → **제어판** → **작업 스케줄러**
2. **생성** → **예약된 작업** → **사용자 정의 스크립트**
3. **일반** 탭  
   - 작업 이름: `Homepage 배포` (원하는 이름)  
   - 사용자: **foifrit** (프로젝트 소유 계정)
4. **일정** 탭  
   - 원하는 대로 설정 (예: 수동 실행만 하려면 "한 번" + 원하는 날짜/시간, 또는 "실행" 버튼으로만 실행)
5. **작업 설정** 탭  
   - **사용자 정의 스크립트**에 아래 한 줄 입력:

```bash
/var/services/homes/Share/Homepage/scripts/00_deploy_auto.sh
```

6. **확인**으로 저장

**실행**: **작업 스케줄러** 목록에서 해당 작업 선택 → **실행** 버튼 클릭 → 배포가 바로 실행됩니다. (또는 등록한 일정에 따라 자동 실행)

### 방법 2: DSM 터미널 패키지에서 실행

**패키지 센터**에서 "Terminal" 또는 "SSH Terminal" 같은 **웹 터미널** 패키지를 설치했다면, DSM 브라우저에서 터미널을 열고 아래처럼 실행할 수 있습니다. (SSH 없이 DSM만으로 실행)

```bash
cd /var/services/homes/Share/Homepage
./scripts/00_deploy_auto.sh
```

전체 메뉴(1번/2번 선택)를 쓰려면:

```bash
cd /var/services/homes/Share/Homepage
./scripts/00_deploy.sh
```

그리고 화면에 나오는 대로 **1** 또는 **2** 입력.

### 실행 요약

- **작업 스케줄러** → 해당 작업 선택 → **실행** 버튼  
- 또는 등록한 일정에 따라 자동 실행됩니다.

### 참고

- `00_deploy_auto.sh`는 **배포(2번)** 만 수행합니다(빌드 → git add → commit → push). 로컬 빌드(1번)는 터미널에서 `00_deploy.sh` 실행 후 1 입력이 필요하므로 SSH에서만 가능합니다.
- 커밋 메시지를 바꾸려면 스크립트 인자를 넣을 수 없으므로, 스케줄러 스크립트를 예를 들어  
  `.../00_deploy_auto.sh "DSM에서 배포"`  
  처럼 수정해 두면 됩니다.
- Node.js, git, `npm`이 **foifrit** 사용자 환경에서 PATH에 있어야 합니다. SSH로 로그인했을 때 `npm run build`가 동작하면 같은 계정으로 스케줄러 실행 시에도 동작하는 경우가 많습니다. 안 되면 스크립트 첫 줄에  
  `export PATH=/opt/bin:/opt/sbin:$PATH`  
  등을 추가해 보세요.

---

## 8. 문제 해결

- **`npm: command not found`**  
  Node.js가 PATH에 없음. Package Center Node는 보통 `/usr/local/bin` 또는 Synology 제공 경로에 있음. `which node` 또는 Docker 사용.

- **`Permission denied` (공유 폴더)**  
  `chown`으로 프로젝트 폴더 소유자를 SSH 로그인 사용자로 바꾸거나, 해당 사용자로 `git clone`/작업.

- **푸시 시 인증 실패**  
  HTTPS면 Personal Access Token 사용. SSH면 `ssh -T git@github.com`로 연결 확인 후 `git push` 재시도.

- **빌드 메모리 부족**  
  Node 빌드 시 메모리가 부족하면 Docker 컨테이너에 메모리 제한을 넉넉히 주거나, NAS에서 빌드 없이 **맥/CI에서만 빌드**하고 NAS에서는 `git pull` 후 `git push`만 하는 방식도 가능합니다. (그 경우 NAS에서는 `push-content.sh` 위주로 사용)

이 설정이 끝나면 **http://218.146.146.234:5000** DSM에 로그인해 둔 뒤, 필요할 때만 SSH로 접속해 위 스크립트를 실행하면 맥과 동일한 배포 역할을 NAS에서 수행할 수 있습니다.
