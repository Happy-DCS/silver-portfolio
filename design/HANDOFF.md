# Silver Eun Cho 포트폴리오 — 개발 인수인계 문서

디자이너 조은(Silver Eun Cho)의 개인 포트폴리오 사이트. 디자인 시안이자 동작하는 프로토타입으로,
이 폴더의 HTML이 곧 디자인 원본입니다. 최종 개발·배포에 필요한 정보를 이 문서에 정리했습니다.

문의: 조은 — euncho.work@gmail.com

---

## 1. 기술 개요

- 순수 HTML + CSS + JavaScript (프레임워크·빌드 과정 없음)
- 페이지별 단일 파일 구조 (CSS/JS 임베디드)
- 데스크톱(1440px) 우선 설계. **모바일 반응형은 미구현 — 개발 단계 작업 필요**
- 외부 의존성 (CDN):
  - Pretendard Variable (본문·산세리프) — jsdelivr
  - Instrument Serif (영문 세리프 이탤릭), Nanum Myeongjo (국문 명조) — Google Fonts
  - pdf.js 3.11.174 (작품 PDF 렌더링) — cdnjs, work.html에서만 사용

## 2. 파일 구조

```
portfolio/
├── index.html      # 홈 (히어로 → 클로버 줄기 디바이더 → 작품 콜라주 → 푸터)
├── works.html      # 전체 작업 (필터형 아카이브, 카드 12개)
├── work.html       # 작품 상세 템플릿 (?p=1~12, PDF 뷰어)
├── about.html      # 소개 + CV (학력/경력/툴/Beyond Design)
├── contact.html    # 연락처 (스크롤 없는 단일 화면)
├── PLAN.md         # 기획 문서 (IA·컨셉 결정 기록)
├── HANDOFF.md      # 이 문서
└── assets/
    ├── img/        # clover.png(심볼), profile.jpg(프로필), instagram/behance/linkedin.png(SNS 로고)
    └── pdf/        # 작품 PDF 저장 위치 — work1.pdf ~ work12.pdf (현재 비어 있음)
```

※ `assets/img/profile.png`는 미사용 원본 — 삭제해도 됩니다.

## 3. 디자인 시스템

### 컬러 토큰 (각 파일 `:root`)
- `--paper: #ffffff` 배경 (순백)
- `--ink: #1e1b16` 텍스트·반전 배경 (검정)
- `--green: #2f7d43` 클로버 그린 (제한적 포인트)
- `--muted: #8b857a` 보조 텍스트 / `--line: #e4dfd5` 테두리
- 푸터 밝은 색: `#f4f1ea`, 푸터 구분선: `#3a352d`

### 타이포 시스템 (사이트 전체의 핵심 문법)
- 대형 타이틀: 산세리프 800 대문자 + 일부 단어만 이탤릭 세리프(`em`)
  - 크기: `clamp(54px, 7.4vw, 118px)` / 행간 1.08 / 자간 -0.03em — **전 페이지 공통**
- 국문 스왑(호버 시 한글 교체)은 명조 800, 원문의 0.89배 크기
- 아웃라인 글자: `color:#fff; -webkit-text-stroke:2px var(--ink); paint-order:stroke fill`
  - Firefox도 지원하나 크로스브라우저 QA 필요
- 로고: *Silver*(이탤릭 세리프) + **EUN CHO**(산세리프 800)

### 공통 컴포넌트 (모든 페이지 동일 마크업)
- 상단 캡슐 바: 고정, 그리드 폭(max 1340px), 반투명+블러, 현재 페이지 탭은 `nav a.on`
- `header::before`: 상단 150px 흰색→투명 그라데이션 (콘텐츠 겹침 방지)
- 푸터: LET'S CREATE *together* (호버→"함께 만들어가요") + 이메일 알약 버튼 + 저작권/SNS
- TOP 버튼: 우하단 원형, 스크롤 400px 이후 표시 (contact 제외)
- `html { scrollbar-gutter: stable }` — 페이지 간 이동 시 상단 바 흔들림 방지. 제거 금지.

## 4. 페이지별 명세·인터랙션

### index.html (홈)
1. 히어로: "HI, I'M *Silver* EUN CHO / WELCOME TO MY *portfolio*"
   - 첫 줄 호버 → "안녕하세요, 조은입니다" (아웃라인 명조, '조은'만 검은 채움)
   - "WELCOME TO MY" 호버 → 단어 사이가 벌어지며 검은 클로버(assets/img/clover.png) 등장
   - *portfolio* 호버 → 검은 상자 반전 + ":)" 슬라이드 등장
   - 스크롤 시 히어로 전체가 위로 밀리며 축소·페이드 (JS, rAF)
2. 디바이더: 세로선이 스크롤 진행도에 따라 자라고, 클로버가 선 끝을 타고 회전하며 하강
   - 첫 화면 하단에 클로버가 미리 보이도록 `margin-top:-130px`
3. 작품 콜라주: 12컬럼 그리드에 5점 비대칭 배치(미술관 스타일). 스크롤 진입 시 개별로
   줌 인(scale .88→1) 등장, 호버 시 1.02 확대 + 하단에 명조 캡션(제목·분야·연도)
4. "View all works →" 버튼(호버 → "모든 작업 보기 →"), 위아래 여백 200px 대칭

