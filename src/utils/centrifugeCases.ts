import {eventBus} from '../middleware/eventMiddleware';

export const centrifugeCases = (msg: {type: string; data: any}) => {
  console.log('msg', msg);
  switch (msg.type) {
    case 'chat-message':
      eventBus.emit('getMessageFromCentrifuge', msg.data);
    case 'signal':
      eventBus.emit('signalReceived', msg.data);
    default:
      return null;
  }
};
