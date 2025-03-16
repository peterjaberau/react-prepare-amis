import { initializeI18n } from '@grafana-module/app/core/internationalization';
import { config, updateConfig } from './config';


export const initI18nPromiseResolver = () => {
  const initI18nPromise = initializeI18n(config.bootData.user.language);
  return initI18nPromise.then(({ language }) => {
    const result = updateConfig({ language });
    console.log('initI18nPromiseResolver', {
      language: language,
      result: result,
    });
  });

}
