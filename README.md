# 🔗 Convert Title to Slug

Công cụ trực tuyến giúp chuyển đổi tiêu đề và văn bản thành **URL slug chuẩn SEO**, hỗ trợ tối ưu và xử lý chuẩn xác tiếng Việt có dấu, hoạt động hoàn toàn trên trình duyệt (client-side).

---

## ✨ Tính năng nổi bật

- ⚡ **Chuyển đổi tức thì (Live Preview):** Tự động tạo slug theo thời gian thực ngay khi nhập tiêu đề hoặc văn bản.
- 🇻🇳 **Tối ưu tiếng Việt toàn diện:**
  - Chuẩn hóa Unicode NFD, bóc tách và loại bỏ dấu tiếng Việt chính xác.
  - Xử lý triệt để ký tự đặc thù tiếng Việt (`đ` &rarr; `d`, `Đ` &rarr; `D`).
- 📦 **Chuyển đổi hàng loạt (Bulk Mode):**
  - Hỗ trợ xử lý danh sách nhiều tiêu đề cùng lúc (mỗi dòng một tiêu đề).
  - Hiển thị số lượng dòng và số lượng slug kết quả theo thời gian thực.
  - Sao chép toàn bộ danh sách kết quả chỉ với 1 click.
  - Tải kết quả về máy dưới dạng tệp văn bản `.txt`.
- ⚙️ **Tùy biến cấu hình linh hoạt (Options Toolbar):**
  - **Dấu phân cách (Separator):** Dấu gạch ngang (`-`) hoặc gạch dưới (`_`).
  - **Kiểu chữ (Case):** Chữ thường (`lowercase` - kebab-case), CHỮ HOA (`uppercase`), hoặc giữ nguyên (`preserve`).
  - **Lọc ký tự đặc biệt:** Tùy chọn giữ hoặc loại bỏ biểu tượng đặc biệt, emoji, ký tự lạ (`removeSpecialChars`).
  - Tự động gom nhiều dấu phân cách liên tiếp và cắt dấu thừa ở hai đầu.
- 🕒 **Lịch sử chuyển đổi (History):**
  - Tự động lưu 20 chuyển đổi gần nhất vào `localStorage` của trình duyệt.
  - Sao chép nhanh lại slug cũ hoặc xóa lịch sử bất cứ lúc nào.
