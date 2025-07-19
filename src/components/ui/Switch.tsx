import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  variant?: 'text' | 'contained' | 'outlined';
}

export const Switch = ({
  value,
  onValueChange,
  disabled = false,
  variant,
}: SwitchProps) => {
  const theme = useTheme();
  const colors = theme.theme.colors;

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const switchStyle = {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: value ? colors.primary : colors.surface,
    padding: 2,
    position: 'relative' as const,
  };

  const thumbStyle = {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: value ? colors.surface : colors.outline,
    position: 'absolute' as const,
    top: 2,
    left: value ? 24 : 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={switchStyle}
      activeOpacity={0.8}>
      <View style={thumbStyle} />
    </TouchableOpacity>
  );
};
