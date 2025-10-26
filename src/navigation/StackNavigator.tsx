import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigationWrapper from './TabNavigationWrapper';
import NotificationScreen from '../screens/NotificationScreen';
import CoinDetailsScreen from '../screens/CoinDetailsScreen';
import PaywallScreen from '../screens/PaywallScreen';
import PromoScreen from '../screens/PromoScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';
import {useAppSelector} from '../store/store';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Chat: undefined;
  Notifications: undefined;
  CoinDetails: {coin: string};
  Paywall: undefined;
  Promo: undefined;
  FeedbackScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const insets = useSafeAreaInsets();
  const hasSeenOnboarding = useAppSelector(
    state => state.appConfig.hasSeenOnboarding,
  );

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
        }}
        initialRouteName={hasSeenOnboarding ? 'Main' : 'Onboarding'}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={TabNavigationWrapper} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="CoinDetails" component={CoinDetailsScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="Promo" component={PromoScreen} />
        <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
      </Stack.Navigator>
    </View>
  );
};

export default StackNavigator;
