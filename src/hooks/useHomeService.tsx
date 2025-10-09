import {useEffect, useRef} from 'react';
import {eventBus} from '../middleware/eventMiddleware';
import {binanceService} from '../service/externalServices';
import {BINANCE_WS_URL} from '../const/externalEndpoints';

export const useHomeService = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    eventBus.on('appStarted', () => {
      fetchPrices().then(() => {
        connectWebSocket();
      });
    });

    return () => {
      // Cleanup WebSocket on unmount
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const fetchPrices = async () => {
    try {
      await binanceService.getTickerPrices();
    } catch (error) {
      console.error('Error fetching prices:', error);
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
            isFavorite: false,
            switchValue: false,
          }));

          // Emit update event
          eventBus.emit('tickerPricesUpdated', updates);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = error => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  };
};
