import React from 'react';
import {StyleSheet} from 'react-native';
import {useChatScreen} from '../hooks/useChatScreen';
import {ChatHeader} from '../components/Chat/ChatHeader';
import {ChatMessagesList} from '../components/Chat/ChatMessagesList';
import {ChatInput} from '../components/Chat/ChatInput';
import {UsernameSetupModal} from '../components/UsernameSetupModal';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTheme} from '../context/ThemeContext';
import KeyboardAvoidingView from '../components/ui/KeyboardAvoidingView';

interface ChatScreenProps {
  onNavigateToTab: () => void;
}

export default function ChatScreen({onNavigateToTab}: ChatScreenProps) {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {
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
  } = useChatScreen();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <ChatHeader onNavigateToTab={onNavigateToTab} />
        <ChatMessagesList
          scrollViewRef={scrollViewRef}
          messages={uniqueMessages}
          getUserColor={getUserColor}
          scrollToBottom={scrollToBottom}
          variant="text"
        />
        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          scrollToBottom={scrollToBottom}
        />
      </KeyboardAvoidingView>
      <UsernameSetupModal
        visible={showUsernameModal}
        onClose={handleUsernameSetupClose}
        onSuccess={handleUsernameSetupSuccess}
      />
    </GestureHandlerRootView>
  );
}
