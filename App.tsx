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

const AppContent = () => {
  useAuth();
  useReduxEvents();
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
