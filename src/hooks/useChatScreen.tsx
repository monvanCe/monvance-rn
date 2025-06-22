import {FlashList} from '@shopify/flash-list';
import {useRef, useState} from 'react';

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

const SAMPLE_MESSAGES: IMessage[] = [
  {
    _id: '1',
    userId: 'user1',
    username: 'John Doe',
    message: 'Merhaba! Nasılsın?',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    _id: '2',
    userId: 'user2',
    username: 'Jane Smith',
    message: 'İyiyim, teşekkürler! Sen nasılsın?',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    _id: '3',
    userId: 'user1',
    username: 'John Doe',
    message: 'Ben de iyiyim. Bugün hava çok güzel!',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
];

export const useChatScreen = () => {
  const scrollViewRef = useRef<FlashList<IMessage>>(null);
  const userColorsRef = useRef<{[key: string]: string}>({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>(SAMPLE_MESSAGES);

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
      const newMessage: IMessage = {
        _id: Date.now().toString(),
        userId: 'user1',
        username: 'John Doe',
        message: message.trim(),
        avatar: 'https://i.pravatar.cc/150?img=1',
      };
      setMessages([...messages, newMessage]);
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
