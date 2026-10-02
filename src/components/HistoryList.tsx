'use client';

import { Copy, Check, Trash2, Clock } from 'lucide-react';
import { SlugHistoryItem } from '@/lib/slugify';
import { useClipboard } from '@/hooks/useClipboard';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

interface HistoryListProps {
  history: SlugHistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export function HistoryList({ history, onClearHistory, onDeleteItem }: HistoryListProps) {
  const { copy } = useClipboard();
  const { t } = useLanguage();
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
          <span>
            {t('historyTitle')} ({history.length})
          </span>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> {t('clearAll')}
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
                type="button"
                onClick={() => handleCopy(item)}
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                title={t('copySlug')}
              >
                {copiedId === item.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onDeleteItem(item.id)}
                className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                title={t('deleteItem')}
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
