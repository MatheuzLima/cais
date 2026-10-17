import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translation from '../../translations/en/translation.json';

// mirrors app/i18n.ts: English source strings are the keys
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  initImmediate: false,
  keySeparator: false,
  nsSeparator: false,
  returnEmptyString: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  resources: { en: { translation } },
});

export default i18n;
