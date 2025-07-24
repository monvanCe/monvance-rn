interface IAppConfig {
  appLanguage: string;
  appTheme: string;
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

interface ITheme {
  radius: number;
  borderWidth: number;
  spacing: number;
  elevation: number;
  defaultVariant: 'text' | 'contained' | 'outlined';
  fontSize: number;
}

interface IUserUpdate {
  _id: string;
  bio?: string;
  avatar?: any;
  isPremium?: boolean;
  isOnline?: boolean;
  notificationId?: string;
  isPremium?: boolean;
  isAdmin?: boolean;
  version?: number;
  limits?: {
    credits: number;
  };
  createdAt?: string;
  updatedAt?: string;
  deviceId?: string;
  platform?: string;
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
  price: string;
}

interface INotification {
  _id: string;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  slug: string;
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
