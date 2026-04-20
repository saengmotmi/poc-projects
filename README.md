# poc-projects

POC를 빠르게 만들고 버릴 수 있게 잡아둔 Yarn Berry 모노레포입니다.

핵심 원칙은 두 가지입니다.

- 패키지 관리는 `Yarn Berry + node_modules linker`
- 개발 흐름은 `Vite+`를 루트 스크립트로 얇게 감싸서 사용

## 구조

- `projects/*`: 실제 POC 앱
- `packages/*`: 공통 설정/공용 패키지
- `templates/*`: 새 프로젝트를 만들 때 복사할 베이스 구조
- `thoughts/*`: 이번 세팅의 research/plan 산출물

## 시작하기

현재 `vite-plus`는 Node `^20.19.0 || >=22.12.0`를 요구합니다.

```bash
cd <repo-root>
fnm use 20.19.0
corepack yarn install
```

## 자주 쓰는 명령

```bash
corepack yarn build
corepack yarn check
corepack yarn test
corepack yarn dev:sample-web
```

## 현재 포함된 프로젝트

- `@poc/sample-web`: Vite+로 `dev/build/check/test`를 검증할 수 있는 기본 웹 POC
- `@poc/pocpm`: exact npm version과 `workspace:*`를 설치하는 학습용 최소 패키지 매니저

중요한 맥락은 [docs/pocpm-reader-guide.md](docs/pocpm-reader-guide.md)에 정리해두었습니다.

## 규약

- 새 POC는 `projects/<slug>`에 둡니다.
- 패키지 이름은 `@poc/<slug>`를 사용합니다.
- 공통 TS 설정은 `@poc/tsconfig`에서 가져갑니다.
- 루트에서는 `vp run --filter "@poc/*" ...`로 workspace 태스크를 오케스트레이션합니다.
- Vite+ 설정 파일은 현재 호환성 때문에 `vite.config.mjs`로 둡니다.

## pocpm

학습용 최소 패키지 매니저는 `packages/pocpm`에 있습니다.

현재 지원 범위:

- exact npm version
- `workspace:*`
- `.pocpm-store` tarball cache
- hoist 없는 `node_modules`
- `.bin`
- root script 실행

예시:

```bash
cd /path/to/your-project
node /path/to/pocpm/dist/cli.js install
node /path/to/pocpm/dist/cli.js run greet
```

처음 읽을 때는 [docs/pocpm-reader-guide.md](docs/pocpm-reader-guide.md)부터 보는 편이 빠릅니다.
