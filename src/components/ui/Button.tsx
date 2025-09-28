import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme as useAppTheme} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';
import {Button as PaperButton} from 'react-native-paper';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  leftIcon?: string;
  rightIcon?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'text' | 'contained' | 'outlined';
  style?: StyleProp<ViewStyle>;
}

export const Button = ({
  onPress,
  children,
  leftIcon,
  rightIcon,
  disabled = false,
  loading = false,
  variant,
  style,
}: ButtonProps) => {
  const {theme: appTheme} = useAppTheme();
  const theme = useTheme();
  const colors = theme.theme.colors;
  const buttonStyle = {
    borderRadius: appTheme.ui.radius,
    borderWidth: variant === 'outlined' ? appTheme.ui.borderWidth : 0,
  };

  const contentStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: appTheme.ui.spacing / 2,
  };

  const styles = StyleSheet.create({
    button: {
      justifyContent: 'center',
      backgroundColor:
        variant === 'contained'
          ? colors.brand
          : variant === 'outlined'
          ? 'transparent'
          : 'transparent',
      borderColor: variant === 'outlined' ? colors.border : 'transparent',
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
      mode={variant || appTheme.ui.defaultVariant}
      style={[styles.button, buttonStyle, style]}
      textColor={variant === 'contained' ? colors.text : colors.brand}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      contentStyle={contentStyle}
      icon={({size, color}: {size: number; color: string}) => (
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
