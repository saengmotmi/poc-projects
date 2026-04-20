# Research: `book-web` 준비 단계

## 범위 고정

- 정상동작: 현재 모노레포에는 Vite+ 기반 샘플 앱 `projects/sample-web`과 문서/교재 설계 문서만 있다.
- 현재동작: `Fumadocs + Code Hike` 기반의 책 프론트엔드 앱과 Vercel 배포 진입점은 아직 없다.

## Output = f(Input, State, Environment, Time)

- Input
  - 사용자가 지정한 스택: `Fumadocs + Code Hike`
  - 모노레포 구조: `projects/*`, `packages/*`
  - 기존 책/커리큘럼 문서: `docs/` 아래 여러 Markdown 문서
- State
  - 루트는 Yarn Berry workspace (`packageManager: yarn@4.9.1`)
  - 현재 웹 앱은 `projects/sample-web` 하나뿐이다
  - `docs/book` 아래에 교재 설계 문서가 추가된 상태다
  - 글로벌 `vercel` CLI는 현재 설치되어 있지 않다
- Environment
  - 현재 셸의 Node 버전은 `v20.10.0`
  - 시스템에는 `fnm`으로 `v20.19.0`이 설치되어 있다
  - 루트 엔진은 `^20.19.0 || >=22.12.0`
- Time
  - 외부 패키지 버전과 Fumadocs/Next.js 설치 방식은 시간이 지나면 바뀔 수 있다
  - 준비 단계에서는 최신 안정 버전을 기준으로 의존성을 고정해야 한다

## 현재 저장소 관측

### 루트 구성

- [package.json](../../package.json)
  - workspaces: `projects/*`, `packages/*`
  - root task orchestration은 `vp run --filter "@poc/*"` 형태

### 현재 웹 앱

- [projects/sample-web/package.json](../../projects/sample-web/package.json)
  - Vite+ 기반
  - `dev/build/check/test` 스크립트 보유

### 현재 문서 자산

- [docs/pocpm-reader-guide.md](../../docs/pocpm-reader-guide.md)
- [docs/pocpm-study-curriculum-beginner.md](../../docs/pocpm-study-curriculum-beginner.md)
- [docs/pocpm-study-curriculum.md](../../docs/pocpm-study-curriculum.md)
- [docs/book/BOOK_PRD.md](../../docs/book/BOOK_PRD.md)
- [docs/book/TOC.md](../../docs/book/TOC.md)
- [docs/book/CHAPTER_TEMPLATE.md](../../docs/book/CHAPTER_TEMPLATE.md)

## 외부 공식 문서 관측

### Fumadocs

- [Fumadocs Next.js manual installation](https://www.fumadocs.dev/docs/manual-installation/next)
  - prerequisite: `Next.js 16`, `Tailwind CSS 4`
  - packages: `fumadocs-mdx`, `fumadocs-core`, `fumadocs-ui`, `@types/mdx`
  - `source.config.ts`, `next.config.mjs`, `lib/source.ts`, `app/docs/layout.tsx`, `app/docs/[[...slug]]/page.tsx`, `app/api/search/route.ts` 구성을 안내
  - `.source` 폴더는 `next dev` 또는 `next build` 시 생성됨

- [Fumadocs MDX options](https://fumadocs.dev/docs/mdx/mdx)
  - `defineConfig({ mdxOptions: ... })`로 remark/rehype 플러그인 추가 가능
  - 기본 preset 위에 plugin을 추가하는 형태 지원

- [Fumadocs typegen](https://fumadocs.dev/docs/mdx/typegen)
  - `fumadocs-mdx` CLI로 `.source` type/output을 생성 가능
  - `postinstall` 스크립트 예시 제공

### Code Hike

- [Code Hike Getting Started](https://codehike.org/docs)
  - docs/tutorial use case에 적합
  - Next.js + Fumadocs 조합을 추천
  - `remarkCodeHike`, `recmaCodeHike` 플러그인 사용
  - MDX config에 `components: { code: "Code" }` 설정 필요

- [Code Hike Code Blocks](https://codehike.org/docs/concepts/code)
  - 커스텀 code component 패턴 설명
  - `highlight` + `Pre` 조합 제공
  - React Server Components에서 async highlight 패턴 사용 가능

- [Code Hike Diff](https://codehike.org/docs/code/diff)
  - 추가/삭제 라인 시각화용 annotation handler 예시 제공

- [Code Hike Scrollycoding](https://codehike.org/docs/layouts/scrollycoding)
  - 코드 워크스루에 적합한 스크롤 기반 레이아웃 제공

### Vercel

- [Deploying a project from the CLI](https://vercel.com/docs/projects/deploy-from-cli)
  - 권장 흐름: `vercel link -> vercel env pull -> vercel deploy -> vercel deploy --prod`

- [Using Monorepos](https://vercel.com/docs/monorepos)
  - monorepo 내 여러 앱/프로젝트를 개별 Vercel 프로젝트로 운용 가능

## 버전 관측

- `next`: `16.2.4`
- `react`: `19.2.5`
- `react-dom`: `19.2.5`
- `tailwindcss`: `4.2.2`
- `typescript`: `6.0.3`
- `fumadocs-ui`: `16.8.1`
- `fumadocs-core`: `16.8.1`
- `fumadocs-mdx`: `14.3.1`
- `codehike`: `1.1.0`
- `@types/mdx`: `2.0.13`
- `vercel`: `51.8.0`

## 현재 제약 관측

- 현재 Node `v20.10.0`로는 루트 엔진과 최신 Next/Fumadocs 검증이 흔들릴 수 있다.
- 루트 `build/check/test`는 workspace 전체에 퍼지므로, 새 앱도 해당 스크립트를 가져야 한다.
- 준비 단계는 "책 프론트엔드 완성"이 아니라 "앱 골격 + 콘텐츠 파이프라인 + 로컬/배포 진입점 확보"로 제한해야 한다.
