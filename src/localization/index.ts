import {store} from '../store/store';
import {I18n} from 'i18n-js';
import en from './en.json';
import tr from './tr.json';

const i18n = new I18n();
i18n.translations = {en, tr};
i18n.enableFallback = true;

i18n.locale = store.getState().appConfig.appLanguage;

export const setLocale = (locale: string) => {
  i18n.locale = locale;
};

export const t = (key: string, options?: any) => i18n.t(key, options);

export default i18n;
