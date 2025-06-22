import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  appLanguage: 'en',
  appTheme: 'light',
} as IAppConfig;

const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setAppLanguage: (state, action) => {
      state.appLanguage = action.payload;
    },
    setAppTheme: (state, action) => {
      state.appTheme = action.payload;
    },
  },
});

export const {setAppLanguage, setAppTheme} = appConfigSlice.actions;

export default appConfigSlice;
