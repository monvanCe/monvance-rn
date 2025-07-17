import {useEffect} from 'react';
import {internalService} from '../service/internalServices';

import {eventBus} from '../middleware/eventMiddleware';

export const useAuth = () => {
  useEffect(() => {
    eventBus.on('appStarted', () => {
      login();
    });
  }, []);

  const login = async () => {
    const res = await internalService.login();
    eventBus.emit('loginSuccess', {user: res});
    return res;
  };

  return {};
};
