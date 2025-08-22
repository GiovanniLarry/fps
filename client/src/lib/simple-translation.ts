import { apiRequest } from "./queryClient";

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

// Simple global translation cache
const translationCache = new Map<string, Map<string, string>>();
let currentLanguage = 'en';

export function getCurrentLanguage(): string {
  return localStorage.getItem('fedpack-language') || 'en';
}

export function setCurrentLanguage(languageCode: string): void {
  localStorage.setItem('fedpack-language', languageCode);
  currentLanguage = languageCode;
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: languageCode }));
}

export async function translateText(text: string, _targetLanguage: string): Promise<string> { return text; }

// Simple translation function that returns text immediately
export function t(text: string, lang?: string): string {
  const targetLang = lang || getCurrentLanguage();
  return text;
}