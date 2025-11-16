import {FlashList} from '@shopify/flash-list';
import {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../store/store';
import {addMessage} from '../store/slices/chatSlice';
import {internalService} from '../service/internalServices';
import {CHAT_ID} from '../const/env';

export const useChatScreen = () => {
  const scrollViewRef = useRef<FlashList<IMessage>>(null);
  const [message, setMessage] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const messages = useAppSelector(state => state.chat.messages);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth);

  const uniqueMessages = messages.reduce((acc: IMessage[], message) => {
    const existing = acc.find(m => m._id === message._id);
    if (!existing) {
      return [...acc, message];
    }
    return acc;
  }, []);

  const scrollToBottom = (withTimeout = true) => {
    if (withTimeout) {
      setTimeout(() => {
        if (scrollViewRef.current && uniqueMessages.length > 0) {
          scrollViewRef.current.scrollToIndex({
            index: uniqueMessages.length - 1,
            animated: true,
          });
        }
      }, 100);
    } else {
      if (scrollViewRef.current && uniqueMessages.length > 0) {
        scrollViewRef.current.scrollToIndex({
          index: uniqueMessages.length - 1,
          animated: true,
        });
      }
    }
  };

  const handleSend = async () => {
    if (!user.username) {
      setShowUsernameModal(true);
      return;
    }

    if (message.trim()) {
      const localId = `${Date.now()}_${Math.random()}`;
      const now = new Date().toISOString();
      const optimisticMessage: IMessage = {
        _id: localId,
        chatId: CHAT_ID,
        userId: {
          _id: user._id || '',
          username: user.username || '',
          avatar: user.avatar || '',
        },
        message,
        createdAt: now,
        updatedAt: now,
        localId,
        status: 'pending',
      };
      dispatch(addMessage(optimisticMessage));
      setMessage('');
      scrollToBottom(false);
      internalService.sendMessage(CHAT_ID, message, localId);
    }
  };

  const handleUsernameSetupSuccess = () => {
    setShowUsernameModal(false);
  };

  const handleUsernameSetupClose = () => {
    setShowUsernameModal(false);
  };

  return {
    scrollViewRef,
    message,
    setMessage,
    uniqueMessages,
    scrollToBottom,
    handleSend,
    showUsernameModal,
    handleUsernameSetupSuccess,
    handleUsernameSetupClose,
  };
};
