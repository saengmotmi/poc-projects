# `pocpm` 교재 전체 목차

이 목차는 "독자가 무엇을 읽고 어떤 상태로 다음 장으로 넘어가야 하는가"가 보이도록 작성합니다. 각 장은 질문, 핵심 산출물, 검증 포인트를 함께 적습니다.

## Part 1. 설치 결과를 눈으로 보기

### Chapter 1. 패키지 하나 설치하면 실제로 무슨 일이 일어날까

- 핵심 질문: `npm install dayjs` 뒤에 디스크에는 정확히 무엇이 생길까?
- 스토리: 패키지 매니저를 매일 쓰지만, 결과물을 제대로 본 적이 없는 프론트엔드 개발자
- 핵심 개념: `package.json`, `package-lock.json`, `node_modules`
- 산출물: `import "dayjs"`의 도착 경로를 추적하는 tracing script
- 검증: 패키지 이름 import가 `node_modules` 안의 실제 파일로 이어짐을 출력으로 확인할 수 있다

### Chapter 2. 설치는 왜 tarball을 중심으로 돌아갈까

- 핵심 질문: 패키지는 어떻게 registry에서 내 디스크로 오나?
- 스토리: lockfile의 `resolved` URL을 보고 직접 파일을 받아보는 실험
- 핵심 개념: `resolved` URL, tarball, integrity
- 산출물: tarball 다운로드 + 압축 해제 스크립트
- 검증: unpacked 폴더와 installed package 폴더를 비교할 수 있다

### Chapter 3. lockfile은 왜 존재할까

- 핵심 질문: `package.json`만 있으면 안 되나?
- 스토리: 어제와 오늘 설치 결과가 달라질 수 있는 팀 프로젝트
- 핵심 개념: range, exact version, 재현 가능성
- 산출물: manifest와 lockfile 비교 스크립트
- 검증: `package.json`의 범위와 lockfile의 정확한 설치 결과를 나란히 설명할 수 있다

## Part 2. 최소 설치기 만들기

### Chapter 4. exact version 하나를 설치하는 첫 설치기

- 핵심 질문: 패키지 매니저의 최소 골격은 어디서 시작할까?
- 스토리: `dayjs` 하나만 자동으로 설치해도 패키지 매니저라고 부를 수 있을까
- 핵심 개념: manifest 읽기, one-package install
- 산출물: `install-one` 스크립트
- 검증: `node_modules/dayjs/package.json`이 생성된다

### Chapter 5. 패키지 메타데이터는 어떻게 설치 결정을 돕나

- 핵심 질문: tarball URL은 어디서 오고, 어떤 정보가 같이 오나?
- 스토리: registry 응답에서 설치에 필요한 최소 필드만 추려내기
- 핵심 개념: package metadata, dist info, dependencies field
- 산출물: registry metadata parser
- 검증: name/version/dist/dependencies를 안정적으로 뽑을 수 있다

### Chapter 6. 전이 의존성이 등장하면 무엇이 달라질까

- 핵심 질문: 내가 설치한 패키지가 또 다른 패키지를 필요로하면 어떻게 할까?
- 스토리: direct dependency 하나에서 dependency tree로 넘어가는 순간
- 핵심 개념: transitive dependency, recursive install
- 산출물: 재귀 설치 로직
- 검증: fixture 패키지 트리가 디스크에 재현된다

### Chapter 7. 설치 결과를 기록하는 첫 lockfile

- 핵심 질문: 지금 성공한 설치 결과를 어떻게 다시 꺼내 쓸까?
- 스토리: 같은 설치를 다시 돌려도 결과가 흔들리지 않게 만들기
- 핵심 개념: resolution snapshot, lockfile write
- 산출물: 첫 `pocpm.lock.json`
- 검증: 설치 후 lockfile이 생성되고 필요한 해 정보가 남는다

### Chapter 8. lockfile을 읽는 설치기

- 핵심 질문: 기록만 하는 lockfile이 아니라, 실제 설치 기준으로 쓰려면?
- 스토리: 네트워크와 시간이 달라도 같은 결과를 재현하고 싶은 순간
- 핵심 개념: lockfile read, frozen install
- 산출물: lockfile 우선 설치 모드
- 검증: 같은 입력에서 같은 결과를 재현한다

### Chapter 9. `.bin`과 script 실행은 왜 필요한가

- 핵심 질문: `npm run dev`는 도대체 어떻게 되는 걸까?
- 스토리: 설치만 되는 도구에서 실행까지 되는 도구로 넘어가기
- 핵심 개념: package bin, `.bin`, PATH
- 산출물: `.bin` 생성과 `run` 구현
- 검증: 설치된 바이너리를 루트 script에서 실행할 수 있다

