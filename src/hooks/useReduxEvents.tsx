import {useEffect} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {useAppDispatch} from '../store/store';
import {setNotificationId, setUser} from '../store/slices/authSlice';
import {setHasNewMessages} from '../store/slices/chatSlice';

export const useReduxEvents = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    eventBus.on('loginSuccess', ({user}) => {
      dispatch(setUser(user));
    });

    eventBus.on('logoutSuccess', () => {
      dispatch(setUser(null));
    });

    eventBus.on('chatScreenOpened', () => {
      dispatch(setHasNewMessages(false));
    });

    eventBus.on('tokenCreated', token => {
      dispatch(setNotificationId(token));
    });

    eventBus.on('tokenRefreshed', token => {
      dispatch(setNotificationId(token));
    });

    eventBus.on('tokenInitialized', token => {
      dispatch(setNotificationId(token));
    });
  }, []);
};
