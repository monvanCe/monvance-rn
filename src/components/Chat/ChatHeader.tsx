import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import {useTheme as useAppTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';
import {Text} from '../ui/Text';
import {t} from '../../localization';

interface ChatHeaderProps {
  onNavigateToTab: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({onNavigateToTab}) => {
  const {theme: appTheme} = useAppTheme();

  const colors = appTheme.colors;

  const styles = style(appTheme, colors);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onNavigateToTab}>
        <Icon name="arrow-left" size={22} color={colors.onSurfaceContent} />
      </TouchableOpacity>
      <Text style={styles.title}>{t('chats')}</Text>
    </View>
  );
};

const style = (appTheme: any, colors: any) => ({
  headerContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.background,
    height: 56,
    paddingHorizontal: appTheme.ui.spacing,
    paddingTop: appTheme.ui.spacing,
    paddingBottom: appTheme.ui.spacing / 2,
  },
  backButton: {
    position: 'absolute' as const,
    left: appTheme.ui.spacing,
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 999,
    zIndex: 2,
  },
  title: {
    fontSize: appTheme.ui.fontSize * 1.125,
    color: colors.onSurfaceContent,
    fontWeight: '700' as const,
    textAlign: 'center' as const,
    flex: 1,
  },
});
