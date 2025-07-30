import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {Text} from './Text';

interface DebouncedInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onDebouncedChange: (text: string) => void;
  debounceDelay?: number;
  error?: string;
  success?: string;
  loading?: boolean;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onChangeText,
  placeholder,
  onDebouncedChange,
  debounceDelay = 1000,
  error,
  success,
  loading,
}) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(() => {
    onDebouncedChange(value);
  }, [onDebouncedChange, value]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.trim()) {
      timeoutRef.current = setTimeout(debouncedCallback, debounceDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, debouncedCallback, debounceDelay]);

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.theme.ui.spacing,
    },
    input: {
      borderWidth: theme.theme.ui.borderWidth,
      borderColor: error
        ? colors.error
        : success
        ? colors.green
        : colors.outline,
      borderRadius: theme.theme.ui.radius,
      padding: theme.theme.ui.spacing,
      fontSize: theme.theme.ui.fontSize,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    messageContainer: {
      marginTop: theme.theme.ui.spacing / 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    messageText: {
      fontSize: theme.theme.ui.fontSize - 2,
      marginLeft: theme.theme.ui.spacing / 2,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceVariant}
      />
      {(error || success || loading) && (
        <View style={styles.messageContainer}>
          {loading && (
            <Text
              style={[styles.messageText, {color: colors.onSurfaceVariant}]}>
              Checking...
            </Text>
          )}
          {error && (
            <Text style={[styles.messageText, {color: colors.error}]}>
              {error}
            </Text>
          )}
          {success && (
            <Text style={[styles.messageText, {color: colors.green}]}>
              {success}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};
