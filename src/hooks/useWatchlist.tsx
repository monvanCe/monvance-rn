import {useEffect, useCallback} from 'react';

import {eventBus} from '../middleware/eventMiddleware';
import {internalService} from '../service/internalServices';
import {useAppSelector} from '../store/store';

export const useWatchlist = () => {
  const {coins} = useAppSelector(state => state.watchlist);

  const switchCoin = useCallback(
    (symbol: string) => {
      let newCoins = [...coins];
      if (coins.includes(symbol)) {
        newCoins = newCoins.filter(coin => coin !== symbol);
      } else {
        newCoins.push(symbol);
      }
      internalService.updateWatchlistCoins(newCoins);
    },
    [coins],
  );

  useEffect(() => {
    const handleLogin = () => {
      internalService.getWatchlist();
    };
    const handleCoinSwitch = (symbol: string) => {
      switchCoin(symbol);
    };

    const handlePeriodChange = (period: string) => {
      internalService.updateWatchlistPeriod(period);
    };
    const handlePercentChange = (percent: string) => {
      internalService.updateWatchlistPercent(percent);
    };

    eventBus.on('loginSuccess', handleLogin);
    eventBus.on('coinSwitched', handleCoinSwitch);
    eventBus.on('periodChanged', handlePeriodChange);
    eventBus.on('percentChanged', handlePercentChange);

    return () => {
      eventBus.off('loginSuccess', handleLogin);
      eventBus.off('coinSwitched', handleCoinSwitch);
      eventBus.off('periodChanged', handlePeriodChange);
      eventBus.off('percentChanged', handlePercentChange);
    };
  }, [switchCoin]);

  return {switchCoin};
};
