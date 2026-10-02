# Convert Title to Slug Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng website tiện ích Next.js 16 (App Router) sử dụng Bun và Tailwind CSS để chuyển đổi bất kỳ đoạn văn bản hoặc tiêu đề nào thành slug chuẩn SEO (hỗ trợ tối ưu tiếng Việt có dấu, chế độ đơn và hàng loạt, dark mode, lưu lịch sử).

**Architecture:** Kiến trúc module Client-Side 100% trên nền Next.js App Router. Logic lõi được đóng gói trong pure function `lib/slugify.ts` (không phụ thuộc React) với kiểm thử toàn diện bằng `bun test`. Tầng giao diện phân tách rõ ràng thành các components: Tabs (Single & Bulk), Options Toolbar, Recent History, Theme Switcher và Toast notification.

**Tech Stack:** Next.js 16.3.8 (App Router), React 19, TypeScript, Bun 1.4.2, Tailwind CSS, Lucide React 1.49.0.

**Spec:** `docs/superpowers/specs/2026-10-02-convert-title-to-slug-design.md`

## Global Constraints

- Runtime & Package Manager: `bun` (version >= 1.4.0). Tất cả lệnh cài đặt, dev, build, test đều dùng `bun` (`bun install`, `bun test`, `bun run build`).
- Next.js App Router with TypeScript và Tailwind CSS đặt trong thư mục `src/`.
- Không sử dụng thư viện bên ngoài cho thuật toán slugify — tự triển khai chuẩn SEO với xử lý đặc thù tiếng Việt (`đ/Đ`, Unicode NFD diacritics stripping).
- Tương thích SSR: `localStorage` chỉ được truy cập sau khi component mounted trên client (không gây lỗi React Hydration mismatch).
- 100% Client-side processing: Không gửi dữ liệu người dùng ra bên ngoài hoặc lên server.

---

### Task 1: Khởi tạo Project Next.js với Bun & Cài đặt Thư viện

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`
- Test: `bun --version`, `bun pm ls`

**Interfaces:**
- Consumes: None
- Produces: Project Next.js sẵn sàng hoạt động với Bun, Tailwind CSS và `lucide-react`.

- [ ] **Step 1: Khởi tạo dự án Next.js bằng create-next-app và Bun**

Chạy lệnh scaffold dự án Next.js với các cờ không tương tác:
```powershell
bun x create-next-app@latest . --use-bun --ts --tailwind --app --src-dir --import-alias "@/*" --disable-git --yes
```

- [ ] **Step 2: Cài đặt thư viện icons `lucide-react`**

Chạy:
```powershell
bun add lucide-react
```

- [ ] **Step 3: Kiểm tra cấu hình và chạy thử build cơ sở**

Chạy:
```powershell
bun run build
```
Expected: Build thành công trang Next.js mặc định mà không có lỗi cú pháp hay thiếu package.

- [ ] **Step 4: Commit**

```powershell
git add package.json bun.lock tsconfig.json next.config.ts src/
git commit -m "chore: scaffold Next.js project with bun and tailwindcss"
```

---

### Task 2: Core Slugify Utility với Tiếng Việt & Bộ Unit Test

**Files:**
- Create: `src/lib/slugify.ts`
- Test: `tests/slugify.test.ts`

**Interfaces:**
- Consumes: None
- Produces: 
  - `SlugifyOptions` interface
  - `slugify(text: string, options?: SlugifyOptions): string`
  - `slugifyBatch(textBlock: string, options?: SlugifyOptions): string[]`

- [ ] **Step 1: Viết failing unit test cho `slugify` và `slugifyBatch`**

Tạo file `tests/slugify.test.ts`:
```typescript
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
```

- [ ] **Step 2: Chạy test để xác nhận test thất bại (Red)**

Chạy:
```powershell
bun test tests/slugify.test.ts
```
Expected: FAIL do chưa có file `src/lib/slugify.ts`.

- [ ] **Step 3: Triển khai code tối thiểu trong `src/lib/slugify.ts` (Green)**

Tạo file `src/lib/slugify.ts`:
```typescript
export interface SlugifyOptions {
  separator?: string;
  transformCase?: 'lowercase' | 'uppercase' | 'preserve';
  removeSpecialChars?: boolean;
  collapseSeparators?: boolean;
  trim?: boolean;
}

