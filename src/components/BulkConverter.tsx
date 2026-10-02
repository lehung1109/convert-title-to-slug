'use client';

import { useMemo, useState } from 'react';
import { Copy, Check, Download, X } from 'lucide-react';
import { slugifyBatch, SlugifyOptions } from '@/lib/slugify';
import { useClipboard } from '@/hooks/useClipboard';
import { useLanguage } from '@/context/LanguageContext';

interface BulkConverterProps {
  options: SlugifyOptions;
  onBulkProcessed?: (count: number) => void;
}

export function BulkConverter({ options, onBulkProcessed }: BulkConverterProps) {
  const [inputText, setInputText] = useState('');
  const { copy, copied } = useClipboard();
  const { t } = useLanguage();

  const slugs = useMemo(() => {
    return slugifyBatch(inputText, options);
  }, [inputText, options]);

  const outputText = useMemo(() => slugs.join('\n'), [slugs]);
  const lineCount = inputText ? inputText.split(/\r?\n/).length : 0;
  const validSlugsCount = slugs.filter((s) => s.length > 0).length;

  const handleCopyAll = async () => {
    if (!outputText) return;
    const ok = await copy(outputText);
    if (ok && onBulkProcessed) {
      onBulkProcessed(validSlugsCount);
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
    URL.revokeObjectURL(url);
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
              {t('bulkInputLabel')} ({lineCount} {t('lines')})
            </span>
            {inputText && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> {t('clear')}
              </button>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('bulkInputPlaceholder')}
            rows={10}
            className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono leading-relaxed"
          />
        </div>

        {/* Output Column */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              {t('bulkOutputLabel')} ({validSlugsCount} {t('slugsCount')})
            </span>
          </div>
          <textarea
            readOnly
            value={outputText}
            placeholder={t('bulkOutputPlaceholder')}
            rows={10}
            className="w-full p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/10 text-blue-950 dark:text-blue-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none text-sm font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!outputText}
          className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium text-sm flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" /> {t('downloadTxt')}
        </button>
        <button
          type="button"
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
              <Check className="w-4 h-4" /> {t('copiedAll')}
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> {t('copyAll')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
