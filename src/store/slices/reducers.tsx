import {combineReducers} from '@reduxjs/toolkit';
import appConfigSlice from './appConfigSlice';
import authSlice from './authSlice';
import chatSlice from './chatSlice';
import homeSlice from './homeSlice';
import notificationSlice from './notificationSlice';
import watchlistSlice from './watchlistSlice';
import favoritesSlice from './favoritesSlice';
import signalsSlice from './signalsSlice';

const rootReducer = combineReducers({
  appConfig: appConfigSlice.reducer,
  auth: authSlice.reducer,
  chat: chatSlice.reducer,
  home: homeSlice.reducer,
  notification: notificationSlice.reducer,
  watchlist: watchlistSlice.reducer,
  favorites: favoritesSlice.reducer,
  signals: signalsSlice,
});

export default rootReducer;