## Part 3. 모노레포와 실제 프로젝트로 확장하기

### Chapter 10. workspace는 왜 별도 규칙이 필요한가

- 핵심 질문: 로컬 패키지를 registry 패키지처럼 다루려면 무엇이 달라져야 할까?
- 스토리: 모노레포 안의 `packages/ui`를 앱에서 쓰고 싶은 상황
- 핵심 개념: workspace, local package discovery
- 산출물: workspace discovery 로직
- 검증: 루트에서 workspace 목록을 읽어온다

### Chapter 11. `workspace:*`를 실제로 연결하기

- 핵심 질문: registry 대신 로컬 폴더를 설치 결과에 연결하려면?
- 스토리: publish하지 않은 로컬 패키지를 바로 앱에서 쓰기
- 핵심 개념: symlink, local resolution
- 산출물: workspace linker
- 검증: `node_modules` 아래에 workspace symlink가 생긴다

### Chapter 12. `pocpm`으로 내 프로젝트 일부를 설치해보기

- 핵심 질문: toy installer가 실제 프로젝트 일부를 먹여 살릴 수 있을까?
- 스토리: `sample-web` 또는 fixture workspace를 shadow install 해보기
- 핵심 개념: dogfooding, shadow install
- 산출물: leaf workspace 적용 실험
- 검증: 설치 후 build/test 중 일부가 통과한다

### Chapter 13. self-hosting은 왜 마지막에 다뤄야 할까

- 핵심 질문: 내 패키지 매니저로 내 패키지 매니저를 유지하려면 무엇이 필요할까?
- 스토리: bootstrap 문제와 첫 self-hosting 시도
- 핵심 개념: bootstrap, toolchain dependency, self-hosting
- 산출물: self-hosting 체크리스트
- 검증: `packages/pocpm`에 대한 부분 self-install 전략을 설명할 수 있다

## Part 4. 다른 패키지 매니저의 설계를 이해하기

### Chapter 14. npm은 왜 이 구조를 택했을까

- 핵심 질문: 지금까지 만든 모델과 npm의 계약은 어디서 만날까?
- 스토리: 우리가 직접 만든 설치기와 npm을 겹쳐 보기
- 핵심 개념: npm의 source of truth, lockfile contract
- 산출물: `pocpm vs npm` 비교표
- 검증: manifest와 lockfile의 역할 차이를 설명한다

### Chapter 15. Yarn은 왜 설치를 단계로 나눴을까

- 핵심 질문: `resolve -> fetch -> link -> build` 분리는 왜 강력할까?
- 스토리: 디버깅 관점에서 설치를 단계별로 보는 이유
- 핵심 개념: pipeline, resolver, fetcher, linker
- 산출물: `pocpm` 단계 매핑 표
- 검증: 버그를 어느 단계 문제로 볼지 설명한다

### Chapter 16. pnpm은 왜 store와 linker에 베팅했을까

- 핵심 질문: 패키지 매니저의 혁신은 resolver 말고 어디서도 일어날 수 있을까?
- 스토리: 설치 결과 구조를 바꾸는 설계의 힘과 비용
- 핵심 개념: content-addressable store, strict node_modules
- 산출물: `pocpm` 설치 계약 초안
- 검증: 현재 설치 결과 계약을 10줄 안으로 설명한다

### Chapter 17. Bun은 왜 채택 전략을 먼저 봤을까

- 핵심 질문: 더 엄격한 설계와 더 쉬운 채택 중 무엇을 먼저 잡아야 할까?
- 스토리: drop-in replacement 전략과 isolated installs 비교
- 핵심 개념: compatibility, migration, adoption
- 산출물: `pocpm`의 다음 3개월 우선순위 메모
- 검증: 호환성 우선/엄격성 우선 중 현재 선택을 말할 수 있다

### Chapter 18. `pocpm 1.0`을 설계하며 책을 마무리하기

- 핵심 질문: 이제 우리 도구는 어디까지를 1.0으로 약속할까?
- 스토리: 학습용 toy에서 self-hosting 가능한 도구로 가는 경계 정하기
- 핵심 개념: product boundary, non-goals, technical roadmap
- 산출물: `pocpm 1.0` 설계 메모
- 검증: 보장할 것 / 안 할 것 / 다음 순서를 문서로 남긴다

## 부록 아이디어

- Appendix A. lockfile 필드 빠른 참고표
- Appendix B. 자주 헷갈리는 용어 20개
- Appendix C. `pocpm` 코드 읽기 순서
- Appendix D. 실습 환경 문제 해결 가이드
