import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useTheme as useAppTheme} from '../context/ThemeContext';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

interface IMessage {
  _id: string;
  userId: string;
  username: string;
  message: string;
  avatar: string;
}

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

interface ChatScreenProps {
  onNavigateToTab: () => void;
}

export default function ChatScreen({onNavigateToTab}: ChatScreenProps) {
  const theme = useTheme();
  const {theme: appTheme} = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
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
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    } else {
      scrollViewRef.current?.scrollToEnd({animated: true});
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: appTheme.ui.spacing,
      borderBottomWidth: appTheme.ui.borderWidth,
      borderBottomColor: theme.colors.outline,
    },
    backButton: {
      padding: appTheme.ui.spacing / 2,
      marginRight: appTheme.ui.spacing / 2,
      backgroundColor: theme.colors.surface,
      borderRadius: appTheme.ui.radius,
    },
    title: {
      fontSize: 20,
      color: theme.colors.onSurface,
      fontWeight: 'bold',
    },
    messagesContainer: {
      flex: 1,
      paddingVertical: appTheme.ui.spacing,
    },
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
    inputContainer: {
      flexDirection: 'row',
      padding: appTheme.ui.spacing,
      backgroundColor: theme.colors.surface,
      borderTopWidth: appTheme.ui.borderWidth,
      borderTopColor: theme.colors.outline,
      height: 60,
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: appTheme.ui.radius,
      paddingHorizontal: appTheme.ui.spacing,
      paddingVertical: appTheme.ui.spacing / 2,
      marginRight: appTheme.ui.spacing,
      color: theme.colors.onSurface,
      height: 36,
    },
    sendButton: {
      backgroundColor: theme.colors.background,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: appTheme.ui.borderWidth,
      borderColor: theme.colors.outline,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onNavigateToTab}>
          <Icon name="arrow-left" size={20} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>Sohbetler</Text>
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={{
          paddingBottom: appTheme.ui.spacing * 2,
        }}
        onContentSizeChange={() => scrollToBottom(false)}>
        {uniqueMessages.map((msg, index) => {
          const isCurrentUser = msg.userId === 'user1';
          const previousMessage = index > 0 ? uniqueMessages[index - 1] : null;
          const nextMessage =
            index < messages.length - 1 ? messages[index + 1] : null;

          const isFirstInGroup =
            !previousMessage || previousMessage.userId !== msg.userId;
          const isLastInGroup =
            !nextMessage || nextMessage.userId !== msg.userId;
          const userColor = getUserColor(msg.userId);

          return (
            <View
              key={msg._id}
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
                  <Image source={{uri: msg.avatar}} style={styles.avatar} />
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
                          marginLeft: isCurrentUser
                            ? 0
                            : appTheme.ui.spacing / 2,
                          marginRight: isCurrentUser
                            ? appTheme.ui.spacing / 2
                            : 0,
                        },
                      ]}>
                      {msg.username}
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
                      {msg.message}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={message}
          onChangeText={setMessage}
          onFocus={() => scrollToBottom(true)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Icon name="send" size={16} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
