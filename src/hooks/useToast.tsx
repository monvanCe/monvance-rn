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
        text1: t('signal_toast_title'),
        text2: t('signal_toast_body', {
          percent: Math.abs(percent).toFixed(2),
          direction: t(directionKey),
          period: data.period,
          prev: data.previousPrice,
          curr: data.currentPrice,
        }),
        type: directionKey === 'increased' ? 'success' : 'error',
      });
    });
  }, []);
};
