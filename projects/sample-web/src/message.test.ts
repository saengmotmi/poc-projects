import { describe, expect, it } from "vite-plus/test";

import { formatPocMessage } from "./message";

describe("formatPocMessage는", () => {
  it("읽기 쉬운 배너 문구를 반환한다", () => {
    expect(formatPocMessage("sample-web")).toBe("sample-web is ready for the next experiment.");
  });
});
