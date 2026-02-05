# DNS 설정 요청 (커스텀 도메인 agem.pknu.ac.kr)

아래 내용을 **pknu.ac.kr 도메인을 관리하는 DNS 담당자**에게 전달해 주세요.

---

## 요청 개요

부산경남대학교(pknu.ac.kr) 연구실 홈페이지를 **https://agem.pknu.ac.kr** 주소로 서비스하려고 합니다.  
사이트는 GitHub Pages에 호스팅되어 있으며, 도메인만 학교 DNS에서 연결해 주시면 됩니다.

---

## 필요한 DNS 레코드

**방식: CNAME 레코드 1개 추가**

| 항목 | 값 |
|------|-----|
| **레코드 유형** | CNAME |
| **호스트/이름 (Name / Host)** | `agem` (또는 `agem.pknu.ac.kr`에 대응하는 서브도메인 부분만) |
| **값/가리킴 (Value / Target / Points to)** | `본인GitHub사용자명.github.io` |

- **예**: GitHub 사용자명이 `pknu-agem` 이라면  
  - **Name**: `agem`  
  - **Target**: `pknu-agem.github.io`

- **프로젝트 페이지**를 쓰는 경우에도, GitHub Pages는 커스텀 도메인을 설정하면 **루트 도메인(agem.pknu.ac.kr)** 로 서비스하므로, 동일하게 **CNAME만** 추가하시면 됩니다.

---

## 참고 (담당자용)

- **CNAME**만 추가해 주시면 됩니다. A 레코드는 필요 없습니다.
- GitHub 측에서 `agem.pknu.ac.kr`을 이 저장소의 Pages와 연결해 두었습니다.
- DNS 반영 후 수 시간~최대 24시간 이내에 https://agem.pknu.ac.kr 로 접속 가능해지며, 이후 GitHub에서 SSL(HTTPS)을 자동으로 제공합니다.

---

## 요청 문구 (그대로 복사용)

```
[DNS 설정 요청]

서비스 주소: https://agem.pknu.ac.kr (연구실 홈페이지)
호스팅: GitHub Pages

아래 CNAME 레코드 1건 추가 부탁드립니다.

• 타입: CNAME
• 호스트(Name): agem
• 값(Target): [여기에 본인 GitHub 사용자명 입력].github.io
  예: pknu-agem.github.io

추가 후 별도 A 레코드나 다른 설정은 필요 없습니다.
```

**`[여기에 본인 GitHub 사용자명 입력]`** 부분만 실제 GitHub 아이디로 바꿔서 전달하시면 됩니다.
