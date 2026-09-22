# 포트폴리오 콘텐츠 작성 계획

## 문서 목적

이 문서는 `git-my-page` 포트폴리오의 프로젝트 콘텐츠를 다른 Codex 세션에서도 동일한 기준으로 이어서 작성할 수 있도록 결정 사항, 조사 대상, 작업 절차와 완료 기준을 정리한 인수인계 문서다.

프로젝트 콘텐츠는 실제 소스와 설정에서 확인한 사실을 근거로 작성한다. 소스에서 확인할 수 없는 담당 범위, 기간, 팀 구성, 성과와 공개 범위는 추측하지 않고 사용자에게 확인한다.

## 현재 프로젝트 상태

- 프레임워크: Nuxt 4
- 언어: TypeScript
- UI: Vue 3 Composition API
- 배포: Nuxt `github_pages` 프리셋 + GitHub Actions
- 패키지 관리자: pnpm
- 프로젝트 데이터: `app/data/projects.ts`
- 프로필 데이터: `app/data/profile.ts`
- 프로젝트 상세 경로: `app/pages/projects/[slug].vue`
- 현재 등록 프로젝트: 7개
- 메인 프로젝트: 4개
- 서브 프로젝트: 3개
- 사진과 영상 자료: 아직 없음

현재 상태에서 다음 검사가 통과한다.

```bash
pnpm lint
pnpm typecheck
pnpm build:pages
```

GitHub Pages 하위 경로 검증은 다음 환경변수를 적용한다.

```powershell
$env:NUXT_APP_BASE_URL='/git-my-page/'
pnpm build:pages
```

## 확정된 포트폴리오 정보

- 이름: 설준찬(SEOL JUNCHAN)
- 직무: 인터랙티브 웹 · 데스크탑 애플리케이션 개발자
- 소개: TypeScript와 Vue를 중심으로 인터랙티브 웹과 전시·키오스크용 데스크탑 애플리케이션을 만듭니다.
- 이메일: `meggigoatee@gmail.com`
- GitHub: `https://github.com/Meggigoatee`

### 기술 분류

#### Core

- TypeScript
- Vue 3
- Pinia

#### Web

- Nuxt 4
- Nuxt Content
- IndexedDB

#### Desktop

- Electron
- Tauri 2
- Rust

#### Interactive & AI

- PixiJS
- MediaPipe
- ONNX Runtime Web

#### System

- Node.js
- WebSocket
- SQLite

Electron은 Core가 아닌 Desktop 기술로 분류한다.

## 프로젝트 구성

### 메인 프로젝트 4개

1. i-syncPlayer System
2. Icecream Table
3. 황금마패의 길
4. Tobomi

메인 프로젝트에는 배경, 담당 범위, 문제와 해결 과정, 기술 선택, 핵심 구현, 테스트·배포, 의사결정과 결과, 구조화된 다이어그램을 제공한다.

### 서브 프로젝트 3개

1. 완도 AI 아바타 생성 프로그램
2. B the B LIVE WALL
3. 정읍 방문자센터 마을 만들기

서브 프로젝트에는 대표 이미지 슬롯, 목적, 담당 범위, 기술 스택과 핵심 구현을 제공한다. 완도 AI 아바타는 MediaPipe, 이미지 합성, Sharp, 인쇄와 QR 흐름을 다른 서브 프로젝트보다 상세하게 설명할 수 있다. 단, 별도 스포트라이트 등 예외적인 메인 화면 구성은 만들지 않는다.

## 조사 대상 프로젝트 경로

다음 프로젝트는 읽기 전용으로 조사한다. 포트폴리오 작성 과정에서 원본 프로젝트를 수정하지 않는다.

### i-syncPlayer System

두 저장소를 하나의 통합 시스템 사례로 소개한다.

- 중앙 통제 앱: `D:\workspace\RnD\i-playerHub`
- 현장 재생 앱: `D:\workspace\RnD\i-syncPlayer`

현재 확인된 내용:

- Electron과 TypeScript 기반 데스크탑 애플리케이션
- 중앙 플레이어 등록, 상태 모니터링과 명령 전송
- 마스터·클라이언트 기반 미디어 재생 동기화
- 플레이리스트와 미디어 카탈로그 관리
- WebSocket 기반 통신
- 업데이트 저장소와 HTTP 파일 서버
- `electron-updater` 기반 설치·다운그레이드 흐름
- Spout 네이티브 출력
- Unity 수신기 프로세스 연동
- Vitest 테스트

