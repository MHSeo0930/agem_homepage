# Vercel 배포 가이드

**Vercel로 배포하면 관리자 로그인이 배포 주소에서 동작합니다.**  
(GitHub Pages는 정적 전용이라 로그인 불가, Vercel은 서버 빌드로 API 사용 가능)

## agem-homepage 프로젝트에 이 저장소 연결하기

이 레포지토리(02_Homepage)를 **기존 Vercel 프로젝트 agem-homepage**에 연결해 배포하려면:

1. **이 프로젝트를 Git에 푸시**  
   - GitHub 등에 저장소를 만들었다면: `git remote add origin <저장소URL>` 후 `git push -u origin main`

2. **Vercel에서 Git 연결/변경**  
   - [agem-homepage 배포 대시보드](https://vercel.com/min-ho-seos-projects/agem-homepage) 접속  
   - **Settings** → **Git**  
   - **Connect Git Repository** 또는 **Disconnect** 후 위에서 푸시한 저장소로 다시 연결  
   - 연결 후 **Production Branch**: `main` (또는 사용 중인 기본 브랜치)로 설정

3. **환경 변수 확인**  
   - **Settings** → **Environment Variables**  
   - 아래 "4. 환경 변수 설정" 항목대로 `ADMIN_USERNAME`, `ADMIN_PASSWORD` 및 (권장) Upstash Redis, Vercel Blob 설정

4. **재배포**  
   - **Deployments** 탭에서 최신 배포 옆 **⋯** → **Redeploy**  
   - 또는 Git에 새로 푸시하면 자동 배포됨

배포가 끝나면 **Domains**에 있는 URL(예: `agem-homepage-xxx.vercel.app`)로 접속하고,  
반드시 **`/agem_homepage/`** 경로로 들어가서 사용하세요. (루트 `/`는 `/agem_homepage/`로 리다이렉트됨)

---

## 로컬에서만 작업 후 배포 (Redis/Blob 없이, 용량/비용 절감)

**편집은 로컬에서만 하고, 변경분을 Git에 올려 배포**하는 방식입니다. Vercel에서 Redis·Blob을 쓰지 않아 용량/비용 부담이 없습니다.

### 워크플로우
1. **로컬에서 편집**  
   - `npm run dev` 후 `http://localhost:3000/agem_homepage`에서 로그인해 콘텐츠·엑셀·이미지 수정  
   - 저장 시 `data/content.json`, `data/journals.xlsx`, `public/uploads/` 등에 반영됨  

2. **한 번에 Git + Vercel 반영**  
   - 아래 명령 하나면 **빌드 후 전체**를 Git에 푸시하고, Vercel이 자동 배포합니다.  
   ```bash
   npm run deploy
   ```
   - 커밋 메시지 지정: `npm run deploy -- "메인 문구 수정"`  
   - 동작: `npm run build` → `git add .` → `git commit` → `git push origin main` → Vercel 자동 배포  

3. **콘텐츠만 올리고 싶을 때**  
   - `npm run push:content` — `data/content.json`, `data/journals.xlsx`, `public/uploads/` 만 커밋·푸시  

4. **배포 사이트에서는 저장/업로드 불가**  
   - Redis·Blob을 쓰지 않으므로, 배포된 사이트에서 "저장" 또는 "이미지 업로드"를 하면  
     *"배포 사이트에서는 저장되지 않습니다. 로컬에서 수정한 뒤 Git에 푸시해 주세요."*  
     안내가 뜹니다. 편집·업로드는 로컬에서만 하면 됩니다.  

### Vercel 설정
- **환경 변수**: `ADMIN_USERNAME`, `ADMIN_PASSWORD`만 넣으면 됩니다.  
- **Redis·Blob**: 사용하지 않으면 연결하지 않아도 됩니다.  

### 주의
- `data/content.json`, `data/journals.xlsx`가 커밋되므로 민감한 정보는 넣지 마세요.  
- 나중에 Redis/Blob을 쓰려면 `.gitignore`에서 `data/*.json`, `data/*.xlsx`를 다시 활성화하고, Vercel Storage를 연결하면 됩니다.

---

## 배포 전 준비사항

### 1. Git 저장소에 푸시
```bash
git add .
git commit -m "Initial commit for Vercel deployment"
git push origin main
```

### 2. Vercel 프로젝트 생성
1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택: `MHSeo0930/agem_homepage`
4. Branch: `main` 선택

### 3. 프로젝트 설정
- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)

