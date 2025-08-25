import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../context/ThemeContext';
import {Text} from './Text';
import NotificationIcon from '../NotificationIcon';
import {useAppSelector} from '../../store/store';
import {eventBus} from '../../middleware/eventMiddleware';

export interface HeaderAction {
  iconName: string;
  onPress: () => void;
  iconLibrary?: 'MaterialIcons' | 'MaterialCommunityIcons';
  size?: number;
  color?: string;
}

interface ScreenHeaderProps {
  title: string;
  showNotification?: boolean;
  actions?: HeaderAction[];
  backgroundColor?: string;
  showChat?: boolean; // Still allow disabling chat if needed
  rightExtra?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showNotification = true,
  actions = [],
  backgroundColor,
  showChat = true, // Default to true - show chat everywhere
  rightExtra,
}) => {
  const {theme} = useTheme();
  const styles = style(theme);

  // Get chat state from Redux to check for new messages
  const chatState = useAppSelector(state => state.chat);
  const hasNewMessages = chatState?.hasNewMessages || false;

  const onNavigateToChat = () => {
    // Use the event bus to trigger chat navigation
    // This will be handled by TabNavigationWrapper
    eventBus.emit('navigateToChat', null);
  };

  const renderAction = (action: HeaderAction, index: number) => {
    const IconComponent =
      action.iconLibrary === 'MaterialCommunityIcons'
        ? require('react-native-vector-icons/MaterialCommunityIcons').default
        : Icon;

    return (
      <TouchableOpacity
        key={index}
        onPress={action.onPress}
        style={styles.actionButton}>
        <IconComponent
          name={action.iconName}
          size={action.size || theme.ui.spacing * 3}
          color={action.color || theme.colors.onSurface}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, backgroundColor && {backgroundColor}]}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.rightContainer}>
        {rightExtra}
        {actions.map(renderAction)}
        {showNotification && <NotificationIcon />}
        {showChat && (
          <View style={styles.chatWrapper}>
            <TouchableOpacity
              onPress={onNavigateToChat}
              style={styles.chatButton}>
              <Icon
                name="chat"
                size={theme.ui.spacing * 3.5}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            {hasNewMessages && <View style={styles.newMessageBadge} />}
          </View>
        )}
      </View>
    </View>
  );
};

const style = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.ui.spacing * 2,
      paddingTop: theme.ui.spacing * 2,
      paddingBottom: theme.ui.spacing * 2,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      fontSize: theme.ui.fontSize * 2,
      fontWeight: '700',
      color: theme.colors.onSurface,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.ui.spacing,
    },
    actionButton: {
      padding: theme.ui.spacing * 0.5,
    },
    chatWrapper: {
      position: 'relative',
    },
    chatButton: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 100,
      padding: theme.ui.spacing,
    },
    newMessageBadge: {
      position: 'absolute',
      top: theme.ui.spacing / 2.5,
      right: theme.ui.spacing / 2.5,
      backgroundColor: theme.colors.error,
      width: theme.ui.spacing * 1.5,
      height: theme.ui.spacing * 1.5,
      borderRadius: theme.ui.spacing * 0.75,
      borderWidth: theme.ui.borderWidth * 2,
      borderColor: theme.colors.background,
      zIndex: 2,
    },
  });

export default ScreenHeader;
