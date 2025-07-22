import React from 'react';
import {FlashList} from '@shopify/flash-list';

import {useTheme as useAppTheme} from '../../context/ThemeContext';
import {ChatMessage} from './ChatMessage';

interface ChatMessagesListProps {
  scrollViewRef: React.RefObject<FlashList<IMessage> | null>;
  messages: IMessage[];
  getUserColor: (userId: string) => string;
  scrollToBottom: (withTimeout?: boolean) => void;
  variant?: 'text' | 'contained' | 'outlined';
}

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  scrollViewRef,
  messages,
  getUserColor,
  scrollToBottom,
  variant,
}) => {
  const {theme: appTheme} = useAppTheme();

  const renderMessage = ({item, index}: {item: IMessage; index: number}) => (
    <ChatMessage
      message={item}
      index={index}
      messages={messages}
      getUserColor={getUserColor}
      variant={variant}
    />
  );

  return (
    <FlashList
      ref={scrollViewRef}
      data={messages}
      renderItem={renderMessage}
      keyExtractor={item => item._id}
      estimatedItemSize={80}
      contentContainerStyle={{
        paddingVertical: appTheme.ui.spacing,
        paddingBottom: appTheme.ui.spacing * 2,
      }}
      onContentSizeChange={() => scrollToBottom(false)}
    />
  );
};
