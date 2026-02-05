# GitHub Pages 배포 가이드 (agem.pknu.ac.kr)

## A. 프로젝트 유형

- **프레임워크**: Next.js 14 (React)
- **빌드**: `npm run build` → 정적 export (`output: 'export'`)로 `out/` 생성
- **주의**: GitHub Pages는 정적 호스팅만 지원합니다. 관리자 로그인·콘텐츠 편집·이미지 업로드 등 API(`/api/*`)는 **Pages에서는 동작하지 않습니다**. 공개용 페이지(홈, 연구, 멤버, 논문, 연락처 등)만 배포됩니다. 관리자 기능이 필요하면 Vercel 등 서버 환경에서 별도 배포하세요.

---

## B. Git 원격 연결 및 푸시 (로컬에서 실행)

아래는 **한 번만** 실행하면 됩니다. `<PASTE_YOUR_GITHUB_REPO_URL_HERE>` 부분을 본인 GitHub 저장소 URL로 바꾼 뒤 실행하세요.

```bash
# 1) 워킹 디렉토리로 이동
cd /Users/foifrit/00_Coding/02_Homepage

# 2) 원격이 아직 없으면 추가 (이미 있으면 이 줄은 스킵)
git remote add origin <PASTE_YOUR_GITHUB_REPO_URL_HERE>

# 이미 origin이 있는데 URL만 바꾸려면:
# git remote set-url origin <PASTE_YOUR_GITHUB_REPO_URL_HERE>

# 3) 브랜치가 main이 아니면 main으로 맞추기
git branch -M main

# 4) 변경 사항 스테이징 및 커밋 (배포에 필요한 파일 포함)
git add .
git status   # 확인 후
git commit -m "chore: GitHub Pages 배포 설정 (정적 export, Actions, CNAME)"

# 5) GitHub에 푸시 (최초 시 upstream 설정)
git push -u origin main
```

- **새 저장소를 만드는 경우**: GitHub에서 "New repository" 생성 시 **README / .gitignore / license 추가하지 말고** 빈 저장소로 만든 뒤, 위에서 `git remote add origin https://github.com/<USERNAME>/<REPO>.git` 하고 푸시하면 됩니다.

---

## C. GitHub Pages 설정 (한 번만)

1. 해당 GitHub 저장소 페이지에서 **Settings** → **Pages** 이동.
2. **Build and deployment**:
   - **Source**: **GitHub Actions** 선택.
3. 저장 후, `main` 브랜치에 푸시가 있으면 자동으로 `.github/workflows/deploy.yml`이 실행되어 `out/`을 빌드하고 GitHub Pages에 배포합니다.
4. 첫 배포 후 수 분 내에 다음 주소에서 확인 가능:
   - **프로젝트 페이지**: `https://<USERNAME>.github.io/<REPO>/`  
   - 아래에서 커스텀 도메인을 설정하면 `https://agem.pknu.ac.kr` 로 접속됩니다.

---

## D. 커스텀 도메인 agem.pknu.ac.kr 연결

### 1) GitHub에서 도메인 설정

1. 같은 저장소 **Settings** → **Pages** → **Custom domain**.
2. 입력란에 **`agem.pknu.ac.kr`** 입력 후 **Save**.
3. **Enforce HTTPS**는 DNS가 정상 반영된 뒤 켜면 됩니다.

### 2) DNS 설정 (학교 담당자 요청용)

도메인(pknu.ac.kr)을 학교에서 관리할 경우, 아래 문구를 그대로 복사해 DNS 담당자에게 전달하면 됩니다.  
필요 시 `<USERNAME>`을 본인 GitHub 사용자명으로, `<REPO>`를 저장소 이름으로 바꿔서 사용하세요.

---

#### 유저/조직 페이지 vs 프로젝트 페이지 (커스텀 도메인 관점)

| 방식 | 저장소 이름 | 기본 URL | DNS (CNAME Target) |
|------|-------------|----------|---------------------|
| **유저/조직 페이지** | `<USERNAME>.github.io` | `https://<USERNAME>.github.io/` | `<USERNAME>.github.io` |
| **프로젝트 페이지** | 아무 이름(예: `02_Homepage`) | `https://<USERNAME>.github.io/<REPO>/` | `<USERNAME>.github.io` |

- **커스텀 도메인(agem.pknu.ac.kr)을 쓰면** 두 방식 모두 **사이트가 도메인 루트(`https://agem.pknu.ac.kr/`)** 에 열립니다. URL 구조는 동일합니다.
- **DNS 레코드도 동일**: CNAME `agem` → `본인GitHub사용자명.github.io` 한 건이면 됩니다.
- **추천**: 기존에 쓰는 저장소가 있다면 그대로 **프로젝트 페이지**로 두고, Custom domain만 설정해도 됩니다. 새로 `USERNAME.github.io` 전용 저장소를 만들 필요는 없습니다.

---

**파일 `DNS_REQUEST_FOR_SCHOOL.md`** 에 담당자 전달용 요청 문구를 정리해 두었습니다. 그 파일 내용을 복사해 전달하면 됩니다.

---

## 요약 체크리스트

- [ ] GitHub에 빈 저장소 생성 (또는 기존 저장소 준비)
- [ ] 로컬에서 `git remote add origin <URL>` 후 `git push -u origin main`
- [ ] Settings → Pages → Source: **GitHub Actions**
- [ ] Actions 탭에서 배포 워크플로우 성공 확인
- [ ] Settings → Pages → Custom domain: **agem.pknu.ac.kr** 입력
- [ ] 학교 DNS 담당자에게 `DNS_REQUEST_FOR_SCHOOL.md` 내용 전달
- [ ] DNS 반영 후 **Enforce HTTPS** 활성화
