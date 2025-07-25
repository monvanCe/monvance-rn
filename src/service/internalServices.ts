import {api} from './api';
import {INTERNAL_ENDPOINTS} from '../const/internalEndpoints';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {ANDROID_VERSION, IOS_VERSION} from '../const/env';
import {eventBus} from '../middleware/eventMiddleware';

export const internalService = {
  getSocket: async (): Promise<{token: string; wsUrl: string}> => {
    return api.get<{token: string; wsUrl: string}>(
      INTERNAL_ENDPOINTS.GET_SOCKET,
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

  updateWatchlistPeriod: async (
    period: string,
  ): Promise<IWatchlistResponse> => {
    const response = await api.put<IWatchlistResponse>(
      `${INTERNAL_ENDPOINTS.WATCHLIST}`,
      'internal',
      {period: Number(period)},
    );
    eventBus.emit('updateWatchlistPeriodSuccess', response);
    return response;
  },

  updateWatchlistPercent: async (
    percent: string,
  ): Promise<IWatchlistResponse> => {
    const response = await api.put<IWatchlistResponse>(
      `${INTERNAL_ENDPOINTS.WATCHLIST}`,
      'internal',
      {percent: Number(percent)},
    );
    eventBus.emit('updateWatchlistPercentSuccess', response);
    return response;
  },

  updateWatchlistWatchAll: async (
    watchAll: boolean,
  ): Promise<IWatchlistResponse> => {
    const response = await api.put<IWatchlistResponse>(
      `${INTERNAL_ENDPOINTS.WATCHLIST}`,
      'internal',
      {watchAll, coins: []},
    );
    eventBus.emit('updateWatchlistWatchAllSuccess', response);
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
    await api.put(
      `${INTERNAL_ENDPOINTS.MARK_AS_READ}/${slug}/read`,
      'internal',
      {},
    );
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

  getMessagesByChatId: async (
    chatId: string = '684f15946720dfaafba07b89',
  ): Promise<IGetMessagesByChatIdResponse> => {
    const response = await api.get<IGetMessagesByChatIdResponse>(
      `${INTERNAL_ENDPOINTS.CHATS}/${chatId}/messages`,
      'internal',
    );
    eventBus.emit('getMessagesByChatIdSuccess', response);
    return response;
  },

  sendMessage: async (
    chatId: string = '684f15946720dfaafba07b89',
    message: string,
    localId?: string,
  ): Promise<ISendMessageResponse> => {
    const response = await api.post<ISendMessageResponse>(
      `${INTERNAL_ENDPOINTS.CHAT_MESSAGES}`,
      'internal',
      {chatId, message},
    );
    eventBus.emit(
      'sendMessageSuccess',
      localId ? {...response, localId} : response,
    );
    return response;
  },
};
