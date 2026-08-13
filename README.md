# Git My Page

Nuxt 4와 GitHub Pages 전용 Nitro 프리셋으로 만든 정적 포트폴리오 보일러플레이트입니다.

## 시작하기

Node.js 22와 pnpm을 사용합니다.

```bash
corepack enable
pnpm install
pnpm dev
```

기본 정보는 `app/data/profile.ts`, 프로젝트 목록은 `app/data/projects.ts`에서 수정합니다.

## 명령어

```bash
pnpm dev          # 개발 서버
pnpm lint         # ESLint
pnpm typecheck    # Vue/Nuxt 타입 검사
pnpm generate     # 일반 정적 사이트 생성
pnpm build:pages  # GitHub Pages 프리셋 빌드
pnpm check        # 전체 로컬 검사
```

## GitHub Pages 배포

`.github/workflows/deploy.yml`이 `main` 브랜치 push마다 사이트를 빌드하고 배포합니다.

1. GitHub에 저장소를 생성하고 이 프로젝트를 push합니다
2. 저장소의 `Settings > Pages`에서 Source를 `GitHub Actions`로 선택합니다
3. 사용자 사이트 저장소(`<아이디>.github.io`)는 루트 경로로 자동 설정됩니다
4. 일반 저장소는 저장소 이름을 기준으로 `/<저장소명>/` 경로가 자동 설정됩니다

커스텀 도메인을 사용할 때는 저장소 Actions 변수 `NUXT_APP_BASE_URL`을 `/`로 설정하세요.

## 배포 전 확인

개인 정보와 소개는 `app/data/profile.ts`, 프로젝트 정보는 `app/data/projects.ts`에서 관리합니다.