export function slugify(text: string, options: SlugifyOptions = {}): string {
  if (!text) return '';

  const {
    separator = '-',
    transformCase = 'lowercase',
    removeSpecialChars = true,
    collapseSeparators = true,
    trim = true,
  } = options;

  // 1. Ánh xạ ký tự đ/Đ tiếng Việt
  let result = text
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

  // 2. Tách dấu Unicode NFD và loại bỏ combining diacritical marks
  result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 3. Xử lý ký tự đặc biệt & khoảng trắng
  const escapedSep = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  if (removeSpecialChars) {
    // Chỉ giữ lại chữ cái Unicode (\p{L}), số (\p{N}), khoảng trắng và ký tự separator
    result = result.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  }

  // Thay thế khoảng trắng bằng separator
  result = result.replace(/\s+/g, separator);

  // 4. Gom nhiều separator lặp lại liên tiếp
  if (collapseSeparators && separator) {
    const sepRegex = new RegExp(`(?:${escapedSep})+`, 'g');
    result = result.replace(sepRegex, separator);
  }

  // 5. Cắt separator ở 2 đầu
  if (trim && separator) {
    const trimRegex = new RegExp(`^${escapedSep}+|${escapedSep}+$`, 'g');
    result = result.replace(trimRegex, '');
  }

  // 6. Xử lý kiểu chữ (Case)
  if (transformCase === 'lowercase') {
    result = result.toLowerCase();
  } else if (transformCase === 'uppercase') {
    result = result.toUpperCase();
  }

  return result;
}

export function slugifyBatch(textBlock: string, options?: SlugifyOptions): string[] {
  if (!textBlock || textBlock.trim() === '') return [];
  const lines = textBlock.split(/\r?\n/);
  return lines.map(line => slugify(line, options));
}
```

- [ ] **Step 4: Chạy lại test để xác nhận tất cả pass (Green)**

Chạy:
```powershell
bun test tests/slugify.test.ts
```
Expected: PASS toàn bộ các test cases.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/slugify.ts tests/slugify.test.ts
git commit -m "feat: implement slugify core utility with vietnamese support and tests"
```

---

### Task 3: Client Hooks: `useLocalStorage` & `useClipboard`

**Files:**
- Create: `src/hooks/useLocalStorage.ts`
- Create: `src/hooks/useClipboard.ts`
- Test: `tests/hooks.test.ts`

**Interfaces:**
- Consumes: Browser APIs (`localStorage`, `navigator.clipboard`)
- Produces:
  - `useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void, boolean]`
  - `useClipboard(timeout?: number): { copy: (text: string) => Promise<boolean>, copied: boolean }`

- [ ] **Step 1: Viết file `src/hooks/useLocalStorage.ts` an toàn SSR**

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isMounted];
}
```

- [ ] **Step 2: Viết file `src/hooks/useClipboard.ts` với fallback `execCommand`**

```typescript
'use client';

import { useState, useCallback } from 'react';

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!text) return false;

    let success = false;
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    }
    return success;
  }, [timeout]);

  return { copy, copied };
}
```

- [ ] **Step 3: Kiểm tra TypeScript typecheck**

Chạy:
```powershell
bun run build
```
Expected: Build thành công không có lỗi type.

- [ ] **Step 4: Commit**

```powershell
git add src/hooks/
git commit -m "feat: add useLocalStorage and useClipboard hooks"
```

---

### Task 4: UI Components: OptionsToolbar & ThemeToggle

**Files:**
- Create: `src/components/OptionsToolbar.tsx`
- Create: `src/components/ThemeToggle.tsx`
- Consumes: `src/lib/slugify.ts:SlugifyOptions`
- Produces: Reusable options selector & Dark mode switcher

- [ ] **Step 1: Tạo `src/components/ThemeToggle.tsx`**

Hỗ trợ chuyển đổi dark/light mode và lưu vào localStorage / cập nhật class `dark` trên thẻ `<html>`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
    </button>
  );
}
```

- [ ] **Step 2: Tạo `src/components/OptionsToolbar.tsx`**

