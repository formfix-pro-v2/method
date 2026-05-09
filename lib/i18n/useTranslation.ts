"use client";

import { useEffect, useState, useCallback } from "react";
import { translations, type Locale } from "./translations";

const STORAGE_KEY = "vm_locale";

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (text: string): string => {
      if (locale === "en") return text;
      return translations[locale]?.[text] || text;
    },
    [locale]
  );

  return { t, locale, setLocale };
}
