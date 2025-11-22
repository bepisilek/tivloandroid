import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en'); // Default to EN initially

  useEffect(() => {
    const storedLang = localStorage.getItem('idopenz_language') as Language;
    if (storedLang && translations[storedLang]) {
      setLanguageState(storedLang);
    } else {
      // IP Detection
      const detectLanguage = async () => {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          if (data) {
            if (data.country_code === 'HU') {
              setLanguage('hu');
            } else if (['DE', 'AT', 'CH'].includes(data.country_code)) {
              setLanguage('de');
            } else {
              setLanguage('en');
            }
          } else {
            setLanguage('en');
          }
        } catch (error) {
          console.warn('Failed to detect country, defaulting to English', error);
          // Fallback: Check navigator language
          const navLang = navigator.language.toLowerCase();
          if (navLang.startsWith('hu')) {
            setLanguage('hu');
          } else if (navLang.startsWith('de')) {
            setLanguage('de');
          } else {
            setLanguage('en');
          }
        }
      };
      detectLanguage();
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('idopenz_language', lang);
  };

  const t = (key: keyof typeof translations['en'], params?: Record<string, string | number>) => {
    let text = translations[language][key] || translations['en'][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};