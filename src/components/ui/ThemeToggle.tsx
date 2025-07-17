import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {Switch} from './Switch';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ThemeToggle = () => {
  const {theme, isDarkMode, toggleTheme} = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.ui.radius,
          padding: theme.ui.spacing * 1.5,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
        <Icon
          name={isDarkMode ? 'weather-night' : 'white-balance-sunny'}
          size={28}
          color={theme.colors.primary}
        />
        <Text
          style={[
            styles.label,
            {color: theme.colors.text, fontSize: 18, fontWeight: '600'},
          ]}>
          {isDarkMode ? 'Koyu Mod' : 'Açık Mod'}
        </Text>
      </View>
      <Switch value={isDarkMode} onValueChange={toggleTheme} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginVertical: 0,
  },
  label: {
    marginLeft: 0,
  },
});

export default ThemeToggle;
