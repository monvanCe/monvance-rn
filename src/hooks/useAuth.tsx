import {useEffect} from 'react';
import {internalService} from '../service/internalServices';

import {eventBus} from '../middleware/eventMiddleware';

import {waitForEvent} from '../utils/waitForEvent';

export const useAuth = () => {
  useEffect(() => {
    eventBus.on('appStarted', () => {
      login();
    });

    eventBus.on('notificationIdCreated', async notificationId => {
      await waitForEvent('loginSuccess');
      await internalService.updateUser({
        notificationId,
      });
    });
  }, []);

  const login = async () => {
    const res = await internalService.login();
    return res;
  };

  return {};
};
