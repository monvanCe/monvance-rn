import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigationWrapper from './TabNavigationWrapper';
import NotificationScreen from '../screens/NotificationScreen';
import CoinDetailsScreen from '../screens/CoinDetailsScreen';
import PaywallScreen from '../screens/PaywallScreen';

export type RootStackParamList = {
  Main: undefined;
  Chat: undefined;
  Notifications: undefined;
  CoinDetails: {coin: string};
  Paywall: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={TabNavigationWrapper} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="CoinDetails" component={CoinDetailsScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
