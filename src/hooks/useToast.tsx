import {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {eventBus} from '../middleware/eventMiddleware';

export const useToast = () => {
  useEffect(() => {
    eventBus.on('notification', payload => {
      Toast.show({
        text1: payload.title,
        type: 'info',
      });
    });
  }, []);
};
