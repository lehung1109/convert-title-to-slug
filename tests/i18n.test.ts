import { describe, expect, it } from "bun:test";
import { dictionaries, getTranslation } from "../src/lib/i18n";

describe("i18n", () => {
  it("defaults to English ('en')", () => {
    expect(dictionaries.en).toBeDefined();
    expect(dictionaries.vi).toBeDefined();
  });

  it("has matching keys in both English and Vietnamese dictionaries", () => {
    const enKeys = Object.keys(dictionaries.en).sort();
    const viKeys = Object.keys(dictionaries.vi).sort();

    expect(enKeys).toEqual(viKeys);
  });

  it("translates static keys correctly", () => {
    expect(getTranslation("en", "tabSingle")).toBe("Single Conversion");
    expect(getTranslation("vi", "tabSingle")).toBe("Chuyển đổi đơn (Single)");
  });

  it("handles dynamic translation functions correctly", () => {
    expect(dictionaries.en.toastBulkCopied(5)).toBe("Copied 5 slugs to clipboard!");
    expect(dictionaries.vi.toastBulkCopied(5)).toBe("Đã sao chép 5 slug vào bộ nhớ tạm!");
  });
});
