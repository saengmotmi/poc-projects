# pocpm Reader Guide

이 문서는 `pocpm`을 처음 보는 사람이 "이게 왜 있는지", "지금 어디까지 됐는지", "어디부터 읽으면 되는지"를 빠르게 파악할 수 있도록 정리한 안내서입니다.

의도적으로 reader-based prose 방식으로 썼습니다.  
즉 구현자가 하고 싶은 말 순서보다, 읽는 사람이 실제로 궁금해할 순서에 맞췄습니다.

## 이 프로젝트는 왜 있나

`pocpm`은 완성형 패키지 매니저를 바로 만들려는 프로젝트가 아닙니다.

이 저장소에서는 두 가지를 같이 하려 합니다.

1. 패키지 매니저의 핵심 추상화를 몸으로 이해한다.
2. 이해한 내용을 장난감 수준에서 끝내지 않고, 나중에는 실제 내 프로젝트에도 점진적으로 써본다.

그래서 이 프로젝트의 기준은 "기능이 많으냐"가 아니라 "설치 과정이 눈에 보이느냐"입니다.

## 지금 당장 할 수 있는 일

현재 `pocpm`은 아래 범위만 지원합니다.

- exact npm version
- `workspace:*`
- `.pocpm-store`에 tarball 저장
- hoist 없는 `node_modules` 구성
- `.bin` 링크 생성
- 루트 `scripts` 실행

이 범위는 일부러 작게 잡았습니다.  
처음부터 semver 최적화, peer dependency, hoisting까지 넣으면 설치기의 본질보다 예외 처리가 더 크게 보이기 때문입니다.

## 아직 안 되는 일

아래 항목은 아직 구현하지 않았고, 현재 설계상도 의도적으로 미뤄둔 상태입니다.

- semver range 해석
- peerDependencies
- hoisting / dedupe
- private registry 인증
- publish
- Windows용 shim

이 문서를 읽는 사람이 "왜 이 기능이 없지?"라고 느낄 수 있어서 먼저 적어둡니다.  
현재 단계에서는 빠진 게 아니라, 학습 순서를 위해 뒤로 미룬 것입니다.

## 코드를 읽기 전에 머리에 두면 좋은 모델

`pocpm`은 크게 세 단계로 작동합니다.

1. `resolve`
   무엇을 설치할지 결정합니다.
2. `fetch`
   결정된 패키지의 tarball을 가져와 저장합니다.
3. `link`
   저장된 패키지를 `node_modules`와 `.bin` 형태로 풀어놓습니다.

스크립트 실행은 설치 이후 단계라서 `run`으로 따로 분리했습니다.

이 모델을 먼저 잡고 읽으면, 파일이 여러 개로 나뉘어 있어도 길을 덜 잃습니다.

## 어디부터 읽으면 좋은가

처음 읽을 때는 아래 순서를 추천합니다.

1. [packages/pocpm/src/pocpm.test.ts](../packages/pocpm/src/pocpm.test.ts)
2. [packages/pocpm/src/index.ts](../packages/pocpm/src/index.ts)
3. [packages/pocpm/src/project.ts](../packages/pocpm/src/project.ts)
4. [packages/pocpm/src/resolve.ts](../packages/pocpm/src/resolve.ts)
5. [packages/pocpm/src/fetch.ts](../packages/pocpm/src/fetch.ts)
6. [packages/pocpm/src/link.ts](../packages/pocpm/src/link.ts)
7. [packages/pocpm/src/run.ts](../packages/pocpm/src/run.ts)

이 순서를 추천하는 이유는 단순합니다.

- 테스트를 먼저 보면 "무엇을 보장하려는지"가 보입니다.
- 그다음 `index.ts`를 보면 전체 데이터 흐름이 보입니다.
- 이후 세부 단계로 들어가면 구현 디테일이 덜 부담스럽습니다.

## 테스트가 실제로 보장하는 것

현재 통합 테스트는 두 가지를 끝까지 확인합니다.

첫 번째 테스트는 설치 자체를 검증합니다.

- exact version을 해석하는지
- transitive dependency가 내려가는지
- lockfile이 써지는지
- tarball cache가 생기는지
- workspace가 symlink로 연결되는지
- workspace 내부에서도 필요한 의존성이 설치되는지

두 번째 테스트는 설치 결과를 사용해보는 단계까지 봅니다.

- `.bin`이 만들어지는지
- 루트 script가 설치된 바이너리를 실제로 실행하는지

즉 이 테스트들은 "파일 몇 개가 생겼다"에서 끝나지 않고, 설치 결과가 실제로 실행 가능한 상태인지까지 확인합니다.

## 이 구현이 일부러 단순한 부분

처음 읽으면 "왜 이렇게 비효율적으로 재귀 설치하지?" 같은 생각이 들 수 있습니다.

그 선택은 의도적입니다.

- hoisting을 넣으면 디스크 구조가 덜 직관적입니다.
- dedupe를 넣으면 왜 그 버전이 그 위치에 갔는지 추적이 어려워집니다.
- peer dependency를 넣으면 같은 패키지가 문맥마다 갈라지는 이유를 먼저 설명해야 합니다.

지금은 성능보다 가시성을 우선했습니다.  
설치기가 디스크를 어떻게 바꾸는지 눈으로 따라갈 수 있어야, 다음 단계 확장도 덜 막힙니다.

## 이 저장소에서 `pocpm`을 어떻게 대해야 하나

아직 이 저장소의 공식 패키지 매니저는 Yarn입니다.

이건 중요합니다.

- 루트 설치와 워크스페이스 관리는 여전히 Yarn이 담당합니다.
- `pocpm`은 학습과 점진적 dogfooding을 위한 내부 도구입니다.

즉 지금 단계의 목표는 "Yarn을 지웠다"가 아니라 "패키지 매니저의 최소 설치 루프를 내가 통제할 수 있게 됐다"입니다.

## 다음에 확장한다면 어디로 가면 좋은가

다음 순서는 아래처럼 가는 편이 안전합니다.

1. lockfile 형식을 조금 더 안정화한다.
2. semver range를 exact version 외 한 단계만 넓힌다.
3. `sample-web` 같은 leaf project에 shadow install을 시도한다.
4. `.bin`과 workspace 케이스를 더 늘린다.
5. 그다음에야 peer dependency나 hoisting을 고민한다.

중요한 건 한 번에 "진짜 패키지 매니저"가 되려고 하지 않는 것입니다.  
이 프로젝트의 강점은 범위를 작게 자르고, 각 단계가 왜 필요한지 드러내는 데 있습니다.

## 빠르게 다시 실행하고 싶다면

```bash
cd <repo-root>
fnm use 20.19.0
corepack yarn workspace @poc/pocpm build
corepack yarn workspace @poc/pocpm test
```

패키지 단독으로 CLI를 써보려면:

```bash
node /path/to/pocpm/dist/cli.js install
node /path/to/pocpm/dist/cli.js run greet
```

다만 마지막 두 명령은 `package.json`이 있는 대상 프로젝트 디렉터리에서 실행해야 합니다.
