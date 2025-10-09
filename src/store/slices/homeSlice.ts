import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ProcessedPrice {
  symbol: string;
  price: string;
  volume: string;
  change: string;
  changePercent: string;
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
    updatePrices: (state, action: PayloadAction<ProcessedPrice[]>) => {
      const updates = action.payload;
      updates.forEach(update => {
        const index = state.prices.findIndex(p => p.symbol === update.symbol);
        if (index !== -1) {
          state.prices[index] = {
            ...state.prices[index],
            price: update.price,
            volume: update.volume,
            change: update.change,
            changePercent: update.changePercent,
          };
        }
      });
    },
  },
});

export const {setPrices, setLoading, updatePrices} = homeSlice.actions;
export default homeSlice;
