import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {PaperProvider} from 'react-native-paper';
import StackNavigator from './src/navigation/StackNavigator';
import {ThemeProvider} from './src/context/ThemeContext';
import {store} from './src/store/store';
import {Provider} from 'react-redux';
import {eventBus} from './src/middleware/eventMiddleware';
import {useAuth} from './src/hooks/useAuth';
import {useReduxEvents} from './src/hooks/useReduxEvents';
import {useNotification} from './src/hooks/useNotification';
import useLocalization from './src/hooks/useLocalization';
import {useHomeService} from './src/hooks/useHomeService';
import {useNotificationService} from './src/hooks/useNotificationService';
import {useWatchlist} from './src/hooks/useWatchlist';
import {useSignalsService} from './src/hooks/useSignalsService';
import Toast from 'react-native-toast-message';
import {useToast} from './src/hooks/useToast';
import {useChatService} from './src/hooks/useChatService';
import {useCentrifuge} from './src/hooks/useCentrifuge';

const AppContent = () => {
  useAuth();
  useReduxEvents();
  useNotification();
  useLocalization();
  useHomeService();
  useNotificationService();
  useWatchlist();
  useSignalsService();
  useToast();
  useChatService();
  useCentrifuge();
  useEffect(() => {
    eventBus.emit('appStarted', null);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <PaperProvider>
      <Provider store={store}>
        <ThemeProvider>
          <AppContent />
          <Toast />
        </ThemeProvider>
      </Provider>
    </PaperProvider>
  );
};

export default App;
