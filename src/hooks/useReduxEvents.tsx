import {useEffect} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {useAppDispatch} from '../store/store';
import {setToken, setUser} from '../store/slices/authSlice';
import {setHasNewMessages, setMessages} from '../store/slices/chatSlice';

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
      dispatch(setToken(token));
    });

    eventBus.on('tokenRefreshed', token => {
      dispatch(setToken(token));
    });

    eventBus.on('tokenInitialized', token => {
      dispatch(setToken(token));
    });
  }, []);
};
