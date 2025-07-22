import {useEffect} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {useAppDispatch} from '../store/store';
import {setNotificationId, setUser} from '../store/slices/authSlice';
import {setHasNewMessages} from '../store/slices/chatSlice';
import {setAppLanguage} from '../store/slices/appConfigSlice';
import {setPrices} from '../store/slices/homeSlice';
import {
  setNotifications,
  setUnreadCount,
  setLoading,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  addNotification,
} from '../store/slices/notificationSlice';
import {setWatchlist} from '../store/slices/watchlistSlice';
import {processTickerPrices} from '../utils/processTickerPrices';

export const useReduxEvents = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    eventBus.on('loginSuccess', ({user}) => {
      dispatch(setUser(user));
    });

    eventBus.on('logoutSuccess', () => {
      dispatch(setUser(null));
    });

    eventBus.on('chatScreenOpened', () => {
      dispatch(setHasNewMessages(false));
    });

    eventBus.on('notificationIdCreated', token => {
      dispatch(setNotificationId(token));
    });

    eventBus.on('notificationIdRefreshed', token => {
      dispatch(setNotificationId(token));
    });

    eventBus.on('notificationIdInitialized', token => {
      dispatch(setNotificationId(token));
    });

    eventBus.on('notification', payload => {
      dispatch(
        addNotification({
          _id: '',
          title: payload.title,
          body: payload.body,
          timestamp: '',
          isRead: false,
          type: 'info',
          slug: '',
          data: null,
        }),
      );
    });

    eventBus.on('languageChanged', lang => {
      dispatch(setAppLanguage(lang));
    });

    eventBus.on('tickerPricesFetched', (data: BinanceTickerPrice[]) => {
      const processedData = processTickerPrices(data);
      dispatch(setPrices(processedData));
    });

    eventBus.on(
      'getNotificationsSuccess',
      (response: INotificationResponse) => {
        response.data.forEach(item => {
          dispatch(addNotification(item));
        });
        dispatch(setLoading(false));
      },
    );

    eventBus.on('getSignalsSuccess', (response: INotificationResponse) => {
      dispatch(setNotifications(response.data));
      dispatch(setLoading(false));
    });

    eventBus.on('getUnreadCountSuccess', (response: IUnreadCountResponse) => {
      dispatch(setUnreadCount(response.data.total));
    });

    eventBus.on('markAsReadSuccess', ({slug}: {slug: string}) => {
      dispatch(markAsRead(slug));
    });

    eventBus.on('markAllAsReadSuccess', () => {
      dispatch(markAllAsRead());
    });

    eventBus.on('deleteNotificationSuccess', ({slug}: {slug: string}) => {
      dispatch(deleteNotification(slug));
    });

    eventBus.on('deleteAllNotificationsSuccess', () => {
      dispatch(deleteAllNotifications());
    });

    eventBus.on('getWatchlistSuccess', response => {
      dispatch(setWatchlist(response.data));
    });

    eventBus.on('updateWatchlistCoinsSuccess', response => {
      dispatch(setWatchlist(response.data));
    });

    eventBus.on('updateWatchlistPeriodSuccess', response => {
      dispatch(setWatchlist(response.data));
    });

    eventBus.on('updateWatchlistPercentSuccess', response => {
      dispatch(setWatchlist(response.data));
    });

    eventBus.on('updateWatchlistWatchAllSuccess', response => {
      dispatch(setWatchlist(response.data));
    });
  }, []);
};
