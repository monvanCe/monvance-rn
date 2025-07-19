import {api} from './api';
import {BINANCE_ENDPOINTS} from '../const/externalEndpoints';
import {eventBus} from '../middleware/eventMiddleware';

export const binanceService = {
  getTickerPrices: async (): Promise<BinanceTickerPrice[]> => {
    const data = await api.get<BinanceTickerPrice[]>(
      BINANCE_ENDPOINTS.TICKER_PRICE,
      'external',
    );
    eventBus.emit('tickerPricesFetched', data);
    return data;
  },
};