- 🔒 **Bảo mật & Riêng tư:** Xử lý 100% tại máy khách (Client-side), không gửi bất kỳ dữ liệu nào về máy chủ.
- 🌓 **Giao diện hiện đại & Responsive:** Hỗ trợ chế độ Sáng / Tối (Light / Dark Mode), thiết kế tối ưu trên cả desktop lẫn thiết bị di động.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện | Phiên bản |
| :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | `16.3.8` |
| **Giao diện (UI)** | [React](https://react.dev/) | `19.2.8` |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `v4` (`@tailwindcss/postcss`) |
| **Icon** | [Lucide React](https://lucide.dev/) | `^1.49.0` |
| **Ngôn ngữ** | [TypeScript](https://www.typescriptlang.org/) | `^5` |
| **Runtime & Package Manager** | [Bun](https://bun.sh/) | `1.4.2` |
| **Testing** | Bun Test runner (`bun:test`) | Tích hợp sẵn |
| **Linter** | ESLint | `^9` |

---

## 📁 Cấu trúc thư mục dự án

```text
convert-title-to-slug/
├── public/                 # Tệp tĩnh (favicon, svg assets)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── globals.css     # Cấu hình Tailwind CSS v4 & theme variables
│   │   ├── layout.tsx      # Root Layout & Metadata SEO
│   │   └── page.tsx        # Trang chủ ứng dụng
│   ├── components/         # Các React UI Components
│   │   ├── BulkConverter.tsx   # Chế độ chuyển đổi hàng loạt & xuất file .txt
│   │   ├── HistoryList.tsx     # Danh sách lịch sử chuyển đổi gần đây
│   │   ├── OptionsToolbar.tsx  # Thanh điều khiển tùy chọn (dấu, kiểu chữ, ký tự)
│   │   ├── SingleConverter.tsx # Chế độ chuyển đổi đơn (Live preview & đếm ký tự)
│   │   ├── SlugApp.tsx         # Component tổng hợp state, tabs và toast
│   │   ├── ThemeToggle.tsx     # Nút chuyển đổi Dark/Light mode
│   │   └── Toast.tsx           # Thông báo Toast khi thao tác sao chép
│   ├── hooks/              # Custom React Hooks
│   │   ├── useClipboard.ts     # Xử lý sao chép vào bộ nhớ tạm (navigator.clipboard)
│   │   └── useLocalStorage.ts  # Quản lý và đồng bộ LocalStorage (chống SSR hydration mismatch)
│   └── lib/
│       └── slugify.ts          # Core logic tạo slug tiếng Việt & chuyển đổi batch
├── tests/                  # Unit tests với Bun Test
│   └── slugify.test.ts     # Bộ kiểm thử cho hàm slugify & slugifyBatch
├── vercel.json             # Cấu hình triển khai trên Vercel với Bun
├── package.json            # Thông tin dự án, dependencies & scripts
└── tsconfig.json           # Cấu hình TypeScript
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Yêu cầu môi trường

Khuyến nghị sử dụng [Bun](https://bun.sh/) (phiên bản `>= 1.4.0`) để đạt tốc độ xử lý nhanh nhất:

```bash
# Kiểm tra phiên bản Bun
bun --version
```

### 2. Cài đặt thư viện (Dependencies)

```bash
bun install
```

*(Hoặc dùng `npm install`, `pnpm install`, `yarn install` tùy môi trường của bạn).*

### 3. Khởi chạy môi trường phát triển (Dev server)

```bash
bun run dev
```

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

### 4. Chạy kiểm thử tự động (Unit tests)

Dự án đi kèm bộ test toàn diện cho các trường hợp xử lý tiếng Việt, ký tự đặc biệt, case transformation:

```bash
bun test
```

### 5. Kiểm tra chất lượng mã (Lint)

```bash
bun run lint
```

### 6. Đóng gói bản Production (Build)

```bash
bun run build
bun run start
```

---

## 💡 Hướng dẫn sử dụng hàm `slugify` trong mã nguồn

Bạn có thể import trực tiếp module [`src/lib/slugify.ts`](src/lib/slugify.ts) để tái sử dụng ở bất kỳ đâu trong dự án:

```typescript
import { slugify, slugifyBatch } from '@/lib/slugify';

// 1. Chuyển đổi cơ bản với tiếng Việt có dấu
const slug1 = slugify('Đại học Bách Khoa Hà Nội & TP.HCM');
// Kết quả: "dai-hoc-bach-khoa-ha-noi-tp-hcm"

// 2. Tùy biến dấu phân cách, kiểu chữ và ký tự đặc biệt
const slug2 = slugify('Bài Viết Mới Nhất 2026! 🚀', {
  separator: '_',
  transformCase: 'uppercase',
  removeSpecialChars: true,
});
// Kết quả: "BAI_VIET_MOI_NHAT_2026"

// 3. Chuyển đổi danh sách nhiều dòng (Batch)
const list = `Tiêu đề bài viết 1\nTiêu đề bài viết 2`;
const slugs = slugifyBatch(list);
// Kết quả: ["tieu-de-bai-viet-1", "tieu-de-bai-viet-2"]
```

### Chi tiết các tùy chọn (`SlugifyOptions`):

| Thuộc tính | Kiểu dữ liệu | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- |
| `separator` | `string` | `"-"` | Ký tự phân cách giữa các từ (`"-"` hoặc `"_"`). |
| `transformCase` | `'lowercase' \| 'uppercase' \| 'preserve'` | `'lowercase'` | Kiểu chữ: chữ thường, chữ hoa hoặc giữ nguyên. |
| `removeSpecialChars` | `boolean` | `true` | Loại bỏ emoji, ký hiệu và ký tự đặc biệt. |
| `collapseSeparators` | `boolean` | `true` | Gộp nhiều dấu phân cách liên tiếp thành một dấu duy nhất. |
| `trim` | `boolean` | `true` | Loại bỏ dấu phân cách ở đầu và cuối chuỗi kết quả. |

---

## 🌐 Triển khai (Deployment)

Dự án đã sẵn sàng triển khai trên [Vercel](https://vercel.com/) với cấu hình trong [`vercel.json`](vercel.json):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "bunVersion": "1.4.x"
}
```

Chỉ cần kết nối repository với Vercel, hệ thống sẽ tự động cấu hình và triển khai dự án bằng Bun runtime.
