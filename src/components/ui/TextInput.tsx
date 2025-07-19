import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme as useAppTheme} from '../../context/ThemeContext';
import {useTheme} from '../../context/ThemeContext';

interface CustomTextInputProps extends TextInputProps {
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  error?: boolean;
  variant?: 'text' | 'contained' | 'outlined';
}

export const TextInput = ({
  leftIcon,
  rightIcon,
  onRightIconPress,
  error = false,
  variant,
  style,
  ...rest
}: CustomTextInputProps) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {theme: appTheme} = useAppTheme();

  const resolvedVariant = variant || theme.theme.ui.defaultVariant;
  const isContained = resolvedVariant === 'contained';
  const isOutlined = resolvedVariant === 'outlined';
  const isText = resolvedVariant === 'text';

  const inputStyle = [
    styles.input,
    {
      color: colors.onSurface,
      backgroundColor: isContained ? colors.surface : 'transparent',
      borderWidth: isOutlined ? appTheme.ui.borderWidth : 0,
      borderColor: isOutlined
        ? error
          ? colors.error
          : colors.outline
        : 'transparent',
      borderRadius: appTheme.ui.radius,
      paddingLeft: leftIcon ? 36 : appTheme.ui.spacing,
      paddingRight: rightIcon ? 36 : appTheme.ui.spacing,
    },
    isText && {
      borderWidth: 0,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
    style,
  ];

  return (
    <View style={styles.container}>
      {leftIcon && (
        <Icon
          name={leftIcon}
          size={20}
          color={colors.onSurfaceVariant}
          style={[styles.leftIcon, {left: appTheme.ui.spacing}]}
        />
      )}
      <RNTextInput
        {...rest}
        style={inputStyle}
        placeholderTextColor={colors.onSurfaceVariant}
      />
      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={[styles.rightIcon, {right: appTheme.ui.spacing}]}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name={rightIcon} size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    minHeight: 40,
    fontSize: 16,
    paddingVertical: 8,
  },
  leftIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
