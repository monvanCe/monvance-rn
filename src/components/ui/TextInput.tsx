import React from 'react';
import {StyleSheet} from 'react-native';
import {TextInput as PaperTextInput, useTheme} from 'react-native-paper';
import {useTheme as useAppTheme} from '../../context/ThemeContext';

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
  const {theme: appTheme} = useAppTheme();

  const inputStyle = {};

  const outlineStyle = {
    borderRadius: appTheme.ui.radius,
    borderWidth: isFilled ?? appTheme.ui.isFilled ? 0 : appTheme.ui.borderWidth,
    borderColor: appTheme.colors.outline,
    elevation: isFilled ?? appTheme.ui.isFilled ? appTheme.ui.elevation : 0,
    backgroundColor:
      isFilled ?? appTheme.ui.isFilled ? theme.colors.surface : 'transparent',
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
      outlineColor={error ? theme.colors.error : theme.colors.outline}
      activeOutlineColor={theme.colors.primary}
      textColor={theme.colors.onSurface}
      placeholderTextColor={theme.colors.onSurfaceVariant}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      numberOfLines={numberOfLines}
      error={error}
    />
  );
};
