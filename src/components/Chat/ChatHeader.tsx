import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useTheme as useAppTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ChatHeaderProps {
  onNavigateToTab: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({onNavigateToTab}) => {
  const theme = useTheme();
  const {theme: appTheme} = useAppTheme();

  const styles = StyleSheet.create({
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
  });

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onNavigateToTab}>
        <Icon name="arrow-left" size={20} color={theme.colors.onSurface} />
      </TouchableOpacity>
      <Text style={styles.title}>Sohbetler</Text>
    </View>
  );
};
