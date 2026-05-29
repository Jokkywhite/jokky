import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import no from './locales/no.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';

const supportedLngs = ['en', 'no', 'fr', 'es', 'ja', 'ko', 'zh'];

const resources = {
  en: { translation: en },
  no: { translation: no },
  fr: { translation: fr },
  es: { translation: es },
  ja: { translation: ja },
  ko: { translation: ko },
  zh: { translation: zh },
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const queryParams = new URLSearchParams(window.location.search);
  const queryLanguage = queryParams.get('lng') || queryParams.get('lang') || queryParams.get('locale');
  if (queryLanguage && supportedLngs.includes(queryLanguage)) {
    return queryLanguage;
  }

  const savedLanguage = window.localStorage.getItem('i18nextLng');
  if (savedLanguage && supportedLngs.includes(savedLanguage)) {
    return savedLanguage;
  }

  const browserLanguage = navigator.language?.split('-')[0];
  if (browserLanguage && supportedLngs.includes(browserLanguage)) {
    return browserLanguage;
  }

  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs,
  nonExplicitSupportedLngs: true,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('i18nextLng', lng);
  }
});

export default i18n;
