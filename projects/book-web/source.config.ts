import type { CodeHikeConfig } from "codehike/mdx";
import { recmaCodeHike, remarkCodeHike } from "codehike/mdx";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

const chConfig: CodeHikeConfig = {
  components: {
    code: "Code",
  },
};

export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig({
  mdxOptions: {
    jsx: true,
    remarkPlugins: [[remarkCodeHike, chConfig]],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
});
