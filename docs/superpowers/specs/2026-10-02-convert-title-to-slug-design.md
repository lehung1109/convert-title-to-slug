# Design Specification: Convert Title to Slug Web Application

- **Date:** 2026-10-02
- **Topic:** Convert Title to Slug Web Application
- **Runtime & Package Manager:** Bun (>= 1.4.x)
- **Framework:** Next.js (App Router, latest), React 19, TypeScript, Tailwind CSS
- **Path Classification:** Architectural

---

## 1. Overview & Objectives

Xây dựng một website tiện ích hiện đại bằng Next.js (phiên bản mới nhất) chạy trên runtime Bun, chuyên phục vụ việc chuyển đổi tiêu đề hoặc bất kỳ đoạn văn bản nào thành dạng **slug** (URL-friendly string) chuẩn SEO.

### Key Goals:
1. **Hỗ trợ tiếng Việt chuyên sâu:** Loại bỏ triệt để và chính xác các dấu tiếng Việt (kể cả ký tự đặc thù `đ/Đ`), chuẩn hóa dấu câu và ký tự Unicode.
2. **Real-time 100% Client-side:** Xử lý tức thì khi người dùng gõ phím (0ms latency, không yêu cầu server call, bảo mật dữ liệu tuyệt đối).
3. **2 Chế độ hoạt động:**
   - **Single Mode:** Chuyển đổi một tiêu đề nhanh chóng với nút sao chép (copy) 1 chạm và thống kê ký tự.
   - **Bulk Mode:** Chuyển đổi danh sách nhiều dòng đồng thời, hỗ trợ sao chép toàn bộ hoặc tải về file `.txt`.
4. **Tùy biến linh hoạt:** Tùy chọn dấu phân cách (`-` hoặc `_`), kiểu chữ (thường / HOA / giữ nguyên), loại bỏ emoji và ký tự đặc biệt.
5. **Tiện ích cao cấp:** Dark/Light mode, thông báo Toast khi sao chép, và lưu lịch sử các slug gần nhất (Recent History) bằng `localStorage`.

---

## 2. Technology Stack & Tooling

| Thành phần | Lựa chọn | Lý do |
|---|---|---|
| **Runtime & PM** | `bun` (v1.4+) | Quản lý package siêu tốc, hỗ trợ test native bằng `bun test` |
| **Framework** | `Next.js` (App Router) | Chuẩn mực web hiện đại, hỗ trợ SSR/Static Export dễ dàng |
| **UI & Styling** | `Tailwind CSS` | Giao diện responsive, linh hoạt, hỗ trợ Dark Mode tiện lợi |
| **Icons** | `lucide-react` | Bộ icon hiện đại, nhẹ, đầy đủ cho copy, check, trash, moon/sun |
| **Testing** | `bun test` | Chạy nhanh, không cần cấu hình phức tạp của Jest |

---

## 3. Core Logic & Algorithm Specification (`lib/slugify.ts`)

Module này được thiết kế dưới dạng **Pure Functions**, độc lập hoàn toàn với React UI để phục vụ viết Unit Test chuẩn xác.

### 3.1 Type Definitions
```typescript
export interface SlugifyOptions {
  separator?: string; // Mặc định: '-'
  transformCase?: 'lowercase' | 'uppercase' | 'preserve'; // Mặc định: 'lowercase'
  removeSpecialChars?: boolean; // Mặc định: true
  collapseSeparators?: boolean; // Mặc định: true
  trim?: boolean; // Mặc định: true
}

export interface SlugHistoryItem {
  id: string;
  originalText: string;
  slug: string;
  timestamp: number;
}
```

### 3.2 Thuật toán xử lý Tiếng Việt & Chuẩn hóa Slug
1. **Bước 1 (Ánh xạ đ/Đ):**
   - Thay thế `đ` $\rightarrow$ `d`, `Đ` $\rightarrow$ `D`.
   *(Lưu ý: Unicode NFD không phân rã `đ` thành `d` + dấu, do đó phải thay thế trước).*
2. **Bước 2 (Unicode NFD & Diacritic Stripping):**
   - Áp dụng `text.normalize('NFD')`.
   - Dùng Regex `replace(/[\u0300-\u036f]/g, '')` để loại bỏ toàn bộ dấu kết hợp (sắc, huyền, hỏi, ngã, nặng, mũ, móc).
3. **Bước 3 (Ký tự đặc biệt & Khoảng trắng):**
   - Nếu `removeSpecialChars === true`: Thay thế các ký tự không phải chữ cái (`\p{L}`), số (`\p{N}`), hoặc khoảng trắng bằng ký tự phân cách (separator).
   - Khoảng trắng (spaces, tabs) được thay bằng separator.
4. **Bước 4 (Gom nhóm & Cắt gọt - Collapse & Trim):**
   - Nếu `collapseSeparators === true`: Gom nhiều separator liên tiếp thành 1 (ví dụ: `---` $\rightarrow$ `-`).
   - Nếu `trim === true`: Cắt bỏ separator ở đầu và cuối chuỗi.
