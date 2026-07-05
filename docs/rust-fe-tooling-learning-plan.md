# Rust FE tooling 학습 계획

이 문서는 TypeScript만 써본 프론트엔드 개발자가 Rust를 가장 실용적으로 익히기 위한 학습 계획입니다.

목표는 Rust 전문가가 되는 것이 아닙니다. 목표는 아래 두 가지입니다.

1. Rust로 작성된 프론트엔드 툴링 코드를 겁먹지 않고 읽는다.
2. `package.json`과 TypeScript 파일을 분석하는 작은 CLI를 직접 만든다.

첫 프로젝트는 [`projects/fe-scan-rs`](../projects/fe-scan-rs/README.md)입니다.

## 완료 기준

8주 뒤에 아래 상태가 되면 성공입니다.

- `cargo` 프로젝트 구조를 이해한다.
- `Result`, `Option`, `enum`, `match`, `trait`를 읽고 쓴다.
- ownership/borrow 에러의 원인을 대략 설명한다.
- `serde`, `clap`, `walkdir`, `anyhow` 같은 실전 crate를 사용한다.
- `package.json` dependency와 TypeScript import를 분석하는 CLI를 만든다.
- SWC, Oxc, Biome 같은 Rust 기반 FE tooling 코드에서 큰 흐름을 따라간다.

## 학습 원칙

### 1. 읽기보다 먼저 예측한다

Rust는 컴파일러 피드백이 강합니다. 그래서 학습 루프를 이렇게 잡습니다.

1. 코드를 작성한다.
2. `cargo check` 전에 컴파일 여부를 예측한다.
3. 실제 에러를 본다.
4. 예측과 다른 지점을 로그에 남긴다.

이 방식은 인출 연습입니다. 다시 읽는 것보다 기억에서 꺼내는 연습이 장기 기억에 유리합니다.

### 2. ownership 에러는 카드로 남긴다

ownership/borrow 문제는 한 번에 끝나지 않습니다. 에러를 아래 형식으로 남기고 1일, 3일, 7일 뒤 다시 풉니다.

```txt
에러: value borrowed here after move
상황: String을 함수에 넘긴 뒤 다시 출력했다
내 예측: 함수 호출 뒤에도 a를 쓸 수 있다고 생각했다
실제 원인: String ownership이 함수로 move됐다
수정: 함수 인자를 &str로 바꿨다
다음 복습: 2026-07-08
```

### 3. 완성 예제를 먼저 보고 점점 가린다

초반에는 예제를 베껴도 됩니다. 대신 두 번째 반복부터는 아래처럼 가립니다.

- 1회차: 예제를 그대로 실행한다.
- 2회차: 함수 이름과 타입을 바꾼다.
- 3회차: 에러 처리를 직접 쓴다.
- 4회차: 테스트를 먼저 쓰고 구현한다.

초보 단계에서는 빈 화면에서 시작하는 것보다 완성 예제에서 일부를 바꾸는 편이 인지 부하가 낮습니다.

### 4. 문법만 따로 외우지 않는다

문법은 `fe-scan-rs` 안에서 익힙니다.

- JSON 파싱을 하며 `serde`와 `Result`를 배운다.
- 파일 탐색을 하며 iterator와 closure를 배운다.
- import 분석을 하며 `String`, `&str`, `Vec<String>`을 배운다.
- AST 파싱을 하며 `enum`, `match`, reference를 읽는다.

## 8주 로드맵

### 0주차: 저장소에 학습 트랙 만들기

항상 동작하는 상태:

- 학습 계획이 문서로 있다.
- `fe-scan-rs` 프로젝트 홈이 있다.
- 세션 로그 템플릿이 있다.

산출물:

- 이 문서
- [`projects/fe-scan-rs/README.md`](../projects/fe-scan-rs/README.md)
- [`projects/fe-scan-rs/learning-log/TEMPLATE.md`](../projects/fe-scan-rs/learning-log/TEMPLATE.md)

### 1주차: TypeScript와 Rust의 값 모델 비교

핵심 질문:

- `let`과 `mut`는 TypeScript 변수 선언과 어떻게 다른가?
- `struct`와 `enum`은 TypeScript object/discriminated union과 어떻게 대응되는가?
- `String`과 `&str`은 언제 다르게 쓰는가?

연습:

