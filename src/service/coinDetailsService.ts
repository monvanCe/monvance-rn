import {api} from './api';
import {INTERNAL_ENDPOINTS} from '../const/internalEndpoints';

export const coinDetailsService = {
  getCoinSignals: async (coin: string, limit: number, skip: number) => {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('skip', skip.toString());

    const response = await api.get<ISignalsResponse>(
      `${
        INTERNAL_ENDPOINTS.GET_COIN_SIGNALS
      }/${coin}?${queryParams.toString()}`,
      'internal',
    );
    return response;
  },
};
