import {useEffect} from 'react';
import {internalService} from '../service/internalServices';
import {eventBus} from '../middleware/eventMiddleware';
import {CHAT_ID} from '../const/env';

export const useChatService = () => {
  const getMessages = async () => {
    await internalService.getMessagesByChatId(CHAT_ID);
  };

  useEffect(() => {
    eventBus.on('loginSuccess', getMessages);
  }, []);
};
