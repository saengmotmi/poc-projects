# Research: pocpm 교재 설계 기준선

## 범위 고정

- 정상동작: 이 저장소에는 `pocpm`의 현재 상태를 설명하는 안내 문서와, implementation-first 입문 커리큘럼 문서가 이미 있다.
- 현재동작: 아직 "일반적인 개발 서적처럼 읽히는 프로덕션 레벨 교재"를 위한 책 단위 설계 문서, 목차 체계, 장 템플릿은 없다.

## Output = f(Input, State, Environment, Time)

- Input
  - 현재 `pocpm` 소스 코드
  - 현재 `docs` 아래의 세 문서
  - 사용자의 독자상: CS 베이스는 약하지만 프론트엔드 실무 경험은 있음
- State
  - 루트 README는 현재 `pocpm` 관련 문서 링크를 포함한다.
  - `docs/book` 디렉터리는 아직 없다.
  - 워킹트리에는 `README.md`, `docs/pocpm-study-curriculum-beginner.md`, `docs/pocpm-study-curriculum.md` 변경이 반영된 상태다.
- Environment
  - 저장소의 공식 패키지 매니저는 아직 Yarn이다.
  - `pocpm`은 학습용 최소 패키지 매니저로 저장소 내부에 존재한다.
  - 현재 작업은 코드 실행 경로보다 Markdown 문서 체계 설계가 중심이다.
- Time
  - 외부 레퍼런스의 버전/URL은 시간이 지나면 바뀔 수 있다.
  - `pocpm` 구현 범위가 바뀌면 교재의 약속 범위도 함께 조정되어야 한다.

## 현재 문서 자산 관측

### 루트 문서

- [README.md](../../README.md)
  - 저장소 소개
  - 현재 공식 패키지 매니저가 Yarn이라는 설명
  - `pocpm` 관련 문서 링크

### `pocpm` 설명 문서

- [docs/pocpm-reader-guide.md](../../docs/pocpm-reader-guide.md)
  - `pocpm`의 존재 이유
  - 현재 지원 범위 / 비지원 범위
  - 코드 읽기 순서
  - 테스트가 무엇을 보장하는지

- [docs/pocpm-study-curriculum-beginner.md](../../docs/pocpm-study-curriculum-beginner.md)
  - 입문 독자상 기준
  - implementation-first 학습 흐름
  - `dayjs` 설치 관찰에서 출발
  - 주차별 고정 템플릿 사용

- [docs/pocpm-study-curriculum.md](../../docs/pocpm-study-curriculum.md)
  - 개념 중심의 6주 커리큘럼
  - 역사/계약/아키텍처/비교 관점 포함

## 현재 `pocpm` 구현 관측

- [packages/pocpm/src/index.ts](../../packages/pocpm/src/index.ts)
  - `loadProject -> resolve -> fetch -> writeLockfile -> link` 흐름

- [packages/pocpm/src/resolve.ts](../../packages/pocpm/src/resolve.ts)
  - exact npm version
  - `workspace:*`
  - registry metadata 조회

- [packages/pocpm/src/link.ts](../../packages/pocpm/src/link.ts)
  - hoist 없는 `node_modules`
  - workspace symlink
  - `.bin` 생성

- [packages/pocpm/src/pocpm.test.ts](../../packages/pocpm/src/pocpm.test.ts)
  - 설치/lockfile/cache/workspace/.bin/script 실행 검증

## 현재 문서 톤과 제약 관측

- 현재 문서는 모두 한국어로 작성되어 있다.
- 현재 문서는 reader-based prose 방향을 이미 일부 반영하고 있다.
- 입문 버전은 학습 흐름을 제시하지만, "책 단위 구조", "장 단위 규격", "집필 원칙", "실전 교재 산출물 구조"는 아직 없다.
- 현재 문서들은 커리큘럼/가이드 성격이 강하고, 개발 서적의 전형적인 장 구성 규칙까지는 고정하지 않았다.

## 관측된 갭

- 책 전체를 관통하는 한 줄 설명이 아직 없다.
- 파트/장 수준 목차가 없다.
- 각 장이 따라야 할 고정 템플릿이 없다.
- 장별 산출물과 검증 방식이 책 수준으로 표준화되어 있지 않다.
- 교재 설계와 기존 커리큘럼 문서의 관계를 설명하는 진입 문서가 없다.
