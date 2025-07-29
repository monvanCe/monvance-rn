import {getApp} from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  getToken,
  hasPermission,
  onMessage,
  setBackgroundMessageHandler,
  isDeviceRegisteredForRemoteMessages,
  registerDeviceForRemoteMessages,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import {getItem, setItem} from './storage';
import {eventBus} from '../middleware/eventMiddleware';

const NOTIFICATION_TOKEN_KEY = 'notification_token';

const app = getApp();
const messaging = getMessaging(app);

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;
    return enabled;
  } catch (error) {
    console.error('Notification permission request failed:', error);
    return false;
  }
};

export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await hasPermission(messaging);
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('Notification permission check failed:', error);
    return false;
  }
};

export const getNotificationToken = async (): Promise<string | null> => {
  try {
    if (!(await isDeviceRegisteredForRemoteMessages(messaging))) {
      await registerDeviceForRemoteMessages(messaging);
    }
    const token = await getToken(messaging);
    return token;
  } catch (error) {
    console.error('Failed to get notification token:', error);
    return null;
  }
};

export const saveNotificationToken = async (token: string): Promise<void> => {
  try {
    await setItem(NOTIFICATION_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save notification token:', error);
  }
};

export const getStoredNotificationToken = async (): Promise<string | null> => {
  try {
    return await getItem(NOTIFICATION_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get stored notification token:', error);
    return null;
  }
};

export const setupNotificationListeners = () => {
  onMessage(messaging, async remoteMessage => {
    eventBus.emit('notification', {
      title: remoteMessage.notification?.title || '',
      body: remoteMessage.notification?.body || '',
      data: JSON.stringify(remoteMessage.data || {}),
    });
  });

  setBackgroundMessageHandler(messaging, async remoteMessage => {
    eventBus.emit('notification', {
      title: remoteMessage.notification?.title || '',
      body: remoteMessage.notification?.body || '',
      data: JSON.stringify(remoteMessage.data || {}),
    });
  });
};

export const initializeNotification = async (): Promise<void> => {
  try {
    const hasPerm = await checkNotificationPermission();
    if (!hasPerm) {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        console.log('Notification permission denied');
        return;
      }
    }
    const currentToken = await getNotificationToken();
    if (!currentToken) {
      console.log('Failed to get notification token');
      return;
    }
    const storedToken = await getStoredNotificationToken();
    if (storedToken === currentToken) {
      eventBus.emit('notificationIdInitialized', currentToken);
    } else if (!storedToken) {
      await saveNotificationToken(currentToken);
      eventBus.emit('notificationIdCreated', currentToken);
    } else {
      await saveNotificationToken(currentToken);
      eventBus.emit('notificationIdRefreshed', currentToken);
    }
    setupNotificationListeners();
  } catch (error) {
    console.error('Notification initialization failed:', error);
  }
};
