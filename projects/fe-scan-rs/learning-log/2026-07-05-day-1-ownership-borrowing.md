# Rust FE tooling log: 2026-07-05 day 1

## 오늘 목표

- Rust를 전혀 모르는 상태에서 ownership/borrow의 첫 감각을 잡는다.
- `String` 대입이 TypeScript식 참조 복사가 아니라 move라는 점을 이해한다.
- `&name`과 `&mut name`의 차이를 구분한다.
- "읽는 건 자유"라는 표현이 언제 맞고 언제 틀린지 정리한다.

## 정상 동작 / 현재 동작

- 정상 동작: `String` 값이 move되는 상황, 공유 읽기 참조가 가능한 상황, 수정 참조가 독점권을 갖는 상황을 예측할 수 있다.
- 현재 동작: `&name`으로 빌린 뒤 원본을 읽어도 되는지, `&mut name`이 있을 때 원본을 읽어도 되는지 헷갈린다.

## 입력 / 상태 / 환경 / 시간

- Input: TypeScript만 써봤고 Rust ownership 이야기는 대강 들어본 상태.
- State: `fe-scan-rs` 구현 전, ownership/borrow 문법을 대화로 먼저 예측했다.
- Environment: 현재 로컬에는 `rustc`, `cargo`, `rustup`이 아직 설치되어 있지 않다.
- Time: 1일차. 코드를 실행하기 전 예측을 먼저 했다.

## 오늘 다룬 예측 문제

### 문제 1: `String`을 다른 변수에 대입한 뒤 원래 변수를 출력하기

```rust
fn main() {
    let name = String::from("typescript");
    let copied = name;

    println!("{}", name);
}
```

- 예측: `name`을 `copied`로 넘겼는데 다시 출력하려 하면 안 될 것 같다.
- 판정: 맞음. 컴파일되지 않는다.
- 핵심: `String`은 힙 데이터를 소유한다. `let copied = name;`은 복사가 아니라 ownership move다.
- 예상 에러: `borrow of moved value: name`

고치는 방법:

```rust
fn main() {
    let name = String::from("typescript");
    let copied = name;

    println!("{}", copied);
}
```

또는 진짜 복사가 필요하면:

```rust
fn main() {
    let name = String::from("typescript");
    let copied = name.clone();

    println!("{}", name);
    println!("{}", copied);
}
```

또는 소유권을 넘기지 않고 빌린다:

```rust
fn main() {
    let name = String::from("typescript");
    let borrowed = &name;

    println!("{}", name);
    println!("{}", borrowed);
}
```

### 문제 2: 읽기 전용으로 빌린 뒤 원본과 참조를 모두 출력하기

```rust
fn main() {
    let name = String::from("typescript");
    let borrowed = &name;

    println!("{}", name);
    println!("{}", borrowed);
}
```

- 예측: 빌렸는데 `name`을 호출해서 안 될 것 같다.
- 판정: 틀림. 컴파일된다.
- 핵심: `&name`은 소유권 이동이 아니다. 읽기 전용으로 잠깐 빌리는 것이다.

이 시점의 상태:

```txt
name owns String
borrowed only reads name
```

그래서 원본 `name`도 읽을 수 있고, 참조 `borrowed`도 읽을 수 있다.

### 문제 3: 읽기 전용 참조가 나중에 쓰이는데 중간에 원본 수정하기

```rust
fn main() {
    let mut name = String::from("type");
    let borrowed = &name;

    name.push_str("script");

    println!("{}", borrowed);
}
```

- 예측: 문제 없을 것 같다.
- 판정: 틀림. 컴파일되지 않는다.
- 문제 줄: `name.push_str("script");`
- 핵심: 읽기 전용 참조 `borrowed`가 나중에 다시 쓰인다. 그동안 원본을 수정할 수 없다.
- 예상 에러: `cannot borrow name as mutable because it is also borrowed as immutable`

고치는 방법 1. 읽기 참조를 먼저 마지막으로 사용한다:

```rust
fn main() {
    let mut name = String::from("type");
    let borrowed = &name;

    println!("{}", borrowed);

    name.push_str("script");
}
```

고치는 방법 2. 수정한 뒤에 빌린다:

```rust
fn main() {
    let mut name = String::from("type");

    name.push_str("script");

    let borrowed = &name;
    println!("{}", borrowed);
}
```

### 문제 4: `&mut name`이 있을 때 원본 `name` 읽기

```rust
fn main() {
    let mut name = String::from("type");
    let borrowed = &mut name;

    println!("{}", name);

    borrowed.push_str("script");
}
```

- 질문: 읽는 건 자유롭다면서 왜 안 되는가?
- 판정: 컴파일되지 않는다.
- 문제 줄: `println!("{}", name);`
- 핵심: `&mut name`은 단순히 "수정 가능"이 아니라 "독점 접근권"이다.

`println!("{}", name);`은 내부적으로 `name`을 읽기 위해 공유 참조를 만들려고 한다. 그런데 아직 `borrowed`가 아래에서 다시 쓰인다.

```rust
borrowed.push_str("script");
```

따라서 Rust는 이렇게 본다.

