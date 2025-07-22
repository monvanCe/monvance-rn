import {api} from './api';
import {INTERNAL_ENDPOINTS} from '../const/internalEndpoints';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {ANDROID_VERSION, IOS_VERSION} from '../const/env';
import {eventBus} from '../middleware/eventMiddleware';

export const internalService = {
  getChatToken: async (): Promise<{token: string; wsUrl: string}> => {
    return api.get<{token: string; wsUrl: string}>(
      INTERNAL_ENDPOINTS.GET_CHAT_TOKEN,
      'internal',
    );
  },

  login: async (): Promise<IUser> => {
    const deviceId = await DeviceInfo.getUniqueId();
    const user = await api.post<IUser>(INTERNAL_ENDPOINTS.LOGIN, 'internal', {
      deviceId,
      platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      version: Platform.OS === 'ios' ? IOS_VERSION : ANDROID_VERSION,
    });
    eventBus.emit('loginSuccess', {user});
    return user;
  },

  updateUser: async (data: {
    username?: string;
    country?: string;
    location?: {latitude?: number; longitude?: number};
    platform?: string;
    notificationId?: string;
    avatar?: string;
    language?: string;
  }): Promise<IUserUpdate> => {
    const user = await api.put<IUserUpdate>(
      INTERNAL_ENDPOINTS.UPDATE_USER,
      'internal',
      data,
    );
    eventBus.emit('updateUserSuccess', {user});
    return user;
  },

  getWatchlist: async (): Promise<IWatchlistResponse> => {
    const response = await api.get<IWatchlistResponse>(
      INTERNAL_ENDPOINTS.WATCHLIST,
      'internal',
    );
    eventBus.emit('getWatchlistSuccess', response);
    return response;
  },

  updateWatchlistCoins: async (
    coins: string[],
  ): Promise<IWatchlistResponse> => {
    const response = await api.put<IWatchlistResponse>(
      `${INTERNAL_ENDPOINTS.WATCHLIST}`,
      'internal',
      {coins},
    );
    eventBus.emit('updateWatchlistCoinsSuccess', response);
    return response;
  },

  getNotifications: async (): Promise<INotificationResponse> => {
    const response = await api.get<INotificationResponse>(
      INTERNAL_ENDPOINTS.GET_NOTIFICATIONS,
      'internal',
    );
    eventBus.emit('getNotificationsSuccess', response);
    return response;
  },

  getSignals: async (): Promise<INotificationResponse> => {
    const response = await api.get<INotificationResponse>(
      INTERNAL_ENDPOINTS.GET_SIGNALS,
      'internal',
    );
    eventBus.emit('getSignalsSuccess', response);
    return response;
  },

  getUnreadCount: async (): Promise<IUnreadCountResponse> => {
    const response = await api.get<IUnreadCountResponse>(
      INTERNAL_ENDPOINTS.GET_UNREAD_COUNT,
      'internal',
    );
    eventBus.emit('getUnreadCountSuccess', response);
    return response;
  },

  markAsRead: async (slug: string): Promise<void> => {
    await api.put(`${INTERNAL_ENDPOINTS.MARK_AS_READ}/${slug}`, 'internal', {});
    eventBus.emit('markAsReadSuccess', {slug});
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put(INTERNAL_ENDPOINTS.MARK_ALL_AS_READ, 'internal', {});
    eventBus.emit('markAllAsReadSuccess', null);
  },

  deleteNotification: async (slug: string): Promise<void> => {
    await api.delete(
      `${INTERNAL_ENDPOINTS.DELETE_NOTIFICATION}/${slug}`,
      'internal',
    );
    eventBus.emit('deleteNotificationSuccess', {slug});
  },

  deleteAllNotifications: async (): Promise<void> => {
    await api.delete(INTERNAL_ENDPOINTS.DELETE_ALL_NOTIFICATIONS, 'internal');
    eventBus.emit('deleteAllNotificationsSuccess', null);
  },
};
