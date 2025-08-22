import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";
import { supportedLanguages, getCurrentLanguage, setCurrentLanguage, type Language } from "@/lib/simple-translation";
import { translatePageContent } from "@/lib/webpage-translation";

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const langCode = getCurrentLanguage();
    return supportedLanguages.find(lang => lang.code === langCode) || supportedLanguages[0];
  });

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const langCode = event.detail;
      const language = supportedLanguages.find(lang => lang.code === langCode);
      if (language) {
        setCurrentLang(language);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
  }, []);

  // Auto-apply translation on mount or language change
  useEffect(() => {
    if (currentLang.code === 'fr') {
      translatePageContent('fr');
    }
  }, [currentLang.code]);

  const handleLanguageSelect = async (language: Language) => {
    setCurrentLanguage(language.code);
    setCurrentLang(language);
    await translatePageContent(language.code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="glass-button px-4 py-2 rounded-lg text-white flex items-center space-x-2 ripple-effect">
          <Globe className="h-4 w-4" />
          <span>{currentLang.flag}</span>
          <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-morphism border-glass-border">
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language)}
            className="text-white hover:bg-white hover:bg-opacity-10 cursor-pointer"
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
