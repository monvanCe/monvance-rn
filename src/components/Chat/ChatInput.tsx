import React, {useEffect} from 'react';
import {View, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import {useTheme as useAppTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';
import {t} from '../../localization';

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
  const {theme: appTheme} = useAppTheme();
  const colors = appTheme.colors;

  const styles = style(appTheme, colors);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollToBottom(true);
      },
    );

    return () => {
      keyboardDidShowListener?.remove();
    };
  }, [scrollToBottom]);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={t('write_message')}
        placeholderTextColor={colors.onSurface}
        value={message}
        onChangeText={setMessage}
        onFocus={() => scrollToBottom(true)}
        multiline={false}
        maxLength={500}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Icon name="send" size={16} color={colors.onSurface} />
      </TouchableOpacity>
    </View>
  );
};

const style = (appTheme: any, colors: any) => ({
  inputContainer: {
    flexDirection: 'row' as const,
    padding: appTheme.ui.spacing,
    backgroundColor: colors.surface,
    borderTopWidth: appTheme.ui.borderWidth,
    borderTopColor: colors.outline,
    height: 60,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingHorizontal: appTheme.ui.spacing,
    paddingVertical: appTheme.ui.spacing / 2,
    marginRight: appTheme.ui.spacing,
    color: colors.onSurface,
    height: 36,
  },
  sendButton: {
    backgroundColor: colors.background,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: appTheme.ui.borderWidth,
    borderColor: colors.outline,
  },
});
