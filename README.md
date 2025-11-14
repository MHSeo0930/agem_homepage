# 연구실 홈페이지

Next.js와 Tailwind CSS를 사용하여 제작된 연구실 홈페이지입니다.

## 시작하기

### 필수 요구사항

- Node.js 18.17 이상
- npm, yarn, 또는 pnpm

### 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
npm start
```

## 프로젝트 구조

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   ├── page.tsx      # 홈페이지
│   │   └── globals.css   # 전역 스타일
│   └── components/       # 재사용 가능한 컴포넌트
│       ├── Header.tsx    # 헤더 컴포넌트
│       ├── Footer.tsx    # 푸터 컴포넌트
│       ├── Hero.tsx      # 히어로 섹션
│       ├── Research.tsx  # 연구 분야 섹션
│       └── News.tsx      # 뉴스 섹션
├── public/               # 정적 파일
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 커스터마이징

- **연구실 이름**: `src/components/Header.tsx`와 `src/components/Footer.tsx`에서 변경
- **색상 테마**: `tailwind.config.ts`에서 Tailwind CSS 테마 수정
- **내용**: 각 컴포넌트 파일에서 텍스트와 내용 수정

## 기술 스택

- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **React 18** - UI 라이브러리
- **React Quill** - 리치 텍스트 에디터

## 관리자 기능 (웹 편집)

웹사이트에서 직접 콘텐츠를 편집할 수 있는 관리자 기능이 포함되어 있습니다.

### 로그인

1. 브라우저에서 `/admin/login` 페이지로 이동합니다
2. 기본 아이디/비밀번호로 로그인합니다:
   - **아이디**: `admin` (또는 `.env.local`에서 설정한 값)
   - **비밀번호**: `admin123` (또는 `.env.local`에서 설정한 값)

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하여 관리자 계정을 설정할 수 있습니다:

```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
```

### 편집 방법

1. `/admin/login`에서 로그인합니다
2. `/admin` 대시보드에서 "홈페이지로 이동" 버튼을 클릭합니다
3. 편집하고 싶은 텍스트 섹션에 마우스를 올리면 "Edit" 버튼이 나타납니다
4. "Edit" 버튼을 클릭하여 에디터를 엽니다
5. 텍스트를 수정하거나 이미지를 삽입할 수 있습니다
6. "Save" 버튼을 클릭하여 저장합니다

### 이미지 업로드

- 에디터의 이미지 아이콘을 클릭하여 이미지를 업로드할 수 있습니다
- 업로드된 이미지는 `/public/uploads/` 폴더에 저장됩니다
- 이미지는 자동으로 콘텐츠에 삽입됩니다

### 저장된 데이터

- 편집된 콘텐츠는 `/data/content.json` 파일에 저장됩니다
- 이미지는 `/public/uploads/` 폴더에 저장됩니다

