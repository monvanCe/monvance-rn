import {getApp} from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
  isDeviceRegisteredForRemoteMessages,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';

import {eventBus} from '../middleware/eventMiddleware';
import {PermissionsAndroid} from 'react-native';

const app = getApp();
const messaging = getMessaging(app);

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    const enabled = authStatus === PermissionsAndroid.RESULTS.GRANTED;
    return enabled;
  } catch (error) {
    console.error('Notification permission request failed:', error);
    return false;
  }
};

export const getNotificationToken = async (): Promise<string | null> => {
  try {
    if (!isDeviceRegisteredForRemoteMessages(messaging)) {
      await registerDeviceForRemoteMessages(messaging);
    }
    const token = await getToken(messaging);
    return token;
  } catch (error) {
    console.error('Failed to get notification token:', error);
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
    await requestNotificationPermission();

    const currentToken = await getNotificationToken();
    if (!currentToken) {
      console.log('Failed to get notification token');
      return;
    }

    eventBus.emit('notificationIdInitialized', currentToken);
    setupNotificationListeners();
  } catch (error) {
    console.error('Notification initialization failed:', error);
  }
};
