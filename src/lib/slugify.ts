export interface SlugifyOptions {
  separator?: string;
  transformCase?: 'lowercase' | 'uppercase' | 'preserve';
  removeSpecialChars?: boolean;
  collapseSeparators?: boolean;
  trim?: boolean;
}

export interface SlugHistoryItem {
  id: string;
  originalText: string;
  slug: string;
  timestamp: number;
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
