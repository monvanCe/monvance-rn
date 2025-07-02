import {api} from './api';
import {INTERNAL_ENDPOINTS} from '../const/internalEndpoints';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {ANDROID_VERSION, IOS_VERSION} from '../const/env';

export const internalService = {
  getChatToken: async (
    token: string,
  ): Promise<{token: string; wsUrl: string}> => {
    return api.get<{token: string; wsUrl: string}>(
      INTERNAL_ENDPOINTS.GET_CHAT_TOKEN,
      'internal',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  login: async (): Promise<IUser> => {
    const deviceId = await DeviceInfo.getUniqueId();
    return api.post<IUser>(INTERNAL_ENDPOINTS.LOGIN, 'internal', {
      deviceId,
      platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      version: Platform.OS === 'ios' ? IOS_VERSION : ANDROID_VERSION,
    });
  },
};
