import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigationWrapper from './TabNavigationWrapper';
import NotificationScreen from '../screens/NotificationScreen';
import CoinDetailsScreen from '../screens/CoinDetailsScreen';
import PaywallScreen from '../screens/PaywallScreen';
import PromoScreen from '../screens/PromoScreen';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';

export type RootStackParamList = {
  Main: undefined;
  Chat: undefined;
  Notifications: undefined;
  CoinDetails: {coin: string};
  Paywall: undefined;
  Promo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const theme = useTheme();
  const colors = theme.theme.colors;

  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: colors.background,
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Main" component={TabNavigationWrapper} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="CoinDetails" component={CoinDetailsScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="Promo" component={PromoScreen} />
      </Stack.Navigator>
    </View>
  );
};

export default StackNavigator;
