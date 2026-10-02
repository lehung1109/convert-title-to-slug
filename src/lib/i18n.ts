export type Locale = 'en' | 'vi';

export interface Dictionary {
  headerSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  tabSingle: string;
  tabBulk: string;
  separatorLabel: string;
  hyphen: string;
  underscore: string;
  caseLabel: string;
  caseLower: string;
  caseUpper: string;
  casePreserve: string;
  removeSpecialChars: string;
  singleInputLabel: string;
  singleInputPlaceholder: string;
  chars: string;
  clear: string;
  singleOutputLabel: string;
  singleEmptyPlaceholder: string;
  copy: string;
  copied: string;
  bulkInputLabel: string;
  lines: string;
  bulkInputPlaceholder: string;
  bulkOutputLabel: string;
  slugsCount: string;
  bulkOutputPlaceholder: string;
  downloadTxt: string;
  copyAll: string;
  copiedAll: string;
  historyTitle: string;
  clearAll: string;
  copySlug: string;
  deleteItem: string;
  toastSlugCopied: string;
  toastBulkCopied: (count: number) => string;
  footerText: string;
  toggleTheme: string;
  switchLanguage: string;
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    headerSubtitle: 'SEO-friendly URL Slug Generator',
    heroTitle: 'SEO-Friendly Slug Generator',
    heroSubtitle: 'Instant, client-side slug generator. Supports English, accurate Vietnamese diacritics, and multi-language Unicode. Fast, secure, and zero server requests.',
    tabSingle: 'Single Conversion',
    tabBulk: 'Bulk Conversion',
    separatorLabel: 'Separator:',
    hyphen: 'Hyphen (-)',
    underscore: 'Underscore (_)',
    caseLabel: 'Letter Case:',
    caseLower: 'lowercase (kebab-case)',
    caseUpper: 'UPPERCASE',
    casePreserve: 'Preserve Case',
    removeSpecialChars: 'Remove special characters & emoji',
    singleInputLabel: 'Input original title or text',
    singleInputPlaceholder: 'Example: Getting Started with Next.js and Bun in 2026...',
    chars: 'characters',
    clear: 'Clear',
    singleOutputLabel: 'Result Slug (Live Preview)',
    singleEmptyPlaceholder: 'No content yet to generate slug...',
    copy: 'Copy',
    copied: 'Copied!',
    bulkInputLabel: 'Original List',
    lines: 'lines',
    bulkInputPlaceholder: 'Enter one title per line...\nExample:\nIntroduction to Next.js\nModern Web with Bun 1.4\nSEO Friendly URLs for Web',
    bulkOutputLabel: 'Slug Results',
    slugsCount: 'slugs',
    bulkOutputPlaceholder: 'Converted slugs will appear here line by line...',
    downloadTxt: 'Download .txt',
    copyAll: 'Copy All',
    copiedAll: 'Copied all!',
    historyTitle: 'Recent Conversion History',
    clearAll: 'Clear all',
    copySlug: 'Copy slug',
    deleteItem: 'Delete item',
    toastSlugCopied: 'Slug copied to clipboard!',
    toastBulkCopied: (count: number) => `Copied ${count} slugs to clipboard!`,
    footerText: 'Built with Next.js, Bun, and Tailwind CSS. Optimized for SEO & comprehensive multi-language support.',
    toggleTheme: 'Toggle theme',
    switchLanguage: 'Switch language',
  },
  vi: {
    headerSubtitle: 'Chuyển đổi tiêu đề thành URL Slug chuẩn SEO',
    heroTitle: 'Chuyển Đổi Slug Chuẩn SEO',
    heroSubtitle: 'Hỗ trợ tiếng Việt không dấu chuẩn xác, chuyển đổi tức thì 100% trên trình duyệt, không gửi dữ liệu ra máy chủ.',
    tabSingle: 'Chuyển đổi đơn (Single)',
    tabBulk: 'Chuyển đổi hàng loạt (Bulk)',
    separatorLabel: 'Dấu phân cách:',
    hyphen: 'Gạch ngang (-)',
    underscore: 'Gạch dưới (_)',
    caseLabel: 'Kiểu chữ:',
    caseLower: 'Chữ thường (kebab-case)',
    caseUpper: 'CHỮ HOA',
    casePreserve: 'Giữ nguyên hoa/thường',
    removeSpecialChars: 'Loại bỏ ký tự đặc biệt & emoji',
    singleInputLabel: 'Nhập tiêu đề hoặc văn bản gốc',
    singleInputPlaceholder: 'Ví dụ: Hướng dẫn lập trình Next.js với Bun cho người mới bắt đầu...',
    chars: 'ký tự',
    clear: 'Xóa',
    singleOutputLabel: 'Slug kết quả (Live Preview)',
    singleEmptyPlaceholder: 'Chưa có nội dung để tạo slug...',
    copy: 'Sao chép',
    copied: 'Đã sao chép!',
    bulkInputLabel: 'Danh sách gốc',
    lines: 'dòng',
    bulkInputPlaceholder: 'Nhập mỗi tiêu đề trên một dòng...\nVí dụ:\nBài viết giới thiệu Next.js\nLập trình Web với Bun 1.4\nSEO thân thiện cho website',
    bulkOutputLabel: 'Kết quả Slug',
    slugsCount: 'slugs',
    bulkOutputPlaceholder: 'Kết quả các dòng slug tương ứng sẽ hiển thị tại đây...',
    downloadTxt: 'Tải file .txt',
    copyAll: 'Sao chép toàn bộ',
    copiedAll: 'Đã sao chép tất cả!',
    historyTitle: 'Lịch sử chuyển đổi gần đây',
    clearAll: 'Xóa tất cả',
    copySlug: 'Sao chép slug',
    deleteItem: 'Xóa mục này',
    toastSlugCopied: 'Đã sao chép slug vào bộ nhớ tạm!',
    toastBulkCopied: (count: number) => `Đã sao chép ${count} slug vào bộ nhớ tạm!`,
    footerText: 'Xây dựng với Next.js, Bun và Tailwind CSS. Tối ưu hóa SEO & hỗ trợ tiếng Việt toàn diện.',
    toggleTheme: 'Chuyển giao diện sáng/tối',
    switchLanguage: 'Chuyển đổi ngôn ngữ',
  },
};

export function getTranslation<K extends keyof Dictionary>(
  locale: Locale,
  key: K
): Dictionary[K] {
  const dict = dictionaries[locale] || dictionaries.en;
  return dict[key];
}
