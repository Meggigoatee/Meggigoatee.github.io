# Icecream Table 소스 조사 메모

## 사용자 확인 정보

- 공개 명칭: 미디어테이블
- 내부 프로젝트명과 실제 화면: 공식 오픈 전이므로 공개하지 않음
- 작업 기간: 2026년 1월 8일–7월 30일
- 프로젝트 형태: 개인 프로젝트
- 담당 범위: 전체 개발
- 기획·디자인 참여: 없음
- 운영 상태: 시범 설치 운영 중
- 장비 구성: 가시광 IP 카메라 2대, RTX 3060 PC 1대, 디스플레이 2대
- 성능: 투사 화면 30 FPS, 추론 처리 15 FPS, YOLO 인식률 94%
- 대표 의사결정: 3초 이상이던 입력·추론·투사 지연에 대해 하드웨어 교체와 프로토콜·처리 구조 개선을 검토함. Python 기반 OpenCV·FFmpeg 스트림을 MediaMTX WebRTC로 변경해 스트림 지연을 약 1.2초에서 0.3초로 줄이고, 표준 출력·IPC 기반 감지 데이터 전달을 ONNX Runtime Web을 사용하는 렌더러 처리 구조로 통합함. 물체 배치부터 효과 투사까지 1.5초 이내로 감소했으며 감지 성능 손실 없음

## 조사 범위

- 조사일: 2026-08-13
- 대상: 전달받은 Icecream Table 원본 저장소(읽기 전용)
- 목적: `docs/portfolio-content-plan.md`의 메인 프로젝트 기준에 맞춘 공개용 콘텐츠 초안 작성
- 원칙: 소스와 설정에서 확인한 기능만 사실로 기록하고, 개인 역할·기간·팀·성과는 추측하지 않음

원본 저장소는 수정하지 않았다. 카메라 주소, 인증정보, 로컬 절대 경로, 내부 설정값과 배포 식별자는 공개 콘텐츠에 옮기지 않았다. 민감정보가 포함될 가능성이 있는 런타임 카메라 설정 파일과 프록시 설정의 값도 조사 결과에 기록하지 않았다.

## 확인한 근거

### 프로젝트 구성과 배포

- `package.json`
  - Electron, Vue 3, TypeScript, PixiJS, ONNX Runtime Web, Pinia 사용
  - electron-vite 기반 개발·빌드 구성
  - Electron Builder의 Windows NSIS 및 portable 스크립트 존재
  - Vitest 테스트 스크립트와 아틀라스 패커 스크립트 존재
- `electron.vite.config.ts`
  - main, preload, renderer 빌드 경계와 Vue 플러그인 확인
- `electron-builder.yml`
  - 별도의 빌더 설정도 존재하나 `package.json`과 제품 식별 정보가 일치하지 않음
  - 실제 패키징 시 어느 설정이 최종 적용되는지는 추가 확인 필요
- `README.md`
  - 미디어 테이블 프로그램이라는 프로젝트 목적과 아틀라스 패커 입력·출력 구조 확인

### Electron 실행 구조

- `src/main/index.ts`
  - 프레임 없는 BrowserWindow 생성
  - IPC 및 로컬 자산·비디오 프로토콜 등록
  - 카메라 프록시 프로세스 시작과 앱 종료 시 정리
  - 디스플레이 절전 방지, 백그라운드 제한 해제, 비디오·GPU 가속 관련 실행 설정
- `src/main/services/cameraProxyOperator.ts`
  - 로컬 카메라 프록시를 숨김 자식 프로세스로 실행하고 종료하는 수명 주기 확인
- `src/main/store/configValidation.ts`
  - 감지, 추적, 색상, 효과, 화면, 카메라 설정의 타입·범위·중복 검증 확인

### Camera → Worker

- `src/renderer/src/services/detection/whepSource.ts`
  - WHEP/WebRTC로 영상 트랙을 수신
  - `MediaStreamTrackProcessor`로 `VideoFrame`을 읽어 감지 서비스에 전달
  - 연결 실패 후 제한된 재시도 흐름 존재
