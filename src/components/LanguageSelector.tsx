import React, { useState, useRef, useEffect } from 'react';
import { useI18n, languages, Language } from '../i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find(l => l.code === language);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 transition-colors ${
          compact
            ? 'p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-lg'
            : 'px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-primary border border-transparent hover:border-primary/10 rounded-lg'
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current?.nativeName}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-56 bg-white border border-primary/10 shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-2 border-b border-primary/5">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest px-2 py-1 block">
                Select Language
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded ${
                    language === lang.code
                      ? 'bg-primary/5 text-primary'
                      : 'hover:bg-primary/5 text-muted hover:text-primary'
                  }`}
                >
                  <span className="text-sm font-medium flex-1">{lang.nativeName}</span>
                  <span className="text-[10px] font-mono text-muted uppercase">{lang.code}</span>
                  {language === lang.code && (
                    <Check className="w-4 h-4 text-accent" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}