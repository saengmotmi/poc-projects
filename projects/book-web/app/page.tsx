import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#d0e0ff,transparent_40%),radial-gradient(circle_at_bottom,#ffe1bf,transparent_35%),linear-gradient(180deg,#f6f8ff_0%,#fff7ef_100%)]" />
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-[0_24px_100px_-32px_rgba(15,23,42,0.45)] backdrop-blur md:p-12">
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-600">
          <span className="rounded-full bg-zinc-900 px-3 py-1 text-white">
            book-web
          </span>
          <span>Fumadocs</span>
          <span className="text-zinc-300">/</span>
          <span>Code Hike</span>
          <span className="text-zinc-300">/</span>
          <span>Vercel Ready</span>
        </div>

        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="space-y-6">
            <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
              준비 단계
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-950 md:text-6xl">
              책을 읽게 만드는 프론트엔드의 최소 골격을 먼저 세웠습니다.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-zinc-600">
              지금 상태는 전체 제품 완성본이 아니라, Fumadocs와 Code Hike를
              얹은 출발점입니다. 이제 챕터 본문, diff 워크스루, 퀴즈, 진도
              저장을 차례로 올릴 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                샘플 문서 열기
              </Link>
              <a
                href="https://www.fumadocs.dev/docs/manual-installation/next"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Fumadocs 문서 보기
              </a>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] bg-zinc-950 p-5 text-zinc-100 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.65)]">
            <div className="text-sm font-medium text-zinc-400">현재 포함된 것</div>
            <ul className="grid gap-3 text-sm leading-6 text-zinc-200">
              <li>MDX 기반 docs route와 sidebar/navigation</li>
              <li>Code Hike custom code component와 diff annotation 준비</li>
              <li>Orama search route</li>
              <li>Vercel CLI preview / production 스크립트</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
