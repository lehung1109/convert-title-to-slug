import { describe, expect, it } from "bun:test";
import { slugify, slugifyBatch } from "../src/lib/slugify";

describe("slugify", () => {
  it("converts basic English text to kebab-case", () => {
    expect(slugify("Hello World Example")).toBe("hello-world-example");
  });

  it("handles Vietnamese diacritics including đ and Đ correctly", () => {
    expect(slugify("Đại học Bách Khoa Hà Nội")).toBe("dai-hoc-bach-khoa-ha-noi");
    expect(slugify("Điện biên phủ trên không")).toBe("dien-bien-phu-tren-khong");
    expect(slugify("Phở bò tái nạm & Bún chả")).toBe("pho-bo-tai-nam-bun-cha");
  });

  it("respects custom separator", () => {
    expect(slugify("Convert title to slug", { separator: "_" })).toBe("convert_title_to_slug");
  });

  it("handles case transformation options", () => {
    expect(slugify("Hello World", { transformCase: "uppercase" })).toBe("HELLO-WORLD");
    expect(slugify("Hello World", { transformCase: "preserve" })).toBe("Hello-World");
  });

  it("collapses multiple consecutive separators and trims edges", () => {
    expect(slugify("  --- Multiple   spaces & --- hyphens ---  ")).toBe("multiple-spaces-hyphens");
  });

  it("removes special symbols and emojis when removeSpecialChars is true", () => {
    expect(slugify("Awesome Post! 🚀🔥 (2026 Edition)")).toBe("awesome-post-2026-edition");
  });

  it("handles empty or whitespace strings safely", () => {
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
    expect(slugify("!@#$%^&*()")).toBe("");
  });
});

describe("slugifyBatch", () => {
  it("converts multiline strings into an array of slugs", () => {
    const input = "Tiêu đề bài viết 1\nTiêu đề bài viết 2\nTiêu đề bài viết 3";
    const result = slugifyBatch(input);
    expect(result).toEqual([
      "tieu-de-bai-viet-1",
      "tieu-de-bai-viet-2",
      "tieu-de-bai-viet-3"
    ]);
  });

  it("handles empty batch input", () => {
    expect(slugifyBatch("")).toEqual([]);
  });
});
