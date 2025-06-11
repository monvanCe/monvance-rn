import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: {
    name: string;
    size?: number;
    color?: string;
  };
  showClearButton?: boolean;
}

export const TextInput = ({
  value,
  onChangeText,
  placeholder = '',
  leftIcon,
  showClearButton = true,
}: TextInputProps) => {
  return (
    <View style={styles.container}>
      {leftIcon && (
        <MaterialIcons
          name={leftIcon.name}
          size={leftIcon.size || 24}
          color={leftIcon.color || '#666'}
          style={styles.leftIcon}
        />
      )}
      <RNTextInput
        style={[
          styles.input,
          leftIcon && styles.inputWithLeftIcon,
          showClearButton && styles.inputWithRightIcon,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      {showClearButton && value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clearButton}>
          <MaterialIcons name="close" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
});
