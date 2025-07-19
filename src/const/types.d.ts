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
  userId: string;
  username: string;
  message: string;
  avatar: string;
}

interface IChatState {
  messages: IMessage[];
  hasNewMessages: boolean;
}
