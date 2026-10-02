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
