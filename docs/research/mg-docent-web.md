# 황금마패의 길 조사 메모

## 사용자 확인 정보

- 공개 프로젝트명: 황금마패의 길
- 작업 기간: 2026년 5월 7일–6월 1일
- 프로젝트 형태: 개인 프로젝트
- 담당 범위: 전체 개발
- 기획 참여: 세부 기능 기획안, UI 레이아웃 결정, 기술 자문
- 운영 상태: 서비스 중
- 공개 범위: 프로젝트명과 화면을 포함해 전체 공개 가능
- 측정 성능: 영상이 포함된 최초 페이지 로드 450ms, 갤러리 로딩 1초 미만
- 방문 규모: 사용자 추산 주당 약 100명이나 정확한 분석 수치가 아니므로 공개 콘텐츠에서는 제외
- 대표 의사결정: 촬영 사진의 CDN 업로드와 브라우저 자체 저장소를 검토한 뒤, 트래픽·비용·외부 의존성 감소와 개인정보 보호를 위해 IndexedDB 기기 내 저장을 선택함. CDN 비용과 의존성 없이 1초 미만 갤러리 로딩 구현

## 조사 원칙

- 원본 프로젝트는 읽기 전용으로 조사했다.
- 공개 콘텐츠에는 소스에서 확인된 기능만 사용했다.
- 기간, 팀 구성, 담당 역할, 운영 상태와 성과는 추측하지 않았다.
- 내부 배포 정보, 호스트 세부 설정, 로그, 관리 문서와 미디어 원본 내용은 공개 콘텐츠 근거로 사용하지 않았다.

## 확인한 기술 구성

근거: `package.json`, `nuxt.config.ts`, `content.config.ts`, `vitest.config.ts`

- Nuxt 4, Vue 3, TypeScript, ESM
- Nuxt Content 3 컬렉션
- 한국어와 영어를 제공하는 Nuxt i18n `prefix_and_default` 전략
- Nuxt UI, Tailwind CSS
- Pinia와 persisted state
- `idb`를 통한 IndexedDB 접근
- `jsQR` 기반 QR 해석
- Vitest, Nuxt Test Utils, Vue Test Utils
- `nuxt generate` 스크립트와 구역별 도슨트 프리렌더 경로

## 확인한 화면과 사용자 흐름

근거: `app/pages/*.vue`, `app/pages/docent/[zone].vue`, `app/components/FooterComponent.vue`

- 홈에서 한국어·영어 전환, 도슨트 목록과 스탬프 진입
- 하단 내비게이션에서 홈, 여정 지도, 마패 조각, 이야기 안내 이동
- 한국어·영어 각각 여덟 개 도슨트 문서와 오디오 자산 연결
- 이야기 목록은 `via=list` 쿼리를 붙여 도슨트 화면으로 이동
- 도슨트 2·4·8 구역에서 AR 촬영으로 이동
- 도슨트 1·3·5·6·7 구역은 각각 다섯 개 조각에 대응
- 목록 경유가 아닐 때만 조각 획득 로직 실행
- 스탬프 화면에서 QR 카메라로 이동
- AR 화면에서 최신 사진 썸네일을 누르면 갤러리로 이동
- 갤러리에서 사진 선택, 공유, 다운로드와 삭제 지원

## 핵심 구현 근거

### 다국어 콘텐츠와 오디오

근거: `content.config.ts`, `content/ko`, `content/en`, `app/components/DocentPlayer.vue`, `app/composables/useLocaleLanguage.ts`, `app/middleware/locale-redirect.global.ts`

- 홈, 목록, 지도, 스탬프, AR와 도슨트를 별도 Content 컬렉션으로 정의한다.
- 선택 언어를 `user-language` 키에 보관하고 첫 루트 방문 시 언어 경로로 리다이렉트한다.
- 오디오 경로는 현재 언어와 선택한 구역 번호로 정한다.

### QR

근거: `app/pages/qr.vue`, `app/composables/useQrScanner.ts`, `app/composables/useCameraStream.ts`

