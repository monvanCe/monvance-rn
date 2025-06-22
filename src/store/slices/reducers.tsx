import {combineReducers} from '@reduxjs/toolkit';
import appConfigSlice from './appConfigSlice';
import authSlice from './authSlice';

const rootReducer = combineReducers({
  appConfig: appConfigSlice.reducer,
  auth: authSlice.reducer,
});

export default rootReducer;
