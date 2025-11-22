import {useEffect, useRef} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {binanceService} from '../service/externalServices';
import {BINANCE_WS_URL} from '../const/externalEndpoints';

export const useHomeService = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestUpdatesRef = useRef<ProcessedPrice[]>([]);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUsingFallbackRef = useRef<boolean>(false);

  useEffect(() => {
    eventBus.on('appStarted', () => {
      fetchPrices();
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
      }
    };
  }, []);

  const fetchPrices = async () => {
    try {
      await binanceService.getTickerPrices();
      connectWebSocket();
    } catch (error) {
      startFallbackPolling();
    }
  };

  const startFallbackPolling = () => {
    if (isUsingFallbackRef.current) {
      return;
    }
    isUsingFallbackRef.current = true;

    fetchUSDTPrices();
    fallbackIntervalRef.current = setInterval(() => {
      fetchUSDTPrices();
    }, 5000);
  };

  const fetchUSDTPrices = async () => {
    try {
      const response = await binanceService.getUSDTPrices();
      const updates: ProcessedPrice[] = response.data.map(item => ({
        symbol: item.symbol,
        price: item.price.toString(),
        volume: (item.volume * item.price).toString(),
        change: item.changePrice.toString(),
        changePercent: item.changePercent.toString(),
      }));

      eventBus.emit('tickerPricesFetched', updates);
    } catch (error) {
      console.error('Error fetching USDT prices:', error);
    }
  };

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(BINANCE_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to Binance stream');
      };

      ws.onmessage = (event: any) => {
        try {
          const data: BinanceStreamTicker[] = JSON.parse(event.data);

          // Transform WebSocket data to ProcessedPrice format
          const updates: ProcessedPrice[] = data.map(ticker => ({
            symbol: ticker.s,
            price: ticker.c,
            volume: ticker.q,
            change: ticker.p,
            changePercent: ticker.P,
          }));

          // Emit update event
          latestUpdatesRef.current = updates;
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }
          debounceTimeoutRef.current = setTimeout(() => {
            eventBus.emit('tickerPricesUpdated', latestUpdatesRef.current);
            debounceTimeoutRef.current = null;
          }, 1000);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = error => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
          debounceTimeoutRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  };
};
