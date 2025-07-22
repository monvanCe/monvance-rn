import {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {eventBus} from '../middleware/eventMiddleware';

export const useToast = () => {
  useEffect(() => {
    eventBus.on('toast', payload => {
      Toast.show({
        text1: payload.message,
        type: payload.type,
      });
    });
  }, []);
};
