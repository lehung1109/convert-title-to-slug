'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className="inline-flex items-center rounded-xl bg-zinc-100 dark:bg-zinc-800 p-0.5 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold"
      role="group"
      aria-label={t('switchLanguage')}
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          locale === 'en'
            ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-xs'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        }`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('vi')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          locale === 'vi'
            ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-xs'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        }`}
        aria-pressed={locale === 'vi'}
      >
        VI
      </button>
    </div>
  );
}
