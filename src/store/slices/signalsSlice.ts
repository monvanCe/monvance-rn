import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: ISignalsState = {
  allSignals: [],
  watchlistSignals: [],
  loading: false,
  allSignalsLoading: false,
  watchlistSignalsLoading: false,
  hasMoreAll: true,
  hasMoreWatchlist: true,
  currentTab: 'all',
  filters: {
    period: 5,
    percent: 3,
  },
};

const signalsSlice = createSlice({
  name: 'signals',
  initialState,
  reducers: {
    setAllSignals: (state, action: PayloadAction<ISignal[]>) => {
      state.allSignals = action.payload;
    },
    addAllSignals: (state, action: PayloadAction<ISignal[]>) => {
      state.allSignals = [...state.allSignals, ...action.payload];
    },
    setWatchlistSignals: (state, action: PayloadAction<ISignal[]>) => {
      state.watchlistSignals = action.payload;
    },
    addWatchlistSignals: (state, action: PayloadAction<ISignal[]>) => {
      state.watchlistSignals = [...state.watchlistSignals, ...action.payload];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAllSignalsLoading: (state, action: PayloadAction<boolean>) => {
      state.allSignalsLoading = action.payload;
    },
    setWatchlistSignalsLoading: (state, action: PayloadAction<boolean>) => {
      state.watchlistSignalsLoading = action.payload;
    },
    setHasMoreAll: (state, action: PayloadAction<boolean>) => {
      state.hasMoreAll = action.payload;
    },
    setHasMoreWatchlist: (state, action: PayloadAction<boolean>) => {
      state.hasMoreWatchlist = action.payload;
    },
    setCurrentTab: (state, action: PayloadAction<'all' | 'watchlist'>) => {
      state.currentTab = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<{period?: number; percent?: number}>,
    ) => {
      state.filters = {...state.filters, ...action.payload};
    },
    clearSignals: state => {
      state.allSignals = [];
      state.watchlistSignals = [];
      state.hasMoreAll = true;
      state.hasMoreWatchlist = true;
    },
  },
});

export const {
  setAllSignals,
  addAllSignals,
  setWatchlistSignals,
  addWatchlistSignals,
  setLoading,
  setAllSignalsLoading,
  setWatchlistSignalsLoading,
  setHasMoreAll,
  setHasMoreWatchlist,
  setCurrentTab,
  setFilters,
  clearSignals,
} = signalsSlice.actions;

export default signalsSlice.reducer;
