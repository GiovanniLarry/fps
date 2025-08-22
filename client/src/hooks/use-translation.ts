import { useState, useEffect } from 'react';
import { getCurrentLanguage, translateText } from '@/lib/translation';

const translations = new Map<string, Map<string, string>>();

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
  }, []);

  const t = async (text: string): Promise<string> => {
    if (currentLanguage === 'en') {
      return text; // Return original text for English
    }

    // Check cache first
    const langCache = translations.get(currentLanguage);
    if (langCache?.has(text)) {
      return langCache.get(text)!;
    }

    try {
      const translatedText = await translateText(text, currentLanguage);
      
      // Cache the translation
      if (!translations.has(currentLanguage)) {
        translations.set(currentLanguage, new Map());
      }
      translations.get(currentLanguage)!.set(text, translatedText);
      
      return translatedText;
    } catch (error) {
      console.warn('Translation failed:', error);
      return text; // Fallback to original text
    }
  };

  // Simple translation function that doesn't use hooks
  const translateTextSync = (text: string): string => {
    if (currentLanguage === 'en') {
      return text;
    }

    // Check cache first
    const langCache = translations.get(currentLanguage);
    if (langCache?.has(text)) {
      return langCache.get(text)!;
    }

    // Return original text and translate asynchronously
    translateText(text, currentLanguage).then(translated => {
      if (!translations.has(currentLanguage)) {
        translations.set(currentLanguage, new Map());
      }
      translations.get(currentLanguage)!.set(text, translated);
      // Trigger re-render by dispatching a custom event
      window.dispatchEvent(new CustomEvent('translationUpdated'));
    }).catch(() => {
      // Keep original text on error
    });

    return text;
  };

  return { t, translateTextSync, currentLanguage };
}