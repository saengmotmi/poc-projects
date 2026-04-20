import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { Code } from "@/components/code/code-block";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Code,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
