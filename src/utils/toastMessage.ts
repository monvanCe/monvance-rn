import {ToastAndroid, Platform, Alert} from 'react-native';

export const toastMessage = (message: string) => {
  const messageToDisplay = message !== null ? message : 'appcheck: null';

  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      messageToDisplay,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  } else {
    Alert.alert('', messageToDisplay);
  }
};
