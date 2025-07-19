import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigationWrapper from './TabNavigationWrapper';
import NotificationScreen from '../screens/NotificationScreen';

export type RootStackParamList = {
  Main: undefined;
  Chat: undefined;
  Notifications: undefined;
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
    </Stack.Navigator>
  );
};

export default StackNavigator;
