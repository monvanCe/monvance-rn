import {api} from './api';
import {
  BINANCE_ENDPOINTS,
  USDT_PRICES_ENDPOINT,
} from '../const/externalEndpoints';
import {eventBus} from '../middleware/eventMiddleware';
import axiosInstance from './axiosConfig';
import {processTickerPrices} from '../utils/processTickerPrices';

export const binanceService = {
  getTickerPrices: async (): Promise<BinanceTickerPrice[]> => {
    const data = await api.get<BinanceTickerPrice[]>(
      BINANCE_ENDPOINTS.TICKER_PRICE,
      'external',
    );

    eventBus.emit('tickerPricesFetched', processTickerPrices(data));
    return data;
  },
  getUSDTPrices: async (): Promise<USDTPricesResponse> => {
    const response = await axiosInstance.get<USDTPricesResponse>(
      USDT_PRICES_ENDPOINT,
    );
    return response.data;
  },
};
