import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: IWatchlistState = {
  watchAll: false,
  coins: [],
  period: 0,
  percent: 0,
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
  },
});

export const {setWatchlist} = watchlistSlice.actions;

export default watchlistSlice;
