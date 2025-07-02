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
  notificationId?: string;
  isAdmin?: boolean;
  version?: number;
  limits?: {
    credits: number;
  };
  token?: string;
}

interface INotificationEvent {
  title: string;
  body: string;
  data: string;
}

interface ILoginSuccessEvent {
  token: string;
  user: IUser;
}

interface IEvent {
  slug: string;
  data: INotificationEvent | ILoginSuccessEvents;
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