### works.html (전체 작업)
- 타이틀 "ALL *works*" 호버 → "모든 작업들" ('모든'만 아웃라인)
- 필터 바: sticky, 영문 라벨 기본·호버 시 한국어. 클릭 시 해당 분야만 표시(JS), 개수 자동 집계
- 분야: all / branding / graphic / book / uiux / product (+ 카드 데이터 `data-f`)
- 카드: CSS columns 마소너리(3열), 호버 시 살짝 떠오르며 제목 밑줄

### work.html (작품 상세 — 핵심 개발 포인트)
- URL 파라미터 `?p=N`으로 작품 선택. 메타데이터는 파일 하단 `works` JS 객체에 있음
- PDF 경로 규칙: `assets/pdf/work{N}.pdf`
- 렌더링: `file:` 프로토콜이면 브라우저 내장 뷰어(`<object>` + `#toolbar=0`),
  서버 환경이면 pdf.js로 각 페이지를 캔버스로 전폭 렌더 (배포 후엔 pdf.js 경로가 기본)
- PDF 없으면 안내 문구 표시. 이전/다음 작품 내비는 번호 순환식
- **개발 시 확인**: 대용량 PDF 로딩 UX(스피너/지연 로드), 페이지 리사이즈 시 재렌더 미구현

### about.html (소개)
- "ABOUT *me*" 호버 → "조은에 대하여" ('조은'만 채움)
- 좌측 프로필 사진(3:4) + 우측 소개 4문단 (이름 기원 서사 — 카피 수정 시 반드시 본인 확인)
- CV 섹션: Education / Experience / Tools / Beyond Design (행 리스트 + 알약 배지)
- Beyond Design의 YouTube 태그 → https://www.youtube.com/@silver_life_1123 (실제 링크)

### contact.html (연락처)
- 스크롤 없는 100vh 단일 화면, 푸터·TOP 없음
- GET IN *touch* 호버 → "편하게 연락해 주세요" (아웃라인)
- 이메일: 호버 시 밑줄+획 굵어짐(text-stroke), 클릭 시 mailto:euncho.work@gmail.com
- SNS: Instagram(세리프 이탤릭, 호버 시 브랜드 그라데이션 + 로고 등장),
  Behance/LinkedIn(산세리프, 브랜드 컬러 + 로고 등장) — 로고는 assets/img/*.png
- Resume: 호버 시 검은 상자 + "이력서" 스왑. **링크 미연결(#) — PDF 파일 받아 연결 필요**

## 5. 더미 데이터 → 실제 데이터 교체 목록 (콘텐츠 확정 대기)

| 항목 | 위치 | 현재 상태 |
|---|---|---|
| 작품 12종 메타(제목·분야·연도) | works.html 카드, index.html 콜라주, work.html `works` 객체 | 더미 — 실제 목록으로 교체. **세 곳 동기화 필수** |
| 작품 썸네일 이미지 | 카드·콜라주의 `linear-gradient` 인라인 배경 | 더미 그라디언트 — `<img>` 또는 background-image로 교체 |
| 작품 PDF | assets/pdf/work1~12.pdf | 없음 — 디자이너가 순차 업로드 예정 |
| SNS 링크 | 전 페이지 푸터·contact의 `href="#"` | 미연결 — Instagram/Behance/LinkedIn 실제 URL 필요 |
| 이력서 PDF | contact.html Resume | 미연결 |
| 홈 콜라주 5점 선정 | index.html | 대표작 확정 시 교체 (임팩트순 배치 원칙) |

## 6. 남은 개발 과제 (권장 순서)

1. **모바일/태블릿 반응형** — 최우선. 브레이크포인트 설계 필요 (현재 1440 기준).
   호버 인터랙션의 터치 대응(탭 시 스왑 표시 등) 포함
2. 실데이터 교체 (5번 표) + 이미지 최적화(WebP, lazy loading)
3. work.html PDF 뷰어 고도화: 로딩 인디케이터, 리사이즈 재렌더, 모바일 성능
4. 메타/SEO: favicon, OG 이미지·태그, 페이지별 description (index만 있음)
5. 접근성 QA: 키보드 포커스 스타일, 호버 전용 정보의 대체 접근, 명도 대비
6. 크로스브라우저 QA: -webkit-text-stroke, backdrop-filter (Safari/Firefox)
7. 배포: 정적 호스팅이면 충분 (GitHub Pages / Netlify / Vercel). 커스텀 도메인 연결
8. 공통 CSS 분리(선택): 현재 페이지별 임베디드 — 유지보수 위해 assets/site.css 추출 고려

## 7. 미리보기 방법

- 더블클릭으로 브라우저에서 바로 열림 (file://)
- 서버 미리보기(권장, pdf.js 확인용): 폴더에서 `python -m http.server 8000` → http://localhost:8000

## 8. 주의사항

- 이 폴더는 까치커피바 사이트(상위 폴더)와 같은 저장소에 있지만 **완전히 독립된 프로젝트**입니다.
  상위 폴더의 index.html 등과 혼동 금지. 배포 시 portfolio/ 폴더만 분리하면 됩니다.
- 카피(문구)는 디자이너의 아이덴티티 그 자체이므로("널린 풀이지만, 행복한 풀" 등)
  임의 수정 금지 — 변경은 반드시 조은 님 확인 후.
- 클로버(assets/img/clover.png)는 개인 심볼. 다른 아이콘으로 대체하지 말 것.
