# 정읍 방문자센터 마을 만들기 조사 메모

## 조사 원칙

- 원본 프로젝트를 읽기 전용으로 조사했다.
- 공개 콘텐츠는 현재 소스에서 확인된 기능과 설정을 근거로 작성했다.
- 기간, 역할, 팀 구성, 납품 상태와 성과는 추측하지 않았다.
- 카메라 접속 정보, 내부 IP·포트, 계정, 비밀번호, 로컬 경로와 모델 파일은 공개 콘텐츠에서 제외했다.

## 기술 구성과 패키징

근거: `package.json`, `electron.vite.config.ts`, `electron-builder.yml`, `vitest.config.ts`

- Electron, Vue 3, TypeScript, Pinia
- PixiJS 8, `bezier-js`
- Electron 메인 프로세스가 실행하는 Python 보조 스크립트
- electron-vite 빌드와 electron-builder 패키징
- Windows NSIS 빌드 스크립트
- 패키지 설정에는 Windows x64·ia32와 portable·NSIS 대상 정의가 함께 존재함
- Vitest를 Node, preload, jsdom renderer 프로젝트로 분리

실제 빌드·테스트 실행은 원본 읽기 전용 조사 범위에서 수행하지 않았다.

## 감지 입력과 추적

근거: `src/main/python/pythonScriptManager.ts`, `src/main/services/entityOperator.ts`, `entityTracker.ts`, `src/definitions/entityData.d.ts`

- Python 감지 프로세스는 카메라 이름과 detection 배열을 프레임 단위 JSON으로 출력한다.
- 오브젝트 라벨은 `road`, `river`, `train`, `cloud` 네 종류다.
- GPU 설정에 따라 감지 스크립트 변형을 선택한다.
- 카메라별 EntityTracker가 같은 라벨과 거리 임계값으로 detection을 매칭한다.
- 연속 감지 횟수가 기준에 도달하면 ID와 평균 좌표를 고정해 created 이벤트를 만든다.
- 연속 유실 횟수가 기준에 도달하면 removed 이벤트를 만든다.
- 카메라별 유효 범위 필터, X 오프셋과 중심 거리 기반 Y 보정이 있다.
- 메인 프로세스가 created와 removed를 렌더러로 전송한다. updated는 계산하지만 현재 EntityOperator에서 별도로 보내지 않는다.
- 연결 정보와 감지 임계값 등 실제 운영 설정은 공개하지 않았다.

## 렌더러 상태와 PixiJS 장면

근거: `src/renderer/src/main.ts`, `services/entityIpcService.ts`, `store/entityStore.ts`, `components/pixiWorld/PixiWorld.vue`, `services/pixi/usePixiApp.ts`

- Pinia 스토어는 라벨별 `Map<id, TrackedEntity>`로 노드를 보관한다.
- IPC의 objects-detected와 objects-lost 이벤트가 노드를 추가·삭제한다.
- Electron 창은 프로덕션에서 PixiWorld 해시 경로를 직접 연다.
- Pixi Application은 1920×1200 디자인 좌표계, antialias, autoDensity, 최대 60 FPS 설정을 사용한다.
- 배경 비디오 위에 decoration, route, animal 레이어를 순서대로 배치한다.
- ResizeObserver로 창 크기에 맞는 레터박스 스케일과 중앙 정렬을 적용한다.
- 화면 가장자리에는 그라데이션 마스크 프레임을 둔다.
- 동물 레이어는 3분마다 페이드아웃 후 다시 생성한다.

## 경로와 장면 구성

근거: `src/renderer/src/services/mstLogics.ts`, `useEdges.ts`, `pixi/sectionFactory.ts`, `pixi/useRoutes.ts`, `pixi/useTraffic.ts`

- 라벨별 노드를 Prim 최소 신장 트리로 연결한다.
- 각 라벨 섹션은 path, decoration, vehicle, bridge, node 컨테이너로 분리된다.
- 도로·철로·강·하늘길을 TilingSprite 선분으로 그린다.
- 강과 하늘길 텍스처는 Ticker에서 tile position을 갱신해 흐름을 표현한다.
- 종류별 노드에 반복 재생 영상 효과를 배치한다.
- 노드·간선 변경을 Vue watch로 감지해 경로 레이어, 교량과 교통수단을 재구성한다.
- 교통수단은 자동차, 열차, 보트와 비행기로 구분한다.
- 현재 활성 이동은 선분의 시작·끝 위치를 `t`로 보간하며 방향에 따라 스프라이트 회전을 설정한다.
- 종류별 생성 간격, 속도와 차선 오프셋 설정을 사용한다.

