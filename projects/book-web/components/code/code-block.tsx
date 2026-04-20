import {
  type AnnotationHandler,
  type BlockAnnotation,
  type RawCode,
  InnerLine,
  Pre,
  highlight,
} from "codehike/code";

const diff: AnnotationHandler = {
  name: "diff",
  onlyIfAnnotated: true,
  transform: (annotation: BlockAnnotation) => {
    const color = annotation.query === "-" ? "#f87171" : "#4ade80";

    return [annotation, { ...annotation, name: "mark", query: color }];
  },
  Line: ({ annotation, ...props }) => (
    <>
      <div className="flex w-5 shrink-0 select-none items-start justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
        {annotation?.query}
      </div>
      <InnerLine merge={props} className="flex-1" />
    </>
  ),
};

const mark: AnnotationHandler = {
  name: "mark",
  Line: ({ annotation, ...props }) => (
    <div
      className="flex min-w-full border-l-2 border-transparent pl-3"
      style={{
        borderLeftColor: annotation?.query,
        backgroundColor: annotation?.query
          ? `color-mix(in srgb, ${annotation.query} 14%, transparent)`
          : undefined,
      }}
    >
      <InnerLine merge={props} className="flex-1" />
    </div>
  ),
};

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark");

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.75)]">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300">
        <span>{highlighted.meta || `${highlighted.lang} example`}</span>
        <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-zinc-400">
          Code Hike
        </span>
      </div>
      <Pre
        code={highlighted}
        className="overflow-x-auto px-4 py-4 text-sm"
        handlers={[mark, diff]}
      />
    </div>
  );
}
