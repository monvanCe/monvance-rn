import {useEffect} from 'react';
import {internalService} from '../service/internalServices';

import {eventBus} from '../middleware/eventMiddleware';
import {useAppSelector} from '../store/store';
import {waitForEvent} from '../utils/waitForEvent';

export const useAuth = () => {
  const user = useAppSelector(state => state.auth);

  useEffect(() => {
    eventBus.on('appStarted', () => {
      login();
    });

    eventBus.on('tokenCreated', async notificationId => {
      const token = await waitForEvent('loginSuccess');
      await internalService.updateUser(token.user.token, {
        notificationId: notificationId,
      });
    });
  }, []);

  const login = async () => {
    const res = await internalService.login();
    return res;
  };

  return {};
};
