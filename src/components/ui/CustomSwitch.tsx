import React from 'react';
import {Switch} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {useTheme as useAppTheme} from '../../context/ThemeContext';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const CustomSwitch = ({
  value,
  onValueChange,
  disabled = false,
}: CustomSwitchProps) => {
  const theme = useTheme();
  const {theme: appTheme} = useAppTheme();

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      color={theme.colors.primary}
      style={{
        transform: [{scale: 0.9}],
      }}
    />
  );
};
