# B the B LIVE WALL 조사 메모

## 조사 범위와 원칙

- 원본 저장소를 읽기 전용으로 조사했다.
- manifest, Electron Forge·Vite·Vitest 설정, main/preload/renderer 소스와 테스트를 확인했다.
- 외부 API의 실제 주소, 인증 헤더 값, 키, 운영 설정과 응답에 포함될 수 있는 개인 식별 정보는 이 메모와 공개 콘텐츠에 기록하지 않았다.
- 기간, 팀 구성, 개인 역할, 납품·운영 상태와 정량 성과는 소스에서 확인할 수 없어 단정하지 않았다.
- 공개 문서에는 Content 스키마의 공통 frontmatter만 사용했고 다이어그램을 추가하지 않았다.

## 확인한 기술 기반

- `package.json`
  - Electron, Vue 3, TypeScript, Axios, Pinia, Electron Store를 사용한다.
  - Electron Forge의 개발 실행, 패키징, make와 publish 스크립트가 있다.
  - Vitest 실행 스크립트가 있다.
- `forge.config.ts`
  - Vite 기반 main/preload/renderer 빌드 구성을 사용한다.
  - 패키지 외부 자원 디렉터리를 extra resource로 포함한다.
  - Windows 설치 maker와 다른 플랫폼 maker가 설정돼 있다.
  - Electron 기능 제한을 위한 fuse 설정이 있다.
- `vitest.config.ts`
  - Vue 플러그인, Happy DOM과 renderer 소스의 테스트 패턴이 설정돼 있다.

## 구현 근거

### Electron 프로세스 경계

- `src/main/main.ts`
  - 저장된 창 위치·크기·전체화면·프레임·항상 위 옵션으로 BrowserWindow를 만든다.
  - 백그라운드 렌더링 제한을 끄고 사용자 입력 없이 미디어를 재생할 수 있게 구성한다.
  - 설정, 레이아웃, 게시물 수집, 전체 게시물 수 조회와 앱 종료 IPC를 등록한다.
- `src/preload/preload.ts`
  - Context Bridge를 통해 필요한 설정·수집·레이아웃 함수만 renderer에 노출한다.
  - 외부 API 인증 정보 자체는 renderer 인터페이스에 노출하지 않는다.
- `src/main/store/configStore.ts`
  - 창, API 연결, 해시태그, 집계 기준, 갱신·교체 주기와 레이아웃을 Electron Store로 관리한다.
  - 현장 설정에 구체적인 태그·숫자·레이아웃 좌표가 있으나 공개 콘텐츠에는 옮기지 않았다.

### 게시물 수집

- `src/main/services/scraper.ts`
  - Axios로 외부 해시태그 API의 페이지형 응답을 수집한다.
  - 기존에 확인한 ID와 현재 요청 안의 중복 ID를 구분한다.
  - 응답을 끝까지 검사하고 신규 항목을 최신 순으로 정렬한다.
  - 화면 표시용 데이터 구조로 정규화하며 캡션의 해시태그와 일반 문장을 분리한다.
  - 외부 서비스 오류는 기록한 뒤 현재까지 수집한 범위로 종료한다.
  - 전체 게시물 수 조회에 실패하면 renderer가 로컬 기준값 방식으로 대체할 수 있도록 `null`을 반환한다.
- `src/main/services/scraper.test.ts`
  - 알려진 ID 사이에 섞인 신규 항목 수집과 페이지 응답의 최신 순 정렬을 검증한다.
  - 테스트의 가상 주소·키와 샘플 응답 값은 조사 결과에 옮기지 않았다.

### 포토월 상태와 화면 갱신

- `src/renderer/components/PhotoWall.vue`
  - 여러 해시태그를 각각 요청한 뒤 성공 결과를 합치고 중복을 제거한다.
  - 해시태그별 최근 ID 집합과 순서를 제한된 크기로 유지한다.
  - 화면 표시 중이거나 이미 대기열에 있는 게시물을 교체 큐에서 제외한다.
  - 수집 주기와 카드 교체 주기를 분리하며 갱신 요청의 중복 실행을 막는다.
  - 고정된 카드 슬롯 순서를 한 번 섞어 순환하고 숨김 슬롯을 건너뛴다.
  - 이미지 로드 실패를 제한된 횟수로 재시도하고 최종 실패 시 이미지를 숨긴다.
  - 총 게시물 수 API가 없을 때 기준값과 현재 게시물 수를 합산하는 대체 경로가 있다.
  - 편집 모드, 카드 표시·숨김, 패널 드래그, 카드 내부 영역 캘리브레이션과 레이아웃 저장을 지원한다.
  - unmount 시 타이머와 등록 리스너를 정리한다.
