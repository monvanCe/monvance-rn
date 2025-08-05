import {useEffect} from 'react';
import {useAppDispatch} from '../store/store';
import {eventBus} from '../middleware/eventMiddleware';
import {
  setCoinSignals,
  addCoinSignals,
  setCoinSignalsLoading,
  setHasMore,
  setCoin,
  clearCoinSignals,
} from '../store/slices/coinDetailsSlice';
import {coinDetailsService} from '../service/coinDetailsService';

export const useCoinDetailsService = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleLoadCoinSignals = async (params: {
      coin: string;
      limit: number;
      skip: number;
      isRefresh: boolean;
    }) => {
      try {
        dispatch(setCoinSignalsLoading(true));
        dispatch(setCoin(params.coin));

        const response = await coinDetailsService.getCoinSignals(
          params.coin,
          params.limit,
          params.skip,
        );

        if (params.isRefresh) {
          dispatch(setCoinSignals(response.data));
        } else {
          dispatch(addCoinSignals(response.data));
        }

        dispatch(setHasMore(response.data.length === params.limit));
      } catch (error) {
        console.error('Error loading coin signals:', error);
      } finally {
        dispatch(setCoinSignalsLoading(false));
      }
    };

    const handleClearCoinSignals = () => {
      dispatch(clearCoinSignals());
    };

    eventBus.on('loadCoinSignals', handleLoadCoinSignals);
    eventBus.on('clearCoinSignals', handleClearCoinSignals);

    return () => {
      eventBus.off('loadCoinSignals', handleLoadCoinSignals);
      eventBus.off('clearCoinSignals', handleClearCoinSignals);
    };
  }, [dispatch]);
};
