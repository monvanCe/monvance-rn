import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {useTheme as useAppTheme} from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const paperTheme = useTheme();
  const {theme} = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name={focused ? 'cog' : 'cog-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    display: 'flex',
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginHorizontal: 0,
    height: 60,
    paddingHorizontal: 16,
  },
});

export default TabNavigator;
