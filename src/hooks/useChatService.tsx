import {useEffect} from 'react';
import {internalService} from '../service/internalServices';
import {eventBus} from '../middleware/eventMiddleware';

export const useChatService = () => {
  const getMessages = async () => {
    await internalService.getMessagesByChatId();
  };

  useEffect(() => {
    eventBus.on('loginSuccess', getMessages);
  }, []);
};
