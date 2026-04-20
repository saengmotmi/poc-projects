# pocpm 학습 커리큘럼 입문 버전

이 문서는 "CS 베이스는 없지만 프론트엔드 개발은 해본 사람"을 위한 버전입니다.

핵심 방향은 하나입니다.

패키지 매니저를 역사나 추상화부터 배우지 않고, `Next.js`를 공부할 때 그랬던 것처럼 "가장 단순한 실행 모델"부터 이해합니다.

즉, 이 문서는 아래 순서로 갑니다.

1. 패키지 하나를 실제로 설치해 본다
2. 설치 결과를 디스크에서 뜯어본다
3. 그 과정을 손으로 재현해 본다
4. 그 손작업을 코드로 자동화한다

이 흐름을 따라가면 `resolver`, `linker`, `lockfile` 같은 말이 공중에 뜨지 않고, "내가 방금 만든 코드가 하는 일"로 바뀝니다.

## 이 문서의 사용법

매 주차는 항상 같은 형식으로 씁니다.

1. 항상 동작하는 상태
2. 이번 주에 추가되는 핵심 개념/구현
3. 왜 필요한가
4. implementation
5. 정리

이 형식을 고정하는 이유는, 매주 "지금 어디서 출발하는지"와 "이번 주에 정확히 뭐가 늘어나는지"가 보이게 하려는 것입니다.

## 먼저 알아둘 최소 용어

처음에는 아래 정도만 알고 있으면 충분합니다.

- 패키지: 설치 가능한 코드 묶음. 보통 npm 라이브러리 하나
- 의존성: 내가 직접 설치하려는 라이브러리
- 전이 의존성: 내 의존성이 또 필요로 하는 라이브러리
- registry: 패키지를 올려두는 창고. npm registry가 대표적
- tarball: 패키지를 압축한 파일
- lockfile: 이번 설치 결과를 기록한 파일
- `node_modules`: Node가 패키지를 찾는 설치 결과 폴더
- workspace: 모노레포 안의 로컬 패키지

모르는 말이 다시 나오면 이 정의로만 돌아와도 충분합니다.

## 시작하기 전에

이 입문 커리큘럼은 처음 몇 주 동안 `pocpm` 자체를 바로 읽기보다, 작은 샌드박스 폴더에서 실험해보는 방식으로 진행합니다.

추천 준비물:

- Node.js
- npm
- 빈 실험 폴더 하나

예시는 `dayjs`를 기준으로 설명합니다. 이유는 간단합니다.

- 유명한 라이브러리다
- 프론트엔드 개발자에게 익숙하다
- npm 페이지 기준으로 의존성이 없다

참고:

