import {api} from './api';
import {INTERNAL_ENDPOINTS} from '../const/internalEndpoints';

export const signalsService = {
  getAllSignals: async (params: {
    period?: number;
    percent?: number;
    limit?: number;
    skip?: number;
  }) => {
    const queryParams = new URLSearchParams();

    if (params.period !== undefined) {
      queryParams.append('period', params.period.toString());
    }
    if (params.percent !== undefined) {
      queryParams.append('percent', params.percent.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.skip !== undefined) {
      queryParams.append('skip', params.skip.toString());
    }

    const response = await api.get<ISignalsResponse>(
      `${INTERNAL_ENDPOINTS.GET_ALL_SIGNALS}?${queryParams.toString()}`,
      'internal',
    );
    return response;
  },

  getWatchlistSignals: async (params: {
    period?: number;
    percent?: number;
    limit?: number;
    skip?: number;
  }) => {
    const queryParams = new URLSearchParams();

    if (params.period !== undefined) {
      queryParams.append('period', params.period.toString());
    }
    if (params.percent !== undefined) {
      queryParams.append('percent', params.percent.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.skip !== undefined) {
      queryParams.append('skip', params.skip.toString());
    }

    const response = await api.get<ISignalsResponse>(
      `${INTERNAL_ENDPOINTS.GET_WATCHLIST_SIGNALS}?${queryParams.toString()}`,
      'internal',
    );
    return response;
  },
};
