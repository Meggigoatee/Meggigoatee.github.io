# Tobomi 소스 조사 메모

## 사용자 확인 정보

- 작업 기간: 2026년 7월 21일–진행 중
- 프로젝트 형태: 개인 프로젝트
- 담당 범위: 기획, UI·캐릭터 디자인, 전체 개발
- 상태: 개발 중, 2026년 8월 25일 데모 출시 예정
- 운영체제: 현재 Windows 한정, macOS 지원 예정
- 성능: 유휴 상태 CPU 사용률 0.5% 이하, 기능 사용 중 3% 이하, 메모리 사용량 200MB 이하
- 공개 범위: Tobomi 프로젝트명과 화면 공개 가능, 저장소 비공개
- 대표 의사결정: 명확한 블록별 기능과 하나의 긴 문서 흐름을 검토하고, 익숙한 블록 디자인에 연속 선택·복사를 결합함. 여러 블록을 한 번의 드래그로 선택·복사할 수 있으며 마우스 사용 빈도 감소 폭은 미측정

## 조사 범위

- 조사일: 2026-08-13
- 대상: 전달받은 Tobomi 원본 저장소(읽기 전용)
- 목적: `docs/portfolio-content-plan.md`의 메인 프로젝트 기준과 현재 Content Collection 스키마에 맞춘 공개용 초안 작성
- 상태 원칙: 현재 개발 버전으로만 표현하고 출시·다운로드·운영 성과를 추측하지 않음

원본 저장소는 수정하지 않았다. 공개 콘텐츠에는 원본 저장소의 절대 경로, 애플리케이션 식별자, 로컬 데이터 경로와 운영체제별 내부 설정값을 포함하지 않았다.

## Content Collection 스키마 확인

`content.config.ts`의 프로젝트 필드를 기준으로 frontmatter를 작성했다.

- `title`, `slug`, `order`, `category`, `status`, `featured`, `summary`
- `period`, `role`, `team`
- `techStack`, `cover`, `gallery`, `video`

Tobomi는 `order: 4`, `status: 개발 중`, `featured: true`로 작성했다. 계획서에서 개인 프로젝트임은 확인되므로 `team: 개인 프로젝트`로 기록했다. 정확한 역할과 기간은 확인되지 않아 각각 `확인 필요`, `null`로 두었다. 스키마에 없는 다이어그램 frontmatter는 추가하지 않고 본문의 표와 텍스트 대체 설명으로 제공했다.

## 확인한 근거

### 프로젝트 상태와 기술 구성

- `package.json`
  - 비공개 패키지와 개발 버전 표기
  - Vue 3, Pinia, TypeScript, Vue Router와 다국어 라이브러리
  - Tauri CLI, Vite, Vitest, happy-dom 기반 개발 구성
- `src-tauri/Cargo.toml`
  - Tauri 2, SQLx SQLite, Tokio
  - 알림, 로컬 설정, 창 상태, 단일 인스턴스, 자동 실행 플러그인
  - Windows의 선택적 시스템 활동 처리를 위한 네이티브 API 의존성
- `src-tauri/tauri.conf.json`
  - 숨겨진 main 창과 투명·상시 위 컴패니언 계열 창
  - 데스크탑 번들 및 Windows NSIS 대상 구성
- `README.md`, `CHANGELOG.md`, `.references/toDo.md`
  - 현재 개발 단계와 구현된 기능, 계획 기능의 구분
  - 공개 배포가 완료되지 않은 내부 개발 구간임을 확인

### Vue UI / Pinia

- `src/main.ts`, `src/router.ts`
  - Vue, Pinia, router와 다국어 초기화
  - main, memo, timer, focus, companion 계열의 다중 창 라우트
  - reminder와 calendar 라우트는 존재하지만 실제 화면은 스텁
- `src/features/main/views/MainWindow.vue`
  - 대시보드에 집중·타이머·메모 카드 연결
  - 설정에서 컴패니언 활동 동의와 앱 종료 진입점 제공
- `src/features/memo/store/memoStore.ts`
  - Pinia 메모 목록 상태와 `memo:changed` 이벤트 기반 부분 갱신
- `src/features/timer/store/timerStore.ts`
  - 저장된 타이머 정의와 실행 상태, `timer:changed` 이벤트 기반 창 간 갱신
