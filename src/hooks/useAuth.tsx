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
      console.log('waiting for login success');
      await waitForEvent('loginSuccess');
      console.log('login success');
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
