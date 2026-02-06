# DNS 설정 요청 (커스텀 도메인 agem.pknu.ac.kr)

아래 내용을 **pknu.ac.kr 도메인을 관리하는 DNS 담당자**에게 전달해 주세요.

---

## 요청 개요

부경대학교(pknu.ac.kr) 연구실 홈페이지를 **https://agem.pknu.ac.kr** 주소로 서비스하려고 합니다.  
사이트는 **Vercel**에 호스팅되어 있으며(관리자 로그인 등 API 동작), 도메인만 학교 DNS에서 연결해 주시면 됩니다.

---

## 필요한 DNS 레코드

**방식: CNAME 레코드 1개 추가**

| 항목 | 값 |
|------|-----|
| **레코드 유형** | CNAME |
| **호스트/이름 (Name / Host)** | `agem` |
| **값/가리킴 (Value / Target / Points to)** | `cname.vercel-dns.com` |

- **Name**: `agem` (또는 사용 중인 DNS 시스템에서 서브도메인만 입력하는 경우)
- **Target**: `cname.vercel-dns.com` (Vercel이 제공하는 CNAME 대상)

---

## CNAME이 불가한 경우 (A 레코드)

일부 환경에서는 CNAME 대신 **A 레코드**로 요청할 수 있습니다.

| 항목 | 값 |
|------|-----|
| **레코드 유형** | A |
| **호스트/이름 (Name / Host)** | `agem` (또는 `agem.pknu.ac.kr`) |
| **값/IP (Value)** | `76.76.21.21` |
| **TTL** | 기본값 |

- Vercel이 제공하는 IP: **76.76.21.21** (변경될 수 있으므로 [Vercel 문서](https://vercel.com/docs/projects/domains#dns-records) 참고)

---

## 참고 (담당자용)

- **CNAME** 또는 **A 레코드** 중 하나만 추가해 주시면 됩니다.
- Vercel 측에서 `agem.pknu.ac.kr`을 이 프로젝트와 연결해 두었습니다.
- DNS 반영 후 수 분~수 시간 이내에 https://agem.pknu.ac.kr 로 접속 가능해지며, Vercel에서 SSL(HTTPS)을 자동으로 제공합니다.

---

## 요청 문구 (그대로 복사용)

```
[DNS 설정 요청]

서비스 주소: https://agem.pknu.ac.kr (연구실 홈페이지)
호스팅: Vercel

아래 CNAME 레코드 1건 추가 부탁드립니다.

• 타입: CNAME
• 호스트(Name): agem
• 값(Target): cname.vercel-dns.com

추가 후 별도 A 레코드나 다른 설정은 필요 없습니다.
```
