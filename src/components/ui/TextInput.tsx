import React from 'react';

import {TextInput as PaperTextInput} from 'react-native-paper';
import {useTheme as useAppTheme} from '../../context/ThemeContext';
import {useTheme} from '../../context/ThemeContext';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  error?: boolean;
  isFilled?: boolean;
}

export const TextInput = ({
  value,
  onChangeText,
  placeholder = '',
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  error = false,
  isFilled,
}: TextInputProps) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {theme: appTheme} = useAppTheme();

  const inputStyle = {};

  const outlineStyle = {
    borderRadius: appTheme.ui.radius,
    borderWidth: isFilled ?? appTheme.ui.isFilled ? 0 : appTheme.ui.borderWidth,
    borderColor: colors.outline,
    elevation: isFilled ?? appTheme.ui.isFilled ? appTheme.ui.elevation : 0,
    backgroundColor:
      isFilled ?? appTheme.ui.isFilled ? colors.surface : 'transparent',
  };

  return (
    <PaperTextInput
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      left={leftIcon ? <PaperTextInput.Icon icon={leftIcon} /> : undefined}
      right={
        rightIcon ? (
          <PaperTextInput.Icon icon={rightIcon} onPress={onRightIconPress} />
        ) : undefined
      }
      style={[inputStyle]}
      outlineStyle={outlineStyle}
      outlineColor={error ? colors.error : colors.outline}
      activeOutlineColor={colors.primary}
      textColor={colors.onSurface}
      placeholderTextColor={colors.onSurfaceVariant}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      numberOfLines={numberOfLines}
      error={error}
    />
  );
};