### 4. 환경 변수 설정
Vercel Dashboard의 "Environment Variables" 섹션에서 다음 변수들을 추가:

**필수 (로그인)**
```
ADMIN_USERNAME=foifrit
ADMIN_PASSWORD=pknu1308!
NODE_ENV=production
```

**편집·저장 영구 반영 (권장)**  
Vercel은 디스크에 파일을 영구 저장하지 않습니다. 아래 저장소를 연결하면 **편집한 콘텐츠·업로드 이미지·엑셀**이 재배포 후에도 유지됩니다.

1. **Upstash Redis** – 콘텐츠(연락처, 뉴스, 갤러리, 논문 등) 저장  
   - Vercel 대시보드 → 프로젝트 → Storage → Create Database → **Upstash Redis** 선택 후 생성 (이름 예: `agem-storage`)  
   - 생성 후 해당 스토어를 agem-homepage 프로젝트에 **연결(Link)**하면 `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` 이 자동으로 추가됩니다.

2. **Vercel Blob** – 이미지 업로드·엑셀 파일 저장  
   - Storage → **Blob** Create Store 후 프로젝트에 연결  
   - `BLOB_READ_WRITE_TOKEN` 이 자동으로 추가됩니다.

위 두 저장소를 연결한 뒤 재배포하면, Vercel 주소에서 편집·저장한 내용이 영구히 유지됩니다.

**지도 표시 (선택)**  
연락처 섹션에 구글 지도 임베드를 쓰려면:

```
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY=여기에_Google_Maps_Embed_API_키
```

