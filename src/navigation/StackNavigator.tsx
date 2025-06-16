import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigationWrapper from './TabNavigationWrapper';

export type RootStackParamList = {
  Main: undefined;
  Chat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={TabNavigationWrapper} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
