import { describe, expect, it } from "vite-plus/test";

import { formatPocMessage } from "./message";

describe("formatPocMessage", () => {
  it("returns a readable banner message", () => {
    expect(formatPocMessage("sample-web")).toBe("sample-web is ready for the next experiment.");
  });
});