## 교차, 충돌과 장식 배치

근거: `src/renderer/src/services/pixi/useRoutes.ts`, `pixi/useAnimals.ts`

- 두 선분의 교차 파라미터를 계산한다.
- 도로와 강·철로 교차, 철로와 강 교차에 교량 스프라이트를 배치한다.
- 길 주변 장식 후보는 선분 방향의 법선 벡터 양쪽에 일정 간격으로 생성한다.
- 다른 경로까지의 점-선분 거리로 경로 영역 겹침을 판정한다.
- 노드 중심과의 거리로 노드 주변 장식 배치를 제외한다.
- 교량 교차 지점 주변의 장식도 제외한다.
- 건물, 나무, 꽃 텍스처를 라벨별로 배정한다.
- 노드 주변에는 원형 배치 장식이 별도로 있다.
- 동물은 화면 경계와 다른 동물의 반경을 검사해 회피 방향으로 천천히 회전하고 위치를 화면 범위 안으로 제한한다.

## 베지어와 원형 장애물 충돌 모듈

근거: `src/renderer/src/services/bezierLogics.ts`, `collisionLogic.ts`, `components/BezierTest.vue`, `router.ts`, `pixi/useRoutes.ts`, `pixi/useTraffic.ts`

- 짧은 간선은 2차 베지어, 긴 간선은 S자 형태의 3차 베지어를 생성한다.
- 곡선 방향 부호와 곡률 스케일을 조합해 여러 후보를 만든다.
- 장애물 노드를 원형 충돌체로 바꾸는 유틸리티가 있다.
- 베지어 길이에 따라 샘플 수를 정하고 각 점과 원형 장애물의 거리를 비교한다.
- BezierTest 컴포넌트는 Canvas에 곡선과 outline을 그리는 실험 화면이다.
- 현재 router에는 BezierTest 경로가 없고, `useRoutes`와 `useTraffic`은 이 모듈을 import하거나 호출하지 않는다.
- 현재 PixiWorld의 경로와 이동은 직선 선분 기반이다.

따라서 공개 콘텐츠에서는 베지어 이동을 현재 적용된 운영 기능으로 단정하지 않고 “구현된 확장 후보”로 설명했다.

## 테스트 근거

근거: `src/main/services/entityTracker.test.ts`, `src/renderer/src/services/mstLogics.test.ts`, `src/renderer/src/store/entityStore.test.ts`

- 연속 감지 뒤 생성, 연속 유실 뒤 삭제와 라벨별 독립 추적 테스트
- 다중 카메라 ID·범위와 좌표 보정 테스트
- 최소 신장 트리의 간선 수, 유효 인덱스, 중복 방지, 연결성 테스트
- 임의 노드 생성 범위 테스트
- Pinia 노드 추가·삭제·동일 ID 갱신과 computed 반응성 테스트
- 테스트 fixture 일부에 내부 연결 정보가 포함되어 있어 공개 근거에는 값이나 원문을 사용하지 않았다.
- 테스트 파일의 존재만 확인했으며 실제 실행 결과는 확인하지 않았다.

## Windows 실행과 운영 설정

근거: `src/main/index.ts`, `package.json`, `electron-builder.yml`

- 전시 창은 설정에 따라 전체 화면으로 열리고 항상 위에 유지된다.
- 렌더러 background throttling을 끄고 자동 재생을 허용한다.
- 멀티 디스플레이가 있으면 기본 화면이 아닌 디스플레이를 우선 선택한다.
- Windows NSIS 패키징과 설치 바로가기 설정이 있다.
- Python 스크립트와 모델 등 resources를 패키지 외부 리소스로 포함한다.
- 현재 벽면 영상용 두 번째 창 코드는 주석 처리되어 있어 활성 기능으로 설명하지 않았다.

## 확인 필요

- 작업 기간, 팀 구성과 정확한 담당 범위
- 물리 오브젝트·감지 모델·그래픽 에셋 제작 참여 여부
- 베지어 모듈의 최종 적용 여부
- 실제 카메라와 디스플레이 구성의 공개 가능 범위
- 납품·운영 상태와 지원 Windows 환경
- 인식 정확도, 프레임 성능과 장시간 실행 검증 결과
- 대표 기술 판단의 문제, 검토 대안, 결정 이유와 결과
