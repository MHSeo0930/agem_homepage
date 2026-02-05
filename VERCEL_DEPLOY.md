# Vercel 배포 가이드

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

```
ADMIN_USERNAME=foifrit
ADMIN_PASSWORD=pknu1308!
NODE_ENV=production
```

**중요**: 프로덕션 환경에서는 강력한 비밀번호를 사용하세요!

### 5. 빌드 및 배포
- "Deploy" 버튼 클릭
- 빌드가 완료되면 자동으로 배포됩니다

## Vercel 특성 및 주의사항

### 파일 시스템 제한
Vercel은 서버리스 환경이므로:
- **임시 파일 시스템**: 각 함수 실행 시에만 파일 시스템에 접근 가능
- **영구 저장 불가**: `data/` 폴더의 파일은 배포 시 초기화될 수 있음
- **해결 방법**: 
  - Vercel KV (Redis) 사용
  - Vercel Postgres 사용
  - 외부 데이터베이스 연결
  - 또는 Git에 초기 데이터 포함

### 현재 구조
현재 프로젝트는 파일 시스템을 사용하므로:
1. **초기 데이터**: Git에 포함된 `data/` 폴더의 초기 데이터 사용
2. **런타임 데이터**: Vercel의 임시 파일 시스템에 저장 (재배포 시 초기화됨)
3. **권장**: 프로덕션 환경에서는 데이터베이스 사용 권장

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

### 빌드 실패
- `npm install` 로컬에서 실행하여 의존성 확인
- `npm run build` 로컬에서 실행하여 빌드 오류 확인

### 환경 변수 오류
- Vercel Dashboard에서 환경 변수 확인
- 변수명 대소문자 확인

### 파일 시스템 오류
- Vercel은 서버리스 환경이므로 파일 시스템 사용 시 제한이 있음
- 데이터베이스 사용 권장

## 추가 리소스
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

