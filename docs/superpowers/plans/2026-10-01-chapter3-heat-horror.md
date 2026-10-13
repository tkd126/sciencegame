# Chapter 3 Heat Horror Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하나를 직접 보여 주지 않는 공포 이야기와 여섯 조작형 열 활동을 기존 게임에 연결한다.

**Architecture:** 기존 app.js 장면·선택·기록 엔진을 유지한다. Chapter3Story는 장면과 탐색 배치, Chapter3State는 순수 규칙, Chapter3View는 탐색 및 실험 화면을 담당한다. 저장은 기존 flags.chapter3에 격리한다.

**Tech Stack:** 정적 HTML/CSS/JavaScript, 기존 Node assert 테스트, 내장 이미지 생성 도구.

**Spec:** `docs/superpowers/specs/2026-10-01-chapter3-heat-horror-design.md` (사용자 승인 완료)

## Global Constraints

- 새 의존성이나 빌드 도구를 추가하지 않는다. prototype/index.html 직접 실행도 유지한다.
- 하나는 얼굴, 몸, 실루엣으로 직접 등장하지 않는다.
- 1999년 12월 28일 낮 12:10에서 이어 시작한다.
- 기존 자산은 덮어쓰지 않는다. 배포와 GitHub 업로드는 이번 범위에 포함하지 않는다.
- 장 선택 및 3편 진입에 0715 잠금 적용. 체험은 기존 저장을 덮어쓰지 않는다.
- 실험은 단계별 표시. 오답은 재시도, 가열은 교사 담당. 녹음은 자막이라고 명시한다.
- 활동 최대 폭 1040px, 높이 화면의 86% 이내. 그림 비율과 실행 버튼 위치 유지.

## Review Focus

1. 관찰 중 새로고침·이탈·중복 실행: 늦은 타이머가 다음 장면이나 완료를 바꾸지 않는다 (작업 1, 4).
2. 선행조건 없는 물건 조사와 잘못된 저장: 단서가 역순으로 나오거나 진행이 막히지 않는다 (작업 1, 2).
3. 기존 1·2편 저장으로 새 버전 실행: 기존 진행 보존, 3편 체험 저장 격리, 재잠금 (작업 5).
4. 390px 터치와 키보드만 사용: 드래그 없이도 동등하게 완료하고 버튼이 이동하지 않는다 (작업 4, 6).
5. 잘못된 예상 후 실제 결과: 물리가 학생 답에 따라 바뀌지 않고 수정할 수 있다 (작업 1, 4).

## 작업 1 — 조작형 학습 규칙과 저장 복원

**Files:** Create `prototype/chapter3-state.js`, `prototype/chapter3-state.test.js`.

**Interfaces:** 브라우저 Chapter3State 및 CommonJS export. `initial(saved?) -> State`, `act(state,event) -> State`, `preview(section) -> State`.
State는 `{version:1, activity, step, seen:{}, inventory:[], predictions:{}, observations:{}, choices:{}, notebook:[], complete:false}`와 활동별 work를 가진다. act는 입력 상태를 변경하지 않는다. 활동 ID는 measure/contact/conduction/convection/radiation/insulation/tape. event는 `{type,target?,value?}`. 알 수 없는 이벤트는 상태 유지.

- [ ] 테스트 먼저 작성: 잘못된 온도계 위치에서 observe는 단계 유지, 올바른 위치→관찰→그림과 같은 온도 기록 성공. contact의 역방향 화살표 거부. conduction 순서 틀림→관찰→수정 성공. convection 두 조건 동시 변경 기록은 근거로 인정하지 않음. radiation 두 조건 기록 필요. insulation 천/공기층+뚜껑+틈 없음 각각 성공, 금속판만 사용한 결과는 더 나쁘게 표시.
- [ ] 저장 테스트: `initial(JSON.parse(JSON.stringify(s)))`에서 소지품/예상/관찰 보존. running 상태는 실행 전으로 복귀. 알 수 없는 단계와 NaN/범위 밖 입력은 안전값 복구. 관찰 전 완료 이벤트와 중복 완료는 통과하지 않음.
- [ ] `node prototype/chapter3-state.test.js`로 모듈 부재/규칙 실패 확인.
- [ ] API 구현. 측정값과 액주 그림은 동일한 모델값을 사용하도록 export `models`. 비교 수치는 교육용 모형으로 선언. 결과는 정답 입력과 독립적으로 계산.
- [ ] 동일 테스트 PASS 확인 후 관련 두 파일만 커밋.

