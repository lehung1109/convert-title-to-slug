'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { dictionaries, Dictionary, Locale } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
  t: <K extends keyof Dictionary>(key: K) => Dictionary[K];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('app_lang') as Locale | null;
      if (saved && (saved === 'en' || saved === 'vi')) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocaleState(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = 'en';
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('app_lang', newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // Ignore localStorage errors
    }
  };

  const dict = dictionaries[locale] || dictionaries.en;

  const t = <K extends keyof Dictionary>(key: K): Dictionary[K] => {
    return dict[key];
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dict, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
