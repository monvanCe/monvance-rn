import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Menu, Divider} from 'react-native-paper';

import {useTheme as useAppTheme} from '../../context/ThemeContext';
import {useTheme} from '../../context/ThemeContext';
import {Button} from './Button';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  selectedValue: string;
  onSelect: (value: string) => void;
  items: DropdownItem[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  variant?: 'text' | 'contained' | 'outlined';
}

export const Dropdown = ({
  selectedValue,
  onSelect,
  items,
  placeholder = 'Select...',
  disabled = false,
  error = false,
  helperText,
  variant,
}: DropdownProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();
  const colors = theme.theme.colors;
  const {theme: appTheme} = useAppTheme();
  const selectedItem = items.find(item => item.value === selectedValue);

  const resolvedVariant = variant || theme.theme.ui.defaultVariant;
  const isContained = resolvedVariant === 'contained';
  const isOutlined = resolvedVariant === 'outlined';

  const buttonStyle = {
    borderRadius: appTheme.ui.radius,
    borderWidth: isOutlined ? appTheme.ui.borderWidth : 0,
    backgroundColor: isContained ? colors.surface : 'transparent',
  };

  // Sadece buton ve açılır menü render edilecek
  return (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <Button
          onPress={() => setMenuVisible(true)}
          style={buttonStyle}
          leftIcon={selectedValue ? 'check' : undefined}
          disabled={disabled}
          variant={resolvedVariant}>
          {selectedItem?.label || placeholder}
        </Button>
      }
      contentStyle={[
        styles.menu,
        {
          borderRadius: appTheme.ui.radius,
          borderWidth: appTheme.ui.borderWidth,
          backgroundColor: colors.surface,
          borderColor: colors.outline,
        },
      ]}>
      {items.map(item => (
        <React.Fragment key={item.value}>
          <Menu.Item
            onPress={() => {
              onSelect(item.value);
              setMenuVisible(false);
            }}
            title={item.label}
            titleStyle={{
              color: colors.onSurface,
            }}
            leadingIcon={selectedValue === item.value ? 'check' : undefined}
          />
          {item.value !== items[items.length - 1].value && (
            <Divider style={{backgroundColor: colors.outline}} />
          )}
        </React.Fragment>
      ))}
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {},
  label: {},
  button: {
    justifyContent: 'flex-start',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  menu: {
    overflow: 'hidden',
  },
  helperText: {
    backgroundColor: 'transparent',
  },
});