## 작업 2 — 이야기, 분기와 탐색 선행조건

**Files:** Create `prototype/chapter3-story.js`, `prototype/chapter3-story.test.js`.

**Interfaces:** Chapter3Story/CommonJS `build() -> scenes`, `rooms` (art, spots의 id/label/좌표), `previewScenes` (section→scene ID). scenes는 app.js의 speaker/line/chars/choices/next 및 experiment 필드를 따른다. 활동 장면은 `experiment:'chapter3', activity:<작업1 ID>`.

- [ ] 테스트: 모든 next/choice 목적지가 등록됨. 네 선택 지점의 모든 경로가 다음 공통 장면에 도달. chars에 hana 또는 silhouette 없음. 최초 시각 낮 12:10. 과학실→고장 문→보건실→방송실 이동 대사 존재. 테이프는 냉장 필요 없이 상자 바깥 봉투에서 획득.
- [ ] 테스트 실행해 실패 확인.
- [ ] 승인 설계의 아홉 이야기 구간 작성. 오프닝/조사 우선순위/문밖 목소리/녹음 처리에 다른 두 인물 반응 추가. 조사 우선순위 분기는 전도와 대류 순서를 바꿀 수 있지만 두 활동 완료 뒤 문 사건으로 합류.
- [ ] 선행조건을 작업1 act에 추가하고 테스트: 온도계 없이 컵 사용하면 먼저 도구 안내, 테이프 없이 재생 불가, 해결한 활동 재조사는 단서 중복 획득 없이 기록 표시.
- [ ] 이야기·상태 테스트 PASS 확인 후 해당 파일 커밋.

## 작업 3 — 카툰 배경과 사물 배치

**Files:** Create `prototype/assets/chapter3/{science-room-v1,science-bench-v1,infirmary-v1,small-studio-v1}.png`, 문 열린 상태 자산, `prototype/assets/chapter3/README.md`, `prototype/chapter3-assets.test.js`. Modify chapter3-story.js rooms.

**Interfaces:** rooms.art는 prototype 기준 상대 경로. spots는 이미지의 동일 좌표계와 라벨을 사용. 열린 문 art는 별도 경로. 가림판/온도계 등 움직이는 실험 도해는 코드 기반 렌더링, 배경은 래스터 생성.

- [ ] 자산 테스트: 참조 파일 존재와 PNG 시그니처, 각 spot 좌표가 이미지 좌표 범위 안에 있음. 닫힘/열림 경로 다름. 누락 상태에서 실패 확인.
- [ ] imagegen 스킬 재확인 후 기존 카툰 배경을 시각 참조로 읽는다. 네 배경과 문 열린 변형 생성. 인물/글자/현대 디지털 기기 없이 제작하고 하단 대화 영역은 비운다.
- [ ] 생성물을 직접 검사한 뒤 프로젝트 폴더로 복사. 실제 물건에 맞춰 rooms.spots 좌표를 설정. 원본 보존, 프롬프트·생성 도구·파일 경로 README 기록.
- [ ] 자산 테스트 PASS 및 문 그림 비교 확인 후 자산/배치만 커밋.

## 작업 4 — 탐색과 확대 실험 화면

**Files:** Create `prototype/chapter3-view.js`, `prototype/chapter3.css`, `prototype/chapter3-view.test.js`.

**Interfaces:** `Chapter3View.mount(host, activity, onDone, saved, onChange, sound) -> dispose`. 작업1 API와 작업2 rooms 사용. onChange(State)는 매 조작 후 호출, onDone은 완료 시 한 번. dispose 뒤 callback 금지. 가방/수첩/실험 닫기는 동일 상태 유지.

