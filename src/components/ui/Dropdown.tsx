import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Menu,
  Divider,
  useTheme,
  Text,
  Surface,
} from 'react-native-paper';
import {useTheme as useAppTheme} from '../../context/ThemeContext';

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
  isFilled?: boolean;
}

export const Dropdown = ({
  selectedValue,
  onSelect,
  items,
  placeholder = 'Select...',
  label,
  disabled = false,
  error = false,
  helperText,
  isFilled,
}: DropdownProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();
  const {theme: appTheme} = useAppTheme();
  const selectedItem = items.find(item => item.value === selectedValue);

  const containerStyle = {
    borderColor: theme.colors.outline,
    borderRadius: appTheme.ui.radius,
    borderWidth: isFilled ?? appTheme.ui.isFilled ? 0 : appTheme.ui.borderWidth,
    backgroundColor:
      isFilled ?? appTheme.ui.isFilled
        ? theme.colors.surfaceVariant
        : 'transparent',
    elevation: isFilled ?? appTheme.ui.isFilled ? appTheme.ui.elevation : 0,
  };

  const buttonStyle = {
    borderRadius: appTheme.ui.radius,
    borderWidth: isFilled ?? appTheme.ui.isFilled ? 0 : appTheme.ui.borderWidth,
    backgroundColor:
      isFilled ?? appTheme.ui.isFilled ? theme.colors.surface : 'transparent',
  };

  const contentStyle = {
    padding: appTheme.ui.spacing,
    gap: appTheme.ui.spacing / 2,
  };

  const labelStyle = {
    paddingHorizontal: appTheme.ui.spacing / 2,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.content, contentStyle]}>
        {label && (
          <Text
            variant="bodySmall"
            style={[
              styles.label,
              labelStyle,
              {
                color: error
                  ? theme.colors.error
                  : theme.colors.onSurfaceVariant,
                marginBottom: appTheme.ui.spacing,
              },
            ]}>
            {label}
          </Text>
        )}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={[styles.button, buttonStyle]}
              contentStyle={styles.buttonContent}
              textColor={error ? theme.colors.error : theme.colors.onSurface}
              icon={selectedValue ? 'check' : undefined}
              disabled={disabled}>
              {selectedItem?.label || placeholder}
            </Button>
          }
          contentStyle={[
            styles.menu,
            {
              borderRadius: appTheme.ui.radius,
              borderWidth: appTheme.ui.borderWidth,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
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
                  color: theme.colors.onSurface,
                }}
                leadingIcon={selectedValue === item.value ? 'check' : undefined}
              />
              {item.value !== items[items.length - 1].value && (
                <Divider style={{backgroundColor: theme.colors.outline}} />
              )}
            </React.Fragment>
          ))}
        </Menu>
      </View>
      {helperText && (
        <Text
          variant="bodySmall"
          style={[
            styles.helperText,
            {
              color: error ? theme.colors.error : theme.colors.onSurfaceVariant,
              padding: appTheme.ui.spacing,
            },
          ]}>
          {helperText}
        </Text>
      )}
    </View>
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
