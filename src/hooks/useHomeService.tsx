import {useEffect} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {binanceService} from '../service/externalServices';

export const useHomeService = () => {
  useEffect(() => {
    eventBus.on('appStarted', () => {
      fetchPrices();
      setInterval(() => {
        fetchPrices();
      }, 10000);
    });
  }, []);

  const fetchPrices = async () => {
    try {
      await binanceService.getTickerPrices();
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };
};
