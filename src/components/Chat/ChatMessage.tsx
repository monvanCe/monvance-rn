import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useTheme as useAppTheme} from '../../context/ThemeContext';

interface ChatMessageProps {
  message: IMessage;
  index: number;
  messages: IMessage[];
  getUserColor: (userId: string) => string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  index,
  messages,
  getUserColor,
}) => {
  const theme = useTheme();
  const {theme: appTheme} = useAppTheme();

  const isCurrentUser = message.userId === 'user1';
  const previousMessage = index > 0 ? messages[index - 1] : null;
  const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

  const isFirstInGroup =
    !previousMessage || previousMessage.userId !== message.userId;
  const isLastInGroup = !nextMessage || nextMessage.userId !== message.userId;
  const userColor = getUserColor(message.userId);

  const styles = StyleSheet.create({
    messageWrapper: {
      marginBottom: appTheme.ui.spacing / 4,
      maxWidth: '75%',
    },
    lastInGroup: {
      marginBottom: appTheme.ui.spacing,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    messageContent: {
      maxWidth: '85%',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: appTheme.ui.borderWidth,
      borderColor: theme.colors.outline,
      marginHorizontal: appTheme.ui.spacing / 2,
    },
    messageBubble: {
      padding: appTheme.ui.spacing,
      borderRadius: appTheme.ui.radius,
      backgroundColor: theme.colors.surface,
    },
    messageText: {
      color: theme.colors.onSurface,
      fontSize: 14,
    },
    username: {
      fontSize: 12,
      marginBottom: appTheme.ui.spacing / 4,
      paddingHorizontal: appTheme.ui.spacing / 2,
    },
  });

  return (
    <View
      style={[
        styles.messageWrapper,
        isLastInGroup && styles.lastInGroup,
        {
          alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
        },
      ]}>
      <View
        style={[
          styles.messageRow,
          {
            flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          },
        ]}>
        {isLastInGroup ? (
          <Image source={{uri: message.avatar}} style={styles.avatar} />
        ) : (
          <View
            style={{
              width: 32 + appTheme.ui.spacing,
            }}
          />
        )}
        <View style={styles.messageContent}>
          {isFirstInGroup && (
            <Text
              style={[
                styles.username,
                {
                  color: userColor,
                  textAlign: isCurrentUser ? 'right' : 'left',
                  marginLeft: isCurrentUser ? 0 : appTheme.ui.spacing / 2,
                  marginRight: isCurrentUser ? appTheme.ui.spacing / 2 : 0,
                },
              ]}>
              {message.username}
            </Text>
          )}
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: isCurrentUser
                  ? theme.colors.primary
                  : theme.colors.surfaceVariant,
              },
            ]}>
            <Text
              style={[
                styles.messageText,
                {
                  color: isCurrentUser
                    ? theme.colors.onPrimary
                    : theme.colors.onSurface,
                },
              ]}>
              {message.message}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
