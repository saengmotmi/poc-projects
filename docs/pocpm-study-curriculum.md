# pocpm 학습 커리큘럼

이 문서는 `pocpm`을 만드는 사람이 패키지 매니저의 역사를 따라가면서 핵심 추상화를 몸에 익히도록 돕기 위한 6주 커리큘럼입니다.

목표는 자료를 많이 읽는 것이 아니라, 매주 하나의 관점을 확실하게 자기 말로 설명할 수 있게 되는 것입니다. 그래서 각 주차는 "무엇을 읽을지"보다 "왜 지금 이걸 읽어야 하는지"와 "읽고 나서 무엇이 달라져야 하는지"를 중심으로 적었습니다.

이 커리큘럼은 패키지 매니저를 세 층으로 나눠서 봅니다.

- 역사층: 패키지 매니저가 원래 어떤 문제를 해결하려고 생겼는지
- 아키텍처층: `resolver`, `fetch/store`, `linker`, `lockfile` 같은 경계가 왜 필요한지
- 구현층: 결국 내 도구에서 어떤 순서로 무엇을 만들어야 하는지

`pocpm`에 바로 도움이 되도록, 매주 끝에는 작은 산출물도 붙였습니다. 거창한 보고서가 아니라 짧은 메모, 표, 수도 코드, 또는 코드 수정 하나면 충분합니다.

## 읽기 전에 기억할 기준

패키지 매니저를 공부하다 보면 CLI 명령이 너무 많아서 본질이 흐려지기 쉽습니다. 그럴 때는 아래 네 문장으로 다시 돌아오면 됩니다.

- 패키지 매니저는 원하는 상태를 읽는다.
- 그 원하는 상태를 만족하는 의존성 해를 계산한다.
- 필요한 아티팩트를 가져와 저장한다.
- 런타임이 이해하는 디스크 구조로 배치한다.

이 네 줄이 흐려지면 다시 자료를 더 읽는 것보다, 지금 읽은 문서가 위 네 단계 중 어디를 설명하는지 먼저 표시해보는 편이 낫습니다.

## 1주차: 패키지 매니저는 원래 무엇을 해결했나

이번 주의 목적은 "패키지 매니저 = npm install"이라는 좁은 감각에서 벗어나는 것입니다. 언어 패키지 매니저가 나오기 전부터 시스템 패키지 매니저는 이미 저장소, 설치, 제거, 업그레이드, 신뢰, 우선순위 같은 문제를 풀고 있었습니다. 이 바닥의 오래된 문제를 먼저 봐야, 나중에 JavaScript 생태계의 세부 기능이 왜 그렇게 꼬였는지 덜 이상하게 느껴집니다.

