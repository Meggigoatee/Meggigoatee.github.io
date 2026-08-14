# i-syncPlayer System 조사 메모

## 사용자 확인 정보

- 작업 기간: 7월 31일–8월 21일
- 프로젝트 형태: 개인 프로젝트
- 담당 범위: i-playerHub 운영 기획 제안 및 신규 개발, 기존 i-syncPlayer 소스코드 인수 후 개선
- 기획 참여: 다수 플레이어를 중앙에서 관리하는 i-playerHub 도입과 운영 방식 제안
- UI·그래픽 디자인 참여: 없음
- 운영 상태: 오픈 예정 전시관에서 시범 운영 중
- 운영 구성: 플레이어 PC 12대, 허브 PC 1대, 프로젝터 27대
- 동기화 오차: 0.1초 미만
- 업데이트 정책: 운영자의 명시적 동작을 통해 적용
- 프로젝트명: 현재 명칭으로 공개 가능
- 화면 자료: 추후 사용자 추가
- 대표 의사결정: 단일 영상 반복 시 약 1초의 지연 문제에 대해 단일 `video` 루프와 다중 `video` 사전 로드를 검토하고, 재생 로직 단일화와 유지보수성을 위해 단일 재생 모드와 루프 방식을 선택함. 루프 지연은 0.05초 미만으로 감소

## 조사 범위와 원칙

- 중앙 통제 앱 `i-playerHub`와 현장 재생 앱 `i-syncPlayer`를 읽기 전용으로 조사했다.
- 각 저장소의 `AGENTS.md`, `.references/project.md`, `.references/architecture.md`를 먼저 확인했다.
- 이후 manifest, 주요 실행 모듈, 타입과 테스트를 교차 확인했다.
- 공개 콘텐츠에는 저장소의 절대 경로, 실제 네트워크 주소·포트, 인증·배포 정보와 장비별 설정값을 넣지 않았다.
- 기간, 팀 구성, 개인 담당 범위, 운영 상태와 성과는 사용자 확인 정보를 우선하고 소스 조사 결과와 구분해 기록했다.

## 확인한 근거

### 공통 기반

- 두 `package.json` 모두 ESM(`type: module`), Electron, TypeScript, Electron Builder와 Vitest 구성을 가진다.
- 두 앱 모두 Windows NSIS 패키징 설정을 가진다.
- 애플리케이션 소스는 main/renderer/build 도구를 TypeScript와 ESM으로 구성한다.

### i-playerHub

- `.references/architecture.md`: 내부망의 여러 i-syncPlayer를 중앙 장비에서 관리하며, 재생 동기화 토폴로지와 업데이트 통제 토폴로지를 분리한다고 명시한다.
- `main.ts`: 설정·플레이어 문서 IPC, 업데이트 저장소와 파일 서버 수명 주기, 원격 설정 창, Windows 로그인 실행 설정을 담당한다.
- `src/scripts/players/player-registry.ts`: 플레이어 목록 로드·저장과 조회를 담당한다.
- `src/scripts/players/player-monitor.ts`: 장비별 상태 조회를 병렬 처리하고 `setTimeout`으로 이전 주기 종료 후 다음 주기를 예약한다.
- `src/scripts/players/player-client.ts`: 장비별 상태 응답을 외부 입력으로 검증하고, 연결 실패·제한 시간·응답 오류를 결과값으로 구분한다. 설치 직후 앱 종료 때문에 응답이 유실될 수 있는 경우와 명령 미전달을 구분한다.
- `src/scripts/players/player-commander.ts`: 선택한 여러 플레이어에 명령을 동시에 보내며 장비별 진행·결과 상태를 관리하고 실행 중 중복 명령을 막는다.
- `server/update-repository.ts`: 릴리스 메타데이터, 설치 파일, blockmap, SHA-512를 검증한다. 설치 파일과 blockmap을 먼저 교체하고 최신 메타데이터를 마지막에 교체한다. 버전별 메타데이터도 보존한다.
- `server/update-file-server.ts`: 업데이트 파일에 대한 읽기 전용 HTTP 제공과 단일 byte Range를 지원한다.
- `tests/`: 구성 병합, 플레이어 문서·폼 검증, 병렬 명령, 비중첩 폴링, UI 상태, 업데이트 저장소와 파일 서버를 대상으로 한 Vitest 테스트가 있다.

### i-syncPlayer