- `src/renderer/src/services/detection/detectionService.ts`
  - 카메라별 목표 FPS 스로틀
  - 준비되지 않은 Worker 또는 FPS 초과 프레임 즉시 `close()`
  - `shared`와 `per-camera` Worker 모드
  - 처리 대상 `VideoFrame`을 transferable로 Worker에 전달
- `src/renderer/src/services/detection/inferenceWorker.ts`
  - 카메라별 대기 프레임을 하나만 유지하고 새 프레임 도착 시 이전 프레임 교체
  - Worker 안에서 추론과 카메라별 추적 실행
  - 모든 처리·교체 프레임을 닫는 자원 수명 관리

### ONNX Runtime Web / WebGPU

- `src/renderer/src/services/inferenceEngine.ts`
  - ONNX Runtime Web 세션 실행 공급자 순서가 WebGPU, WASM으로 구성됨
  - WebGPU 전처리 실패 시 CPU 전처리 대체 경로
  - 워밍업 추론, YOLO 출력 디코드, NMS, 원본 좌표 복원
  - 감지 박스의 색상 분류와 화면 좌표 변환 연결
- `src/renderer/src/services/webGpuPreprocess.ts`
  - `VideoFrame`을 external texture로 받아 letterbox, RGB 정규화, NCHW 변환
  - GPU 버퍼를 ORT 텐서 입력으로 연결
- `src/renderer/src/services/yoloDecode.ts`
  - 신뢰도 필터, 박스 크기 제한, NMS와 최대 감지 수 제한 확인
- `src/renderer/src/services/cupColorClassifier.ts`
  - 감지 영역 중앙부의 RGB 중앙값 계산
  - sRGB를 CIE Lab으로 변환하고 설정된 프로필과 거리 비교

### Detection Result → PixiJS

- `src/renderer/src/services/detection/entityTracker.ts`
  - 위치 기반 감지 매칭
  - 연속 감지와 색상 투표 후 객체 활성화
  - 생성·갱신·제거 이벤트 생성
  - 가까운 객체 중복 활성화를 막는 배제 반경
- `src/renderer/src/services/charucoCalibration.ts`
  - OpenCV.js와 `DICT_4X4_250` 사전으로 ChArUco 보드의 코너와 ID 검출
  - `VideoFrame`을 `OffscreenCanvas`에 캡처해 카메라 픽셀 좌표와 보드 기준 화면 좌표의 대응점 구성
  - 유효 코너 4개 이상에서 RANSAC 기반 3×3 호모그래피 계산
- `src/renderer/src/services/homographyCalibrationService.ts`
  - 보정 중 일반 감지를 중단하고 카메라별 캘리브레이션 프레임 측정
  - 여러 시도 중 유효 코너가 가장 많은 측정값을 선택하고 모든 카메라가 성공했을 때 저장·적용
- `src/renderer/src/services/tpsMapper.ts`
  - 카메라 좌표를 화면 좌표로 변환하는 TPS 구현
  - 대응점 3개 이상이면 TPS, 불가능하면 호모그래피, 이후 항등 변환 순서의 대체 경로
- `src/renderer/src/components/EffectLayer.vue`
  - 효과 자산 준비, 엔티티 변화 감시, Pixi 효과 생성·이동·삭제 연결
  - 컵 생성 시 좌·우 테이블 배경 영상 트리거
  - 효과 자산 준비 성공 이후 감지 시작을 허용하는 상태 전달
- `src/renderer/src/services/effectManager.ts`
  - PixiJS Application과 좌·우 렌더링 영역 구성
  - `created`, `updated`, `deleted` 효과 단계 전환
  - 중심 마스크, 컵 커버, 위치 갱신과 배제 반경 처리
  - 전체 효과 아틀라스 순차 로드 및 GPU 업로드
- `src/renderer/src/services/assetsIpcService.ts`
  - manifest 검증, 그리드 시트 페이지 로딩, 프레임 Texture 생성과 정리
