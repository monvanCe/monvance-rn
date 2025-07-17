import React from 'react';
import {Switch as PaperSwitch} from 'react-native-paper';

import {useTheme as useAppTheme} from '../../context/ThemeContext';
import {useTheme} from '../../context/ThemeContext';

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
  const colors = theme.theme.colors;
  const {theme: appTheme} = useAppTheme();

  return (
    <PaperSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      color={colors.primary}
      style={{
        transform: [{scale: 0.9}],
      }}
    />
  );
};
