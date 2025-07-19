import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {useTheme as useAppTheme} from '../../context/ThemeContext';
import {useTheme} from '../../context/ThemeContext';
import {Text} from '../ui/Text';

interface ChatMessageProps {
  message: IMessage;
  index: number;
  messages: IMessage[];
  getUserColor: (userId: string) => string;
  variant?: 'contained' | 'outlined' | 'text';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  index,
  messages,
  getUserColor,
  variant,
}) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {theme: appTheme} = useAppTheme();

  const resolvedVariant = variant || theme.theme.ui.defaultVariant;
  const isContained = resolvedVariant === 'contained';
  const isOutlined = resolvedVariant === 'outlined';

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
      borderColor: colors.outline,
      marginHorizontal: appTheme.ui.spacing / 2,
    },
    messageBubble: {
      padding: appTheme.ui.spacing * 1.5,
      borderRadius: appTheme.ui.radius,
      backgroundColor: isContained
        ? isCurrentUser
          ? colors.primary
          : colors.surface
        : isOutlined
        ? 'transparent'
        : colors.surface,
      borderWidth: isOutlined ? appTheme.ui.borderWidth : 0,
      borderColor: isOutlined ? colors.outline : 'transparent',
    },
    messageText: {
      color: colors.onSurface,
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
          {isFirstInGroup && !isCurrentUser && (
            <Text
              style={[
                styles.username,
                {
                  color: colors.primary,
                  textAlign: 'left',
                  marginLeft: appTheme.ui.spacing / 2,
                  marginRight: 0,
                },
              ]}>
              {message.username}
            </Text>
          )}
          {isFirstInGroup && isCurrentUser ? (
            <View
              style={{
                height: styles.username.fontSize + styles.username.marginBottom,
              }}
            />
          ) : null}
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: isCurrentUser
                  ? colors.primary
                  : colors.surface,
                borderRadius: 20,
                marginBottom: 2,
                minWidth: 80,
                maxWidth: '100%',
              },
            ]}>
            <Text
              style={[
                styles.messageText,
                {
                  color: isCurrentUser ? colors.background : colors.onSurface,
                },
              ]}>
              {message.message}
            </Text>
            <Text
              style={{
                color: isCurrentUser
                  ? colors.background
                  : colors.onSurfaceVariant,
                fontSize: 13,
                marginTop: 8,
                marginLeft: isCurrentUser ? 0 : 2,
                marginRight: isCurrentUser ? 2 : 0,
                textAlign: 'left',
              }}>
              {(message as any).createdAt || '10:00'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
