import {useEffect} from 'react';
import {initializeNotification} from '../utils/notification';
import {eventBus} from '../middleware/eventMiddleware';

export const useNotification = () => {
  useEffect(() => {
    eventBus.on('appStarted', () => {
      initializeNotification();
    });

    eventBus.on('notification', async ({title, body, data}) => {
      // console.log(title, body, data);
    });
  }, []);

  return {};
};
