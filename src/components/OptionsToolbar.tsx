'use client';

import { SlugifyOptions } from '@/lib/slugify';

interface OptionsToolbarProps {
  options: SlugifyOptions;
  onChange: (options: SlugifyOptions) => void;
}

export function OptionsToolbar({ options, onChange }: OptionsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm">
      {/* Separator selector */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-zinc-600 dark:text-zinc-400">Dấu phân cách:</span>
        <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 bg-white dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => onChange({ ...options, separator: '-' })}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              options.separator === '-'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Gạch ngang (-)
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...options, separator: '_' })}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              options.separator === '_'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Gạch dưới (_)
          </button>
        </div>
      </div>

      {/* Case selector */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-zinc-600 dark:text-zinc-400">Kiểu chữ:</span>
        <select
          value={options.transformCase || 'lowercase'}
          onChange={(e) =>
            onChange({
              ...options,
              transformCase: e.target.value as SlugifyOptions['transformCase'],
            })
          }
          className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="lowercase">Chữ thường (kebab-case)</option>
          <option value="uppercase">CHỮ HOA</option>
          <option value="preserve">Giữ nguyên hoa/thường</option>
        </select>
      </div>

      {/* Special chars toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={options.removeSpecialChars ?? true}
          onChange={(e) => onChange({ ...options, removeSpecialChars: e.target.checked })}
          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
        />
        <span className="text-zinc-700 dark:text-zinc-300 text-xs">Loại bỏ ký tự đặc biệt & emoji</span>
      </label>
    </div>
  );
}
