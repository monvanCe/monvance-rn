import React from 'react';
import {View, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from './Text';
import {useTheme} from '../../context/ThemeContext';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  leftIconColor?: string;
  rightIcon?: string;
  rightIconColor?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  showDivider?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  leftIcon,
  leftIconColor,
  rightIcon,
  rightIconColor,
  rightElement,
  onPress,
  style,
  showDivider = false,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const Content = (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={24}
            color={leftIconColor || theme.colors.brand}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.rightSection}>
        {rightElement}
        {rightIcon && (
          <Icon
            name={rightIcon}
            size={22}
            color={rightIconColor || theme.colors.brand}
          />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={showDivider && styles.divider}>
        {Content}
      </TouchableOpacity>
    );
  }

  return <View style={showDivider && styles.divider}>{Content}</View>;
};

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: theme.ui.spacing,
    },
    textContainer: {
      flex: 1,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.ui.spacing,
    },
    title: {
      fontSize: theme.ui.fontSize * 1.125,
      fontWeight: '600',
    },
    subtitle: {
      fontSize: theme.ui.fontSize * 0.8125,
      fontWeight: '600',
      marginTop: 2,
    },
    divider: {
      marginBottom: theme.ui.spacing,
    },
  });

export default SettingsItem;
