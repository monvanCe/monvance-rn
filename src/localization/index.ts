import {store} from '../store/store';
import {I18n} from 'i18n-js';

import en from './en.json';
import tr from './tr.json';

const i18n = new I18n();

i18n.translations = {
  en,
  tr,
};

const appLanguage = store.getState().appConfig.appLanguage;

i18n.locale = appLanguage;

i18n.enableFallback = true;

export default i18n;
