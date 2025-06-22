import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {toastMessage} from './toastMessage.ts';

let notificationCallback: ((remoteMessage: any) => void) | null = null;

export const setNotificationCallback = (
  callback: (remoteMessage: any) => void,
) => {
  notificationCallback = callback;
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification Authorization status:', authStatus);
  }

  return enabled;
}

export async function initializeNotifications() {
  const isPermissionGranted = await requestUserPermission();

  if (isPermissionGranted) {
    const token = await getFcmToken();
    notifciationListener();
    return token;
  }

  return null;
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');

  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('New FCM token generated:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
      return null;
    }
  }

  return fcmToken;
};

export const notifciationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging().onMessage(async remoteMessage => {
    console.log('bildirim geldi');
    if (remoteMessage.notification?.body) {
      toastMessage(remoteMessage.notification.body);
    }
    if (notificationCallback) {
      notificationCallback(remoteMessage);
    }
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
