import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useChatScreen} from '../hooks/useChatScreen';
import {ChatHeader} from '../components/Chat/ChatHeader';
import {ChatMessagesList} from '../components/Chat/ChatMessagesList';
import {ChatInput} from '../components/Chat/ChatInput';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

interface ChatScreenProps {
  onNavigateToTab: () => void;
}

export default function ChatScreen({onNavigateToTab}: ChatScreenProps) {
  const theme = useTheme();
  const {
    scrollViewRef,
    message,
    setMessage,
    uniqueMessages,
    getUserColor,
    scrollToBottom,
    handleSend,
  } = useChatScreen();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <ChatHeader onNavigateToTab={onNavigateToTab} />
      <ChatMessagesList
        scrollViewRef={scrollViewRef}
        messages={uniqueMessages}
        getUserColor={getUserColor}
        scrollToBottom={scrollToBottom}
      />
      <ChatInput
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        scrollToBottom={scrollToBottom}
      />
    </GestureHandlerRootView>
  );
}
