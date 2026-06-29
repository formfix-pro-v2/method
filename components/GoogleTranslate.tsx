"use client";

import { useEffect } from "react";

/**
 * Invisible Google Translate integration.
 * Activates when user selects a non-English locale.
 * Translates the entire page content automatically.
 * The Google Translate bar is hidden via CSS.
 */
export default function GoogleTranslate() {
  useEffect(() => {
    const locale = localStorage.getItem("vm_locale") || "en";
    if (locale === "en") return;

    // Map our locale codes to Google Translate language codes
    const langMap: Record<string, string> = {
      sr: "sr",
      de: "de",
      es: "es",
    };

    const targetLang = langMap[locale];
    if (!targetLang) return;

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "sr,de,es",
          autoDisplay: false,
          layout: (window as any).google.translate.TranslateElement.InlineLayout.NONE,
        },
        "google_translate_element"
      );
    };

    // Load the script if not already loaded
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Auto-trigger translation after script loads
    const interval = setInterval(() => {
      const select = document.querySelector(
        ".goog-te-combo"
      ) as HTMLSelectElement | null;
      if (select) {
        select.value = targetLang;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      }
    }, 500);

    // Stop trying after 10 seconds
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return <div id="google_translate_element" className="hidden" />;
}
