import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectIdea } from '../types';
import { Language, UI_TRANSLATIONS, PROJECT_TRANSLATIONS_EN } from '../data/translations';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  getLocalizedProject: (project: ProjectIdea) => ProjectIdea;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      if (saved === 'en' || saved === 'ar') return saved;
      // Auto-detect browser preference if desired, default to Arabic
      if (typeof navigator !== 'undefined' && navigator.language?.startsWith('en')) {
        // We still default to Arabic for original context unless user saved, or allow English if saved
      }
      return 'ar';
    } catch {
      return 'ar';
    }
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem('app_language', language);
    } catch {
      // ignore
    }

    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      
      // Update body font family class
      if (language === 'en') {
        document.body.classList.remove("font-['Cairo',system-ui,sans-serif]");
        document.body.classList.add("font-['Plus_Jakarta_Sans',system-ui,sans-serif]");
        document.title = "Easy & High-Profit Micro Businesses | 2026 Guide";
      } else {
        document.body.classList.remove("font-['Plus_Jakarta_Sans',system-ui,sans-serif]");
        document.body.classList.add("font-['Cairo',system-ui,sans-serif]");
        document.title = "أفكار مشاريع سهلة ومربحة | دليل 2026";
      }
    }
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string, fallback?: string): string => {
    const table = UI_TRANSLATIONS[language];
    if (table && key in table) {
      return table[key];
    }
    return fallback || key;
  };

  const getLocalizedProject = (project: ProjectIdea): ProjectIdea => {
    if (language === 'ar') return project;

    const en = PROJECT_TRANSLATIONS_EN[project.id];
    if (!en) return project;

    return {
      ...project,
      title: en.title || project.title,
      badge: en.badge || project.badge,
      shortDescription: en.shortDescription || project.shortDescription,
      detailedDescription: en.detailedDescription || project.detailedDescription,
      capitalRange: {
        ...project.capitalRange,
        label: en.capitalLabel || project.capitalRange.label,
      },
      monthlyProfitRange: {
        ...project.monthlyProfitRange,
        label: en.profitLabel || project.monthlyProfitRange.label,
      },
      profitMargin: en.profitMargin || project.profitMargin,
      easeLevel: en.easeLevel as any || project.easeLevel,
      timeToRevenue: en.timeToRevenue || project.timeToRevenue,
      workLocation: en.workLocation || project.workLocation,
      dailyHours: en.dailyHours || project.dailyHours,
      requirements: en.requirements || project.requirements,
      actionSteps: en.actionSteps || project.actionSteps,
      marketingStrategy: en.marketingStrategy || project.marketingStrategy,
      secretToSuccess: en.secretToSuccess || project.secretToSuccess,
      potentialRisksAndFix: en.potentialRisksAndFix || project.potentialRisksAndFix,
      unitEconomics: {
        ...project.unitEconomics,
        unitName: en.unitEconomics?.unitName || project.unitEconomics.unitName,
        exampleExplanation: en.unitEconomics?.exampleExplanation || project.unitEconomics.exampleExplanation,
      },
      tags: en.tags || project.tags,
    };
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL,
        setLanguage,
        toggleLanguage,
        t,
        getLocalizedProject,
        formatCurrency,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
