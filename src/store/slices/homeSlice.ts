import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ProcessedPrice {
  symbol: string;
  price: string;
  volume: string;
  change: string;
  changePercent: string;
  isFavorite: boolean;
  switchValue: boolean;
}

interface IHomeState {
  prices: ProcessedPrice[];
  loading: boolean;
}

const initialState: IHomeState = {
  prices: [],
  loading: true,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setPrices: (state, action: PayloadAction<ProcessedPrice[]>) => {
      state.prices = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {setPrices, setLoading} = homeSlice.actions;
export default homeSlice;
