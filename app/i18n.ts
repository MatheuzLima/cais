import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../translations/en/translation.json';
import ptBR from '../translations/pt-BR/translation.json';

// Keys are the English source strings (gettext style): `t('Containers')`.
// A string missing from a translation file falls back to the English key,
// so the UI can be translated incrementally.
export const LANGUAGE_STORAGE_KEY = 'cais.language';

export const supportedLanguages = [
  { id: 'en', label: 'English', shortLabel: 'EN' },
  { id: 'pt-BR', label: 'Português (Brasil)', shortLabel: 'PT' },
] as const;

export type LanguageId = (typeof supportedLanguages)[number]['id'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'pt-BR': { translation: ptBR },
    },
    supportedLngs: supportedLanguages.map((l) => l.id),
    fallbackLng: { pt: ['pt-BR'], default: ['en'] },
    // resources are bundled, so init synchronously: AngularJS templates
    // rendered on first digest must already see the active language
    initImmediate: false,
    keySeparator: false,
    nsSeparator: false,
    returnEmptyString: false,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

function syncDocumentLanguage(lng: string) {
  document.documentElement.setAttribute('lang', lng);
}

syncDocumentLanguage(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', syncDocumentLanguage);

export function getCurrentLanguage(): LanguageId {
  const current = i18n.resolvedLanguage || i18n.language;
  return supportedLanguages.some((l) => l.id === current)
    ? (current as LanguageId)
    : 'en';
}

export default i18n;
