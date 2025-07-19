import {useEffect} from 'react';
import {useAppSelector} from '../store/store';
import i18n from '../localization/index';

const useLocalization = () => {
  const appLanguage = useAppSelector(state => state.appConfig.appLanguage);
  useEffect(() => {
    i18n.locale = appLanguage;
  }, [appLanguage]);
};

export default useLocalization;
