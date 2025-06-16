import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {useTheme as useAppTheme} from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

interface TabNavigationProps {
  setScreenName: (screenName: string) => void;
  onNavigateToChat: () => void;
}

const TabNavigation = ({
  setScreenName,
  onNavigateToChat,
}: TabNavigationProps) => {
  const paperTheme = useTheme();
  const {theme} = useAppTheme();

  return (
    <Tab.Navigator
      screenListeners={{
        state: e => {
          const index = e.data.state.index;
          const tabName = e.data.state.routeNames[index];
          setScreenName(tabName);
        },
      }}
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
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}>
        {() => <HomeScreen onNavigateToChat={onNavigateToChat} />}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name={focused ? 'cog' : 'cog-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}>
        {() => <SettingsScreen />}
      </Tab.Screen>
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

export default TabNavigation;
