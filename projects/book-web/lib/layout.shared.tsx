import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "pocpm Book",
    },
    links: [
      {
        text: "Docs",
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "Curriculum",
        url: "https://github.com/saengmotmi/poc-projects/tree/main/docs",
        external: true,
      },
    ],
  };
}