5. **Bước 5 (Transform Case):**
   - Chuyển thành chữ thường (`toLowerCase()`), chữ hoa (`toUpperCase()`), hoặc giữ nguyên tùy theo cấu hình `transformCase`.

### 3.3 Hàm Batch Processing
```typescript
export function slugifyBatch(textBlock: string, options?: SlugifyOptions): string[] {
  if (!textBlock) return [];
  const lines = textBlock.split(/\r?\n/);
  return lines.map(line => slugify(line, options));
}
```

---

## 4. UI Architecture & Component Hierarchy

```
src/
├── app/
│   ├── globals.css         # Tailwind base, dark mode variables
│   ├── layout.tsx          # Root layout, HTML theme script, metadata
│   └── page.tsx            # Main Landing page with Header, SlugApp & Footer
├── components/
│   ├── SlugApp.tsx         # Root client component điều phối tabs, options & history state
│   ├── SingleConverter.tsx # Ô nhập liệu đơn, preview slug live, copy button, stats
│   ├── BulkConverter.tsx   # Textarea nhiều dòng, copy all, download txt file, line counter
│   ├── OptionsToolbar.tsx  # Bộ tùy chọn: Separator (- / _), Case (lower/upper/none), Strip switch
│   ├── HistoryList.tsx     # Danh sách Recent History (LocalStorage), copy lại hoặc xóa
│   ├── ThemeToggle.tsx     # Switch Dark / Light mode (hỗ trợ lưu theme)
│   └── Toast.tsx           # Thông báo Toast khi copy thành công
├── hooks/
│   ├── useLocalStorage.ts  # Hook an toàn với SSR để đọc/ghi localStorage
│   └── useClipboard.ts     # Hook copy clipboard với fallback document.execCommand
└── lib/
    └── slugify.ts          # Core logic chuyển đổi slug
```

---

## 5. State Management & Hydration Safety

- **Realtime Rendering:** Sử dụng `useMemo` tính toán slug từ `inputText` và `options` mỗi khi state thay đổi. Không cần debounce đối với text ngắn; với bulk mode xử lý mượt mà trên client.
- **SSR Hydration Guard:**
  - `localStorage` cho History và Theme được khởi tạo với trạng thái ban đầu an toàn (empty list / system theme).
  - Sử dụng cờ `isMounted` trong `useLocalStorage` để đảm bảo không xảy ra lỗi `Hydration mismatch` giữa server HTML và client render.
- **History Cap:** Giới hạn tối đa 20 mục lịch sử gần nhất để tối ưu hiệu năng và dung lượng `localStorage`.

---

## 6. Error Handling & Edge Cases

| Tình huống | Cách xử lý |
|---|---|
| Chuỗi nhập vào rỗng hoặc chỉ có khoảng trắng | Trả về chuỗi rỗng `""`, UI hiển thị placeholder mờ gợi ý |
| Chuỗi toàn emoji / ký tự đặc biệt | Nếu bật `removeSpecialChars`, kết quả trả về `""` an toàn |
| Trình duyệt không hỗ trợ Clipboard API | Tự động fallback sang `document.execCommand('copy')` |
| Người dùng nhập văn bản nhiều MB trong Bulk mode | Giới hạn dung lượng text hợp lý để tránh treo tab browser |
| Dấu phân cách trùng lặp (`---`, `___`) | Tự động chuẩn hóa về 1 dấu duy nhất |

---

## 7. Testing Plan (`bun test`)

Tạo file kiểm thử `tests/slugify.test.ts` kiểm tra các bộ dữ liệu:
1. **Tiếng Việt căn bản & nâng cao:**
   - Dấu tiếng Việt thông dụng: `"Học Lập Trình Next.js"` $\rightarrow$ `"hoc-lap-trinh-next-js"`
   - Ký tự `đ / Đ`: `"Đại học Bách Khoa Hà Nội"` $\rightarrow$ `"dai-hoc-bach-khoa-ha-noi"`
   - Dấu hỏi, ngã, nặng, mũ, móc: `"Phở bò tái nạm, bún chả thơm ngon!"` $\rightarrow$ `"pho-bo-tai-nam-bun-cha-thom-ngon"`
2. **Options Suite:**
   - Separator `_`: `"Xin chào thế giới"` $\rightarrow$ `"xin_chao_the_gioi"`
   - Case uppercase: `"hello world"` $\rightarrow$ `"HELLO-WORLD"`
   - Collapse separators: `"hello   ---   world"` $\rightarrow$ `"hello-world"`
3. **Bulk Processing Suite:**
   - Xử lý mảng nhiều dòng với ký tự xuống dòng `\n` và `\r\n`.
4. **Edge Cases:**
   - Chuỗi rỗng, khoảng trắng đơn độc, ký tự đặc biệt và số.
