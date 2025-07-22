import {internalService} from '../service/internalServices';
import {useAppSelector} from '../store/store';
import {useState, useRef, useEffect} from 'react';

export const useChatService = () => {
  const user = useAppSelector(state => state.auth);
  const [connectionStatus, setConnectionStatus] = useState(
    'Bağlantı Bekleniyor...',
  );
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const isConnectedRef = useRef(false);
  const subscriptionsRef = useRef(new Set<string>());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000;

  const subscribeToChannel = (channel: string) => {
    if (!wsRef.current || !isConnectedRef.current) return;
    subscriptionsRef.current.add(channel);
    const message = {
      method: 'subscribe',
      params: {channel},
    };
    wsRef.current.send(JSON.stringify(message));
  };

  const attemptReconnect = (url: string, _token?: string) => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts.current += 1;
        connect(url, _token);
      }, reconnectDelay);
    }
  };

  const connect = (url: string, _token?: string) => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnectionStatus('Bağlanıyor...');
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('Bağlandı!');
        isConnectedRef.current = true;
        reconnectAttempts.current = 0;
        // Re-subscribe to all channels after reconnection
        subscriptionsRef.current.forEach(channel => {
          subscribeToChannel(channel);
        });
        subscribeToChannel('signal');
        if (user && user._id) {
          subscribeToChannel(`users#${user._id}`);
        }
      };

      ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          // handleMessage(data); // handleMessage fonksiyonunu import etmiyoruz, bu satırı yorumda bırakıyoruz
          setMessages(prev => [...prev, event.data]);
        } catch (error) {
          //
        }
      };

      ws.onerror = error => {
        setConnectionStatus('Bağlantı Hatası');
      };

      ws.onclose = () => {
        setConnectionStatus('Bağlantı Kesildi');
        isConnectedRef.current = false;
        attemptReconnect(url, _token);
      };
    } catch (error) {
      setConnectionStatus('Bağlantı Hatası');
    }
  };

  const getChatToken = async () => {
    const res = await internalService.getChatToken();
    connect(res.wsUrl, res.token);
    return res;
  };

  const publishMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === 1 && message) {
      wsRef.current.send(
        typeof message === 'string' ? message : JSON.stringify(message),
      );
      setMessages(prev => [
        ...prev,
        `Giden: ${
          typeof message === 'string' ? message : JSON.stringify(message)
        }`,
      ]);
      return true;
    }
    return false;
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setConnectionStatus('Bağlantı Kesildi');
      isConnectedRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    getChatToken,
    connect,
    publishMessage,
    disconnect,
    connectionStatus,
    messages,
    isConnected: connectionStatus === 'Bağlandı!',
    subscribeToChannel,
  };
};
