import messaging from '@react-native-firebase/messaging';
import {getItem, setItem} from './storage';
import {eventBus} from '../middleware/eventMiddleware';
import {Platform} from 'react-native';

const NOTIFICATION_TOKEN_KEY = 'notification_token';

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } catch (error) {
    console.error('Notification permission request failed:', error);
    return false;
  }
};

export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().hasPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.error('Notification permission check failed:', error);
    return false;
  }
};

export const getNotificationToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
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
  messaging().onMessage(async remoteMessage => {
    eventBus.emit('notification', {
      title: remoteMessage.notification?.title || '',
      body: remoteMessage.notification?.body || '',
      data: JSON.stringify(remoteMessage.data || {}),
    });
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    eventBus.emit('notification', {
      title: remoteMessage.notification?.title || '',
      body: remoteMessage.notification?.body || '',
      data: JSON.stringify(remoteMessage.data || {}),
    });
  });
};

export const initializeNotification = async (): Promise<void> => {
  try {
    const hasPermission = await checkNotificationPermission();

    if (!hasPermission) {
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
      eventBus.emit('tokenInitialized', currentToken);
    } else if (!storedToken) {
      await saveNotificationToken(currentToken);
      eventBus.emit('tokenCreated', currentToken);
    } else {
      await saveNotificationToken(currentToken);
      eventBus.emit('tokenRefreshed', currentToken);
    }

    setupNotificationListeners();
  } catch (error) {
    console.error('Notification initialization failed:', error);
  }
};
