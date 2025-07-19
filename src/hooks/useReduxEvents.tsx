import {useEffect} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {useAppDispatch} from '../store/store';
import {setNotificationId, setUser} from '../store/slices/authSlice';
import {setHasNewMessages} from '../store/slices/chatSlice';
import {setAppLanguage} from '../store/slices/appConfigSlice';
import {setPrices} from '../store/slices/homeSlice';

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

    eventBus.on('tokenCreated', token => {
      dispatch(setNotificationId(token));
    });

    eventBus.on('tokenRefreshed', token => {
      dispatch(setNotificationId(token));
    });

    eventBus.on('tokenInitialized', token => {
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
  }, []);
};
