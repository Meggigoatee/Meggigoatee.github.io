# 완도 AI 아바타 생성 프로그램 조사 메모

## 조사 원칙

- 원본 프로젝트를 읽기 전용으로 조사했다.
- 공개 문서는 실행 코드에서 확인된 기능만 사용했다.
- 설정 파일에 포함된 서비스 주소, API 키, 저장 경로, 프린터 정보와 생성 프롬프트는 기록하거나 공개하지 않았다.
- 소스에서 확인할 수 없는 기간, 역할, 팀, 성과와 납품 상태는 `확인 필요`로 남겼다.

## 기술과 패키징

근거: `package.json`, `electron.vite.config.ts`, `electron-builder.yml`

- Electron, Vue 3, TypeScript, Pinia
- `@mediapipe/tasks-vision`, `sharp`, `qrcode`
- 외부 배경 제거 연동 코드와 로컬 이미지 공유 서버
- electron-vite 빌드
- `vue-tsc`와 `tsc` 기반 타입 검사
- Windows NSIS와 portable 패키징 스크립트
- 자동 테스트 스크립트와 테스트 파일은 확인하지 못함

## 확인한 사용자 흐름

근거: `src/renderer/src/components/Front.vue`, `FrameSelect.vue`, `Prompt.vue`, `Photo.vue`, `Generate.vue`, `CharacterSelect.vue`, `CutOut.vue`, `ShowAvatar.vue`, `Print.vue`, `Finish.vue`, `src/renderer/src/utils/store.ts`

1. 시작 화면에서 출력 프레임을 선택한다.
2. 캐릭터 유형을 선택하면 설정에 있는 프롬프트 조각을 조합한다.
3. 안내를 확인하고 카메라로 한 명의 얼굴을 촬영한다.
4. 얼굴 검출과 크롭을 통과한 사진으로 AI 이미지를 생성한다.
5. 생성 후보 가운데 한 장을 선택한다.
6. 선택한 이미지의 배경 제거와 얼굴 분석 결과를 받아 편집한다.
7. 선택한 프레임에 얼굴 이미지를 배치한다.
8. 합성 결과를 저장·인쇄하고 임시 링크의 QR 코드를 표시한다.
9. 완료 뒤 시작 화면으로 돌아가고 스토어 데이터를 초기화한다.

별도 입력 감지기가 타임아웃 시 시작 화면으로 복귀시키는 것도 확인했다.

## MediaPipe 사용 범위

근거: `src/renderer/src/utils/taskVision.ts`, `src/renderer/src/components/Photo.vue`, `src/renderer/src/utils/faceCut.ts`

- MediaPipe WASM과 다음 로컬 모델을 초기화한다.
  - Face Landmarker
  - BlazeFace short-range Face Detector
  - Selfie multiclass Image Segmenter
- `TaskVision`은 얼굴 랜드마크, 얼굴 검출과 이미지 세그멘테이션 메서드를 제공한다.
- 현재 실행 화면에서 확인된 호출은 `Photo.vue`의 `detectFace`뿐이다.
- 얼굴이 없거나 첫 검출의 바운딩 박스 너비가 기준보다 작으면 오류 상태로 전환하고 다시 촬영한다.
- 검출 바운딩 박스를 확대하고 이미지 경계 안으로 제한한 뒤 OffscreenCanvas에서 얼굴 주변을 크롭한다.
- 현재 소스에서 `detectFaceLandMarker`와 `detectFaceSegmenter`의 호출은 확인되지 않았다.

따라서 공개 콘텐츠에서는 “MediaPipe 기반 얼굴 검출과 촬영 검증”으로 기술하고, MediaPipe가 현재 전체 랜드마크 분석과 배경 제거를 담당한다고 쓰지 않았다.

## AI 생성과 컷아웃 처리

근거: `src/renderer/src/components/Generate.vue`, `CharacterSelect.vue`, `CutOut.vue`, `src/main/ImagineOperator.ts`, `src/main/cutOutOperator.ts`

- 촬영 Blob을 외부 이미지 생성 흐름에 전달하고 작업 ID로 완료 상태를 폴링한다.
- 완료 응답의 여러 이미지 URL을 Blob으로 내려받아 후보 선택 화면에 표시한다.
- 생성 실패 시 진행 상태를 오류로 바꾸고 후보 화면으로 이동하는 폴백 코드가 있다.
- 선택한 후보를 컷아웃 요청에 PNG, 투명 배경, 얼굴 분석 옵션으로 전송한다.
- 응답의 투명 배경 이미지 URL과 첫 번째 얼굴의 좌표 배열을 사용한다.
- 실패 시 5초 뒤 한 번 재시도하며 재실패 시 CutOut 오류 상태를 표시한다.
- 구체적인 서비스명, 주소, 인증 헤더 값과 프롬프트는 공개 문서에서 제외했다.

