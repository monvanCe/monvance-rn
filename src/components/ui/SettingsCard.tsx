import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

interface SettingsCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SettingsCard: React.FC<SettingsCardProps> = ({children, style}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.ui.radius,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const createStyles = (_theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    card: {
      padding: 18,
      marginBottom: 0,
      marginTop: 0,
      marginHorizontal: 0,
      gap: 8,
    },
  });

export default SettingsCard; 