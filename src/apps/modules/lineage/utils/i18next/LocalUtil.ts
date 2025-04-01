
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { getInitOptions } from './i18nextUtil';

// Initialize i18next (language)
i18n
  .use(LanguageDetector) // Detects system language
  .use(initReactI18next)
  .init(getInitOptions());

export default i18n;
