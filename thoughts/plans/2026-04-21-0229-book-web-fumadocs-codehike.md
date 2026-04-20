# Plan: `book-web` 준비 단계

## 목표

`projects/book-web`에 `Fumadocs + Code Hike` 기반 docs 앱의 최소 골격을 만든다. 이 단계의 목표는 읽기 경험 전체를 완성하는 것이 아니라, 이후 챕터 본문/인터랙션/퀴즈를 안전하게 얹을 수 있는 출발점을 확보하는 것이다.

## 비목표

- 책 전체 UI/브랜딩 완성
- 퀴즈 시스템 구현
- Motion 기반 커스텀 코드 애니메이션 구현
- 실제 Vercel 프로덕션 배포 수행
- 기존 `sample-web` 제거 또는 대체

## 리스크 / 대응

- 리스크: Fumadocs와 Code Hike의 MDX 설정이 충돌할 수 있다
  - 대응: `source.config.ts`의 `mdxOptions`에 Code Hike plugin을 얹는 최소 통합부터 시작한다
- 리스크: `.source` 생성 전 타입체크가 실패할 수 있다
  - 대응: `postinstall`에 `fumadocs-mdx` typegen을 추가한다
- 리스크: 현재 셸 Node 버전이 엔진보다 낮아 검증이 흔들릴 수 있다
  - 대응: 모든 설치/검증은 `fnm exec --using 20.19.0`으로 실행한다
- 리스크: root workspace task에 새 앱이 들어오며 기존 루트 검증이 깨질 수 있다
  - 대응: `book-web`에도 `build/check/test` 스크립트를 명시한다

## 수용 기준 (DoD)

- `projects/book-web`가 존재한다
- Next.js App Router + Tailwind 4 기반으로 앱이 구성된다
- Fumadocs MDX content source가 연결된다
- Code Hike plugin과 custom `Code` component가 연결된다
- 샘플 MDX 문서 1개가 `/docs` 경로에서 렌더링된다
- root에 `dev:book-web` 스크립트가 생긴다
- 앱 수준 `deploy:preview`, `deploy:prod` 스크립트가 생긴다
- `yarn workspace @poc/book-web build`가 통과한다

## 검증 명령

```bash
fnm exec --using 20.19.0 corepack yarn install
fnm exec --using 20.19.0 corepack yarn workspace @poc/book-web build
fnm exec --using 20.19.0 corepack yarn workspace @poc/book-web check
fnm exec --using 20.19.0 corepack yarn workspace @poc/book-web test
```

## Phase 1. 앱 골격 생성

- [x] `projects/book-web`에 Next.js App Router 앱 골격 생성
- [x] workspace package로 편입
- [x] 기본 스크립트 정리

성공 기준:

- 새 앱이 workspace로 인식되고 자체 `package.json`을 가진다

## Phase 2. Fumadocs 최소 통합

- [x] `source.config.ts` 추가
- [x] `next.config.mjs`에 Fumadocs MDX loader 연결
- [x] `lib/source.ts`, `app/layout.tsx`, `app/docs/layout.tsx`, `app/docs/[[...slug]]/page.tsx`, `app/api/search/route.ts` 추가
- [x] 샘플 `content/docs/index.mdx` 추가

성공 기준:

- `/docs` 경로에 Fumadocs 기반 문서 페이지를 렌더링할 수 있다

## Phase 3. Code Hike 준비 연결

- [x] Code Hike plugin을 MDX config에 연결
- [x] custom `Code` component 추가
- [x] diff 예제 또는 annotated code 예제 1개 추가

성공 기준:

- MDX 안의 code block이 Code Hike를 통해 렌더링된다

## Phase 4. 모노레포/배포 진입점 연결

- [x] 루트 `README` 또는 앱 `README`에 실행/배포 준비 메모 추가
- [x] root에 `dev:book-web` 스크립트 추가
- [x] 앱 package에 `deploy:preview`, `deploy:prod` 스크립트 추가

성공 기준:

- 나중에 `vercel` CLI만 로그인되면 바로 preview/prod 커맨드를 실행할 수 있다

## 완료 후 다음 단계

1. 챕터 1 MDX 실원고 추가
2. Code Hike diff/focus/scrollycoding 컴포넌트 강화
3. 퀴즈 컴포넌트 설계
4. Motion 기반 커스텀 전환 애니메이션 추가

## 검증 결과

- [x] `fnm exec --using 20.19.0 corepack yarn install`
- [x] `fnm exec --using 20.19.0 corepack yarn workspace @poc/book-web test`
- [x] `fnm exec --using 20.19.0 corepack yarn workspace @poc/book-web check`
- [x] `fnm exec --using 20.19.0 corepack yarn workspace @poc/book-web build`