- [dayjs on npm](https://www.npmjs.com/package/dayjs)
- [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install/)

버전 번호는 시간이 지나면 달라질 수 있습니다. 이 문서에서 진짜 중요한 것은 특정 숫자가 아니라, 설치 결과의 구조입니다.

## 1주차: 패키지 하나 설치하고 결과를 눈으로 보기

### 항상 동작하는 상태

아직 `pocpm`은 손대지 않습니다.

이번 주에 항상 동작해야 하는 것은 이것뿐입니다.

- 빈 폴더에서 `npm init -y`가 된다
- `npm install dayjs`가 된다
- 설치가 끝나면 `package.json`, `package-lock.json`, `node_modules/dayjs`가 생긴다

### 이번 주에 추가되는 핵심 개념/구현

이번 주 핵심은 구현보다 관찰입니다.

- `package.json`은 무엇을 원한다고 적는 파일인가
- `package-lock.json`은 실제로 무엇이 설치됐다고 적는 파일인가
- `node_modules/dayjs`는 최종 설치 결과로서 어떤 의미를 가지는가

구현은 아주 작게 갑니다.

- lockfile과 installed package를 읽어서 출력하는 작은 inspection script 하나

### 왜 필요한가

`Next.js`를 처음 배울 때 SSR의 추상 개념부터 외운 게 아니라, "서버가 HTML을 응답한다"는 사실을 먼저 눈으로 확인했기 때문에 다음 단계가 쉬웠을 겁니다.

패키지 매니저도 똑같습니다.

처음부터 `resolver`, `store`, `linker`를 외우면 어렵습니다.  
대신 먼저 "설치 결과로 실제 무슨 파일이 생기나"를 보면 훨씬 쉬워집니다.

이번 주의 목표는 이 한 문장을 몸으로 이해하는 것입니다.

**패키지 매니저는 결국 `node_modules`와 lockfile을 만들어내는 프로그램이다.**

### implementation

실험용 폴더를 만들고 아래를 실행합니다.

```bash
mkdir pm-week1
cd pm-week1
npm init -y
npm install dayjs
```

그다음 아래 세 파일을 읽어봅니다.

- `package.json`
- `package-lock.json`
- `node_modules/dayjs/package.json`

관찰 포인트는 이 세 가지입니다.

1. `package.json`

- `dependencies.dayjs`가 추가된다
- 여기에는 보통 exact version이 아니라 range가 적힌다

2. `package-lock.json`

- 루트 패키지와 `node_modules/dayjs`가 기록된다
- 정확한 버전이 적힌다
- tarball URL과 integrity hash가 적힌다

3. `node_modules/dayjs/package.json`

- 실제로 설치된 패키지의 이름과 버전이 있다
- `main`, `types`, `scripts` 같은 메타데이터가 있다

여기서 아주 작은 inspection script를 하나 만들어도 좋습니다.

예시:

```js
// inspect-lockfile.mjs
import fs from "node:fs/promises";

const lockfile = JSON.parse(await fs.readFile("./package-lock.json", "utf8"));

console.log("lockfileVersion:", lockfile.lockfileVersion);
console.log("packages:", Object.keys(lockfile.packages));
console.log("dayjs:", lockfile.packages["node_modules/dayjs"]);
```

실행:

```bash
node inspect-lockfile.mjs
```

이 스크립트는 패키지 매니저는 아니지만, "설치 결과를 읽는 작은 도구"입니다. 이게 첫 구현입니다.

### 정리

이번 주가 끝나면 아래를 말할 수 있으면 충분합니다.

- `package.json`은 주문서에 가깝다
- lockfile은 영수증에 가깝다
- `node_modules`는 최종 산출물이다

이번 주의 한 줄 요약:

**설치를 이해하려면 먼저 설치 결과를 디스크에서 읽을 수 있어야 한다.**

## 2주차: tarball을 직접 받아서 풀어보기

### 항상 동작하는 상태

1주차에서 한 실험은 항상 다시 재현할 수 있어야 합니다.

- `npm install dayjs`가 된다
- `package-lock.json`에서 `resolved` URL을 찾을 수 있다
- `node_modules/dayjs`가 어떤 파일 구조인지 볼 수 있다

### 이번 주에 추가되는 핵심 개념/구현

이번 주에 추가되는 핵심은 이겁니다.

- npm install은 마법이 아니라 tarball 다운로드 + 압축 해제 + 배치다

구현은 아래 둘 중 하나면 충분합니다.

- tarball을 다운로드하는 스크립트
- tarball을 다운로드해서 풀어보는 스크립트

### 왜 필요한가

패키지 매니저를 처음 만들 때 제일 좋은 착시는 "엄청 복잡한 알고리즘이 먼저 있을 것 같다"는 겁니다.

하지만 실제로 가장 먼저 보이는 일은 훨씬 단순합니다.

- 주소를 알아낸다
- 파일을 받는다
- 압축을 푼다
- 폴더를 놓는다

이 단순한 흐름을 손으로 한 번 재현해봐야, 나중에 `fetch`와 `link`를 코드로 분리하는 이유가 자연스럽게 들어옵니다.

### implementation

이번 주에는 `package-lock.json`의 `resolved` 값을 그대로 써도 좋고, registry metadata를 직접 조회해도 좋습니다. 입문 버전에서는 먼저 lockfile의 URL을 그대로 쓰는 편이 더 쉽습니다.

예시 스크립트:

```js
// fetch-and-unpack.mjs
import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import { pipeline } from "node:stream/promises";
import tar from "tar";

const lockfile = JSON.parse(await fs.readFile("./package-lock.json", "utf8"));
const resolved = lockfile.packages["node_modules/dayjs"].resolved;

await fs.mkdir("./tmp", { recursive: true });

const tgzPath = path.resolve("./tmp/dayjs.tgz");

await new Promise((resolve, reject) => {
  https.get(resolved, response => {
    if (response.statusCode !== 200) {
      reject(new Error(`Failed: ${response.statusCode}`));
      return;
    }

    pipeline(response, fs.open(tgzPath, "w").then(file => file.createWriteStream()))
      .then(resolve)
      .catch(reject);
  }).on("error", reject);
});

await fs.mkdir("./tmp/dayjs", { recursive: true });
await tar.x({
  file: tgzPath,
  cwd: "./tmp/dayjs",
  strip: 1
});

console.log("unpacked:", path.resolve("./tmp/dayjs"));
```

실행 후엔 아래를 비교해보세요.

- `tmp/dayjs`
- `node_modules/dayjs`

완전히 같을 필요는 없지만, "아 설치는 진짜로 압축 파일을 받아서 푸는 거구나"가 보여야 합니다.

### 정리

이번 주가 끝나면 아래를 이해하면 충분합니다.

- registry에는 패키지 메타데이터와 tarball이 있다
- 설치는 결국 tarball을 받아서 디스크에 풀어놓는 일이다

이번 주의 한 줄 요약:

**패키지 설치의 본체는 먼저 '받기'와 '풀기'다.**

## 3주차: exact version 하나를 설치하는 최소 설치기 만들기

### 항상 동작하는 상태

2주차까지의 작업으로 아래는 항상 재현 가능해야 합니다.

- tarball URL을 찾을 수 있다
- tarball을 받을 수 있다
- tarball을 원하는 폴더에 풀 수 있다

### 이번 주에 추가되는 핵심 개념/구현

이번 주부터 진짜 패키지 매니저다운 구현이 시작됩니다.

핵심은 딱 하나입니다.

- 루트 `package.json`의 dependency 하나를 읽어서 `node_modules/<name>`에 설치하기

이번 주에 도입할 개념은 최소한만 갑니다.

- manifest 읽기
- exact version
- install result 만들기

### 왜 필요한가

여기서부터는 inspection tool이 아니라 installer가 됩니다.

`Next.js`에서 "HTML을 응답하는 서버"를 처음 만들었을 때 비로소 SSR의 출발점이 생긴 것처럼,

패키지 매니저도 이 순간부터 출발점이 생깁니다.

즉, 이번 주의 목표는 이 문장입니다.

**"dayjs 하나를 설치할 수 있으면, 패키지 매니저의 최소 골격은 생긴다."**

### implementation

이번 주 구현 범위는 일부러 좁게 잡습니다.

- `dependencies`만 본다
- 첫 번째 dependency만 본다
- exact version만 지원한다
- 전이 의존성은 아직 안 본다

입력 예시는 이렇게 맞추면 좋습니다.

```json
{
  "dependencies": {
    "dayjs": "1.11.20"
  }
}
```

구현 단계:

1. `package.json` 읽기
2. package name / version 뽑기
3. registry metadata 조회
4. tarball URL 찾기
5. `node_modules/dayjs` 생성
6. 압축 해제

이 시점에 "최소 설치기"라는 이름으로 파일을 하나 만들어보세요.

예시 이름:

- `install-one.mjs`

완료 기준:

- `node install-one.mjs` 실행 후 `node_modules/dayjs/package.json`이 존재한다

이 단계에선 아직 lockfile도 쓰지 않아도 됩니다. 이번 주 목표는 설치 결과를 자동으로 만드는 것 하나뿐입니다.

### 정리

이번 주가 끝나면 아래를 구분할 수 있어야 합니다.

- 원하는 것을 읽는 단계
- 패키지를 찾는 단계
- 설치 결과를 만드는 단계

이번 주의 한 줄 요약:

**최소 패키지 매니저는 "package.json 하나 읽고 node_modules 하나 만드는 프로그램"이다.**

## 4주차: 전이 의존성을 추가해서 진짜 트리로 만들기

### 항상 동작하는 상태

3주차 최소 설치기는 아래를 보장해야 합니다.

- exact version 하나를 설치할 수 있다
- `node_modules/<name>`을 만들 수 있다

### 이번 주에 추가되는 핵심 개념/구현

이번 주엔 드디어 dependency tree가 등장합니다.

- 내가 설치한 패키지가 또 다른 패키지를 필요로할 수 있다
- 설치는 한 단계가 아니라 재귀적으로 일어난다

### 왜 필요한가

패키지 매니저가 어려워지는 진짜 이유는 direct dependency가 아닙니다.

어려운 지점은 이겁니다.

- 나는 `A` 하나를 원했는데
- `A`가 `B`, `C`를 원하고
- `B`가 또 `D`를 원한다

즉, 사용자는 보통 한 줄만 적지만, 설치기는 트리를 만들어야 합니다.

여기서 처음으로 "아, 이게 graph 문제처럼 보이는 이유가 있구나"가 자연스럽게 들어옵니다.

### implementation

이번 주에는 의존성이 있는 작은 패키지 fixture를 쓰는 편이 좋습니다. 유명 패키지로 바로 가도 되지만, 입문 단계에선 fixture가 더 통제하기 쉽습니다.

예를 들면:

- `app` depends on `foo`
- `foo` depends on `bar`

이번 주 구현 범위:

1. 현재 패키지의 dependency 목록 읽기
2. 각 dependency를 다시 resolve/fetch/install
3. 현재 패키지 아래 `node_modules`에 재귀적으로 배치

완료 기준:

- `foo`를 설치하면 `foo/node_modules/bar`까지 생긴다

이 시점에야 "전이 의존성"이라는 말이 몸에 들어옵니다.

### 정리

이번 주의 핵심은 이겁니다.

- direct dependency는 시작점일 뿐이다
- 설치기는 dependency tree 전체를 물질화해야 한다

이번 주의 한 줄 요약:

**패키지 매니저는 한 패키지를 설치하는 도구가 아니라, 의존성 트리를 설치하는 도구다.**

## 5주차: lockfile을 쓰고 다시 읽기

### 항상 동작하는 상태

4주차가 끝났다면 아래는 항상 되어야 합니다.

- direct dependency 설치
- transitive dependency 설치
- 디스크에 재귀 구조 생성

### 이번 주에 추가되는 핵심 개념/구현

이번 주 핵심은 reproducibility입니다.

- 이번에 설치한 결과를 기록한다
- 다음 설치 때 같은 결과를 재사용한다

### 왜 필요한가

lockfile은 입문자에게 제일 추상적으로 들리는 개념 중 하나입니다.  
하지만 실제 필요성은 단순합니다.

- 어제는 잘 됐는데 오늘은 다른 버전이 깔릴 수 있다
- 팀원과 CI가 서로 다른 결과를 가질 수 있다

즉, lockfile은 부가기능이 아니라 "이번에 성공한 해를 다시 꺼내 쓰기 위한 기록"입니다.

### implementation

이번 주 구현은 최소한으로 갑니다.

1. resolve 결과를 JSON으로 저장
2. 다음 설치 시 이 파일이 있으면 우선 읽기
3. manifest와 충돌하지 않으면 lockfile 기준으로 설치

완료 기준:

- 첫 install 후 lockfile이 생긴다
- 두 번째 install이 같은 버전 결과를 재현한다

이제부터는 비로소 아래 문장을 이해할 수 있습니다.

- `package.json`은 허용 범위
- lockfile은 구체적 결과

### 정리

이번 주의 한 줄 요약:

**lockfile은 "이번에 성공한 설치 결과"를 다시 쓰기 위한 메모다.**

## 6주차: workspace와 로컬 패키지 연결

### 항상 동작하는 상태

5주차가 끝났다면 아래는 항상 되어야 합니다.

- registry 패키지를 설치할 수 있다
- 전이 의존성을 설치할 수 있다
- lockfile을 쓰고 읽을 수 있다

### 이번 주에 추가되는 핵심 개념/구현

이번 주 핵심은 로컬 패키지입니다.

- 모든 의존성이 npm registry에 있는 건 아니다
- 모노레포에서는 로컬 패키지를 dependency처럼 다뤄야 한다

### 왜 필요한가

여기서 `pocpm`이 당신의 실제 프로젝트와 연결되기 시작합니다.

모노레포에서는 이런 일이 흔합니다.

- `projects/web`가
- `packages/ui`를 의존한다

이걸 매번 tarball처럼 받는 게 아니라, 로컬 폴더를 연결해야 합니다.

즉 workspace는 "레지스트리에서 받는 패키지"와 "내 옆 폴더의 패키지"를 같은 설치 모델 안에 넣는 문제입니다.

### implementation

이번 주 구현 범위:

1. 루트 `workspaces` 읽기
2. `workspace:*` dependency 찾기
3. 해당 로컬 폴더를 `node_modules`에 symlink 연결

완료 기준:

- workspace 패키지가 registry 대신 로컬 폴더로 연결된다

이 단계까지 오면 `pocpm`은 학습용 toy를 넘어, 실제 모노레포 감각에 닿기 시작합니다.

### 정리

이번 주의 한 줄 요약:

**workspace는 "로컬 폴더도 패키지처럼 설치할 수 있게 만드는 규칙"이다.**

## 6주를 끝낸 뒤에 남아야 하는 감각

이 커리큘럼이 끝났다면 아래 감각이 남아 있어야 합니다.

- 패키지 매니저는 설치 결과를 디스크에 만드는 프로그램이다
- 설치는 `정하기 -> 받기 -> 놓기 -> 기록하기`의 흐름으로 볼 수 있다
- direct dependency보다 transitive dependency부터 진짜 어려움이 시작된다
- lockfile은 결과를 다시 쓰기 위한 기록이다
- workspace는 로컬 패키지를 같은 모델 안에 넣는 방식이다

여기까지 오면, 그다음부터는 `pnpm`, `Bun`, `Yarn`, `Nix`를 읽을 때도 추상어가 덜 무섭습니다. 이제는 그 도구들이 "무슨 새로운 마법을 썼는가"가 아니라, **같은 문제를 어디서 다르게 풀었는가**로 보이기 시작할 겁니다.

## 다음 단계

이제야 비로소 비교 문서를 읽을 준비가 됩니다.

추천 순서:

1. [pocpm-reader-guide.md](./pocpm-reader-guide.md)
2. [pocpm-study-curriculum.md](./pocpm-study-curriculum.md)

즉, 입문 버전으로 몸에 넣고, 그다음 개념 중심 문서로 올라가는 흐름이 좋습니다.
