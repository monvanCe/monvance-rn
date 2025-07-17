import {useEffect} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {useAppDispatch} from '../store/store';
import {setUser} from '../store/slices/authSlice';
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
  }, []);
};