- [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → "Maps Embed API" 사용 설정 후 API 키 생성  
없으면 OpenStreetMap으로 대체됩니다.

**중요**: 프로덕션 환경에서는 강력한 비밀번호를 사용하세요.

### 5. 빌드 및 배포
- "Deploy" 버튼 클릭
- 빌드가 완료되면 자동으로 배포됩니다

## 저장소 사용 (편집 내용 영구 저장)

- **Upstash Redis** (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`):  
  웹에서 편집한 모든 콘텐츠(연락처, 뉴스, 갤러리, 논문, 교수/멤버 정보 등)가 Redis에 저장됩니다.  
  설정하지 않으면 로컬에서는 `data/content.json` 파일을 사용하고, Vercel에서는 저장이 유지되지 않습니다.

- **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`):  
  에디터에서 업로드한 이미지와 Achievements의 엑셀 파일이 Blob에 저장됩니다.  
  설정하지 않으면 로컬에서는 `public/uploads`와 `data/journals.xlsx`를 사용하고, Vercel에서는 업로드·엑셀 저장이 재배포 시 사라질 수 있습니다.

## Vercel 콘텐츠를 로컬로 백업한 뒤 Git에 올리기

Vercel(Redis)에서 수정한 콘텐츠는 Git에 자동 반영되지 않습니다. 주기적으로 로컬로 백업한 뒤 커밋·푸시하면 **버전 관리**와 **백업**을 함께 할 수 있습니다.

1. **백업 실행** (Vercel에 배포된 주소에서 콘텐츠를 받아 `data/content.json`으로 저장)
   ```bash
   # 배포 URL을 인자로 넘기거나
   node scripts/backup-from-vercel.js https://agem-homepage-xxx.vercel.app/agem_homepage

   # 또는 .env에 BACKUP_SOURCE_URL 설정 후
   BACKUP_SOURCE_URL=https://agem-homepage-xxx.vercel.app/agem_homepage npm run backup:vercel
   ```
2. **Git에 반영**
   ```bash
   git add data/content.json
   git commit -m "Backup content from Vercel"
   git push origin main
   ```

배포 URL은 Vercel 대시보드 → 프로젝트 → Domains에서 확인할 수 있습니다 (예: `agem-homepage-xxx.vercel.app`). basePath가 있으므로 URL 끝에 `/agem_homepage`를 붙여 사용하세요.

## 커스텀 도메인 연결

### 1. Vercel에서 도메인 추가
1. 프로젝트 설정 → Domains
2. 원하는 도메인 입력 (예: `lab.pknu.ac.kr`)
3. DNS 설정 안내에 따라 도메인 제공자에서 설정

### 2. DNS 설정
도메인 제공자에서 다음 레코드 추가:
- **Type**: CNAME
- **Name**: `@` 또는 `lab`
- **Value**: `cname.vercel-dns.com`

또는:
- **Type**: A
- **Name**: `@`
- **Value**: Vercel이 제공하는 IP 주소

## 배포 후 확인사항

1. ✅ 홈페이지 접속 확인
2. ✅ 관리자 로그인 기능 확인
3. ✅ 이미지 업로드 기능 확인
4. ✅ 엑셀 파일 업로드/다운로드 확인
5. ✅ 데이터 저장/불러오기 확인

## 문제 해결

### 엑셀 다운로드/저장 시 "EROFS: read-only file system" 또는 "엑셀 저장을 위해 Vercel Blob 연결이 필요합니다"
- **원인**: Vercel은 디스크에 파일을 쓸 수 없어, 엑셀 파일(`journals.xlsx`)을 Blob에 저장해야 합니다.
- **해결**: Vercel 대시보드 → 프로젝트 → **Storage** → **Create Database** → **Blob** 선택 후 생성하고, 프로젝트에 연결합니다. `BLOB_READ_WRITE_TOKEN`이 자동 추가된 뒤 **Redeploy** 하면 엑셀 다운로드·저장이 동작합니다.

### 편집 시 "Failed to save content" (저장 실패)
- **원인**: Vercel은 디스크에 파일을 영구 저장하지 않습니다. **Upstash Redis**가 연결되지 않으면 콘텐츠 저장이 불가능합니다.
- **해결**:
  1. [Vercel 대시보드](https://vercel.com/dashboard) → **agem-homepage** 프로젝트 선택
  2. **Storage** → **Create Database** → **Upstash Redis** 선택 후 생성
  3. 생성된 Redis를 프로젝트에 연결(자동으로 `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` 환경 변수 추가됨)
  4. **Redeploy** 실행
- 저장 실패 시 알림에 "Vercel에서는 콘텐츠 저장을 위해 Upstash Redis가 필요합니다…" 문구가 표시되면 위 순서대로 Redis를 연결하면 됩니다.

### 편집 시 "404 NOT_FOUND" / "저장 중 오류가 발생했습니다"
- **원인**: 앱이 `basePath: '/agem_homepage'`로 배포되므로, 실제 API 경로는 `/agem_homepage/api/...` 입니다. API 요청이 basePath 없이 `/api/...`로 가면 Vercel이 해당 리소스를 찾지 못해 NOT_FOUND(404)를 반환합니다.
- **해결**:
  1. **항상 `.../agem_homepage/` 로 접속**한 뒤 편집하세요. 루트(`/`)로만 접속하면 리다이렉트 타이밍에 따라 일부 요청이 잘못된 경로로 나갈 수 있습니다.
  2. Vercel 환경 변수에 `NEXT_PUBLIC_BASEPATH`를 수동으로 넣었다면 **비우거나 잘못된 값으로 두지 마세요**. 비어 있으면 코드에서 기본값 `/agem_homepage`를 쓰도록 수정되어 있으나, 루트 원인 제거를 위해 이 변수를 덮어쓰지 않는 것을 권장합니다.
- `getApiBase()`가 서버/클라이언트 모두에서 basePath를 안전하게 반환하도록 되어 있으므로, 위 접속 경로만 지키면 됩니다.

### 지도가 안 보일 때
- **Google 지도**: Vercel에 `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`를 설정한 뒤 재배포하세요.
- **OpenStreetMap**: 일부 환경에서 iframe이 차단될 수 있습니다. 지도 영역 오른쪽 하단의 "Google 지도에서 보기" / "OpenStreetMap" 링크로 새 탭에서 확인할 수 있습니다.

### 빌드 실패
- `npm install` 로컬에서 실행하여 의존성 확인
- `npm run build` 로컬에서 실행하여 빌드 오류 확인

### 환경 변수 오류
- Vercel Dashboard에서 환경 변수 확인
- 변수명 대소문자 확인

### 저장한 내용이 사라질 때
- Upstash Redis와 Vercel Blob을 연결했는지 확인하세요. 위 "4. 환경 변수 설정"의 **편집·저장 영구 반영** 항목을 참고해 Storage에서 Redis·Blob을 생성하고 프로젝트에 연결한 뒤 재배포하세요.

## 추가 리소스
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

