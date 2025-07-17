import React from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {useTheme as useAppTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSend: () => void;
  scrollToBottom: (withTimeout?: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSend,
  scrollToBottom,
}) => {
  const theme = useTheme();

  const {theme: appTheme} = useAppTheme();

  const styles = StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      padding: appTheme.ui.spacing,
      backgroundColor: theme.theme.colors.surface,
      borderTopWidth: appTheme.ui.borderWidth,
      borderTopColor: theme.theme.colors.outline,
      height: 60,
    },
    input: {
      flex: 1,
      backgroundColor: theme.theme.colors.background,
      borderRadius: appTheme.ui.radius,
      paddingHorizontal: appTheme.ui.spacing,
      paddingVertical: appTheme.ui.spacing / 2,
      marginRight: appTheme.ui.spacing,
      color: theme.theme.colors.onSurface,
      height: 36,
    },
    sendButton: {
      backgroundColor: theme.theme.colors.background,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: appTheme.ui.borderWidth,
      borderColor: theme.theme.colors.outline,
    },
  });

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Mesajınızı yazın..."
        placeholderTextColor={theme.theme.colors.onSurfaceVariant}
        value={message}
        onChangeText={setMessage}
        onFocus={() => scrollToBottom(true)}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Icon name="send" size={16} color={theme.theme.colors.onSurface} />
      </TouchableOpacity>
    </View>
  );
};
