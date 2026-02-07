# 갤러리/이미지 업로드 → 화면 표시 흐름 점검

## 1. 전체 흐름 (단계별)

### 1단계: 업로드 API (POST /api/upload)
- **파일 저장**: `process.cwd()/public/uploads/<safeFilename>` (로컬/NAS)
- **반환 URL**: `basePath + "/uploads/" + safeFilename` → 예: `/agem_homepage/uploads/1739xxxxxx-abc.jpg`
- **점검**: NAS에서 `public/uploads/` 쓰기 권한, `process.cwd()`가 프로젝트 루트인지

### 2단계: 콘텐츠 저장 API (POST /api/content)
- **body**: `{ gallery: JSON.stringify(updatedGallery) }` (갤러리 한 항목의 image 필드만 새 URL로 갱신)
- **저장 위치**: `process.cwd()/data/content.json` (로컬/NAS, Redis 없을 때)
- **점검**: NAS에서 `data/` 디렉터리 및 `content.json` 쓰기 권한
- **실패 시**: 500 반환 → 화면에는 낙관적 반영 유지, 저장만 실패 알림

### 3단계: 저장 성공 후 화면 갱신
- **400ms 후** `loadData()` 호출 → GET /api/content
- **가능 원인**: GET 응답이 **브라우저 캐시**로 오래된 데이터를 주면, 방금 저장한 URL이 덮어쓰여져 placeholder로 돌아감
- **대응**: content GET 요청에 `cache: 'no-store'` 적용

### 4단계: loadData() 정규화 (갤러리)
- `item.image`가 `/uploads/`로만 시작하면 → `getApiBase() + "/uploads/" + 파일명` 으로 변환
- 이미 `/agem_homepage/uploads/`면 그대로 사용
- **점검**: `getApiBase()`가 브라우저에서 `/agem_homepage` 반환하는지 (경로 기준)

### 5단계: 이미지 표시 (EditableImage / Image)
- **표시 URL**: `imageSrc`가 `/`로 시작하면 `window.location.origin + imageSrc`
- **실제 요청**: `http://NAS:3000/agem_homepage/uploads/xxx.jpg`
- Next.js `basePath: '/agem_homepage'` → `public/uploads/xxx`는 `/agem_homepage/uploads/xxx`로 서빙
- **placeholder**: `!imageSrc || imageError` 등일 때 "사진 없음" / "이미지 없음"
- **점검**: 이미지 로드 실패(404)면 `onError` → placeholder. 즉 **파일이 없거나 경로가 잘못되면** placeholder 표시

---

## 2. 증상 정리

| 증상 | 가능 원인 |
|------|-----------|
| 웹에서 업로드 직후 placeholder | ① content GET 캐시로 이전 데이터로 덮어씀 ② content 저장 실패 후 loadData()는 호출 안 함 → 낙관적 반영만 있어야 함. 반대로 placeholder면 **저장 성공인데 GET이 캐시**일 가능성 |
| 00_deploy.sh 실행 후엔 사진 보임 | ① 재시작으로 캐시/메모리 초기화 ② 또는 스크립트가 git pull로 최신 content.json 반영 |

→ **적용한 수정**: 갤러리/교수/멤버/알umni의 `loadData()`에서 GET /api/content 호출 시 `cache: 'no-store'`, `credentials: 'include'` 추가. 재시작 없이 저장 직후 화면에 반영되는지 확인.

---

## 3. NAS에서 점검할 것

1. **쓰기 권한**
   - `data/` 디렉터리, `data/content.json`
   - `public/uploads/` 디렉터리  
   → 서버 실행 계정(예: AGEM)이 쓰기 가능한지

2. **실행 경로**
   - `00_deploy.sh` / `npm run dev` 실행 시 `process.cwd()`가 `/var/.../Homepage`인지  
   → 업로드·content 저장 모두 이 경로 기준

3. **접속 주소**
   - 브라우저가 `http://NAS주소:3000/agem_homepage/...` 로 접속하는지  
   → `getApiBase()`가 `/agem_homepage`로 맞게 동작하는지
