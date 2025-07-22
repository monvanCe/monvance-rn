import {combineReducers} from '@reduxjs/toolkit';
import appConfigSlice from './appConfigSlice';
import authSlice from './authSlice';
import chatSlice from './chatSlice';
import homeSlice from './homeSlice';
import notificationSlice from './notificationSlice';
import watchlistSlice from './watchlistSlice';
import favoritesSlice from './favoritesSlice';

const rootReducer = combineReducers({
  appConfig: appConfigSlice.reducer,
  auth: authSlice.reducer,
  chat: chatSlice.reducer,
  home: homeSlice.reducer,
  notification: notificationSlice.reducer,
  watchlist: watchlistSlice.reducer,
  favorites: favoritesSlice.reducer,
});

export default rootReducer;
