# @poc/book-web

`pocpm` 교재를 웹에서 읽게 만들기 위한 책 프론트엔드 준비 앱입니다.

현재 범위는 "완성된 제품"이 아니라 아래 출발점을 확보하는 데 있습니다.

- Next.js App Router
- Fumadocs MDX content source
- Code Hike custom code block
- Orama search route
- Vercel CLI preview / production 배포 스크립트

## 실행

루트에서:

```bash
fnm use 20.19.0
corepack yarn install
corepack yarn workspace @poc/book-web dev
```

문서 페이지:

- `http://localhost:3000/docs`

## 배포 준비

이 앱은 로컬 devDependency로 `vercel` CLI를 포함합니다.

```bash
corepack yarn workspace @poc/book-web vercel:link
corepack yarn workspace @poc/book-web vercel:pull
corepack yarn workspace @poc/book-web deploy:preview
corepack yarn workspace @poc/book-web deploy:prod
```

공식 권장 흐름은 `vercel link -> vercel env pull -> vercel deploy -> vercel deploy --prod`입니다.

## 다음 작업

- 책 전용 랜딩/챕터 레이아웃
- Code Hike diff/focus/scrollycoding 강화
- 퀴즈 컴포넌트
- 진행률 저장
