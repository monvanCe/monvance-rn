import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {Switch} from './Switch';

const ThemeToggle = () => {
  const {theme, isDarkMode, toggleTheme} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.ui.radius,
          marginVertical: theme.ui.spacing,
          padding: theme.ui.spacing * 2,
        },
      ]}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.ui.spacing * 2,
            fontWeight: '600',
            marginBottom: theme.ui.spacing * 1.5,
          },
        ]}>
        Tema
      </Text>
      <View style={styles.switchContainer}>
        <Text
          style={[
            styles.toggleText,
            {
              color: theme.colors.text,
              fontSize: theme.ui.spacing * 1.75,
              fontWeight: '500',
            },
          ]}>
          {isDarkMode ? 'Koyu' : 'Açık'}
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {},
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {},
});

export default ThemeToggle;