## 얼굴 편집과 프레임 합성

근거: `src/renderer/src/components/ShowAvatar.vue`, `Print.vue`, `src/renderer/src/utils/imageUtils.ts`

- 활성 `ShowAvatar.vue` 코드는 컷아웃 이미지를 OffscreenCanvas에 그린다.
- 전달받은 68점 좌표 중 턱 끝 위치를 사용해 아래쪽 픽셀을 정리한다.
- 알파 값이 0이 아닌 픽셀의 경계를 구해 투명 여백을 크롭한다.
- 편집 결과를 PNG Blob으로 저장한다.
- `Print.vue`는 선택 프레임과 캐릭터에 맞는 리소스를 불러온다.
- 프레임별 배치 기준점에 얼굴 이미지의 bottom-center를 맞추고 최종 PNG를 만든다.
- `ShowAvatar.vue` 내부에는 후드와 눈 좌표를 이용한 더 복잡한 합성 코드가 주석 처리되어 있으므로 공개 기능으로 포함하지 않았다.

## Sharp 출력과 인쇄

근거: `src/main/imageExportOperator.ts`, `src/main/printerOperator.ts`, `src/renderer/src/components/Print.vue`, `Finish.vue`, `src/preload/index.ts`

- 렌더러는 ArrayBuffer를 preload IPC API로 메인 프로세스에 전달한다.
- ImageExportOperator는 Sharp 메타데이터로 방향을 확인한다.
- 인쇄용 사진 조건에 따라 300 DPI 메타데이터와 90도 회전을 적용하고 PNG로 저장한다.
- `Print.vue`의 활성 경로는 저장된 이미지 경로를 PowerShell 인쇄 스크립트에 전달한다.
- PrinterOperator에는 별도 숨김 BrowserWindow와 Electron silent print를 쓰는 구현도 있으나 현재 `Print.vue`에서는 PowerShell 경로를 호출한다.
- 앱 시작 시 임시 인쇄 이미지 디렉터리를 비우고 다시 생성하는 코드가 있다.
- 완료 단계에서 캐릭터 유형별 아바타 단독 이미지도 별도로 내보낸다.
- 실제 파일 경로, 프린터명과 스크립트 내부 설정은 공개하지 않았다.

## QR 전달

근거: `src/renderer/src/utils/useQR.ts`, `src/renderer/src/components/Print.vue`, `src/main/cloudflareService/shareImageService.ts`, `shareImageStore.ts`, `localServer.ts`, `cloudflareOperator.ts`

- 최종 PNG를 Electron 메인 프로세스의 메모리 Map에 임시 등록한다.
- UUID 기반 공유 ID와 만료 시각을 생성한다.
- 로컬 HTTP 서버는 미리보기, 원본과 다운로드 응답을 제공하고 `no-store` 헤더를 사용한다.
- 로컬 서버는 외부 접근 가능한 임시 터널 프로세스와 연결된다.
- 공유 URL은 600×600 QR 코드, 오류 복원 수준 H로 렌더링된다.
- 공유 데이터와 다운로드 화면은 3분 후 만료되고 주기적으로 정리된다.
- 구체적인 터널 도메인, 내부 포트와 실행 파일 경로는 공개하지 않았다.

## 운영과 안정성에서 확인한 항목

근거: `src/renderer/src/App.vue`, `src/renderer/src/utils/inactivityDetector.ts`, `src/main/index.ts`, `src/renderer/src/utils/store.ts`

- 입력 타임아웃 시 시작 화면과 정상 상태로 복귀한다.
- 완료 화면은 10초 뒤 시작 화면으로 이동한다.
- 완료 컴포넌트가 해제될 때 체험 데이터 스토어를 초기화한다.
- 전체 화면, 항상 위, Windows 로그인 자동 실행 코드가 있다.
- 시작 시 이미지 공유용 로컬 서버를 열고 종료 시 터널과 서버를 정리한다.
- 카메라, 얼굴 미검출, 생성, 컷아웃, 인쇄 등 단계별 오류 상태와 안내 문구가 정의되어 있다.

## 확인 필요

- 작업 기간, 팀 구성, 정확한 담당 범위
- 실제 사용한 AI 생성 서비스와 공개 가능 범위
- 기획·디자인·에셋 제작 참여 여부
- 납품·운영 상태, 대상 키오스크와 지원 장치 사양
- 얼굴 사진, AI 결과와 로컬 저장 파일의 실제 보관·파기 정책
- 현장 테스트, 생성 시간, 성공률과 인쇄 실패 대응 결과
- 대표 성과와 공개 가능한 화면
- 대표 기술 판단의 문제, 검토 대안, 결정 이유와 결과
