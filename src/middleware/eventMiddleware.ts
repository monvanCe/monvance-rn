type eventType = {
  toast: {message: string; type: 'success' | 'error' | 'info' | 'warning'};
  appStarted: null;
  chatScreenOpened: null;
  loginSuccess: {user: IUser};
  logoutSuccess: null;
  notification: {title: string; body: string; data: string};
  error: string;
  notificationIdRefreshed: string;
  notificationIdCreated: string;
  notificationIdInitialized: string;
  updateUserSuccess: {user: IUserUpdate};
  checkUsernameSuccess: {username: string; available: boolean};
  languageChanged: string;
  tickerPricesFetched: BinanceTickerPrice[];
  getNotificationsSuccess: INotificationResponse;
  getSignalsSuccess: INotificationResponse;
  getUnreadCountSuccess: IUnreadCountResponse;
  markAsReadSuccess: {slug: string};
  markAllAsReadSuccess: null;
  deleteNotificationSuccess: {slug: string};
  deleteAllNotificationsSuccess: null;
  getWatchlistSuccess: IWatchlistResponse;
  coinSwitched: string;
  updateWatchlistCoinsSuccess: IWatchlistResponse;
  periodChanged: string;
  updateWatchlistPeriodSuccess: IWatchlistResponse;
  percentChanged: string;
  updateWatchlistPercentSuccess: IWatchlistResponse;
  watchAllChanged: boolean;
  updateWatchlistWatchAllSuccess: IWatchlistResponse;
  addFavorite: string;
  removeFavorite: string;
  centrifugeSent: {channel: string; message: any};
  getMessagesByChatIdSuccess: IGetMessagesByChatIdResponse;
  sendMessageSuccess: ISendMessageResponse;
  getMessageFromCentrifuge: IMessage;
  signalReceived: {title: string; body: string};
  // Signals events
  getAllSignalsSuccess: ISignalsResponse;
  getWatchlistSignalsSuccess: ISignalsResponse;
  addAllSignalsSuccess: ISignalsResponse;
  addWatchlistSignalsSuccess: ISignalsResponse;
  setCurrentTab: 'all' | 'watchlist';
  updateSignalsFilters: {period?: number; percent?: number};
  setAllSignalsLoading: boolean;
  setWatchlistSignalsLoading: boolean;
  loadAllSignals: {
    period?: number;
    percent?: number;
    limit?: number;
    skip?: number;
    isRefresh?: boolean;
  };
  loadWatchlistSignals: {
    period?: number;
    percent?: number;
    limit?: number;
    skip?: number;
    isRefresh?: boolean;
  };
  // Coin Details events
  loadCoinSignals: {
    coin: string;
    limit: number;
    skip: number;
    isRefresh: boolean;
  };
  clearCoinSignals: null;
  navigateToChat: null;
  // Paywall events
  getPaywallSuccess: IPaywallResponse;
  paymentSuccess: IUser;
  subscriptionSelected: ISubscription;
  restorePurchasesSuccess: IUser;
  paywallOpened: null;
};

class EventManager<Events extends Record<string, any>> {
  private listeners: {[K in keyof Events]?: ((payload: Events[K]) => void)[]} =
    {};

  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void,
  ) {
    this.listeners[event] = (this.listeners[event] || []).filter(
      l => l !== listener,
    );
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    (this.listeners[event] || []).forEach(listener => listener(payload));
  }
}

export const eventBus = new EventManager<eventType>();
export type {eventType};