### Icecream Table

- 경로: `D:\workspace\018_thailand\icecream_table`

현재 확인된 내용:

- Electron, Vue 3, TypeScript
- PixiJS 기반 인터랙티브 그래픽
- ONNX Runtime Web 기반 객체 인식
- WebGPU 실행과 성능 프로파일링 설정
- Detection Worker와 목표 FPS 설정
- 에셋 아틀라스 패킹
- Electron Builder 기반 Windows 설치·포터블 배포
- Vitest 테스트

### 황금마패의 길

- 경로: `D:\workspace\Web\2026\Mungyeong\mg-docent-web`

현재 확인된 내용:

- Nuxt 4, Vue 3, TypeScript
- Nuxt Content 기반 도슨트 콘텐츠
- 다국어 처리
- QR 스캐너
- AR 촬영 결과 처리
- IndexedDB 기반 로컬 이미지 보관
- 지도, 스탬프, 오디오 도슨트 흐름
- Nuxt UI, Tailwind CSS
- Vitest와 Nuxt Test Utils

### Tobomi

- 경로: `D:\garage\my-top-project\my-top`
- 상태: Windows 데모를 공개한 개인 프로젝트 (2026-09-21 v0.6.0 베타)

현재 확인된 내용:

- Tauri 2, Rust, Vue 3, TypeScript
- Pinia 상태 관리
- SQLx와 SQLite 기반 로컬 저장
- 시스템 트레이
- 단일 인스턴스
- 로그인 시 자동 실행
- 시스템 활동 감지
- 애니메이션 데스크탑 컴패니언
- Vitest 테스트

Tobomi는 정식 출시 완료 프로젝트처럼 표현하지 않고 데모 공개 단계와 버전을 명시한다. 공개된 랜딩 페이지 `https://tobomi.app`는 `links`로 표시하고, 저장소는 비공개이므로 코드 링크는 표시하지 않는다.

### 완도 AI 아바타 생성 프로그램

- 경로: `D:\workspace\2026\Wando\WandoCreateAvatar`

현재 확인된 내용:

- Electron, Vue 3, TypeScript
- MediaPipe Tasks Vision
- 얼굴 검출과 랜드마크 분석
- 인물 분리와 배경 처리
- Sharp 기반 이미지 출력·인쇄 처리
- QR 코드 결과물 전달
- 키오스크용 Windows 패키징

### B the B LIVE WALL

- 경로: `D:\workspace\2026\BtB\fan-message-board`

현재 확인된 내용:

- Electron Forge, Vue 3, TypeScript
- 소셜 미디어 해시태그 기반 라이브 포토월
- Axios 기반 외부 API 연동
- Pinia 상태 관리
- Electron Store 기반 로컬 설정
- Vitest 테스트

### 정읍 방문자센터 마을 만들기

- 경로: `D:\workspace\archived\017_JeongeupCenter\block-village`

현재 확인된 내용:

- Electron, Vue 3, TypeScript
- PixiJS 기반 장면 구성
- 베지어 경로 이동
- 오브젝트 충돌과 배치 로직
- 전시용 Windows 패키징
- Vitest 테스트

## 콘텐츠 관리 구조 변경

프로젝트별 장문 콘텐츠를 `projects.ts` 한 파일에서 관리하지 않는다. `@nuxt/content`를 도입하고 각 프로젝트를 별도 Markdown 문서로 관리하는 방향을 우선 검토한다.

권장 구조:

```text
content/
└─ projects/
   ├─ i-syncplayer-system.md
   ├─ icecream-table.md
   ├─ golden-horse-pass-road.md
   ├─ tobomi.md
   ├─ wando-avatar-kiosk.md
   ├─ b-the-b-live-wall.md
   └─ block-village.md
```

각 문서는 다음 필드를 공통으로 가진다.

```yaml
title:
slug:
category:
status:
featured:
summary:
period:
role:
team:
techStack: []
cover: null
gallery: []
video: null
```

본문 권장 구조:

