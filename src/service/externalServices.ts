import {api} from './api';
import {BINANCE_ENDPOINTS} from '../const/externalEndpoints';

export interface BinanceTickerPrice {
  symbol: string;
  price: string;
}

export const binanceService = {
  getTickerPrices: async (): Promise<BinanceTickerPrice[]> => {
    return api.get<BinanceTickerPrice[]>(BINANCE_ENDPOINTS.TICKER_PRICE);
  },
};