- `src/features/focus/store/focusStore.ts`
  - 집중 목표·현재 단계·오늘 완료 요약 상태
  - `focus:changed` 이벤트 후 Rust 상태 재조회

### Tauri Commands → Rust Services

- `src/features/*/services/*.ts`
  - 프론트 컴포넌트와 스토어가 직접 SQL을 사용하지 않고 타입이 지정된 `invoke` 래퍼만 호출
- `src-tauri/src/lib.rs`
  - SQLx 풀, 시스템 활동 adapter, 컴패니언 창 상태, 로케일, 종료 조정, 타이머 런타임 관리
  - 트레이, 단일 인스턴스, 자동 실행, 창 상태, 알림 플러그인 등록
  - 메모·타이머·집중·컴패니언·창·종료·자동 실행 커맨드 등록
- `src-tauri/src/commands/memo.rs`
  - 메모 읽기·쓰기, 블록과 항목의 트랜잭션 저장, 변경 이벤트
- `src-tauri/src/commands/timer.rs`
  - 타이머 정의의 SQLite 저장과 프로세스 메모리 실행 상태
  - 시작·일시정지·재개·초기화 및 완료 이벤트
- `src-tauri/src/commands/focus.rs`, `src-tauri/src/deadline_supervisor.rs`
  - 목표 기반 집중·휴식 상태, 완료 기록과 오늘 요약
  - 백그라운드 deadline 확인, 알림, 종료·재시작 상태 정리

### SQLite / SQLx

- `src-tauri/src/db/pool.rs`
  - 앱 데이터 디렉터리에 SQLite 파일 생성
  - SQLx pool 직접 관리, 외래 키 제약 활성화, 내장 마이그레이션 실행
- `src-tauri/migrations/*.sql`
  - 메모·블록·체크리스트·불릿 항목
  - 저장된 타이머 정의
  - 완료한 집중 기록, 현재 집중 목표와 실행 상태
  - reminder와 calendar 테이블도 초기 스키마에 있으나 대응 커맨드와 기능은 아직 없음

### System Activity

- `src-tauri/src/system_activity.rs`
  - 기본 비활성, 신호 종류별 동의 후 adapter 시작
  - 자리 비움·복귀, 잠금·해제와 외부 타이핑 여부를 상태 이벤트로 정제
  - 입력 내용, 키 종류, 창 제목과 화면을 읽거나 저장하지 않음
- `src/features/companion/composables/useCompanionActivityConsent.ts`
  - 동의 상태를 로컬 설정에 저장하고 Rust adapter에 반영
  - 동의 철회 시 감지 중지와 관련 집계 초기화
- `src/features/companion/composables/useCompanionSystemActivity.ts`
  - 정제된 이벤트를 컴패니언의 작업·휴식·복귀 상태로 변환

### Tray / Autostart / Single Instance

- `src-tauri/src/tray.rs`, `src-tauri/src/window_visibility.rs`
  - Rust 소유 트레이
  - 대시보드·컴패니언 표시와 숨김, 종료 진입점
- `src-tauri/src/commands/autostart.rs`, `src/settings/autostart.ts`
  - 자동 실행 플러그인을 Rust 커맨드로 감쌈
  - 앱 설정의 사본이 아닌 OS 등록 상태를 읽어 표시
- `src-tauri/src/lib.rs`
  - 두 번째 실행을 차단하고 기존 컴패니언을 표시하는 single-instance 흐름
- `src-tauri/src/commands/app_exit.rs`
  - 열린 메모 창에 저장 준비 이벤트 전송
  - 저장 실패 시 종료 취소와 해당 창 표시
  - 창 상태와 집중 실행 상태 정리 후 데이터베이스 풀 종료

### 컴패니언

- `src/features/companion/store/companionStore.ts`
  - 지속 상태와 일시 반응을 분리한 Pinia 상태 머신
  - 우선순위, 선점, 복귀와 긴급 반응 확인 흐름
- `src/features/companion/composables/useCompanionEvents.ts`
  - 메모, 체크리스트와 집중 이벤트를 정규화된 반응 요청으로 변환
  - 코드에는 향후 리마인더 이벤트 수신 계약도 있으나 실제 발신 기능은 없음
- `src/features/companion/components/MaruSpriteRenderer.vue`
  - manifest에서 선택한 애니메이션의 스프라이트 프레임 재생