```markdown
## 프로젝트 배경

## 담당 범위

## 해결해야 했던 문제

## 시스템 또는 사용자 흐름

## 핵심 구현

## 기술 선택과 트레이드오프

## 테스트와 배포

## 의사결정과 결과
```

프로젝트 목록, 대표 프로젝트와 상세 페이지는 Content Collection을 단일 데이터 원본으로 사용한다. GitHub Pages 정적 경로는 콘텐츠 slug에서 자동 생성하고 모든 프로젝트 상세 경로가 프리렌더링되는지 검증한다.

## 메인 프로젝트 작성 기준

메인 프로젝트는 다음 순서로 작성한다.

1. 프로젝트 한눈에 보기
2. 배경과 해결하려던 문제
3. 담당 범위
4. 시스템 또는 사용자 흐름
5. 핵심 구현 3~4개
6. 기술 선택과 트레이드오프
7. 테스트·배포·현장 안정성
8. 문제 → 대안 소개 → 결정 이유 → 결과

### i-syncPlayer System 다이어그램

표현할 관계:

```text
i-playerHub
├─ 플레이어 등록·상태 모니터링
├─ 원격 명령
└─ 업데이트 저장소·파일 서버
        ↓
여러 i-syncPlayer
├─ WebSocket 동기화
├─ 플레이리스트·미디어 재생
├─ 자동 업데이트
└─ Spout 출력 → Unity Receiver
```

### Icecream Table 다이어그램

표현할 흐름:

```text
Camera Input
→ Detection Worker
→ ONNX Runtime Web / WebGPU
→ Detection Result
→ PixiJS Interaction
→ Display Output
```

### 황금마패의 길 다이어그램

기술 구조보다 관람객 사용자 흐름을 우선한다.

```text
언어 선택
→ 지도·목록 탐색
→ QR 스캔
→ 장소별 도슨트
→ AR 촬영
→ IndexedDB 갤러리
→ 스탬프 경험
```

### Tobomi 다이어그램

표현할 계층:

```text
Vue UI / Pinia
→ Tauri Commands
→ Rust Services
├─ SQLite / SQLx
├─ System Activity
├─ Tray
└─ Autostart / Single Instance
```

다이어그램은 이미지 파일이 아닌 접근 가능한 SVG 또는 HTML/CSS 컴포넌트로 제작한다. 다이어그램마다 제목, 설명과 텍스트 대체 정보를 제공한다.

## 서브 프로젝트 작성 기준

서브 프로젝트는 다음 내용을 제공한다.

1. 프로젝트 목적
2. 담당 범위
3. 기술 스택
4. 핵심 구현 3~4개
5. 핵심 판단과 결과
6. 대표 이미지 슬롯

서브 프로젝트에도 상세 페이지를 제공하지만 메인 프로젝트와 같은 규모의 다이어그램과 장문 분석을 강제하지 않는다.

## 사진과 영상 자료 처리

현재 사진과 영상 경로는 비워 둔다.

```yaml
cover: null
gallery: []
video: null
```

개발 단계에서는 비율이 정해진 빈 프레임으로 레이아웃 공간을 확인할 수 있게 한다. 실제 공개 버전에서는 자료가 없는 빈 프레임이나 깨진 이미지 아이콘을 노출하지 않도록 조건부 렌더링한다.

향후 프로젝트별로 다음 자료를 준비한다.

- 대표 이미지 1장
- 실제 설치 또는 실행 화면
- 핵심 기능 화면
- 결과 화면
- 필요한 경우 10~30초 인터랙션 영상

## 공개 정보와 보안 원칙

다음 정보는 포트폴리오에 직접 포함하지 않는다.

- 내부 IP와 포트
- 인증 정보와 API 키
- 사내 서버 주소
- 비공개 저장소 경로
- 사용자 또는 관람객 개인정보
- 배포용 인증서 정보
- 클라이언트가 공개를 허가하지 않은 화면과 자료
- 소스 코드를 그대로 재현할 수 있는 과도하게 상세한 내부 구현

프로젝트 파일의 주석과 설정은 기능을 이해하는 근거로만 사용하고 그대로 복사하지 않는다.

## 사용자 확인이 필요한 정보

소스 조사와 1차 초안을 작성한 뒤 다음 질문을 프로젝트별로 묶어서 한 번에 요청한다.