Thanh tùy chọn cho phép chọn Separator (`-` / `_`), Case (`lowercase` / `uppercase` / `preserve`), và loại bỏ ký tự lạ:
```typescript
'use client';

import { SlugifyOptions } from '@/lib/slugify';

interface OptionsToolbarProps {
  options: SlugifyOptions;
  onChange: (options: SlugifyOptions) => void;
}

export function OptionsToolbar({ options, onChange }: OptionsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm">
      {/* Separator selector */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-zinc-600 dark:text-zinc-400">Dấu phân cách:</span>
        <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 bg-white dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => onChange({ ...options, separator: '-' })}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              options.separator === '-'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Gạch ngang (-)
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...options, separator: '_' })}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              options.separator === '_'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Gạch dưới (_)
          </button>
        </div>
      </div>

      {/* Case selector */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-zinc-600 dark:text-zinc-400">Kiểu chữ:</span>
        <select
          value={options.transformCase || 'lowercase'}
          onChange={(e) =>
            onChange({
              ...options,
              transformCase: e.target.value as SlugifyOptions['transformCase'],
            })
          }
          className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="lowercase">Chữ thường (kebab-case)</option>
          <option value="uppercase">CHỮ HOA</option>
          <option value="preserve">Giữ nguyên hoa/thường</option>
        </select>
      </div>

      {/* Special chars toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={options.removeSpecialChars ?? true}
          onChange={(e) => onChange({ ...options, removeSpecialChars: e.target.checked })}
          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
        />
        <span className="text-zinc-700 dark:text-zinc-300 text-xs">Loại bỏ ký tự đặc biệt & emoji</span>
      </label>
    </div>
  );
}
```

- [ ] **Step 3: Kiểm tra build**

Chạy:
```powershell
bun run build
```
Expected: Build thành công.

- [ ] **Step 4: Commit**

```powershell
git add src/components/OptionsToolbar.tsx src/components/ThemeToggle.tsx
git commit -m "feat: add OptionsToolbar and ThemeToggle components"
```

---

### Task 5: Component SingleConverter

**Files:**
- Create: `src/components/SingleConverter.tsx`
- Consumes: `src/lib/slugify.ts`, `src/hooks/useClipboard.ts`
- Produces: Chế độ chuyển đổi đơn lẻ (Single title conversion) với realtime output, nút copy, clear, đếm từ/ký tự.

- [ ] **Step 1: Tạo `src/components/SingleConverter.tsx`**

```typescript
'use client';

import { useMemo, useState } from 'react';
import { Copy, Check, X, ArrowRightLeft } from 'lucide-react';
import { slugify, SlugifyOptions } from '@/lib/slugify';
import { useClipboard } from '@/hooks/useClipboard';

interface SingleConverterProps {
  options: SlugifyOptions;
  onSlugGenerated?: (original: string, slug: string) => void;
}

export function SingleConverter({ options, onSlugGenerated }: SingleConverterProps) {
  const [input, setInput] = useState('');
  const { copy, copied } = useClipboard();

  const slug = useMemo(() => slugify(input, options), [input, options]);

  const handleCopy = async () => {
    if (!slug) return;
    const ok = await copy(slug);
    if (ok && onSlugGenerated) {
      onSlugGenerated(input, slug);
    }
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
          <label htmlFor="single-input" className="font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Nhập tiêu đề hoặc văn bản gốc
          </label>
          <div className="flex items-center gap-3">
            <span>{input.length} ký tự</span>
            {input && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Xóa
              </button>
            )}
          </div>
        </div>
        <textarea
          id="single-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ví dụ: Hướng dẫn lập trình Next.js với Bun cho người mới bắt đầu..."
          rows={3}
          className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base resize-y"
        />
      </div>

      {/* Output Section */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Slug kết quả (Live Preview)
          </label>
          <span>{slug.length} ký tự</span>
        </div>
        <div className="relative flex items-center rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-2 pl-4 transition-all">
          <span className="flex-1 font-mono text-base break-all text-blue-950 dark:text-blue-200 select-all min-h-[1.5rem] flex items-center">
            {slug || <span className="text-zinc-400 dark:text-zinc-600 select-none italic text-sm">Chưa có nội dung để tạo slug...</span>}
          </span>
          <button
            onClick={handleCopy}
            disabled={!slug}
            className={`ml-3 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-all shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : slug
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Đã sao chép!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Sao chép
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Kiểm tra build**

Chạy:
```powershell
bun run build
```
Expected: Build thành công.

- [ ] **Step 3: Commit**

```powershell
git add src/components/SingleConverter.tsx
git commit -m "feat: add SingleConverter component"
```

---

### Task 6: Component BulkConverter

**Files:**
- Create: `src/components/BulkConverter.tsx`
- Consumes: `src/lib/slugify.ts`, `src/hooks/useClipboard.ts`
- Produces: Chế độ chuyển đổi hàng loạt (Bulk mode) với phân tích từng dòng, copy tất cả và tải về file `.txt`.

- [ ] **Step 1: Tạo `src/components/BulkConverter.tsx`**

