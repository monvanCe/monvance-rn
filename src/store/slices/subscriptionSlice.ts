import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ISubscriptionState {
  subscriptions: ISubscription[];
  loading: boolean;
  selectedSubscription: ISubscription | null;
  premiumAdvantages: string[];
  paywallData: IPaywallResponse | null;
}

const initialState: ISubscriptionState = {
  subscriptions: [],
  loading: false,
  selectedSubscription: null,
  premiumAdvantages: [],
  paywallData: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptions: (state, action: PayloadAction<ISubscription[]>) => {
      state.subscriptions = action.payload;
    },
    setPremiumAdvantages: (state, action: PayloadAction<string[]>) => {
      state.premiumAdvantages = action.payload;
    },
    setSelectedSubscription: (
      state,
      action: PayloadAction<ISubscription | null>,
    ) => {
      state.selectedSubscription = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPaywallData: (state, action: PayloadAction<IPaywallResponse>) => {
      state.paywallData = action.payload;
      state.subscriptions = action.payload.package;
      state.premiumAdvantages = action.payload.premiumAdvantages;
    },
    clearSubscriptionData: state => {
      state.subscriptions = [];
      state.premiumAdvantages = [];
      state.selectedSubscription = null;
      state.paywallData = null;
    },
  },
});

export const {
  setSubscriptions,
  setPremiumAdvantages,
  setSelectedSubscription,
  setLoading,
  setPaywallData,
  clearSubscriptionData,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
