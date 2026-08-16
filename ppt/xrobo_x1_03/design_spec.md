# Design Specification — XROBO Extreme X1 3차시 「엑스쿠터 컨트롤」 소스 완전 분석

## I. Project Overview

- **Purpose**: 공동교육과정 「로봇 소프트웨어 개발」 수업용 강의 자료. XROBO Extreme X1 교구의 3차시 예제(엑스쿠터 컨트롤) mBlock 소스를 블록 단위로 아주 자세히 해설한다.
- **Audience**: 공동교육과정을 수강하는 고등학생 (블록 코딩 기초 경험 보유)
- **Core message**: 이 한 프로그램 안에 순차·반복·선택·함수의 네 가지 제어 구조가 모두 들어 있고, 리모컨 값 하나로 로봇의 동작이 결정된다.
- **Delivery purpose**: presentation 겸 수업 보조 — balanced 밀도
- **Content divergence**: 소스 파일의 실제 값(핀, 속도, 주파수, 시간)을 그대로 사용. 블록 명칭은 mBlock XROBO 확장 팔레트 기준으로 서술.

## II. Mode & Visual Style

- mode: instructional — 개념을 분해하고 순서대로 쌓아 올리는 교수형 전개. 페이지당 한 개념.
- visual_style: swiss-minimal — 밝은 바탕, 명확한 그리드, 절제된 색. 코드 패널은 모노스페이스.

## III. Color Scheme

| Role | HEX | Usage |
|---|---|---|
| bg | #FFFFFF | 슬라이드 배경 |
| secondary_bg | #F3F4F6 | 코드 패널, 표 헤더 |
| primary | #1E3A8A | 제목 강조, 구조 요소 |
| accent | #F97316 | 핵심 값·강조 포인트 |
| secondary_accent | #0E7490 | 보조 강조 (함수/신호 계열) |
| text | #1F2937 | 본문 |
| text_secondary | #6B7280 | 캡션, 푸터 |
| border | #E5E7EB | 구분선, 패널 테두리 |

## IV. Font Plan

Per-role font stacks (px only):

- font_family: `Pretendard, "Malgun Gothic", Arial, sans-serif` (설치 잠금 — 이 저장소는 Pretendard 고정)
- code_family: `Consolas, "Courier New", monospace`
- 크기 램프: cover_title 64 / title 42 / subtitle 32 / lead 28 / body 24 / code 20 / annotation 18 / footnote 16
- 위계는 폰트 교체가 아니라 굵기(Medium/SemiBold/Bold)와 크기로 만든다.

## V. Layout System

- 캔버스 1280×720, 좌우 여백 72px, 제목 영역 y≈60–150, 콘텐츠 y≈180–640, 푸터 y≈680.
- 코드 해설 페이지: 좌측 코드 패널(모노스페이스 의사코드) + 우측 해설 카드의 2단 구성.
- 흐름도 페이지: 전면 다이어그램.

## VI. Icon Plan

- library: chunk-filled (단일 라이브러리)
- 사용 아이콘: robot, microchip, music, volume-high, arrows-repeat, git-fork, code-block, cog, bolt, lightbulb, signal, play, stop, checkmark, circle-question, target, list-ordered, stopwatch, wrench, book-open, sliders, flag

## VII. Visualization Reference List

| Page | Template | Type | Summary | Note |
|---|---|---|---|---|
| P13 | no-template-match | flowchart | — | 전체 실행 흐름도는 자유 설계 |

## VIII. Image Resource List

이미지 없음 (image_usage: none) — 모든 시각 요소는 SVG 벡터로 직접 그린다.

## IX. Content Outline

#### Slide 1 — 표지 (Cover)

- **Cover impact**: 짙은 남색 필드 위 로봇 아이콘과 초대형 제목 "엑스쿠터 컨트롤 — 소스 완전 분석". 과목·교구 태그 라인.
- 과목: 공동교육과정 로봇 소프트웨어 개발 / 교구: XROBO Extreme X1 / 3차시

#### Slide 2 — 수업 개요: 과목과 교구

- **Core message**: 이 수업은 공동교육과정 「로봇 소프트웨어 개발」이며, XROBO Extreme X1 키트와 mBlock 5로 실습한다.
- 과목 소개 / 교구 소개 / 오늘의 학습 목표 3단 구성

#### Slide 3 — 프로젝트 파일의 정체: .mblock 안에는 무엇이 있나