- `.scripts/atlasPacker.mjs`
  - 라벨·단계별 PNG 입력 검증
  - 정규화된 프레임을 그리드 시트와 manifest로 생성
  - 스테이징 디렉터리 완성 후 기존 출력 교체

### 테스트

- `vitest.config.ts`
  - main과 preload는 Node, renderer는 jsdom 환경으로 분리
- 조사 시점의 `src/**/*.test.ts`는 18개
  - 설정 검증
  - 감지 서비스, 추적기와 성능 집계
  - 전처리, YOLO 디코드, 색상 분류, TPS, WebGPU 계측
  - 아틀라스, 효과 재생, 테이블 영상과 상태 저장소
  - Vue 설정·운영 컴포넌트
- 이번 콘텐츠 조사에서는 테스트, 타입 검사와 빌드를 실행하지 않았으므로 통과를 주장하지 않음
- 내부 인계 문서에는 현재 Pixi 구현과 맞지 않는 기존 `EffectLayer.test.ts`가 있다는 주의가 기록되어 있음. 공개 콘텐츠에는 개별 실패 여부 대신 새 검증을 수행하지 않았다고만 표기함

## 공개 콘텐츠에 반영한 사실

- Electron, Vue 3, TypeScript 기반 전시용 데스크탑 앱
- WebRTC/WHEP 카메라 입력과 `VideoFrame` 처리
- Detection Worker의 목표 FPS 스로틀과 최신 프레임 우선 큐
- ONNX Runtime Web의 WebGPU 우선·WASM 대체 실행
- WebGPU 전처리와 CPU 대체 경로
- YOLO 객체 감지, 색상 분류, 위치 추적
- OpenCV.js ChArUco 보드 측정과 TPS·호모그래피 기반 화면 좌표 보정
- PixiJS 아틀라스 애니메이션과 테이블 배경 영상
- Vitest 테스트 구성
- Windows NSIS·portable 패키징 스크립트

## 공개 콘텐츠에서 제외한 정보

- 카메라 주소, 포트, 인증정보와 프록시 설정값
- 내부 저장소의 절대 경로
- 클라이언트·회사 관련 식별 정보
- 앱 ID, 실행 파일명과 설치 스크립트의 내부 식별값
- 캘리브레이션 원본 데이터와 현장 화면 크기·장비 설정값
- 모델 파일명, 세부 임계값과 색상 프로필 값
- 일시적인 성능 측정값과 특정 GPU 장비 정보
- 소스 코드를 재현할 수 있는 세부 알고리즘·셰이더 코드

## 확인이 필요한 항목

- 작업 기간
- 개인 프로젝트 또는 팀 프로젝트 여부와 팀 구성
- 본인의 정확한 담당 범위
- 기획·디자인·현장 설치 참여 여부
- 공개 가능한 공식 프로젝트명과 클라이언트명
- 실제 운영·납품·출시 상태
- 실제 배포에 사용한 패키지 형태와 대상 아키텍처
- 가장 어려웠던 문제와 본인이 내린 핵심 기술 결정
- 정량화 가능한 감지 성능, 지연 시간 또는 운영 안정성 결과
- 공개 가능한 실행 화면, 설치 사진과 영상
- 대표 기술 판단의 문제, 검토 대안, 결정 이유와 결과

## 다이어그램 전달 데이터

공개 콘텐츠에는 별도 스키마 필드를 추가하지 않고 접근 가능한 Markdown 표와 텍스트 대체 설명을 넣었다. 이후 UI 컴포넌트로 옮길 때 사용할 순서는 다음과 같다.

1. Camera Input
2. Detection Worker
3. ONNX Runtime Web / WebGPU
4. Detection Result
5. ChArUco / TPS Coordinate Transform
6. PixiJS Interaction
7. Display Output

대체 설명에는 Worker의 프레임 선택, ONNX 추론, 추적, ChArUco 보드 측정과 카메라·화면 좌표 변환, PixiJS 효과 출력의 관계를 포함해야 한다. 시각적 화살표만으로 의미를 전달하지 않고 각 단계 이름과 설명을 DOM 텍스트로 제공한다.
