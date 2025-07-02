import {useEffect} from 'react';
import {useAppSelector, useAppDispatch} from '../store/store';
import {setHasNewMessages} from '../store/slices/chatSlice';
import {EventNames} from '../const/enums';
import {useChatService} from './useChatService';

export const useEvent = () => {
  const dispatch = useAppDispatch();
  const event = useAppSelector(state => state.event);
  const {getChatToken} = useChatService();

  const handleChatScreenOpened = () => {
    dispatch(setHasNewMessages(false));
  };

  const handleLoginSuccess = () => {
    getChatToken(event.data.token);
  };

  const main = (eventName: string, data?: any) => {
    switch (eventName) {
      case EventNames.CHAT_SCREEN_OPENED:
        handleChatScreenOpened();
        break;
      case EventNames.LOGIN_SUCCESS:
        handleLoginSuccess();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (event.slug) {
      main(event.slug, event.data);
    }
  }, [event.slug, event.data]);

  return {main};
};
