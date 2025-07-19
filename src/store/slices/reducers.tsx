import {combineReducers} from '@reduxjs/toolkit';
import appConfigSlice from './appConfigSlice';
import authSlice from './authSlice';
import chatSlice from './chatSlice';
import homeSlice from './homeSlice';

const rootReducer = combineReducers({
  appConfig: appConfigSlice.reducer,
  auth: authSlice.reducer,
  chat: chatSlice.reducer,
  home: homeSlice,
});

export default rootReducer;
