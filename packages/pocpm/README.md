# pocpm

학습용 최소 패키지 매니저입니다.

이 패키지는 "패키지 매니저의 최소 동작을 직접 만들고, 나중에는 내 프로젝트에 점진적으로 써보자"는 목적을 위해 있습니다.

짧게 말하면 지금 `pocpm`은 아래 질문에 답하는 코드입니다.

- 의존성을 어떻게 해석하는가
- tarball을 어디에 저장하는가
- `node_modules`를 어떻게 만드는가
- 설치된 `.bin`으로 스크립트를 어떻게 실행하는가

현재 범위:

- exact npm version
- `workspace:*`
- local cache
- hoist 없는 `node_modules`
- `.bin`
- root script 실행

처음 읽는다면 이 파일보다 [docs/pocpm-reader-guide.md](../../docs/pocpm-reader-guide.md)를 먼저 여는 편이 좋습니다. 구현 범위, 코드 읽는 순서, 테스트가 보장하는 내용까지 같이 적어두었습니다.