- `src/renderer/services/photoWall.logic.ts`
  - ID 중복 제거, 슬롯 순서 셔플, 가시 슬롯 선택, 표시 문자열 정리, 로컬 날짜 집계, 총계 대체 계산과 화면 비율 계산을 순수 함수로 분리한다.
- `src/renderer/renderer.ts`
  - Vue 앱을 만들고 Pinia를 플러그인으로 등록한다. 조사한 소스에는 별도 Pinia store 파일이 없어 상태 관리의 구체 사용을 과장하지 않았다.

### 자원 로딩

- `src/main/services/instagramReferer.ts`
  - 원격 이미지 제공처의 요구에 맞춰 Electron 세션에서 요청 헤더를 보완한다.
  - 구체 도메인과 헤더 값은 공개 콘텐츠와 이 메모에 기록하지 않았다.
- `src/main/services/registerProtocols.ts`, `src/main/services/localResources.ts`
  - 패키지 외부 자원을 읽기 위한 Electron 커스텀 프로토콜을 등록한다.
  - 허용된 host와 기준 디렉터리 안의 상대 경로만 처리하고 경로 이탈을 거부한다.
  - 이미지 확장자에 따라 응답 MIME 유형을 정한다.

## 테스트에서 확인한 범위

- `src/main/services/scraper.test.ts`
  - 증분 수집과 최신 순 정렬
- `src/renderer/services/photoWall.logic.test.ts`
  - 카드 슬롯 상수, 중복 제거, 슬롯 셔플과 숨김 건너뛰기
  - 캡션·메타 정리, 로컬 날짜 기준 당일 집계, 총계 대체 계산과 화면 비율
- `src/renderer/components/PhotoWall.test.ts`
  - 카드 생성과 초기 렌더
  - 가시 슬롯을 반영한 요청 상한
  - 여러 해시태그 병합과 신규 게시물 교체
  - 편집 모드, 카드 숨김·복원, 외부 게시물 열기
  - unmount 시 타이머와 이벤트 정리

테스트 파일과 설정의 존재 및 의도만 조사했으며, 이번 콘텐츠 작성 과정에서 실제 테스트 명령은 실행하지 않았다.

## 공개 표현 판단

### 공개 초안에 사용한 사실

- 여러 해시태그의 최신 소셜 미디어 게시물을 합쳐 표시하는 라이브 포토월
- Electron main/preload/renderer 책임 분리
- 페이지형 증분 수집, ID 중복 제거와 해시태그별 실패 분리
- 제한된 카드 슬롯과 교체 대기열, 애니메이션 기반 순환
- 패널·카드 편집과 카드 내부 표시 영역 캘리브레이션
- Electron Store 설정 유지, 커스텀 자원 프로토콜과 Electron Forge 패키징
- Vitest와 Vue Test Utils 테스트

### 사용하지 않은 정보와 표현

- 외부 API의 서비스 주소, endpoint, 인증 방식의 구체 값과 키
- 실제 운영 해시태그, 게시물 ID, 계정명, 캡션, 이미지 주소와 영구 링크
- 현장 설정의 구체 창 크기, 좌표, 카드 수, 집계 기준값과 갱신 시간
- 회사 연락처, 내부 저장 위치와 패키지 식별자
- “실시간 무중단 수집”, “모든 게시물 표시”, “운영 안정성 검증 완료” 같은 근거 없는 표현
- 외부 서비스 이용 정책이나 게시물 노출 동의가 확인됐다는 표현

## 사용자 확인 필요

- 작업 기간, 팀 구성과 개인 담당 범위
- 기획·디자인·현장 설치 참여 여부
- 운영·납품 상태와 공개 가능한 클라이언트명
- 게시물 필터링, 노출 동의와 삭제 요청 처리 정책
- 외부 서비스 장애·호출 제한 대응 방식
- 실제 디스플레이 구성과 장기간 운영 결과
- 공개 가능한 화면과 정량 성과
- 대표 기술 판단의 문제, 검토 대안, 결정 이유와 결과
