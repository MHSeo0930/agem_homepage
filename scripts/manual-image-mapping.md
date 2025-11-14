# 갤러리 이미지 수동 매핑 가이드

웹사이트에서 이미지를 직접 확인하고 다운로드하는 방법입니다.

## 방법 1: 브라우저 개발자 도구 사용

1. https://icms.pknu.ac.kr/agem/3470 접속
2. F12로 개발자 도구 열기
3. Network 탭 → Img 필터 선택
4. 각 페이지를 새로고침하면서 이미지 URL 확인
5. 이미지 URL을 복사하여 아래 매핑에 추가

## 방법 2: 이미지 직접 다운로드

1. 각 갤러리 항목 클릭
2. 이미지 우클릭 → "이미지 주소 복사"
3. 아래 파일명으로 저장

## 갤러리 항목과 파일명 매핑

### Page 1 (최신)
1. `250930-happy-birthday.jpg` - 250930 happy birthday
2. `250824-25-workshop-kims.jpg` - 250824-25 Workshop with KIMS
3. `250822-graduation.jpg` - 250822 Graudation
4. `250709-sajik-baseball-stadium.jpg` - 250709 Sajik Baseball Stadium
5. `247th-ecs-meeting.jpg` - 247th ECS Meeting (Montreal, Canada)
6. `25-spring-electrochemistry.jpg` - 25 춘계한국전기화학회 (제주도)
7. `2025-winter-symposium.jpg` - 2025 대한화학회 동계 심포지엄 (강원도 홍천 소노캄)
8. `241108-happy-birthday.jpg` - 241108 Happy birthday
9. `24-fall-surface-chemistry.jpg` - 24 추계표면공학회

### Page 2
10. `lab-cherry-blossom.jpg` - 연구실 단체 벚꽃 사진
11. `2022-spring-surface-chemistry.jpg` - 2022' 춘계 한국표면공학회 with Prof. Han's group
12. `green-energy-summer-school.jpg` - 제 2회 그린에너지 소부장 섬머스쿨 초청 발표
13. `waterloo-1.jpg` - at Uni. of Waterloo
14. `2019-electrochemistry.jpg` - 2019' 전기화학회
15. `2021-corrosion-society.jpg` - 2021 한국부식방식학회 초청발표
16. `alberta.jpg` - at Uni. of Alberta
17. `mcmaster.jpg` - at MacMaster Uni.
18. `waterloo-2.jpg` - at Uni. of Waterloo

### Page 3
19. `csir.jpg` - at CSIR
20. `2018-excellent-employee.jpg` - 2018' 출연연 우수직원 이사장 표창
21. `waterloo-3.jpg` - at Uni. of Waterloo
22. `group-photo.jpg` - 그룹사진

## 이미지 저장 위치

모든 이미지를 다음 폴더에 저장하세요:
`public/images/gallery/`

## 갤러리 페이지 업데이트

이미지를 다운로드한 후, `src/app/board/gallery/page.tsx` 파일의 `image` 경로를 업데이트하세요.

