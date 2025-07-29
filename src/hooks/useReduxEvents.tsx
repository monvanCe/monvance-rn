import {useEffect} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {useAppDispatch} from '../store/store';
import {setNotificationId, setUser} from '../store/slices/authSlice';
import {
  addMessage,
  setHasNewMessages,
  setMessages,
  updateMessageByLocalId,
} from '../store/slices/chatSlice';
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
import {
  coinSwitched,
  percentChanged,
  periodChanged,
  setWatchlist,
  watchAllChanged,
} from '../store/slices/watchlistSlice';
import {processTickerPrices} from '../utils/processTickerPrices';
import {addFavorite, removeFavorite} from '../store/slices/favoritesSlice';

export const useReduxEvents = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    //AUTH
    eventBus.on('loginSuccess', ({user}) => {
      dispatch(setUser(user));
    });
    eventBus.on('logoutSuccess', () => {
      dispatch(setUser(null));
    });

    //CHAT
    eventBus.on('chatScreenOpened', () => {
      dispatch(setHasNewMessages(false));
    });

    //APP
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
      const processedData = processTickerPrices(data);
      dispatch(setPrices(processedData));
    });
    eventBus.on('getSignalsSuccess', (response: INotificationResponse) => {
      dispatch(setNotifications(response.data));
      dispatch(setLoading(false));
    });

    //NOTIFICATIONS
    eventBus.on(
      'getNotificationsSuccess',
      (response: INotificationResponse) => {
        dispatch(setNotifications(response.data));
        dispatch(setLoading(false));
      },
    );
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

    //FAVORITES
    eventBus.on('addFavorite', (symbol: string) => {
      dispatch(addFavorite(symbol));
    });
    eventBus.on('removeFavorite', (symbol: string) => {
      dispatch(removeFavorite(symbol));
    });

    //WATCHLIST
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
    eventBus.on('coinSwitched', (symbol: string) => {
      dispatch(coinSwitched(symbol));
    });
    eventBus.on('watchAllChanged', (watchAll: boolean) => {
      dispatch(watchAllChanged(watchAll));
    });
    eventBus.on('periodChanged', period => {
      dispatch(periodChanged(Number(period)));
    });
    eventBus.on('percentChanged', percent => {
      dispatch(percentChanged(Number(percent)));
    });

    //MESSAGES
    eventBus.on('getMessagesByChatIdSuccess', response => {
      dispatch(setMessages(response.data));
    });
    eventBus.on('sendMessageSuccess', response => {
      if (response && response.localId) {
        dispatch(
          updateMessageByLocalId({
            localId: response.localId,
            data: {...response.data, status: 'sent', localId: undefined},
          }),
        );
      } else {
        dispatch(addMessage(response.data));
      }
    });
    eventBus.on('getMessageFromCentrifuge', (message: IMessage) => {
      dispatch(addMessage(message));
    });
  }, []);
};
