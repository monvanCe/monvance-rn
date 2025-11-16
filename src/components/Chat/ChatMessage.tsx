import React from 'react';
import {View, Image, Dimensions} from 'react-native';

import {useTheme as useAppTheme} from '../../context/ThemeContext';
import {useTheme} from '../../context/ThemeContext';
import {Text} from '../ui/Text';
import {useAppSelector} from '../../store/store';
import {timeParserHour} from '../../utils/timeUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {t} from '../../localization';

interface ChatMessageProps {
  message: IMessage;
  index: number;
  messages: IMessage[];
  variant?: 'contained' | 'outlined' | 'text';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  index,
  messages,
  variant,
}) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {theme: appTheme} = useAppTheme();
  const user = useAppSelector(state => state.auth);
  const resolvedVariant = variant || theme.theme.ui.defaultVariant;
  const isContained = resolvedVariant === 'contained';
  const isOutlined = resolvedVariant === 'outlined';

  const isCurrentUser = message.userId?._id === user._id || false;
  const previousMessage = index > 0 ? messages[index - 1] : null;
  const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

  const isFirstInGroup =
    !previousMessage || previousMessage.userId !== message.userId;
  const isLastInGroup = !nextMessage || nextMessage.userId !== message.userId;

  const windowWidth = Dimensions.get('window').width;
  const styles = style(
    appTheme,
    colors,
    isCurrentUser,
    isContained,
    isOutlined,
    windowWidth,
  );

  return (
    <View
      style={[
        styles.messageWrapper,
        isLastInGroup && styles.lastInGroup,
        {alignSelf: isCurrentUser ? 'flex-end' : 'flex-start'},
      ]}>
      <View
        style={[
          styles.messageRow,
          isCurrentUser ? styles.rowReverse : styles.row,
        ]}>
        {isLastInGroup && message?.userId?.avatar ? (
          <Image source={{uri: message.userId.avatar}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={styles.messageContent}>
          {isFirstInGroup && !isCurrentUser && (
            <Text style={[styles.username, {color: colors.brand}]}>
              {message?.userId?.username || t('unknown_user')}
            </Text>
          )}
          {/* {isFirstInGroup && isCurrentUser ? (
            <View style={styles.usernameSpacer} />
          ) : null} */}
          <View style={styles.messageBubble}>
            <Text
              style={[
                styles.messageText,
                isCurrentUser && styles.messageTextCurrentUser,
              ]}>
              {message.message}
            </Text>
            <View style={styles.timeRow}>
              <Text
                style={[
                  styles.messageTime,
                  isCurrentUser
                    ? styles.messageTimeCurrentUser
                    : styles.messageTimeOther,
                ]}>
                {message.createdAt
                  ? timeParserHour(message.createdAt)
                  : '10:00'}
              </Text>
              {isCurrentUser && (
                <Icon
                  name={
                    !message.status
                      ? 'check'
                      : message.status === 'pending'
                      ? 'clock-time-four-outline'
                      : message.status === 'failed'
                      ? 'close'
                      : 'check'
                  }
                  size={16}
                  color={colors.onSurfaceContent}
                  style={styles.statusIcon}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const style = (
  appTheme: any,
  colors: any,
  isCurrentUser: boolean,
  isContained: boolean,
  isOutlined: boolean,
  windowWidth: number,
) => ({
  messageWrapper: {
    marginBottom: appTheme.ui.spacing / 4,
    maxWidth: windowWidth * 0.75,
  },
  lastInGroup: {
    marginBottom: appTheme.ui.spacing,
  },
  messageRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
  },
  row: {
    flexDirection: 'row' as const,
  },
  rowReverse: {
    flexDirection: 'row-reverse' as const,
  },
  messageContent: {
    maxWidth: windowWidth * 0.85,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: appTheme.ui.borderWidth,
    borderColor: colors.outline,
    marginHorizontal: appTheme.ui.spacing / 2,
  },
  avatarPlaceholder: {
    width: 32 + appTheme.ui.spacing,
  },
  messageBubble: {
    padding: appTheme.ui.spacing * 1.5,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: isOutlined ? appTheme.ui.borderWidth : 0,
    borderColor: isOutlined ? colors.outline : 'transparent',
    marginBottom: 2,
    minWidth: 80,
    maxWidth: windowWidth * 0.85,
  },
  timeRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginTop: 4,
  },
  messageTime: {
    fontSize: 13,
    textAlign: 'left' as const,
  },
  statusIcon: {
    marginLeft: 8,
  },
  messageText: {
    color: colors.text,
    fontSize: 14,
  },
  messageTextCurrentUser: {
    color: colors.text,
  },
  username: {
    fontSize: 12,
    marginBottom: appTheme.ui.spacing / 4,
    paddingHorizontal: appTheme.ui.spacing / 2,
    textAlign: 'left' as const,
    marginLeft: appTheme.ui.spacing / 2,
    marginRight: 0,
  },
  usernameSpacer: {
    height: 12 + appTheme.ui.spacing / 4,
  },

  messageTimeCurrentUser: {
    color: colors.text,
    marginLeft: 0,
    marginRight: 2,
  },
  messageTimeOther: {
    color: colors.textSecondary,
    marginLeft: 2,
    marginRight: 0,
  },
});
