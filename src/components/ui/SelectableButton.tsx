import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';

interface SelectableButtonProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

const SelectableButton: React.FC<SelectableButtonProps> = ({
  title,
  isSelected,
  onPress,
}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
          backgroundColor: theme.colors.surface,
        },
      ]}
      onPress={onPress}>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: isSelected ? theme.colors.primary : theme.colors.onSurface,
            },
          ]}>
          {title}
        </Text>
        {isSelected && (
          <Icon
            name="check"
            size={16}
            color={theme.colors.primary}
            style={styles.icon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  icon: {
    marginLeft: 4,
  },
});

export default SelectableButton;
