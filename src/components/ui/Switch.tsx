import React from 'react';
import {Switch as PaperSwitch} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {useTheme as useAppTheme} from '../../context/ThemeContext';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Switch = ({
  value,
  onValueChange,
  disabled = false,
}: SwitchProps) => {
  const theme = useTheme();
  const {theme: appTheme} = useAppTheme();

  return (
    <PaperSwitch
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
