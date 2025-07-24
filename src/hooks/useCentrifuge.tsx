import {useAppSelector} from '../store/store';
import {useRef, useEffect} from 'react';
import {USERS_CHANNEL_PREFIX, SIGNAL_CHANNEL} from '../const/enums';
import {eventBus} from '../middleware/eventMiddleware';
import {internalService} from '../service/internalServices';
import {centrifugeCases} from '../utils/centrifugeCases';

export const useCentrifuge = () => {
  const user = useAppSelector(state => state.auth);
  const centrifugeRef = useRef<any | null>(null);
  const subscriptionsRef = useRef<{[key: string]: any}>({});
  const centrifugeModule = require('centrifuge');
  const Centrifuge = centrifugeModule.Centrifuge;

  const subscribeToChannel = (channel: string) => {
    if (!centrifugeRef.current || subscriptionsRef.current[channel]) return;
    const sub = centrifugeRef.current.newSubscription(channel);
    sub.on('publication', (ctx: any) => {
      let msg = ctx.data;
      if (msg instanceof Uint8Array) msg = new TextDecoder().decode(msg);
      centrifugeCases(msg);
    });
    sub.subscribe();
    subscriptionsRef.current[channel] = sub;
  };

  const connect = async () => {
    console.log('connect');
    try {
      const res = await internalService.getSocket();
      if (centrifugeRef.current) centrifugeRef.current.disconnect();
      const centrifuge = new Centrifuge(res.wsUrl);
      centrifugeRef.current = centrifuge;
      centrifuge.setToken(res.token);
      centrifuge.on('connected', () => {
        console.log('Bağlandı!');
        subscribeToChannel(SIGNAL_CHANNEL);
        if (user && user._id)
          subscribeToChannel(`${USERS_CHANNEL_PREFIX}${user._id}`);
      });
      centrifuge.on('disconnected', () => console.log('Bağlantı Kesildi'));
      centrifuge.connect();
    } catch {
      console.log('Bağlantı Hatası');
    }
  };

  const publishMessage = (channel: string, message: any) => {
    if (centrifugeRef.current && channel) {
      centrifugeRef.current.publish(channel, message);
      return true;
    }
    return false;
  };

  const disconnect = () => {
    if (centrifugeRef.current) {
      centrifugeRef.current.disconnect();
      centrifugeRef.current = null;
      subscriptionsRef.current = {};
      console.log('Bağlantı Kesildi');
    }
  };

  useEffect(() => {
    const handleLogin = () => connect();
    eventBus.on('loginSuccess', handleLogin);

    const handleCentrifugeSent = (payload: {channel: string; message: any}) => {
      publishMessage(payload.channel, payload.message);
    };
    eventBus.on('centrifugeSent', handleCentrifugeSent);

    return () => {
      eventBus.off('loginSuccess', handleLogin);
      eventBus.off('centrifugeSent', handleCentrifugeSent);
      disconnect();
    };
  }, []);

  return {connect, publishMessage, disconnect, subscribeToChannel};
};
