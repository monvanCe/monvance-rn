import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {useTheme as useAppTheme} from '../context/ThemeContext';
import WatchListScreen from '../screens/WatchListScreen';
import SignalsScreen from '../screens/SignalsScreen';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const {theme} = useAppTheme();

  return (
    <Tab.Navigator
     
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...(Platform.OS === 'android' ? styles.tabBarAndorid : styles.tabBarIos),
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
          title: 'Home',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}>
        {() => <HomeScreen />}
      </Tab.Screen>
      <Tab.Screen
        name="Watchlist"
        options={{
          title: 'Whatchlist',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name={focused ? 'clock-outline' : 'clock-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}>
        {() => <WatchListScreen />}
      </Tab.Screen>
      <Tab.Screen
        name="Signals"
        options={{
          title: 'Signals',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name={focused ? 'chart-box' : 'chart-box-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}>
        {() => <SignalsScreen />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              name={focused ? 'account' : 'account-outline'}
              size={focused ? size + 4 : size}
              color={color}
            />
          ),
        }}>
        {() => <ProfileScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarAndorid: {
    position: 'absolute',
    display: 'flex',
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginHorizontal: 0,
    height: 60,
    paddingHorizontal: 16,
  },
  tabBarIos: {
    position: 'absolute',
    display: 'flex',
    bottom:0,
    paddingTop: 7,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginHorizontal: 0,
    height: 64,
    paddingHorizontal: 16,
  },
});

export default TabNavigation;
