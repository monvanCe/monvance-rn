import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {WatchlistPercent, WatchlistPeriod} from '../../const/enums';

const initialState: IWatchlistState = {
  watchAll: false,
  coins: [],
  period: WatchlistPeriod.MINUTE_1,
  percent: WatchlistPercent.PERCENT_1,
  loading: true,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setWatchlist: (state, action: PayloadAction<IWatchlistState>) => {
      state.watchAll = action.payload.watchAll;
      state.coins = action.payload.coins;
      state.period = action.payload.period;
      state.percent = action.payload.percent;
      state.loading = false;
    },
    coinSwitched: (state, action: PayloadAction<string>) => {
      if (state.coins.includes(action.payload)) {
        state.coins = state.coins.filter(coin => coin !== action.payload);
      } else {
        state.coins.push(action.payload);
      }
    },
    watchAllChanged: (state, action: PayloadAction<boolean>) => {
      state.watchAll = action.payload;
      state.coins = [];
    },
    periodChanged: (state, action: PayloadAction<WatchlistPeriod>) => {
      state.period = action.payload;
    },
    percentChanged: (state, action: PayloadAction<WatchlistPercent>) => {
      state.percent = action.payload;
    },
  },
});

export const {
  setWatchlist,
  coinSwitched,
  watchAllChanged,
  periodChanged,
  percentChanged,
} = watchlistSlice.actions;

export default watchlistSlice;
