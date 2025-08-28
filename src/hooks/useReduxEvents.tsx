import {useEffect} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {useAppDispatch} from '../store/store';
import {
  setNotificationId,
  setUser,
  setUserUpdate,
} from '../store/slices/authSlice';
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
import {
  setAllSignals,
  addAllSignals,
  setWatchlistSignals,
  addWatchlistSignals,
  setAllSignalsLoading,
  setWatchlistSignalsLoading,
  setHasMoreAll,
  setHasMoreWatchlist,
  setCurrentTab,
  setFilters,
  clearSignals,
} from '../store/slices/signalsSlice';
import {
  setPaywallData,
  setLoading as setSubscriptionLoading,
  setSelectedSubscription,
  setHasVisitedPaywall,
} from '../store/slices/subscriptionSlice';
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
    eventBus.on('updateUserSuccess', ({user}) => {
      dispatch(setUserUpdate(user));
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

    //SIGNALS
    eventBus.on('getAllSignalsSuccess', (response: ISignalsResponse) => {
      dispatch(setAllSignals(response.data));
      dispatch(setAllSignalsLoading(false));
      dispatch(setHasMoreAll(response.count === response.limit));
    });
    eventBus.on('getWatchlistSignalsSuccess', (response: ISignalsResponse) => {
      dispatch(setWatchlistSignals(response.data));
      dispatch(setWatchlistSignalsLoading(false));
      dispatch(setHasMoreWatchlist(response.count === response.limit));
    });
    eventBus.on('addAllSignalsSuccess', (response: ISignalsResponse) => {
      dispatch(addAllSignals(response.data));
      dispatch(setAllSignalsLoading(false));
      dispatch(setHasMoreAll(response.count === response.limit));
    });
    eventBus.on('addWatchlistSignalsSuccess', (response: ISignalsResponse) => {
      dispatch(addWatchlistSignals(response.data));
      dispatch(setWatchlistSignalsLoading(false));
      dispatch(setHasMoreWatchlist(response.count === response.limit));
    });
    eventBus.on('setCurrentTab', (tab: 'all' | 'watchlist') => {
      dispatch(setCurrentTab(tab));
      dispatch(clearSignals());
    });
    eventBus.on(
      'updateSignalsFilters',
      (filters: {period?: number; percent?: number}) => {
        dispatch(setFilters(filters));
        dispatch(clearSignals());
      },
    );
    eventBus.on('setAllSignalsLoading', (loading: boolean) => {
      dispatch(setAllSignalsLoading(loading));
    });
    eventBus.on('setWatchlistSignalsLoading', (loading: boolean) => {
      dispatch(setWatchlistSignalsLoading(loading));
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

    //SIGNAL
    eventBus.on('signalReceived', ({title, body}) => {
      const notification: INotification = {
        _id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now().toString(),
        isRead: false,
        type: 'info',
        data: null,
        title,
        body,
      };
      dispatch(addNotification(notification));
    });

    //PAYWALL
    eventBus.on('getPaywallSuccess', (response: IPaywallResponse) => {
      dispatch(setPaywallData(response));
      dispatch(setSubscriptionLoading(false));
    });

    eventBus.on('paywallOpened', () => {
      dispatch(setHasVisitedPaywall(true));
    });

    eventBus.on('paymentSuccess', (user: IUser) => {
      dispatch(setUser(user));
    });

    eventBus.on('restorePurchasesSuccess', (user: IUser) => {
      dispatch(setUser(user));
    });

    eventBus.on('subscriptionSelected', (subscription: ISubscription) => {
      dispatch(setSelectedSubscription(subscription));
    });
  }, []);
};