- 후면 카메라를 우선 요청한다.
- 영상 중앙의 정사각 영역을 Canvas에 옮겨 `jsQR`로 해석한다.
- 스캔 페이지에서는 250ms 간격과 720px 스캔 크기를 설정한다.
- QR 문자열을 URL로 해석하고 허용한 공개 서비스 호스트일 때만 pathname, query, hash를 앱 라우터로 전달한다.
- 카메라 조건 적용 실패 시 기본 비디오 요청으로 재시도하며 언마운트 시 스트림을 정리한다.
- 공개 포트폴리오에는 실제 허용 호스트명과 배포 주소를 적지 않았다.

### AR 합성과 로컬 갤러리

근거: `app/pages/ar.vue`, `app/pages/gallery.vue`, `app/components/CameraViewer.vue`, `app/components/ModelViewer.vue`, `app/composables/useImageComposer.ts`, `app/composables/useArPhotoIndexedDb.ts`

- 카메라 이미지와 캐릭터 영상 프레임을 1200×1600 Canvas에 합성해 PNG data URL을 만든다.
- 일부 AR 유형에는 별도 배경 이미지를 추가한다.
- 전·후면 카메라 전환을 지원한다.
- IndexedDB에 원본 Blob, 1/5 크기 썸네일 Blob, 생성 시각을 저장한다.
- 최대 25개를 유지하고 초과 시 생성 시각이 오래된 항목부터 제거한다.
- 갤러리는 최신 결과부터 표시하며 Web Share API 파일 공유를 지원하지 않는 환경에서는 다운로드로 대체한다.
- 삭제 시 IndexedDB 레코드와 화면용 Object URL을 함께 정리한다.

### 스탬프

근거: `app/store/stampStore.ts`, `app/pages/stamp.vue`, `app/pages/docent/[zone].vue`

- 활성 화면은 Pinia 스토어에서 다섯 개 조각을 관리한다.
- persisted state를 통해 브라우저 로컬 저장소에 유지한다.
- 조각 갱신 시 초기화 예정 시각을 설정하고, 그 시각이 지나면 기본 상태로 돌린다.
- 목록 경유 도슨트에서는 조각을 지급하지 않는 분기 처리가 있다.

## 테스트 관련 주의

근거: `vitest.config.ts`, `test/nuxt/useStampData.test.ts`, `app/composables/useStampData.ts`, `app/store/stampStore.ts`

- Nuxt 테스트 프로젝트 구성이 있으며 `useStampData`의 초기값, 변경, 초기화와 localStorage 복구 테스트가 존재한다.
- 해당 테스트 대상은 여섯 개 `item`을 다루는 별도 composable이고, 현재 스탬프 화면에서 사용하는 다섯 개 `piece` Pinia 스토어와 다르다.
- 따라서 공개 콘텐츠에서는 테스트 인프라와 해당 테스트의 존재만 언급하고, 현재 스탬프·QR·AR 전체가 자동 테스트된다고 표현하지 않았다.
- 원본 저장소를 읽기 전용으로 유지하기 위해 테스트와 빌드는 실행하지 않았다. 통과 여부는 확인 필요다.

## 공개 콘텐츠에서 제외한 정보

- 배포 스크립트, 배포 로그와 구체적인 서버·호스트 정보
- 로컬 원본 저장소의 절대 경로
- 프로젝트 관리용 스프레드시트 내용
- 실제 도슨트 음원·영상·이미지의 원본 내용과 파일 자체
- 브라우저 저장소의 내부 DB명과 스토어명

## 확인 필요

- 작업 기간
- 개인·팀 프로젝트 여부와 팀 구성
- 본인의 정확한 담당 범위
- 기획 및 디자인 참여 여부
- 실제 배포·납품·운영 상태
- 지원 기기와 브라우저 기준
- 현장 네트워크 및 카메라 권한 실패 대응 검증 결과
- 정량 성과와 관람객 반응
- 대표 기술 판단의 문제, 검토 대안, 결정 이유와 결과
