import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {useTheme as useAppTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';
import {Text} from '../ui/Text';

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
      padding: appTheme.ui.spacing,
      borderBottomWidth: appTheme.ui.borderWidth,
      borderBottomColor: colors.outline,
    },
    backButton: {
      padding: appTheme.ui.spacing / 2,
      marginRight: appTheme.ui.spacing / 2,
      backgroundColor: colors.surface,
      borderRadius: appTheme.ui.radius,
    },
    title: {
      fontSize: 20,
      color: colors.onSurface,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onNavigateToTab}>
        <Icon name="arrow-left" size={20} color={colors.onSurface} />
      </TouchableOpacity>
      <Text style={styles.title}>Sohbetler</Text>
    </View>
  );
};
