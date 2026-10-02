'use client';

import { useState } from 'react';
import { SlugifyOptions, SlugHistoryItem } from '@/lib/slugify';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { OptionsToolbar } from '@/components/OptionsToolbar';
import { SingleConverter } from '@/components/SingleConverter';
import { BulkConverter } from '@/components/BulkConverter';
import { HistoryList } from '@/components/HistoryList';
import { Toast } from '@/components/Toast';

export function SlugApp() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [options, setOptions] = useState<SlugifyOptions>({
    separator: '-',
    transformCase: 'lowercase',
    removeSpecialChars: true,
    collapseSeparators: true,
    trim: true,
  });

  const [history, setHistory, isHistoryMounted] = useLocalStorage<SlugHistoryItem[]>('slug_history', []);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const handleSlugGenerated = (original: string, slug: string) => {
    if (!original.trim() || !slug.trim()) return;
    showToast('Đã sao chép slug vào bộ nhớ tạm!');

    setHistory((prev) => {
      // Tránh trùng lặp slug liên tiếp ở đầu
      const filtered = prev.filter((item) => item.slug !== slug);
      const newItem: SlugHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        originalText: original.slice(0, 100),
        slug,
        timestamp: Date.now(),
      };
      return [newItem, ...filtered].slice(0, 20); // Tối đa 20 mục
    });
  };

  const handleBulkProcessed = (count: number) => {
    showToast(`Đã sao chép ${count} slug vào bộ nhớ tạm!`);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('single')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'single'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          Chuyển đổi đơn (Single)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bulk')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'bulk'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          Chuyển đổi hàng loạt (Bulk)
        </button>
      </div>

      {/* Options Toolbar */}
      <OptionsToolbar options={options} onChange={setOptions} />

      {/* Main Mode Container */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        {activeTab === 'single' ? (
          <SingleConverter options={options} onSlugGenerated={handleSlugGenerated} />
        ) : (
          <BulkConverter options={options} onBulkProcessed={handleBulkProcessed} />
        )}
      </div>

      {/* Recent History */}
      {isHistoryMounted && (
        <HistoryList
          history={history}
          onClearHistory={handleClearHistory}
          onDeleteItem={handleDeleteHistoryItem}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}
