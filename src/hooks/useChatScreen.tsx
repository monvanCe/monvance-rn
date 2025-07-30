import {FlashList} from '@shopify/flash-list';
import {useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../store/store';
import {addMessage} from '../store/slices/chatSlice';
import {internalService} from '../service/internalServices';

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B59B6',
  '#3498DB',
  '#1ABC9C',
];

export const useChatScreen = () => {
  const scrollViewRef = useRef<FlashList<IMessage>>(null);
  const userColorsRef = useRef<{[key: string]: string}>({});
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

  const getUserColor = (userId: string) => {
    if (!userColorsRef.current[userId]) {
      const availableColors = COLORS.filter(
        color => !Object.values(userColorsRef.current).includes(color),
      );
      const colorToUse =
        availableColors.length > 0
          ? availableColors[Math.floor(Math.random() * availableColors.length)]
          : COLORS[Math.floor(Math.random() * COLORS.length)];
      userColorsRef.current[userId] = colorToUse;
    }
    return userColorsRef.current[userId];
  };

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
        chatId: '684f15946720dfaafba07b89',
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
      internalService.sendMessage('684f15946720dfaafba07b89', message, localId);
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
    getUserColor,
    scrollToBottom,
    handleSend,
    showUsernameModal,
    handleUsernameSetupSuccess,
    handleUsernameSetupClose,
  };
};