- `src/features/companion/views/CompanionWindow.vue`
  - 투명 오버레이 창, 직접 상호작용, 빠른 메뉴, 시스템 활동과 자율 행동 연결

### 테스트

- `vitest.config.ts`
  - happy-dom 환경과 공용 setup 사용
- 조사 시점의 프론트 `*.spec.ts` 파일은 54개
  - Vue 컴포넌트와 Pinia 스토어
  - 메모 편집 규칙, 타이머·집중 표시와 상태
  - 컴패니언 행동 선택, 상호작용, 창 배치와 스프라이트 재생
  - 다국어, 설정과 창 서비스
- Rust 소스에는 조사 시점 기준 `#[test]` 또는 `#[tokio::test]` 속성이 다수 존재
  - SQLx 인메모리 데이터베이스와 마이그레이션
  - 메모·타이머·집중 도메인 규칙
  - 트레이·창 표시 결정, 종료 조정과 시스템 활동 상태 전이
- 이번 조사에서는 테스트, 프론트 빌드, `cargo check`와 Tauri 번들 빌드를 실행하지 않음

## 구현과 계획의 구분

### 현재 코드에서 확인된 구현

- 블록형 메모와 자동 저장
- 저장해 두고 반복 사용하는 다중 타이머
- 목표 기반 집중·휴식과 백그라운드 완료 처리
- 대시보드와 기능별 다중 창
- 애니메이션 컴패니언과 빠른 메뉴·목록
- 메모·집중·시스템 활동 이벤트에 반응하는 상태 머신
- 다국어와 테마 설정
- 시스템 트레이, 단일 인스턴스, 로그인 시 자동 실행
- 동의 기반 시스템 활동 감지
- SQLx·SQLite 로컬 데이터 저장

### 공개 콘텐츠의 구현 결과에서 제외

- 리마인더: 라우트·빈 화면·테이블·컴패니언 수신 계약은 있으나 실제 커맨드와 스케줄러가 없음
- 캘린더: 라우트·빈 화면·테이블은 있으나 실제 로컬 일정 기능이 없음
- Google Calendar: 아키텍처와 향후 계획만 있고 구현 의존성·모듈이 없음
- 오늘의 목표와 관계·장기 기억: 계획 또는 부분 배관 단계
- 공개 다운로드, 정식 출시, 업데이트와 운영 성과: 확인되지 않음

## 공개 콘텐츠에서 제외한 정보

- 원본 저장소와 사용자 데이터의 절대 경로
- 애플리케이션 identifier와 내부 버전 문자열
- 운영체제별 자동 실행 등록 위치와 세부 네이티브 API
- Tauri 개발 서버 주소와 세부 창 크기
- capability 파일의 내부 권한 식별자와 디버그 커맨드
- 캐릭터 생성 원본·QA 작업 파일과 내부 에셋 경로
- 아직 구현되지 않은 기능을 완료된 것처럼 보이게 하는 설명

## 확인이 필요한 항목

- 개발 시작 시점과 공개 가능한 작업 기간
- 기획, UI 디자인, 캐릭터 디자인·에셋 제작의 정확한 담당 범위
- 현재 지원 대상 운영체제와 실제 기기 검증 범위
- 외부 공개, 베타 배포와 정식 출시 계획
- 공개 저장소·데모·다운로드 링크 제공 여부
- 정량적인 시작 속도, 메모리 사용량과 안정성 결과
- 대표 사용자 시나리오와 사용성 검증 결과
- 공개 가능한 화면·캐릭터 이미지·영상
- 대표 기술 판단의 문제, 검토 대안, 결정 이유와 결과

## 다이어그램 전달 데이터

공개 콘텐츠 본문에 다음 계층을 접근 가능한 표와 텍스트 대체 설명으로 기록했다.

1. Vue UI / Pinia
2. Tauri Commands
3. Rust Services
4. SQLite / SQLx
5. System Activity
6. Tray
7. Autostart / Single Instance

시각 컴포넌트로 전환할 때는 Rust Services 아래에 네 개의 시스템 분기를 배치하고, 처리 결과와 의미 이벤트가 Vue UI / Pinia로 돌아오는 역방향 관계도 설명 텍스트에 포함해야 한다. 화살표나 색상만으로 계층 관계를 전달하지 않는다.
