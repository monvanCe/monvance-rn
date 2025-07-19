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

const AppContent = () => {
  useAuth();
  useReduxEvents();
  useNotification();
  useLocalization();
  useHomeService();
  useNotificationService();
  useEffect(() => {
    eventBus.emit('appStarted', null);
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
