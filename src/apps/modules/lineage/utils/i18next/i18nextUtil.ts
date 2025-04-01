
import i18next, { InitOptions } from 'i18next';
import { map, upperCase } from 'lodash';
import enUS from '../../locale/languages/en-us.json';
import frFR from '../../locale/languages/fr-fr.json';

export enum SupportedLocales {
  English = 'en-US',
  Français = 'fr-FR',

}

export const languageSelectOptions = map(SupportedLocales, (value, key) => ({
  label: `${key} - ${upperCase(value.split('-')[0])}`,
  key: value,
}));

// Returns i18next options
export const getInitOptions = (): InitOptions => {
  return {
    supportedLngs: Object.values(SupportedLocales),
    resources: {
      'en-US': { translation: enUS },
      'fr-FR': { translation: frFR },
    },
    fallbackLng: ['en-US'],
    detection: {
      order: ['querystring', 'cookie', 'navigator'],
      caches: ['cookie'], // cache user language on
    },
    interpolation: {
      escapeValue: false, // XSS safety provided by React
    },
    missingKeyHandler: (_lngs, _ns, key) =>
      // eslint-disable-next-line no-console
      console.error(`i18next: key not found "${key}"`),
    saveMissing: true, // Required for missing key handler
  };
};

// Returns the current locale to use in cronstrue
export const getCurrentLocaleForConstrue = () => {
  // For cronstrue, we need to pass the locale in the format 'pt_BR' and not 'pt-BR'
  // for some selected languages
  // if (
  //   [
  //     SupportedLocales['Português (Brasil)'],
  //     SupportedLocales['Português (Portugal)'],
  //     SupportedLocales.简体中文,
  //   ].includes(i18next.resolvedLanguage as SupportedLocales)
  // ) {
  //   return i18next.resolvedLanguage.replaceAll('-', '_');
  // }

  return (i18next as any).resolvedLanguage.split('-')[0];
};
