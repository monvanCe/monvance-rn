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
} from '../store/slices/notificationSlice';

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

    eventBus.on('languageChanged', lang => {
      dispatch(setAppLanguage(lang));
    });

    eventBus.on('tickerPricesFetched', (data: BinanceTickerPrice[]) => {
      const processedData = data.map(item => ({
        symbol: item.symbol,
        price: item.price,
        volume: (Math.random() * 1000).toFixed(2),
        change: (Math.random() * 100).toFixed(2),
        changePercent: (Math.random() * 5).toFixed(2),
        isFavorite: Math.random() > 0.5,
        switchValue: Math.random() > 0.5,
      }));
      dispatch(setPrices(processedData));
    });

    eventBus.on(
      'getNotificationsSuccess',
      (response: INotificationResponse) => {
        dispatch(setNotifications(response.notifications));
        dispatch(setLoading(false));
      },
    );

    eventBus.on('getSignalsSuccess', (response: INotificationResponse) => {
      dispatch(setNotifications(response.notifications));
      dispatch(setLoading(false));
    });

    eventBus.on('getUnreadCountSuccess', (response: IUnreadCountResponse) => {
      dispatch(setUnreadCount(response.count));
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
  }, []);
};
