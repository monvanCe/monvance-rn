import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button as PaperButton, useTheme} from 'react-native-paper';
import {useTheme as useAppTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  leftIcon?: string;
  rightIcon?: string;
  disabled?: boolean;
  loading?: boolean;
  isFilled?: boolean;
  style?: any;
}

export const Button = ({
  onPress,
  children,
  leftIcon,
  rightIcon,
  disabled = false,
  loading = false,
  isFilled,
  style,
}: ButtonProps) => {
  const theme = useTheme();
  const {theme: appTheme} = useAppTheme();

  const buttonStyle = {
    borderRadius: appTheme.ui.radius,
    borderWidth: appTheme.ui.borderWidth,
  };

  const contentStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: appTheme.ui.spacing / 2,
  };

  const styles = StyleSheet.create({
    button: {
      justifyContent: 'center',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftIcon: {
      marginRight: appTheme.ui.spacing / 2,
    },
    rightIcon: {
      marginLeft: appTheme.ui.spacing / 2,
    },
  });

  return (
    <PaperButton
      mode={isFilled ?? appTheme.ui.isFilled ? 'contained' : 'outlined'}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      style={[styles.button, buttonStyle, style]}
      contentStyle={contentStyle}
      icon={({size, color}) => (
        <View style={styles.iconContainer}>
          {leftIcon && (
            <Icon
              name={leftIcon}
              size={size}
              color={color}
              style={styles.leftIcon}
            />
          )}
          {rightIcon && (
            <Icon
              name={rightIcon}
              size={size}
              color={color}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}>
      {children}
    </PaperButton>
  );
};
