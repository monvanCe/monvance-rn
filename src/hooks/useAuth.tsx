import {useEffect} from 'react';
import {internalService} from '../service/internalServices';

import {eventBus} from '../middleware/eventMiddleware';

import {waitForEvent} from '../utils/waitForEvent';
import {useAppSelector} from '../store/store';

export const useAuth = () => {
  const user = useAppSelector(state => state.auth);

  const handleAppStarted = () => {
    login();
  };

  const updateNotificationId = async (currentNotificationId: string) => {
    const currentUser: IUser = await new Promise(resolve => {
      if (user.token !== '') {
        resolve(user);
      } else {
        waitForEvent('loginSuccess').then(({user}) => resolve(user));
      }
    });

    if (currentUser.notificationId === currentNotificationId) return;
    await internalService.updateUser({
      notificationId: currentNotificationId,
    });
  };

  useEffect(() => {
    eventBus.on('appStarted', handleAppStarted);
    eventBus.on('notificationIdInitialized', updateNotificationId);

    return () => {
      eventBus.off('appStarted', handleAppStarted);
      eventBus.off('notificationIdInitialized', updateNotificationId);
    };
  }, [user, updateNotificationId]);

  const login = async () => {
    const res = await internalService.login();
    return res;
  };

  return {};
};
