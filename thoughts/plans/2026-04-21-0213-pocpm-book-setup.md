# Plan: pocpm 교재 설계 문서화

## 목표

`pocpm`을 기반으로 한 프로덕션 레벨 교재의 설계 문서를 저장소 안에 고정한다. 이번 작업의 목표는 본문 집필이 아니라, 책 단위의 기준선과 집필 계약을 먼저 명문화하는 것이다.

## 비목표

- 실제 장 본문 1개 이상을 완성본 수준으로 집필하지 않는다.
- 예제 코드 폴더를 새로 만들지 않는다.
- 기존 `pocpm` 구현 범위를 바꾸지 않는다.
- 커리큘럼 문서 자체를 전면 수정하지 않는다.

## 리스크 / 대응

- 리스크: 책 설계 문서가 기존 커리큘럼과 중복될 수 있다.
  - 대응: `README`에서 "가이드", "커리큘럼", "교재 설계"의 역할을 분리해 안내한다.
- 리스크: 독자상이 넓어지면 문서가 추상적으로 흐를 수 있다.
  - 대응: PRD에 독자상을 하나로 고정한다.
- 리스크: 장마다 톤이 흔들릴 수 있다.
  - 대응: 고정 장 템플릿과 집필 체크리스트를 둔다.

## 수용 기준 (DoD)

- `docs/book/BOOK_PRD.md`가 존재한다.
- `docs/book/TOC.md`가 존재한다.
- `docs/book/CHAPTER_TEMPLATE.md`가 존재한다.
- 세 문서가 서로의 역할을 명확히 나눈다.
- 루트 `README.md`에서 교재 설계 문서 진입 링크를 찾을 수 있다.
- `thoughts/research`와 `thoughts/plans`에 이번 작업의 아티팩트가 남는다.

## 검증 명령

```bash
test -f /Users/ohjongtaek/Desktop/dev/poc-projects/docs/book/BOOK_PRD.md
test -f /Users/ohjongtaek/Desktop/dev/poc-projects/docs/book/TOC.md
test -f /Users/ohjongtaek/Desktop/dev/poc-projects/docs/book/CHAPTER_TEMPLATE.md
rg -n "교재 설계|BOOK_PRD|CHAPTER_TEMPLATE|TOC" /Users/ohjongtaek/Desktop/dev/poc-projects/README.md /Users/ohjongtaek/Desktop/dev/poc-projects/docs/book
```

## Phase 1. 기준선 문서화

- [x] 현재 `docs`와 `pocpm` 구현 상태를 관측한다.
- [x] research 아티팩트에 관측만 기록한다.

성공 기준:

- 현재 문서/코드/독자상/갭이 research 문서에 정리되어 있다.

## Phase 2. 책 기획서 작성

- [x] `docs/book/BOOK_PRD.md`를 작성한다.
- [x] 북극성, 독자상, 약속, 비목표, 스토리 축, 교육 원칙을 고정한다.

성공 기준:

- 누가 읽는 책인지, 무엇을 배우는 책인지, 무엇을 일부러 다루지 않는지가 한 문서 안에 보인다.

## Phase 3. 전체 목차 작성

- [x] `docs/book/TOC.md`를 작성한다.
- [x] 파트/장 구조, 장별 핵심 질문, 장별 산출물, 장별 검증 포인트를 적는다.

성공 기준:

- 책 전체를 처음부터 끝까지 어떤 서사로 읽게 할지 보인다.

## Phase 4. 장 템플릿 작성

- [x] `docs/book/CHAPTER_TEMPLATE.md`를 작성한다.
- [x] 장 구조, reader-based prose 원칙, 개념 설명 박스, 구현/검증/회고 규칙을 고정한다.

성공 기준:

- 이후 장을 누가 쓰더라도 톤과 구조가 흔들리지 않을 최소 규격이 생긴다.

## Phase 5. 진입점 연결

- [x] 루트 `README.md`에 교재 설계 문서 링크를 추가한다.

성공 기준:

- 저장소에 처음 들어온 사람이 커리큘럼 문서와 교재 설계 문서를 구분해서 찾을 수 있다.

## 완료 후 다음 단계

1. `docs/book/ch01.md` 초안 집필
2. `docs/book/ch02.md` 초안 집필
3. `docs/book/ch03.md` 초안 집필
4. 장별 예제 폴더 전략 수립

## 검증 결과

- [x] `docs/book/BOOK_PRD.md` 존재 확인
- [x] `docs/book/TOC.md` 존재 확인
- [x] `docs/book/CHAPTER_TEMPLATE.md` 존재 확인
- [x] 루트 `README.md`에서 교재 설계 문서 링크 확인
