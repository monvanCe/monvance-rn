import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  appLanguage: 'en',
  appTheme: 'light',
  externalUrl: 'https://www.binance.com/en/price/bitcoin',
  internalUrl: 'https://monvance-apiv2-192419154766.europe-west1.run.app',
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
