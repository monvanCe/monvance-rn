interface IAppConfig {
  appLanguage: string;
  appTheme: string;
}

interface IOnboardingPage {
  id: number;
  title: string;
  description: string;
  image: any;
}

interface IUser {
  _id: string;
  username?: string;
  bio?: string;
  country?: string;
  language?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  avatar?: any;
  isPremium?: boolean;
  isOnline?: boolean;
  notificationId?: string;
  isAdmin?: boolean;
  version?: number;
  limits?: {
    credits: number;
  };
  token: string;
}

interface IUserUpdate {
  limits: {
    credits: number;
  };
  isAdsFree: boolean;
  _id: string;
  bio: string;
  deviceId: string;
  platform: 'ANDROID' | 'IOS' | 'WEB' | string;
  isPremium: boolean;
  isOnline: boolean;
  notificationId: string;
  avatar: string | null;
  isAdmin: boolean;
  version: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  username: string;
}

interface ITheme {
  radius: number;
  borderWidth: number;
  spacing: number;
  elevation: number;
  defaultVariant: 'text' | 'contained' | 'outlined';
  fontSize: number;
}

interface IUserUpdateResponse {
  data: IUserUpdate;
  message: string;
}

interface IMessage {
  _id: string;
  chatId: string;
  userId: {
    _id: string;
    username: string;
    avatar: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
  localId?: string;
  status?: 'pending' | 'sent' | 'failed';
}

interface IChatState {
  messages: IMessage[];
  hasNewMessages: boolean;
}

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

interface BinanceTickerPrice {
  symbol: string;
  lastPrice: string;
  quoteVolume: string;
  priceChangePercent: string;
  priceChange: string;
}

interface BinanceStreamTicker {
  s: string; // symbol
  c: string; // price (current)
  q: string; // volume
  p: string; // change
  P: string; // changePercent
}

interface INotification {
  _id: string;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  data: any;
}

interface INotificationState {
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
}

interface IPagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface INotificationResponse {
  data: INotification[];
  pagination: IPagination;
  message: string;
}

interface IUnreadCountResponse {
  data: {
    total: number;
    signal: number;
    notification: number;
    event: number;
  };
  message: string;
}

interface IWatchlistResponse {
  data: IWatchlist;
  message: string;
}

interface IGetMessagesByChatIdResponse {
  data: IMessage[];
  message: string;
  pagination: IPagination;
}

interface ISendMessageResponse {
  data: IMessage;
  message: string;
  localId?: string;
}

interface IWatchlist {
  watchAll: boolean;
  coins: string[];
  period: number;
  percent: number;
}

interface IFavoritesState {
  favorites: string[];
}

interface ISignal {
  _id: string;
  coin: string;
  period: number;
  percent: number;
  changePercent: number;
  isIncrease: boolean;
  currentPrice: number;
  previousPrice: number;
  periodStartTime: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ISignalsResponse {
  success: boolean;
  data: ISignal[];
  count: number;
  period: number;
  percent: number;
  skip: number;
  limit: number;
}

interface ISignalPushData {
  currentPrice: string;
  previousPrice: string;
  period: string; // minutes as string
  userPercent: string; // threshold percent as string
  messageNumber: string; // backend message/status code
  type: 'signal';
  status: string;
  language?: string;
}

interface ISignalsState {
  allSignals: ISignal[];
  watchlistSignals: ISignal[];
  loading: boolean;
  allSignalsLoading: boolean;
  watchlistSignalsLoading: boolean;
  hasMoreAll: boolean;
  hasMoreWatchlist: boolean;
  currentTab: 'all' | 'watchlist';
  filters: {
    period?: number;
    percent?: number;
  };
}

interface ICoinDetailsState {
  coinSignals: ISignal[];
  loading: boolean;
  hasMore: boolean;
  coin: string;
}

interface ISubscriptionLimits {
  artwork: number;
}

interface ISubscription {
  _id: string;
  sku: string;
  platform: 'ANDROID' | 'IOS';
  discount: number;
  isActive: boolean;
  isPromo: boolean;
  interval: number;
  intervalDays: number;
  limits: ISubscriptionLimits;
  isTrial: boolean;
  trialDays: number;
  offerToken?: string;
}

interface ISubscriptionState {
  subscriptions: ISubscription[];
  loading: boolean;
  selectedSubscription: ISubscription | null;
  premiumAdvantages: string[];
}

type IPaywallResponse =
  | {
      package: ISubscription[];
      premiumAdvantages: string[];
    }
  | {
      package: ISubscription[];
      premiumAdvantages: string[];
      promoPackage: ISubscription[];
      trialTime: string;
    };

interface IAndroidPaymentRequest {
  packageName: string;
  productId: string;
  purchaseToken: string;
}

interface IIOSPaymentRequest {
  receiptData: string;
}

type TPaymentRequest = IAndroidPaymentRequest | IIOSPaymentRequest;
