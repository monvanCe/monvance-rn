import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: ISubscriptionState = {
  subscriptions: [],
  loading: false,
  selectedSubscription: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptions: (state, action: PayloadAction<ISubscription[]>) => {
      state.subscriptions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSelectedSubscription: (
      state,
      action: PayloadAction<ISubscription | null>,
    ) => {
      state.selectedSubscription = action.payload;
    },
    clearSubscriptions: state => {
      state.subscriptions = [];
      state.selectedSubscription = null;
    },
  },
});

export const {
  setSubscriptions,
  setLoading,
  setSelectedSubscription,
  clearSubscriptions,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
