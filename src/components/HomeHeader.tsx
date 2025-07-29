import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Text} from './ui/Text';
import {t} from '../localization';

import NotificationIcon from './NotificationIcon';

type HomeHeaderProps = {
  onNavigateToChat: () => void;
  hasNewMessages: boolean;
  appTheme: any;
};

const HomeHeader = ({
  onNavigateToChat,
  hasNewMessages,
  appTheme,
}: HomeHeaderProps) => {
  const styles = style(appTheme);
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{t('markets')}</Text>
      <View style={styles.rightRow}>
        <NotificationIcon />
        <View style={styles.chatWrapper}>
          <TouchableOpacity
            onPress={onNavigateToChat}
            style={styles.chatButton}>
            <Icon
              name="chat"
              size={appTheme.ui.spacing * 3.5}
              color={appTheme.colors.primary}
            />
          </TouchableOpacity>
          {hasNewMessages && <View style={styles.newMessageBadge} />}
        </View>
      </View>
    </View>
  );
};

const style = (appTheme: any) => ({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: appTheme.ui.spacing * 2,
    paddingTop: appTheme.ui.spacing * 2,
    paddingBottom: appTheme.ui.spacing * 2,
  },
  headerTitle: {
    fontSize: appTheme.ui.fontSize * 2,
    fontWeight: '700' as const,
    color: appTheme.colors.onSurface,
  },
  rightRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  chatWrapper: {
    position: 'relative' as const,
  },
  chatButton: {
    backgroundColor: appTheme.colors.surfaceVariant,
    borderRadius: 100,
    padding: appTheme.ui.spacing,
  },
  newMessageBadge: {
    position: 'absolute' as const,
    top: appTheme.ui.spacing / 2.5,
    right: appTheme.ui.spacing / 2.5,
    backgroundColor: appTheme.colors.error,
    width: appTheme.ui.spacing * 1.5,
    height: appTheme.ui.spacing * 1.5,
    borderRadius: appTheme.ui.spacing * 0.75,
    borderWidth: appTheme.ui.borderWidth * 2,
    borderColor: appTheme.colors.background,
    zIndex: 2,
  },
});

export default HomeHeader;
