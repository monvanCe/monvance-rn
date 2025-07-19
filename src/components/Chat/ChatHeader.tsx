import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {useTheme as useAppTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';
import {Text} from '../ui/Text';
import {t} from '../../localization';

interface ChatHeaderProps {
  onNavigateToTab: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({onNavigateToTab}) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {theme: appTheme} = useAppTheme();

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      height: 56,
      paddingHorizontal: appTheme.ui.spacing,
      paddingTop: appTheme.ui.spacing,
      paddingBottom: appTheme.ui.spacing / 2,
    },
    backButton: {
      position: 'absolute',
      left: appTheme.ui.spacing,
      backgroundColor: 'transparent',
      padding: 8,
      borderRadius: 999,
      zIndex: 2,
    },
    title: {
      fontSize: 18,
      color: colors.onSurface,
      fontWeight: '700',
      textAlign: 'center',
      flex: 1,
    },
  });

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onNavigateToTab}>
        <Icon name="arrow-left" size={22} color={colors.onSurfaceVariant} />
      </TouchableOpacity>
      <Text style={styles.title}>{t('sohbetler')}</Text>
    </View>
  );
};
