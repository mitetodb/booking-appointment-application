import { useLanguage } from '../contexts/LanguageContext';
import enTranslations from '../translations/en';
import bgTranslations from '../translations/bg';
import deTranslations from '../translations/de';

const translationMap = {
  en: enTranslations,
  bg: bgTranslations,
  de: deTranslations,
};

export const useTranslation = () => {
  const { language } = useLanguage();
  const t = translationMap[language] || bgTranslations;

  return { t, language };
};