- 작업 기간
- 개인 또는 팀 프로젝트 여부
- 본인의 정확한 담당 범위
- 기획·디자인 참여 여부
- 대표할 문제와 검토한 대안
- 최종 대안의 결정 이유
- 결정 이후 확인된 결과
- 운영·납품·출시 상태
- 공개 가능한 프로젝트명과 클라이언트명
- 공개 가능한 화면 범위
- 수치로 표현 가능한 성능 또는 운영 결과

답변 전에는 다음과 같은 표현을 추측해서 작성하지 않는다.

- 성능이 크게 향상되었다
- 사용자 만족도가 높아졌다
- 운영 비용을 절감했다
- 프로젝트 전체를 단독으로 담당했다
- 특정 기간에 납품했다

## 작업 순서

### 1단계: 콘텐츠 기반 정리

- `@nuxt/content` 도입 여부 확정
- Content Collection 스키마 작성
- 기존 `projects.ts` 데이터 이전
- 프로젝트 목록과 상세 페이지를 새 데이터 원본에 연결
- 7개 정적 상세 경로 검증

### 2단계: 소스 조사 노트 작성

- 각 프로젝트의 manifest, 핵심 모듈, 테스트와 빌드 설정 조사
- 확인된 사실과 추론을 분리
- 공개하면 안 되는 설정과 정보 표시
- 임시 조사 노트는 공개 콘텐츠와 분리

### 3단계: 메인 프로젝트 초안

다음 순서로 작성한다.

1. i-syncPlayer System
2. Icecream Table
3. 황금마패의 길
4. Tobomi

i-syncPlayer System 초안을 먼저 작성해 콘텐츠 깊이와 문체를 확정한 뒤 나머지 프로젝트에 같은 기준을 적용한다.

### 4단계: 사용자 확인

- 초안에서 확인이 필요한 항목을 질문 목록으로 정리
- 사용자의 답변을 문서에 반영
- 과장되거나 내부적인 표현을 교정

### 5단계: 서브 프로젝트 초안

다음 순서로 작성한다.

1. 완도 AI 아바타 생성 프로그램
2. B the B LIVE WALL
3. 정읍 방문자센터 마을 만들기

### 6단계: 다이어그램과 사진 슬롯

- 메인 4개 다이어그램 구현
- 반응형 상세 페이지 배치
- 사진·영상 데이터 구조와 빈 슬롯 구현
- 실제 자료가 없을 때 공개 페이지에서 숨김 처리

### 7단계: 검증

- 콘텐츠 사실 확인
- 공개 정보와 보안 검토
- 맞춤법과 문체 통일
- 모바일·태블릿·데스크톱 레이아웃 확인
- 접근성 확인
- 7개 상세 경로 프리렌더링 확인
- lint, 타입 검사, GitHub Pages 빌드 실행

## 완료 기준

- 전체 7개 프로젝트가 목록과 상세 페이지에 표시된다.
- 메인 4개와 서브 3개의 시각적 우선순위가 명확하다.
- 메인 4개는 구조화된 사례 설명과 다이어그램을 가진다.
- 서브 3개는 목적, 담당 범위, 기술과 핵심 구현을 가진다.
- 사진이 없어도 깨진 UI나 링크가 나타나지 않는다.
- 소스에서 확인되지 않은 성과와 역할을 단정하지 않는다.
- 공개하면 안 되는 설정과 내부 정보가 포함되지 않는다.
- 모든 정적 상세 경로가 GitHub Pages base URL에서 정상 동작한다.
- `pnpm lint`, `pnpm typecheck`, `pnpm build:pages`가 통과한다.

## 다음 세션 시작 지점

다음 세션에서는 이 문서를 먼저 읽고 아래 작업부터 시작한다.

1. 현재 `app/data/projects.ts`와 상세 페이지 구조 확인
2. `@nuxt/content` 도입의 현재 Nuxt 4 호환성 확인
3. Content Collection 스키마와 프로젝트 Markdown 구조 구현
4. 기존 7개 프로젝트 데이터를 새 구조로 이전
5. i-syncPlayer System의 심층 콘텐츠 초안 작성

구현 중 사용자의 역할, 기간, 팀 구성이나 결과가 필요해지면 추측하지 말고 질문한다.