```txt
&mut name 이 살아있음
그런데 &name 을 또 만들려고 함
```

이 조합은 금지다.

고치는 방법:

```rust
fn main() {
    let mut name = String::from("type");
    let borrowed = &mut name;

    borrowed.push_str("script");

    println!("{}", name);
}
```

`borrowed`를 마지막으로 쓴 뒤에는 독점 대여가 끝났다고 볼 수 있어서, 그 다음에 `name`을 읽을 수 있다.

## 오늘 헷갈렸던 지점 정리

### 오해 1. `copied`라는 변수 이름이면 복사된 것 같다

아니다. Rust에서 `String`을 그냥 대입하면 복사가 아니라 move다.

```rust
let copied = name;
```

이 줄 이후 소유자는 `copied`다. `name`은 더 이상 사용할 수 없다.

### 오해 2. 빌렸으면 원본을 못 읽을 것 같다

반은 맞고 반은 틀리다.

읽기 전용 참조 `&name`만 있다면 원본도 읽을 수 있다.

```rust
let borrowed = &name;
println!("{}", name);
println!("{}", borrowed);
```

이건 된다.

### 오해 3. 모든 걸 `mut`로 하면 해결될 것 같다

아니다. `mut`는 두 종류를 구분해야 한다.

```rust
let mut name = String::from("type");
```

이건 `name`이라는 변수를 바꿀 수 있다는 뜻이다.

```rust
let borrowed = &mut name;
```

이건 `borrowed`가 `name`에 대한 독점 수정 권한을 빌렸다는 뜻이다.

`&mut`가 살아있는 동안에는 원본 `name`으로 읽는 것도 막힌다.

### 오해 4. 읽는 건 자유롭다면서 왜 `println!("{}", name)`이 안 되는가

정확한 표현은 이렇다.

```txt
수정하는 사람이 아무도 없을 때, 읽기 전용 참조 여러 개는 자유롭다.
```

하지만 `&mut name`은 수정용 독점 접근권이다. 이 독점권이 살아있는 동안에는 읽기 참조도 같이 만들 수 없다.

## 오늘의 핵심 규칙

Rust는 한 시점에 둘 중 하나만 허용한다.

```txt
읽기 전용 참조 여러 개: OK
수정용 참조 하나: OK

읽기 참조 + 수정 참조: NO
수정 참조 여러 개: NO
```

짧게 쓰면:

> many readers or one writer.

오늘 버전으로 더 정확히 쓰면:

> `&mut`는 "수정 가능"이 아니라 "독점 접근권"이다.

## 에러 카드

```txt
에러: borrow of moved value: `name`
상황: String을 다른 변수에 대입한 뒤 원래 변수를 출력했다
내 예측: copied로 넘겼으니 name을 출력하면 안 될 것 같았다
실제 원인: String ownership이 name에서 copied로 move됐다
수정: copied를 출력하거나, name.clone()으로 복사하거나, &name으로 빌린다
다음 복습: 2026-07-06
```

```txt
에러: cannot borrow `name` as mutable because it is also borrowed as immutable
상황: &name으로 읽기 참조를 만들고, 그 참조를 나중에 출력하기 전에 name.push_str(...)로 수정했다
내 예측: 문제 없을 것 같았다
실제 원인: 읽기 참조 borrowed가 아직 살아있어서 원본을 수정할 수 없었다
수정: borrowed를 먼저 마지막으로 쓰거나, 수정한 뒤에 borrowed를 만든다
다음 복습: 2026-07-06
```

```txt
에러: cannot borrow `name` as immutable because it is also borrowed as mutable
상황: &mut name을 만든 뒤, borrowed를 나중에 다시 쓰기 전에 println!("{}", name)으로 원본을 읽었다
내 예측: 읽는 건 자유로운 것 아닌가 헷갈렸다
실제 원인: &mut name은 독점 접근권이라 살아있는 동안 공유 읽기 참조도 만들 수 없다
수정: borrowed를 먼저 마지막으로 사용한 뒤 name을 읽는다
다음 복습: 2026-07-06
```

## 다음 복습 문제

다음 세션 시작 때 아래 네 조각을 다시 예측한다.

```rust
fn main() {
    let name = String::from("rust");
    let a = &name;
    let b = &name;
    println!("{} {} {}", name, a, b);
}
```

```rust
fn main() {
    let mut name = String::from("rust");
    let a = &mut name;
    let b = &mut name;
    a.push_str("!");
    b.push_str("?");
}
```

```rust
fn main() {
    let mut name = String::from("rust");
    let a = &name;
    println!("{}", a);
    name.push_str("!");
    println!("{}", name);
}
```

```rust
fn main() {
    let mut name = String::from("rust");
    let a = &mut name;
    a.push_str("!");
    println!("{}", name);
}
```

## 변경한 파일

- `projects/fe-scan-rs/learning-log/2026-07-05-day-1-ownership-borrowing.md`

## 다음 행동

- Rust toolchain을 설치한다.
- 같은 예제들을 실제 `cargo check`로 확인한다.
- 예측과 실제 compiler message가 다른 지점을 다음 로그에 남긴다.
