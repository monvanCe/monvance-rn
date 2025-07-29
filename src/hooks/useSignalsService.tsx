import {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {signalsService} from '../service/signalsService';
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

export const useSignalsService = () => {
  const dispatch = useDispatch();
  const {
    allSignals,
    watchlistSignals,
    allSignalsLoading,
    watchlistSignalsLoading,
    hasMoreAll,
    hasMoreWatchlist,
    currentTab,
    filters,
  } = useSelector((state: RootState) => state.signals);

  const loadAllSignals = useCallback(
    async (isRefresh = false) => {
      try {
        dispatch(setAllSignalsLoading(true));

        const skip = isRefresh ? 0 : allSignals.length;
        const response = await signalsService.getAllSignals({
          period: filters.period,
          percent: filters.percent,
          limit: 50,
          skip,
        });

        if (isRefresh) {
          dispatch(setAllSignals(response.data));
        } else {
          dispatch(addAllSignals(response.data));
        }

        dispatch(setHasMoreAll(response.data.length === 50));
      } catch (error) {
        console.error('Error loading all signals:', error);
      } finally {
        dispatch(setAllSignalsLoading(false));
      }
    },
    [dispatch, allSignals.length, filters],
  );

  const loadWatchlistSignals = useCallback(
    async (isRefresh = false) => {
      try {
        dispatch(setWatchlistSignalsLoading(true));

        const skip = isRefresh ? 0 : watchlistSignals.length;
        const response = await signalsService.getWatchlistSignals({
          period: filters.period,
          percent: filters.percent,
          limit: 50,
          skip,
        });

        if (isRefresh) {
          dispatch(setWatchlistSignals(response.data));
        } else {
          dispatch(addWatchlistSignals(response.data));
        }

        dispatch(setHasMoreWatchlist(response.data.length === 50));
      } catch (error) {
        console.error('Error loading watchlist signals:', error);
      } finally {
        dispatch(setWatchlistSignalsLoading(false));
      }
    },
    [dispatch, watchlistSignals.length, filters],
  );

  const loadSignals = useCallback(
    async (isRefresh = false) => {
      if (currentTab === 'all') {
        await loadAllSignals(isRefresh);
      } else {
        await loadWatchlistSignals(isRefresh);
      }
    },
    [currentTab, loadAllSignals, loadWatchlistSignals],
  );

  const switchTab = useCallback(
    (tab: 'all' | 'watchlist') => {
      dispatch(setCurrentTab(tab));
      dispatch(clearSignals());
    },
    [dispatch],
  );

  const updateFilters = useCallback(
    (newFilters: {period?: number; percent?: number}) => {
      dispatch(setFilters(newFilters));
      dispatch(clearSignals());
    },
    [dispatch],
  );

  const loadMore = useCallback(() => {
    if (currentTab === 'all' && hasMoreAll && !allSignalsLoading) {
      loadAllSignals();
    } else if (
      currentTab === 'watchlist' &&
      hasMoreWatchlist &&
      !watchlistSignalsLoading
    ) {
      loadWatchlistSignals();
    }
  }, [
    currentTab,
    hasMoreAll,
    hasMoreWatchlist,
    allSignalsLoading,
    watchlistSignalsLoading,
    loadAllSignals,
    loadWatchlistSignals,
  ]);

  useEffect(() => {
    loadSignals(true);
  }, [currentTab, filters]);

  return {
    allSignals,
    watchlistSignals,
    allSignalsLoading,
    watchlistSignalsLoading,
    hasMoreAll,
    hasMoreWatchlist,
    currentTab,
    filters,
    loadSignals,
    loadMore,
    switchTab,
    updateFilters,
  };
};
