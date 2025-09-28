import {useEffect} from 'react';
import {signalsService} from '../service/signalsService';
import {eventBus} from '../middleware/eventMiddleware';

export const useSignalsService = () => {
  useEffect(() => {
    const handleLoginSuccess = async () => {
      try {
        const response = await signalsService.getAllSignals({
          limit: 50,
          skip: 0,
        });
        eventBus.emit('getAllSignalsSuccess', response);
      } catch (error) {
        console.error('Error loading initial signals:', error);
      }
    };

    const handleLoadAllSignals = async (params: {
      period?: number;
      percent?: number;
      limit?: number;
      skip?: number;
      isRefresh?: boolean;
    }) => {
      try {
        const response = await signalsService.getAllSignals(params);
        if (params.isRefresh) {
          eventBus.emit('getAllSignalsSuccess', response);
        } else {
          eventBus.emit('addAllSignalsSuccess', response);
        }
      } catch (error) {
        console.error('Error loading all signals:', error);
      }
    };

    const handleLoadWatchlistSignals = async (params: {
      period?: number;
      percent?: number;
      limit?: number;
      skip?: number;
      isRefresh?: boolean;
    }) => {
      try {
        const response = await signalsService.getWatchlistSignals(params);
        if (params.isRefresh) {
          eventBus.emit('getWatchlistSignalsSuccess', response);
        } else {
          eventBus.emit('addWatchlistSignalsSuccess', response);
        }
      } catch (error) {
        console.error('Error loading watchlist signals:', error);
      }
    };

    // Register event listeners
    eventBus.on('loginSuccess', handleLoginSuccess);
    eventBus.on('loadAllSignals', handleLoadAllSignals);
    eventBus.on('loadWatchlistSignals', handleLoadWatchlistSignals);

    // Cleanup
    return () => {
      eventBus.off('loginSuccess', handleLoginSuccess);
      eventBus.off('loadAllSignals', handleLoadAllSignals);
      eventBus.off('loadWatchlistSignals', handleLoadWatchlistSignals);
    };
  }, []);
};
