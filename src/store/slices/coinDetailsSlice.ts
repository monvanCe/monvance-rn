import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {eventBus} from '../../middleware/eventMiddleware';

interface ICoinDetailsState {
  coinSignals: ISignal[];
  loading: boolean;
  hasMore: boolean;
  coin: string;
}

const initialState: ICoinDetailsState = {
  coinSignals: [],
  loading: false,
  hasMore: true,
  coin: '',
};

const coinDetailsSlice = createSlice({
  name: 'coinDetails',
  initialState,
  reducers: {
    setCoinSignals: (state, action: PayloadAction<ISignal[]>) => {
      state.coinSignals = action.payload;
    },
    addCoinSignals: (state, action: PayloadAction<ISignal[]>) => {
      state.coinSignals = [...state.coinSignals, ...action.payload];
    },
    setCoinSignalsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setCoin: (state, action: PayloadAction<string>) => {
      state.coin = action.payload;
    },
    clearCoinSignals: state => {
      state.coinSignals = [];
      state.hasMore = true;
    },
  },
});

export const {
  setCoinSignals,
  addCoinSignals,
  setCoinSignalsLoading,
  setHasMore,
  setCoin,
  clearCoinSignals,
} = coinDetailsSlice.actions;

export default coinDetailsSlice.reducer;