```typescript
'use client';

import { useMemo, useState } from 'react';
import { Copy, Check, Download, X } from 'lucide-react';
import { slugifyBatch, SlugifyOptions } from '@/lib/slugify';
import { useClipboard } from '@/hooks/useClipboard';

interface BulkConverterProps {
  options: SlugifyOptions;
  onBulkProcessed?: (count: number) => void;
}

export function BulkConverter({ options, onBulkProcessed }: BulkConverterProps) {
  const [inputText, setInputText] = useState('');
  const { copy, copied } = useClipboard();

  const slugs = useMemo(() => {
    return slugifyBatch(inputText, options);
  }, [inputText, options]);

  const outputText = useMemo(() => slugs.join('\n'), [slugs]);
  const lineCount = inputText ? inputText.split(/\r?\n/).length : 0;

  const handleCopyAll = async () => {
    if (!outputText) return;
    const ok = await copy(outputText);
    if (ok && onBulkProcessed) {
      onBulkProcessed(slugs.filter(s => s.length > 0).length);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slugs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a);
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Column */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Danh sách gốc ({lineCount} dòng)
            </span>
            {inputText && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Xóa
              </button>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Nhập mỗi tiêu đề trên một dòng...\nVí dụ:\nBài viết giới thiệu Next.js\nLập trình Web với Bun 1.4\nSEO thân thiện cho website`}
            rows={10}
            className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono leading-relaxed"
          />
        </div>

        {/* Output Column */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Kết quả Slug ({slugs.filter(s => s.length > 0).length} slugs)
            </span>
          </div>
          <textarea
            readOnly
            value={outputText}
            placeholder="Kết quả các dòng slug tương ứng sẽ hiển thị tại đây..."
            rows={10}
            className="w-full p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/10 text-blue-950 dark:text-blue-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none text-sm font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={handleDownload}
          disabled={!outputText}
          className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium text-sm flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" /> Tải file .txt
        </button>
        <button
          onClick={handleCopyAll}
          disabled={!outputText}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 shadow-sm transition-all ${
            copied
              ? 'bg-emerald-600 text-white'
              : outputText
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Đã sao chép tất cả!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Sao chép toàn bộ
            </>
          )}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Kiểm tra build**

Chạy:
```powershell
bun run build
```
Expected: Build thành công.

- [ ] **Step 3: Commit**

```powershell
git add src/components/BulkConverter.tsx
git commit -m "feat: add BulkConverter component"
```

---

### Task 7: History List & Toast Feedback

**Files:**
- Create: `src/components/HistoryList.tsx`
- Create: `src/components/Toast.tsx`
- Consumes: `src/lib/slugify.ts:SlugHistoryItem`, `src/hooks/useClipboard.ts`
- Produces: Danh sách lịch sử Recent History và Toast message nhẹ nhàng.

- [ ] **Step 1: Tạo `src/components/Toast.tsx`**

```typescript
'use client';

import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl text-sm font-medium animate-bounce transition-all">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
      <span>{message}</span>
    </div>
  );
}
```

- [ ] **Step 2: Tạo `src/components/HistoryList.tsx`**

```typescript
'use client';

import { Copy, Check, Trash2, Clock } from 'lucide-react';
import { SlugHistoryItem } from '@/lib/slugify';
import { useClipboard } from '@/hooks/useClipboard';
import { useState } from 'react';

interface HistoryListProps {
  history: SlugHistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export function HistoryList({ history, onClearHistory, onDeleteItem }: HistoryListProps) {
  const { copy } = useClipboard();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (item: SlugHistoryItem) => {
    const ok = await copy(item.slug);
    if (ok) {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold text-sm">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Lịch sử chuyển đổi gần đây ({history.length})</span>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
        </button>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-60 overflow-y-auto pr-1">
        {history.map((item) => (
          <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0 flex-1">
              <p className="truncate text-zinc-500 dark:text-zinc-400">{item.originalText}</p>
              <p className="font-mono text-zinc-900 dark:text-zinc-100 font-medium truncate">{item.slug}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopy(item)}
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                title="Sao chép slug"
              >
                {copiedId === item.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-500 transition-colors"
                title="Xóa mục này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Kiểm tra build**

Chạy:
```powershell
bun run build
```
Expected: Build thành công.

- [ ] **Step 4: Commit**

```powershell
git add src/components/HistoryList.tsx src/components/Toast.tsx
git commit -m "feat: add HistoryList and Toast components"
```

---

### Task 8: Tích hợp SlugApp & Thiết kế Landing Page

**Files:**
- Create: `src/components/SlugApp.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Consumes: All components from Tasks 2-7
- Produces: Hoàn thiện website `convert-title-to-slug` đầy đủ tính năng.