- **Core message**: .mblock 파일은 ZIP 압축 파일이며, 핵심은 블록 코드가 JSON으로 저장된 project.json이다.
- 파일 구성 목록: project.json / mscratch.json / 스프라이트·소리 자산, xrobo_learnkit 확장 v0.2.2, 업로드 모드(Arduino C 변환)

#### Slide 4 — 프로그램 전체 지도: 두 개의 스크립트

- **Core message**: 프로그램은 "메인 스크립트"와 사용자 함수 "엑스쿠터 컨트롤" 두 덩어리로 이루어진다.
- 단일 다이어그램: 메인(자동 시연 루프) → 함수 호출 → (조건 충족 시) 리모컨 제어 모드

#### Slide 5 — 사용하는 하드웨어와 블록

- **Core message**: 이 소스는 DC 모터 2개, 부저, RF 리모컨 수신(A6)의 세 가지 장치를 블록으로 제어한다.
- 장치별 블록·파라미터 표 (모터: 좌/우 속도·시간, 부저: 주파수·재생·쉼, 리모컨: A6 수신값 비교)

#### Slide 6 — 코드 읽기 ①: 시작과 초기 설정

- **Core message**: 프로그램은 시작 블록(RF 자동 연결)과 초기 설정 블록(핀 0, 값 20) 두 줄로 준비를 마친다.
- 코드 패널 + 파라미터 해설 (rfauto=1, pin=0/val=20)

#### Slide 7 — 코드 읽기 ②: 무한 반복 — 메인 루프의 네 단계

- **Core message**: 무한 반복 블록 안에서 [리모컨 감지 → 전진 → 후진 → 멜로디]의 네 단계가 계속 순환한다.
- 루프 본문 4단계 카드

#### Slide 8 — 폴링(Polling): 10번 반복해서 리모컨을 살핀다

- **Core message**: "함수 호출 + 0.2초 대기"를 10번 반복하는 것은 약 2초 동안 리모컨 입력을 폴링하는 코드다.
- 단일 개념 페이지: 0.2s × 10 타임라인

#### Slide 9 — 모터 제어: 속도의 부호가 방향이다

- **Core message**: 좌·우 모터에 같은 값을 주면 직진하고, 값의 부호를 바꾸면 방향이 반대가 된다.
- 전진 (10,10,1000ms) / 후진 (-10,-10,1000ms) / 0.5초 대기 해설

#### Slide 10 — 부저 멜로디: 주파수가 음이 된다

- **Core message**: 부저 블록의 숫자는 주파수(Hz)이고, 523·587·659는 각각 도5·레5·미5에 해당한다.
- 7음 시퀀스 (C5 D5 E5 D5 C5 D5 E5), 재생 50ms + 쉼 100ms

#### Slide 11 — 함수 「엑스쿠터 컨트롤」 ①: 진입 조건과 시작음

- **Core message**: 리모컨 수신값(A6)이 1일 때만 함수 본문이 실행되고, 도4·레4·미4 시작음이 모드 전환을 알린다.
- if A6==1 → 262/294/321Hz 알림음 → 내부 무한 반복 진입

#### Slide 12 — 함수 「엑스쿠터 컨트롤」 ②: 중첩 if-else 분기

- **Core message**: 3단 중첩 if-else가 리모컨 값 1·2·5를 각각 전진·후진·멜로디로, 그 외 값을 정지로 연결한다.
- 분기표: 1→(20,20) / 2→(-20,-20) / 5→멜로디 / else→(0,0)

#### Slide 13 — 전체 실행 흐름도

- **Core message**: 리모컨 1번을 누르기 전에는 자동 시연이 반복되고, 누른 뒤에는 영원히 리모컨 제어 모드에 머문다.
- 전면 순서도 (메인 루프 ↔ 함수 내부 루프, 복귀 없음 표시)

#### Slide 14 — 이 소스에 담긴 프로그래밍 개념 4가지

- **Core message**: 순차·반복·선택·함수 — 프로그래밍의 네 가지 기본 구조가 이 한 소스에 모두 들어 있다.
- 4개념 카드 + 소스 속 실제 위치 매핑

#### Slide 15 — 변형 미션과 정리 (Closing)

- **Closing impact**: "값을 바꾸면 동작이 바뀐다" — 3가지 변형 미션 제시와 차시 정리로 마무리.
- 미션: 속도·시간 바꾸기 / 새 버튼(값) 분기 추가 / 나만의 멜로디 작곡
