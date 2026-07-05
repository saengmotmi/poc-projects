# Research: Rust FE tooling learning track

Date: 2026-07-05 21:03 KST

## Normal vs Current

- Normal behavior: TypeScript만 써본 프론트엔드 개발자가 Rust 기반 프론트엔드 툴링 코드를 읽고, 작은 CLI를 직접 만들며 학습 기록을 남길 수 있다.
- Current behavior: 이 저장소에는 `pocpm` 학습 문서와 POC 프로젝트는 있지만, Rust 학습/툴링 제작을 이어서 기록할 전용 트랙은 없다.

## Output Axes

- Input: TypeScript 경험, 프론트엔드 툴링에 대한 관심, `package.json`/TypeScript import 분석 같은 익숙한 문제.
- State: 저장소는 `docs/*`, `thoughts/*`, `projects/*`로 연구, 계획, POC를 분리해서 기록한다.
- Environment: 루트는 Yarn Berry 모노레포다. Rust POC는 Node workspace에 영향을 주지 않도록 독립 프로젝트로 둔다.
- Time: 학습은 하루 60~90분, 주 5일, 8주 단위로 반복 가능한 산출물을 만든다.

## Learning Science Observations

- 인출 연습(retrieval practice): Roediger & Karpicke(2006)는 다시 읽기보다 테스트/회상이 장기 기억에 유리하다는 결과를 보였다. Rust에서는 `cargo check` 전에 "이 코드가 컴파일될까?"를 먼저 예측한다.
- 간격 반복(distributed practice): Cepeda et al.(2006)은 복습 간격을 둔 연습이 몰아서 하는 연습보다 오래 간다고 정리했다. ownership/borrow 에러 카드는 1일, 3일, 7일 뒤 다시 푼다.
- worked example + fading: Sweller의 인지 부하 이론은 초보자가 완성 예제를 먼저 보고, 이후 점점 빈칸을 늘리는 방식이 유리하다고 본다. 처음에는 작은 Rust CLI 예제를 따라 치고, 다음 단계에서 함수/타입을 바꾼다.
- 의도적 연습(deliberate practice): Ericsson et al.(1993)은 약점을 좁게 잡고 즉각 피드백을 받는 연습을 강조했다. Rust에서는 `moved value`, `cannot borrow as mutable`, `borrowed value does not live long enough`처럼 에러 종류별로 연습한다.
- 교차 연습(interleaving): Rohrer & Taylor(2007)는 한 유형만 반복하기보다 관련 문제를 섞으면 전이가 좋아질 수 있음을 보였다. 파일 IO, JSON 파싱, iterator, 에러 처리를 한 CLI 안에서 섞는다.
- 맥락 기반 전이(contextualized transfer): 추상 문법보다 실제로 쓸 문제에서 배운 지식이 나중에 비슷한 작업으로 옮겨가기 쉽다. 그래서 주제를 `package.json`과 TypeScript import 분석으로 잡는다.

## MVP Scope

### Included

- Rust 학습을 위한 독립 문서 트랙.
- `fe-scan-rs` POC 프로젝트 홈.
- 매 학습 세션을 남길 수 있는 로그 템플릿.
- Rust 기반 FE tooling을 읽고 만들기 위한 8주 로드맵.

### Excluded

- 이번 변경에서 Rust 바이너리를 바로 구현하지 않는다.
- 이번 변경에서 루트 Yarn workspace에 Rust 프로젝트를 연결하지 않는다.
- lifetime, async Rust, macro, unsafe는 초반 범위에서 제외한다.

## First Divergence to Avoid

가장 피해야 할 첫 분기점은 Rust Book을 처음부터 끝까지 읽기만 하는 것이다. 이 방식은 피드백이 늦고, TypeScript 개발자가 당장 만날 프론트엔드 툴링 문제로 전이되기 어렵다.

첫 구현 주제는 `fe-scan-rs deps`로 둔다. 이 명령은 `package.json`을 읽고 dependency 목록을 출력한다. 익숙한 입력을 사용하므로 Rust의 어려운 부분을 ownership, `Result`, `serde`, iterator 같은 핵심 개념에 집중할 수 있다.
