import {useEffect} from 'react';
import {initializeNotification} from '../utils/notification';
import {eventBus} from '../middleware/eventMiddleware';

export const useNotification = () => {
  useEffect(() => {
    eventBus.on('appStarted', () => {
      initializeNotification();
    });
  }, []);

  return {};
};
