import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from './translations';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ar' | 'ja' | 'hi';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Espanol', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Francais', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugues', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
];

function detectBrowserLanguage(): Language {
  const nav = navigator;
  const browserLang = (nav.language || (nav as any).userLanguage || '').toLowerCase();

  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('hi')) return 'hi';
  return 'en';
}

function getInitialLanguage(): Language {
  const stored = localStorage.getItem('swifttrack_lang');
  if (stored && translations[stored]) return stored as Language;
  return detectBrowserLanguage();
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  dir: 'ltr',
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    localStorage.setItem('swifttrack_lang', lang);
  }, []);

  useEffect(() => {
    document.documentElement.dir = languages.find(l => l.code === language)?.dir || 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  }, [language]);

  const dir = languages.find(l => l.code === language)?.dir || 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  const { t } = useContext(I18nContext);
  return t;
}