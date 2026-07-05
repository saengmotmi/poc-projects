# fe-scan-rs

`fe-scan-rs`는 Rust로 프론트엔드 툴링을 배우기 위한 POC입니다.

이 프로젝트의 목적은 작은 CLI를 만들면서 Rust의 핵심 개념을 실제 프론트엔드 문제에 연결하는 것입니다.

첫 번째 목표는 이것입니다.

```bash
fe-scan deps
```

이 명령은 현재 폴더의 `package.json`을 읽고 dependencies/devDependencies 목록을 출력합니다.

## 현재 상태

- 현재는 학습/제작 기록을 시작하기 위한 문서 단계입니다.
- Rust 구현은 다음 PR에서 `cargo check`와 `cargo test`를 검증할 수 있을 때 추가합니다.
- 루트 Yarn workspace에는 아직 연결하지 않습니다.

## 만들 기능

### 1단계: dependency 출력

```bash
fe-scan deps
```

입력:

```json
{
  "dependencies": {
    "react": "18.2.0"
  },
  "devDependencies": {
    "vite": "5.0.0"
  }
}
```

출력:

```txt
react 18.2.0
vite 5.0.0
```

### 2단계: workspace 탐색

```bash
fe-scan deps --workspace
```

규칙:

- 하위 폴더의 `package.json`을 찾는다.
- `node_modules`, `.git`, `dist`는 제외한다.
- 같은 dependency가 여러 번 나오면 package 위치와 함께 보여준다.

### 3단계: TypeScript import 분석

```bash
fe-scan imports src
```

예상 출력:

```txt
react
@acme/ui
```

### 4단계: 사용하지 않는 dependency 후보 찾기

```bash
fe-scan unused-deps
```

초기 버전은 완벽한 lint rule이 아니라 "후보"만 출력합니다.

## 배울 Rust 개념

| 기능 | Rust 개념 |
| --- | --- |
| CLI 인자 처리 | `clap`, `struct`, derive macro |
| `package.json` 읽기 | `serde`, `Result`, `?` |
| 폴더 탐색 | iterator, closure, ownership |
| import 문자열 처리 | `String`, `&str`, `Vec<String>` |
| AST 파싱 | `enum`, `match`, reference |
| 테스트 | `cargo test`, fixture, `tempfile` |

## 학습 기록 규칙

학습 세션은 [`learning-log/TEMPLATE.md`](./learning-log/TEMPLATE.md)를 복사해서 남깁니다.

현재 로그:

- [2026-07-05 week 0: Rust FE tooling 트랙 시작](./learning-log/2026-07-05-week-0.md)
- [2026-07-05 day 1: ownership/borrow 첫 감각](./learning-log/2026-07-05-day-1-ownership-borrowing.md)

각 로그는 아래 네 가지를 반드시 포함합니다.

1. 오늘의 정상 동작과 현재 동작
2. 컴파일/테스트 전에 한 예측
3. 실제 피드백과 첫 분기점
4. 다음 복습 날짜

## 관련 문서

- [Rust FE tooling 학습 계획](../../docs/rust-fe-tooling-learning-plan.md)
- [Research: Rust FE tooling learning track](../../thoughts/research/2026-07-05-2103-rust-fe-tooling-learning.md)
- [Plan: Rust FE tooling learning track](../../thoughts/plans/2026-07-05-2103-rust-fe-tooling-learning.md)