- [ ] 테스트: 더블 실행 하나만 처리, dispose 후 관찰 완료 콜백 없음, 닫기/재열기 보존, 단계별 한 문제, 선택 상태 aria-pressed, 키보드와 포인터 이벤트 동일 act 호출. 가짜 clock과 최소 DOM fixture 사용.
- [ ] 테스트 실행해 실패 확인.
- [ ] 렌더러 구현: 온도계 높이/숫자 다이얼, 예상 그래프 끝점, 금속판 순서표, 창문/난방 비교, 가림판 이동, 단열 재료 배치. 각 드래그는 선택→대상 클릭 및 키보드로도 수행 가능.
- [ ] 대화는 기존 dialogue/speaker/line 표현을 사용하고 별도 시험지 스타일을 만들지 않음. 탐색 사물 hover/focus/둘러보기, 가방, 구분된 수첩 기록 제공.
- [ ] 제어부와 실행 영역 높이 고정. active 입력 focus와 내부 scrollTop 유지. reduced-motion 및 연출 줄이기 적용. 숨겨진 배경 조사 입력은 활동 중 차단.
- [ ] 테스트 PASS 후 관련 파일 커밋.

## 작업 5 — 본편 연결·잠금·구간 체험

**Files:** Modify `prototype/app.js`, `prototype/index.html`, `prototype/chapter-access.js`, `prototype/chapter-access.test.js`; Create `prototype/chapter3-integration.test.js`.

**Interfaces:** Object.assign(scenes,Chapter3Story.build()). scene.experiment==='chapter3'일 때 작업4 mount, onChange는 flags.chapter3 저장, onDone은 scene.next. 3편 결말 ID chapter3-end, 시작 chapter3-start. 2편 끝 버튼은 3편 시작으로 연결. previewScenes는 5개 구간에 사용.

- [ ] 테스트: chapter3-/c3- 잠금 true, 1편 false. 2편 끝→3편 시작. 기존 1·2편 flags unchanged. 체험 조작/완료가 localStorage 본편을 덮어쓰지 않음. 3편 저장 이어하기 잠금 취소 시 state 변경 없음. 기존 chapter2-end 저장 정상 연결.
- [ ] 테스트 실행해 실패 확인.
- [ ] 스크립트/CSS 등록, mount/dispose 연결, 저장/기록/배경/인물/결말 연결. app.js의 chapter2-end 포함 분기를 명시적으로 분리해 2편 재시작 회귀 방지.
- [ ] 장 선택에 처음/측정/전도·대류/보건실/마지막 방송실 추가. 기존 0715 대화 문구를 ‘장 선택과 다음 편’으로 수정. 3편 다시 보기는 체험과 본편을 구분.
- [ ] `Get-ChildItem prototype/*.test.js | ForEach-Object { node $_.FullName; if ($LASTEXITCODE -ne 0) { throw $_.Name } }` 전체 PASS 후 관련 파일 커밋.

## 작업 6 — 전체 플레이와 인수인계

**Files:** Create `docs/chapter3-qa-2026-10-01.md`; Modify `CONTINUE_HERE.md`, `prototype/README.md`. 결함 수정 시 해당 테스트 먼저 보강.

- [ ] browse 스킬을 읽고 로컬 서버/실제 브라우저에서 시작. 사용자 본편 저장은 백업하거나 별도 테스트 컨텍스트 사용.
- [ ] 1280×720 처음→결말: 오사용/오답→재시도, 선택 분기 합류, 전도·대류 양 순서, 녹음 중단 선택→재개를 확인.
- [ ] 390×844에서 모든 활동 터치 대체 조작, 키보드, 스크롤/버튼 좌표/이미지 비율 확인. 실행 전후 버튼 좌표 비교.
- [ ] 새로고침과 활동 이탈/재진입, 애니메이션 중 이탈, 비밀번호 취소/재잠금, 기존 저장 보존 확인.
- [ ] 전체 Node 테스트와 JS 구문 검사 재실행, 이미지 HTTP 오류/콘솔 오류 확인. file 직접 실행에서도 핵심 경로 확인.
- [ ] 검증 결과와 미검증 학생 난이도/소요 시간, 음성 아닌 자막, 로컬 미배포 상태를 문서화. 새 자산 경로와 프롬프트 기록 링크 포함.
- [ ] 검증된 변경만 최종 커밋. 사용자에게 실행 주소와 장 선택→0715→3편 경로, 남은 제한을 보고. 배포하지 않음.

## 계획 자체 검토

- 승인 설계 1~8절을 작업 1~6에 대응시켰다.
- 저장/분기/자산/입력/통합 책임을 분리하고 공통 API 이름을 통일했다.
- 위험 다섯 항목을 소유 작업의 테스트에 배정했다.
- 현재는 구현 계획만 작성한 상태이며 제품 코드·이미지는 아직 변경하지 않았다.