처음 읽을 자료는 [The Debian Administrator's Handbook](https://www.debian.org/doc/manuals/debian-handbook/index.en.html)입니다. 이 자료를 읽을 때는 Debian 전체를 이해하려고 애쓰기보다, 목차에서 `dpkg`, `APT`, repository, authenticity, upgrade에 해당하는 부분만 따라가면 충분합니다. 특히 "낮은 수준의 패키지 도구"와 "그 위에서 의존성과 저장소를 다루는 도구"가 분리되어 있다는 감각을 잡는 것이 중요합니다.

읽다 보면 "이건 운영체제 얘기지, JavaScript 패키지 매니저랑 무슨 상관이지?"라는 생각이 들 수 있습니다. 그 반응은 정상입니다. 여기서 얻어야 하는 것은 구체적인 명령어가 아니라, 패키지 매니저가 원래부터 두 가지 세계를 동시에 다뤄왔다는 사실입니다. 하나는 "파일을 어떻게 설치하느냐"이고, 다른 하나는 "무엇을 어디서 믿고 가져오느냐"입니다. JavaScript 패키지 매니저는 여기에 `semver`와 `transitive dependency`라는 어려움을 더 얹은 셈입니다.

이번 주가 끝나면 아래 질문에 자기 말로 답할 수 있어야 합니다.

- 왜 `dpkg` 같은 로우 레벨 설치기와 `APT` 같은 고수준 도구가 분리되는가?
- 저장소, 신뢰, 업그레이드 정책은 왜 설치기와 별개의 문제인가?
- "패키지 설치"와 "의존성 해결"은 왜 같은 일처럼 보이지만 실제로는 다른 일인가?

이번 주 산출물은 짧아도 됩니다. `docs`나 개인 노트 어디든 좋으니 "`pocpm`에서 나중에 분리될 가능성이 높은 책임 5개"를 적어보세요. 예를 들면 `manifest parsing`, `resolution`, `registry access`, `store`, `linking` 같은 식입니다.

## 2주차: JavaScript 패키지 매니저의 기본 계약 이해하기

이번 주의 목적은 npm을 좋아하느냐 싫어하느냐가 아니라, JavaScript 생태계가 무엇을 표준 계약처럼 여기는지 이해하는 것입니다. `package.json`, `package-lock.json`, `node_modules`, lifecycle scripts, `devDependencies`, `peerDependencies` 같은 요소는 다 우연히 붙은 기능이 아니라, 실제 프로젝트 운영에서 생긴 압력을 반영한 것입니다.

먼저 읽을 자료는 [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install/) 문서입니다. 여기서 제일 중요한 문장은 `package.json`이 허용 범위를 말하고, `package-lock.json`이 구체적인 설치 결과를 고정한다는 부분입니다. 공식 문서도 lockfile의 해가 manifest 범위를 만족하면 lockfile을 사용하고, 충돌하면 다시 resolve해서 lockfile을 갱신한다고 설명합니다.

이 주차에서 흔히 막히는 지점은 dependency type이 너무 많다는 점입니다. `dependencies`, `devDependencies`, `optionalDependencies`, `peerDependencies`를 처음부터 완벽하게 외우려고 하지 않는 편이 좋습니다. 대신 질문을 바꿔야 합니다. "이 의존성은 해석 대상인가, 디스크 설치 대상인가, 런타임 계약인가?"라고 보면 훨씬 정리가 됩니다. npm 문서도 `omit` 옵션 설명에서, 어떤 의존성은 디스크에는 설치하지 않아도 lockfile 해석에는 포함된다고 분명히 말합니다.

이번 주가 끝나면 아래를 설명할 수 있어야 합니다.

- `package.json`과 lockfile 중 무엇이 source of truth인가?
- 왜 어떤 의존성은 해결은 되지만 디스크에는 설치하지 않을 수 있는가?
- `peerDependencies`는 "추가 설치 목록"이 아니라 왜 "호환성 제약"에 가까운가?

이번 주 산출물은 `pocpm` 관점의 표 하나면 충분합니다. 열은 `field`, `해결 단계에서 필요`, `설치 단계에서 필요`, `지금 pocpm 지원 여부` 정도로 잡고, `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`, `bin`, `scripts`를 채워보세요. 이 표는 다음 구현 우선순위를 정할 때 바로 도움이 됩니다.

## 3주차: 설치 파이프라인을 아키텍처로 보는 법

이번 주의 목적은 패키지 매니저를 명령 모음이 아니라 파이프라인으로 보는 것입니다. 이 주차부터는 "설치가 왜 복잡한가"가 아니라 "복잡함을 어디서 끊어야 하는가"를 배우게 됩니다.

가장 먼저 읽을 자료는 [Yarn Architecture](https://yarnpkg.com/advanced/architecture)와 [yarn install](https://yarnpkg.com/cli/install)입니다. Yarn 문서는 설치를 `Resolution`, `Fetch`, `Link`, `Build`로 나누고, 내부적으로는 `Resolver`, `Fetcher`, `Linker` 같은 인터페이스로 설명합니다. 이건 단순한 구현 취향이 아니라, 실제로 버그를 고칠 때 첫 분기점을 찾기 쉽게 해주는 설계입니다.

읽으면서 꼭 붙잡아야 할 포인트는 "왜 링크 전략을 resolver와 분리하나"입니다. 같은 resolution 결과라도 디스크에 놓는 방식은 `node_modules`, `PnP`, symlink tree 등으로 달라질 수 있습니다. 이걸 한 덩어리로 구현하면, 나중에 문제를 봐도 "버전 선택이 틀린 건지", "다운로드가 잘못된 건지", "배치가 깨진 건지" 구분이 안 됩니다.

이 주차에서 자주 생기는 오해는 "그럼 내 작은 패키지 매니저도 저렇게 다 인터페이스화해야 하나?"입니다. 꼭 그렇진 않습니다. 중요한 것은 파일 개수를 늘리는 게 아니라, 머릿속 경계를 분리하는 것입니다. `pocpm`처럼 작은 구현이라면 파일은 적어도 괜찮지만, 적어도 코드 안에서는 `무엇을 고른다`, `어디서 가져온다`, `어떻게 놓는다`가 섞이지 않아야 합니다.

이번 주가 끝나면 아래 질문에 답할 수 있어야 합니다.

- 같은 `package.json`으로도 linker에 따라 왜 다른 설치 결과가 나올 수 있는가?
- `build`를 `link`와 별도 단계로 보는 이유는 무엇인가?
- lockfile은 resolution 결과의 기록인가, 설치 결과의 기록인가, 둘 다인가?

이번 주 산출물은 현재 `pocpm` 코드 기준의 설치 파이프라인 메모입니다. `loadProject -> resolve -> fetch -> writeLockfile -> link`를 적고, 각 단계의 입력과 출력을 한 줄씩 붙여보세요. 이 작업을 하면 나중에 `devDependencies`나 semver를 넣을 위치가 훨씬 선명해집니다.

## 4주차: pnpm을 통해 store와 linker의 힘 이해하기

이번 주의 목적은 "패키지 매니저의 혁신이 꼭 resolver에서만 나오지 않는다"는 사실을 배우는 것입니다. `pnpm`은 많은 사람들이 속도 도구로 기억하지만, 유지보수자 관점에서 보면 핵심은 content-addressable store와 특이한 `node_modules` layout에 대한 강한 베팅이었습니다.

읽을 자료는 [pnpm GitHub README](https://github.com/pnpm/pnpm)와 [pnpm v1 announcement](https://medium.com/pnpm/pnpm-version-1-is-out-935a07af914)입니다. README는 저장소와 링크 전략의 핵심을 짧고 정확하게 설명하고, v1 발표 글은 왜 그 구조를 생태계와 호환되게 만드는 데 그렇게 오래 걸렸는지를 보여줍니다.

이 주차에서 독자가 특히 조심해야 할 부분은 "pnpm = 하드링크라서 빠름" 정도로만 요약해버리는 것입니다. 더 중요한 질문은 따로 있습니다. 왜 maintainer는 v1에서 store 구조, node_modules layout, lockfile format을 안정화 대상이라고 선언했을까요? 답은 간단합니다. 패키지 매니저가 믿을 만해지려면, 매번 눈에 보이는 CLI 기능보다 설치 결과를 결정하는 내부 계약이 먼저 굳어야 하기 때문입니다.

여기서 `pocpm`에 바로 연결되는 교훈도 나옵니다. 당신이 지금 당장 hoist나 global store를 구현하지 않더라도, "내 도구는 어떤 설치 결과를 약속하나"를 먼저 써야 합니다. 예를 들어 "`pocpm`은 hoist 없는 `node_modules`를 기본으로 삼고, workspace는 symlink로 연결한다" 같은 식의 문장이 있어야 나중에 변경이 breaking change인지 판단할 수 있습니다.

이번 주가 끝나면 아래를 설명할 수 있어야 합니다.

- pnpm은 왜 resolver보다 `store + linker` 쪽에서 차별화되었는가?
- 새로운 `node_modules` 구조를 도입하면 어떤 호환성 비용이 생기는가?
- 패키지 매니저에서 "v1 안정화"는 왜 CLI보다 내부 레이아웃 계약과 더 관련이 깊은가?

이번 주 산출물은 `pocpm`의 설치 계약 초안입니다. 10줄 안쪽이면 충분합니다. 예를 들면 "현재 `pocpm`은 exact npm version과 `workspace:*`만 지원한다", "lockfile은 아직 해석의 source of truth가 아니다", "설치 결과는 hoist 없는 `node_modules`다" 같은 식으로 적으면 됩니다.

## 5주차: Bun을 통해 채택 전략과 운영 UX 이해하기

이번 주의 목적은 패키지 매니저가 기술적으로 맞는 것만으로 채택되지 않는다는 점을 배우는 것입니다. `Bun`은 패키지 매니저만 따로 만든 프로젝트가 아니어서, 초반 전략이 pnpm과 꽤 달랐습니다. 그래서 "무엇을 먼저 구현하면 사람들이 실제로 써보게 되는가"를 생각하기에 좋습니다.

읽을 자료는 [bun install](https://bun.sh/docs/cli/install), [Isolated installs](https://bun.sh/docs/pm/isolated-installs), [Lockfile](https://bun.sh/docs/pm/lockfile)입니다. 여기서 핵심은 Bun이 처음부터 새로운 엄격한 설치 전략만 밀어붙이지 않았다는 점입니다. 공식 문서도 기존 프로젝트 호환성을 위해 `hoisted` 전략을 오래 보존하고, 새 워크스페이스에서는 `isolated`를 기본으로 삼는 식으로 전환했다고 설명합니다.

이 주차에서 배워야 할 전문성은 "기술적으로 더 깨끗한 모델"과 "지금 당장 갈아타기 쉬운 모델"을 구분하는 능력입니다. Bun은 이 둘을 한 번에 해결하려 하지 않았습니다. 먼저 drop-in replacement처럼 써볼 수 있게 만들고, 그 뒤에 stricter linker와 text lockfile, migration 같은 운영 UX를 강화해왔습니다.

`pocpm` 입장에서는 여기서 두 가지를 얻으면 충분합니다. 첫째, self-hosting이나 whole-repo migration은 기능이 아니라 채택 전략이라는 점입니다. 둘째, 호환성과 엄격성은 둘 다 필요하지만 순서를 잘못 잡으면 아무도 못 쓰는 도구가 된다는 점입니다.

이번 주가 끝나면 아래를 설명할 수 있어야 합니다.

- Bun은 왜 초기 채택을 위해 hoisted 호환성을 중요하게 다뤘는가?
- strict linker를 나중에 넣는 전략은 어떤 장점과 비용이 있는가?
- migration, text lockfile, `--frozen-lockfile` 같은 기능은 왜 단순 부가기능이 아닌가?

이번 주 산출물은 짧은 결정 메모입니다. 제목은 "`pocpm`은 pnpm식으로 갈까, Bun식으로 갈까?" 정도면 됩니다. 여기서 정답을 내릴 필요는 없고, 적어도 "`pocpm`의 다음 3개월은 linker 혁신보다 self-hosting과 reproducibility를 우선한다" 같은 운영 원칙 한 줄은 남겨두는 편이 좋습니다.

## 6주차: 형식 모델과 내 구현 계획 연결하기

마지막 주의 목적은 흩어진 감각을 다시 하나의 모델로 묶는 것입니다. 지금까지는 역사, 생태계 계약, 아키텍처, 실제 프로젝트 전략을 따로 봤다면, 이번 주는 "결국 dependency resolution이란 무엇인가"를 더 추상적으로 정리합니다.

읽을 자료는 [Package Managers à la Carte: A Formal Model of Dependency Resolution](https://arxiv.org/abs/2602.18602)입니다. 이 논문은 최신 자료라 읽기 부담이 있을 수 있지만, 처음부터 끝까지 세세하게 이해할 필요는 없습니다. 초반의 문제 정의와 abstract만 잘 읽어도 충분합니다. 중요한 포인트는 패키지 매니저마다 문법은 달라도, 의존성 해결의 핵심 semantics를 공통된 표현으로 잡아볼 수 있다는 발상입니다.

이 자료를 읽을 때는 "수학적으로 엄밀한가"보다 "내가 이미 본 resolver 문제를 더 작은 조각으로 말해주는가"를 보세요. 논문이 주는 실용적인 이익은 하나입니다. package manager를 만들다 보면 자꾸 구현 디테일이 본질처럼 느껴지는데, 형식 모델은 그 디테일 뒤에 있는 더 작은 문제를 드러내줍니다. 예를 들어 패키지 식별, 버전 제약, resolution, deployment를 서로 다른 문제로 생각하게 해줍니다.

이번 주가 끝나면 아래를 설명할 수 있어야 합니다.

- dependency resolution과 deployment는 왜 다른 단계인가?
- package manager마다 표면 문법이 달라도, 공통 semantics가 있다고 말할 수 있는 이유는 무엇인가?
- 지금의 `pocpm`에서 추상화로 남겨야 할 것과, 구현 디테일로 묶어둬도 되는 것은 무엇인가?

이번 주 산출물은 `pocpm`의 1.0 설계 메모 초안입니다. 아래 네 항목만 있어도 충분합니다.

- 1.0에서 보장할 계약
- 1.0에서 명시적으로 지원하지 않을 것
- 설치 파이프라인 단계와 각 단계의 입력/출력
- self-hosting에 도달하는 순서

## 6주를 끝낸 뒤의 체크리스트

이 커리큘럼을 다 따라왔다면, 이제는 자료를 더 읽기 전에 아래 다섯 문장을 막힘 없이 말할 수 있어야 합니다.

- 패키지 매니저는 원하는 상태를 받아서 실행 가능한 로컬 상태로 동기화하는 도구다.
- lockfile은 단순 캐시가 아니라 재현 가능한 해의 기록이다.
- resolver, store, linker를 분리해서 생각해야 디버깅과 진화가 쉬워진다.
- 호환성과 엄격성은 둘 다 중요하지만, 제품 단계에 따라 우선순위가 달라진다.
- `pocpm`의 다음 핵심 목표는 기능 추가가 아니라 self-hosting 가능한 최소 계약을 고정하는 것이다.

이 다섯 줄이 자연스럽게 나오면, 그다음부터는 문헌 조사가 아니라 구현의 시간입니다. 그때는 새 자료를 더 읽기보다, `pocpm`에서 하나씩 테스트를 추가하고 경계를 정리하는 편이 훨씬 빨리 배웁니다.
