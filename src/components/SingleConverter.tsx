'use client';

import { useMemo, useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { slugify, SlugifyOptions } from '@/lib/slugify';
import { useClipboard } from '@/hooks/useClipboard';
import { useLanguage } from '@/context/LanguageContext';

interface SingleConverterProps {
  options: SlugifyOptions;
  onSlugGenerated?: (original: string, slug: string) => void;
}

export function SingleConverter({ options, onSlugGenerated }: SingleConverterProps) {
  const [input, setInput] = useState('');
  const { copy, copied } = useClipboard();
  const { t } = useLanguage();

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
            {t('singleInputLabel')}
          </label>
          <div className="flex items-center gap-3">
            <span>{input.length} {t('chars')}</span>
            {input && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> {t('clear')}
              </button>
            )}
          </div>
        </div>
        <textarea
          id="single-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('singleInputPlaceholder')}
          rows={3}
          className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base resize-y"
        />
      </div>

      {/* Output Section */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            {t('singleOutputLabel')}
          </label>
          <span>{slug.length} {t('chars')}</span>
        </div>
        <div className="relative flex items-center rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-2 pl-4 transition-all">
          <span className="flex-1 font-mono text-base break-all text-blue-950 dark:text-blue-200 select-all min-h-[1.5rem] flex items-center">
            {slug || <span className="text-zinc-400 dark:text-zinc-600 select-none italic text-sm">{t('singleEmptyPlaceholder')}</span>}
          </span>
          <button
            type="button"
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
                <Check className="w-4 h-4" /> {t('copied')}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> {t('copy')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