- [ ] **Step 1: Tạo `src/components/SlugApp.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { SlugifyOptions, SlugHistoryItem } from '@/lib/slugify';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { OptionsToolbar } from '@/components/OptionsToolbar';
import { SingleConverter } from '@/components/SingleConverter';
import { BulkConverter } from '@/components/BulkConverter';
import { HistoryList } from '@/components/HistoryList';
import { Toast } from '@/components/Toast';

export function SlugApp() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [options, setOptions] = useState<SlugifyOptions>({
    separator: '-',
    transformCase: 'lowercase',
    removeSpecialChars: true,
    collapseSeparators: true,
    trim: true,
  });

  const [history, setHistory, isHistoryMounted] = useLocalStorage<SlugHistoryItem[]>('slug_history', []);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const handleSlugGenerated = (original: string, slug: string) => {
    if (!original.trim() || !slug.trim()) return;
    showToast('Đã sao chép slug vào bộ nhớ tạm!');

    setHistory((prev) => {
      // Tránh trùng lặp slug liên tiếp ở đầu
      const filtered = prev.filter((item) => item.slug !== slug);
      const newItem: SlugHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        originalText: original.slice(0, 100),
        slug,
        timestamp: Date.now(),
      };
      return [newItem, ...filtered].slice(0, 20); // Tối đa 20 mục
    });
  };

  const handleBulkProcessed = (count: number) => {
    showToast(`Đã sao chép ${count} slug vào bộ nhớ tạm!`);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('single')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'single'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          Chuyển đổi đơn (Single)
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'bulk'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          Chuyển đổi hàng loạt (Bulk)
        </button>
      </div>

      {/* Options Toolbar */}
      <OptionsToolbar options={options} onChange={setOptions} />

      {/* Main Mode Container */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        {activeTab === 'single' ? (
          <SingleConverter options={options} onSlugGenerated={handleSlugGenerated} />
        ) : (
          <BulkConverter options={options} onBulkProcessed={handleBulkProcessed} />
        )}
      </div>

      {/* Recent History */}
      {isHistoryMounted && (
        <HistoryList
          history={history}
          onClearHistory={handleClearHistory}
          onDeleteItem={handleDeleteHistoryItem}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}
```

- [ ] **Step 2: Cập nhật `src/app/page.tsx`**

```typescript
import { SlugApp } from '@/components/SlugApp';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight">Convert Title to Slug</h1>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">Chuyển đổi tiêu đề thành URL Slug chuẩn SEO</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section & Main Tool */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Chuyển Đổi Slug Chuẩn SEO
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Hỗ trợ tiếng Việt không dấu chuẩn xác, chuyển đổi tức thì 100% trên trình duyệt, không gửi dữ liệu ra máy chủ.
          </p>
        </div>

        <SlugApp />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>Xây dựng với Next.js, Bun và Tailwind CSS. Tối ưu hóa SEO & hỗ trợ tiếng Việt toàn diện.</p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Cập nhật `src/app/layout.tsx` với SEO metadata & font**

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Convert Title to Slug - Công cụ tạo URL slug chuẩn SEO tiếng Việt',
  description: 'Chuyển đổi tiêu đề và văn bản tiếng Việt sang slug URL chuẩn SEO siêu nhanh, bảo mật và hỗ trợ xử lý hàng loạt.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Chạy kiểm thử toàn bộ và xác nhận build**

Chạy:
```powershell
bun test
bun run build
```
Expected:
- Tests: 100% pass
- Build: Next.js build thành công (Compiled successfully, static routes generated).

- [ ] **Step 5: Commit**

```powershell
git add src/
git commit -m "feat: complete convert-title-to-slug web application"
```

---

### Task 9: Kiểm thử Tích hợp & Nghiệm thu Tổng thể

**Files:**
- Test: `tests/slugify.test.ts`
- Verification: Toàn bộ quy trình test, build và chạy thử server dev.

- [ ] **Step 1: Chạy `bun test` kiểm tra tính chính xác của thuật toán**

Chạy:
```powershell
bun test
```
Expected: Tất cả các test cases về tiếng Việt, options, batching đều pass.

- [ ] **Step 2: Chạy kiểm tra TypeScript typecheck và Build Production**

Chạy:
```powershell
bun run build
```
Expected: 0 errors, production build hoàn tất.

- [ ] **Step 3: Ghi nhận trạng thái hoàn thành vào tài liệu git log**

Chạy:
```powershell
git status
git log -n 5 --oneline
```
Expected: Working tree clean, các commit được sắp xếp theo đúng thứ tự phát triển.
