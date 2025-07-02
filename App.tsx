import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {PaperProvider} from 'react-native-paper';
import StackNavigator from './src/navigation/StackNavigator';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import {store} from './src/store/store';
import {Provider} from 'react-redux';
import {useEvent} from './src/hooks/useEvent';
import {useAuth} from './src/hooks/useAuth';

const AppContent = () => {
  const {theme} = useTheme();
  useEvent();
  const {login} = useAuth();

  useEffect(() => {
    login();
  }, []);

  return (
    <PaperProvider theme={theme}>
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
