import {createSlice} from '@reduxjs/toolkit';

interface IAppConfig {
  appLanguage: string;
  appTheme: 'light' | 'dark';
  externalUrl: string;
  internalUrl: string;
  hasSeenOnboarding: boolean;
}

const initialState: IAppConfig = {
  appLanguage: 'en',
  appTheme: 'dark',
  externalUrl: 'https://www.binance.com/en/price/bitcoin',
  internalUrl: 'https://monvance-apiv2-192419154766.europe-west1.run.app',
  hasSeenOnboarding: false,
};

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
    setHasSeenOnboarding: (state, action) => {
      state.hasSeenOnboarding = action.payload;
    },
  },
});

export const {setAppLanguage, setAppTheme, setHasSeenOnboarding} = appConfigSlice.actions;

export default appConfigSlice;
