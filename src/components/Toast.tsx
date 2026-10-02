'use client';

import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
      <span>{message}</span>
    </div>
  );
}
