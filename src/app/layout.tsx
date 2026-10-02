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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
