import {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {eventBus} from '../middleware/eventMiddleware';
import {t} from '../localization';

export const useToast = () => {
  useEffect(() => {
    // eventBus.on('notification', payload => {
    //   Toast.show({
    //     text1: payload.title,
    //     text2: payload.body,
    //     type: 'info',
    //   });
    // });

    eventBus.on('error', payload => {
      Toast.show({
        text1: payload,
        type: 'error',
      });
    });

    eventBus.on('signalReceived', data => {
      const previous = Number(data.previousPrice);
      const current = Number(data.currentPrice);
      const diff = current - previous;
      const percent = previous !== 0 ? (diff / previous) * 100 : 0;
      const directionKey = percent >= 0 ? 'increased' : 'decreased';

      Toast.show({
        text1: data.title,
        text2: data.body,
        type: directionKey === 'increased' ? 'success' : 'error',
      });
    });
  }, []);
};
