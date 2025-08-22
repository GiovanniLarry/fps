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

export async function translateText(text: string, _targetLanguage: string): Promise<string> { return text; }

export function getCurrentLanguage(): string {
  return localStorage.getItem('fedpack-language') || 'en';
}

export function setCurrentLanguage(languageCode: string): void {
  localStorage.setItem('fedpack-language', languageCode);
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: languageCode }));
}
