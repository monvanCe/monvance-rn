import {useEffect} from 'react';
import {eventBus} from '../middleware/eventMiddleware';

export const useHomeService = () => {
  useEffect(() => {
    eventBus.on('appStarted', () => {
      console.log('appStarted');
    });
  }, []);
};
