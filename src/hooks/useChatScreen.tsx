import {FlashList} from '@shopify/flash-list';
import {useRef, useState} from 'react';
import {useAppSelector} from '../store/store';

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
  const messages = useAppSelector(state => state.chat.messages);

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

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
      scrollToBottom(false);
    }
  };

  return {
    scrollViewRef,
    message,
    setMessage,
    uniqueMessages,
    getUserColor,
    scrollToBottom,
    handleSend,
  };
};
