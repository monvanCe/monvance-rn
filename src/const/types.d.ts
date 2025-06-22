interface IAppConfig {
  appLanguage: string;
  appTheme: string;
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