- `.references/architecture.md`: 이미지·비디오를 여러 화면에서 동기 재생하는 Windows Electron 앱이며, 선택적으로 Spout와 Unity Receiver를 사용한다고 명시한다.
- `main.ts`: Electron 창·트레이·설정·플레이리스트 IPC를 관리한다. Spout 설정에서는 offscreen 렌더링과 네이티브 모듈 출력을 사용하고 Unity 수신기 프로세스를 시작·정리한다.
- `src/scripts/media/media-catalog.ts`: 로컬 미디어 경로에서 지원되는 이미지와 비디오를 카탈로그로 구성한다.
- `src/scripts/playlist-manager.ts`: 다중 플레이리스트, 항목 순서·활성화·볼륨, 파일 누락 상태를 관리한다. 누락 항목은 문서에는 보존하고 재생 대상에서 제외한다.
- `src/scripts/media/media-player.ts`: 두 개의 비디오 요소를 active/standby로 운용하고 작업 식별자에 맞는 준비 결과만 commit한다. 이미지 표시도 같은 준비 인터페이스로 다룬다.
- `src/scripts/sync/master-sync.ts`: TCP 명령, 준비 상태 수집, 작업 식별자, 다음 비디오 prefetch, UDP 시간 전송, 이미지·구버전 대체 흐름을 구현한다.
- `src/scripts/sync/client-sync.ts`: 마스터 연결과 재연결, 순번 기반 로컬 미디어 해석, ready/done/notFound 응답, 오래된 작업 무시와 UDP 시간 차 기반 playback rate 보정을 구현한다.
- `src/scripts/control/control-server.ts`: 마스터 재생 제어, 설정, 업데이트 상태·확인·설치를 위한 HTTP 인터페이스를 제공한다.
- `updater.ts`: 패키지 실행과 업데이트 서버 설정 여부에 따라 updater를 활성화한다. 백그라운드 다운로드를 허용하되 앱 종료 시 자동 설치는 끄고 호출 시점에 무인 설치한다. 이전 버전 확인도 별도 조건으로 처리한다.
- `src/scripts/effects/effects-manager.ts`: 이미지 시퀀스와 제한된 Canvas 풀, 겹침 방지, 좌표 UDP 수신과 반전 설정을 처리한다.
- `unity-receiver/`: Spout 텍스처 표시, 창 모드, 플레이어 HTTP 인터페이스와의 연결을 담당하는 Unity 원본이 있다.
- `tests/`: 동기화 명령과 작업 식별자, prefetch, 미디어 플레이어 이중 버퍼, 플레이리스트, HTTP 제어, 효과, 업데이트 릴리스와 updater 상태를 대상으로 한 Vitest 테스트가 있다.

## 사실과 표현 판단

### 공개 초안에 사용한 사실

- Electron·TypeScript 기반 Windows 데스크탑 앱 두 개로 구성됨
- Hub의 플레이어 등록·상태 모니터링·원격 명령·업데이트 저장소
- 플레이어의 마스터·클라이언트 재생 동기화
- TCP 명령 채널과 UDP 시간 채널
- 미디어 카탈로그, 다중 플레이리스트, 비디오 사전 준비
- 내부망용 `electron-updater` 흐름과 Hub 파일 서버
- Spout 네이티브 출력과 Unity 수신기
- Vitest 테스트와 Electron Builder NSIS 패키징

### 사용하지 않거나 보정한 표현

- 계획 문서에는 WebSocket 기반 통신이 기재되어 있으나 현재 애플리케이션 소스의 재생 동기화는 Node TCP/UDP, 중앙 통제는 HTTP로 확인된다. `ws` 패키지가 manifest에 남아 있어도 실제 소스 사용 근거가 없어 공개 기술 스택에는 WebSocket을 넣지 않았다.
- “실시간 완전 동기화”, “무중단 업데이트”, “성능 향상”, “현장 안정성 검증 완료” 같은 표현은 측정·운영 근거가 없어 사용하지 않았다.
- 자동 업데이트는 다운로드와 설치 시점을 분리한다. “완전 자동 배포”로 표현하지 않았다.
- 플레이리스트는 장비 사이에서 파일 자체를 공유하거나 체크섬으로 호환성을 보장하지 않는다. 같은 순번을 장비별 로컬 항목에 매핑하는 구조로 설명했다.
- 특정 회사·클라이언트·전시장·Unity 버전·내부 네트워크 값은 공개 초안에 포함하지 않았다. 장비 수와 측정 결과는 사용자 확인을 받은 범위만 사용했다.

## 다이어그램 데이터

공개 문서 frontmatter의 `diagram`은 접근 가능한 시퀀스 다이어그램을 위해 다음을 제공한다.

- 제목과 한 문단 설명
- 화면 없이도 관계를 이해할 수 있는 `ariaLabel`
- 여섯 개의 참여 요소: Hub, Master, Clients, 장비별 Renderer, 장비별 Spout, Unity Receiver
- Hub의 장비별 직접 관리, `operationId` 기반 준비·응답·재생, UDP 시간 보정, 장비별 로컬 재생과 선택적 Spout 출력을 순서대로 표현하는 연결

다이어그램에서 재생 동기화 연결과 중앙 관리 연결은 같은 네트워크 책임처럼 합치지 않는다. Hub는 재생 토폴로지를 경유하지 않고 각 장비의 HTTP 인터페이스를 직접 호출하며, TCP·UDP 동기화는 Master와 Clients 사이에서만 동작한다. Spout와 Unity Receiver는 전체 시스템이 공유하는 단일 수신기가 아니라 설정이 활성화된 각 플레이어의 로컬 출력 경로다.

## 실행하지 않은 검증

- 원본 저장소는 읽기 전용 조사 대상이므로 소스·설정·생성물을 수정하지 않았다.
- 콘텐츠 작성 과정에서 두 원본 저장소의 전체 Vitest, 타입 검사와 Windows 빌드를 새로 실행하지 않았다.
- 실제 여러 장비, 내부망, Spout 호환 GPU와 Unity 수신기에서의 동작은 검증하지 않았다.

## 추가 확인이 필요한 정보

- 실제 실행 화면과 대표 이미지의 공개 가능 범위
- 정식 운영 이후의 장기 운영 기간과 장애 복구 기록
- 업데이트 배포 시간처럼 아직 사용자 확인을 받지 않은 추가 수치 성과
