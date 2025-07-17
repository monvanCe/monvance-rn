/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {eventBus} from './src/middleware/eventMiddleware';

eventBus.emit('appStarted', null);
AppRegistry.registerComponent(appName, () => App);