- TypeScript discriminated union을 Rust `enum`으로 옮긴다.
- `package.json` dependency 한 줄을 Rust struct로 표현한다.
- 작은 변환 함수에 테스트를 붙인다.

### 2주차: ownership과 borrow 집중 훈련

핵심 질문:

- 값이 언제 move되는가?
- 언제 `&T`를 넘기고, 언제 `T`를 넘기는가?
- `.clone()`은 언제 학습용으로 허용하고, 언제 피해야 하는가?

연습:

- 매일 ownership 컴파일 에러 1개를 예측하고 고친다.
- 같은 문제를 `clone`, immutable borrow, mutable borrow 방식으로 각각 고친다.
- 에러 카드를 학습 로그에 남긴다.

### 3주차: `fe-scan-rs deps` 만들기

목표:

```bash
fe-scan deps
```

예상 출력:

```txt
react 18.2.0
vite 5.0.0
typescript 5.4.0
```

배울 것:

- `clap`으로 CLI 인자를 읽는다.
- `serde_json`으로 `package.json`을 읽는다.
- `anyhow`와 `?`로 에러를 전파한다.
- `Result<T, E>`를 함수 시그니처에 드러낸다.

### 4주차: workspace와 파일 시스템 탐색

목표:

```bash
fe-scan deps --workspace
```

기능:

- 하위 폴더에서 `package.json`을 찾는다.
- `node_modules`, `.git`, `dist`는 제외한다.
- 테스트에서는 임시 폴더를 만든다.

배울 것:

- `walkdir`
- iterator와 closure
- 테스트 가능한 함수 분리

### 5주차: TypeScript import 분석

목표:

```bash
fe-scan imports src
```

처음에는 라인 기반 분석으로 충분합니다.

```ts
import React from "react";
import { Button } from "@acme/ui";
```

예상 출력:

```txt
react
@acme/ui
```

배울 것:

- `.ts`, `.tsx` 파일 필터링
- 문자열 처리
- `Vec<String>`과 iterator 변환
- 테스트 케이스 설계

### 6주차: parser와 AST 맛보기

목표:

- `oxc_parser` 또는 `swc_ecma_parser`로 파일을 파싱한다.
- import declaration만 뽑는다.
- 라인 기반 분석과 parser 기반 분석의 차이를 기록한다.

주의:

- parser 내부 구현을 깊게 파지 않는다.
- 목적은 Rust 코드에서 AST 타입, `enum`, `match`가 어떻게 쓰이는지 읽는 것이다.

### 7주차: 실제 코드 읽기

대상 후보:

- Oxc
- SWC
- Biome
- Lightning CSS

방법:

1. README를 읽는다.
2. `crates/*` 구조를 본다.
3. `Result`, `enum`, `trait`가 많이 나오는 파일 하나를 고른다.
4. 30분 동안 모르는 것보다 알아본 것을 적는다.

성공 기준:

```txt
이 함수는 파일을 받아 AST를 만들고,
에러가 있으면 Result로 반환하고,
성공하면 diagnostics와 함께 결과를 넘긴다.
```

이 정도로 설명할 수 있으면 충분합니다.

### 8주차: 작은 배포물로 마무리

목표 명령:

```bash
fe-scan deps
fe-scan imports src
fe-scan unused-deps
```

완료 기준:

- `cargo test` 통과
- `cargo clippy` 통과
- README에 예제 입력/출력 추가
- 학습 로그에 before/after 기록

## 매일 60분 루프

1. 5분: 어제 코드를 안 보고 설명한다.
2. 10분: 오늘 만날 개념 하나를 예제로 확인한다.
3. 30분: `fe-scan-rs`에 작은 기능 하나를 추가한다.
4. 10분: 컴파일 에러 또는 설계 결정을 로그에 남긴다.
5. 5분: 다음 복습 날짜를 정한다.

## 피할 것

- Rust Book을 처음부터 끝까지 읽기만 하기.
- lifetime을 첫 주부터 깊게 파기.
- async Rust부터 시작하기.
- borrow checker가 막을 때마다 무조건 `.clone()`으로 덮기.
- macro, unsafe, compiler internals를 초반에 건드리기.

## 참고 근거

- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning.
- Cepeda, N. J. et al. (2006). Distributed practice in verbal recall tasks.
- Sweller, J. (1988). Cognitive load during problem solving.
- Ericsson, K. A. et al. (1993). The role of deliberate practice.
- Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning.
