import {eventBus} from '../middleware/eventMiddleware';

export const centrifugeCases = (msg: {type: string; data: any}) => {
  switch (msg.type) {
    case 'chat-message':
      console.log('chat-message', msg.data);
      eventBus.emit('getMessageFromCentrifuge', msg.data);
      break;
    case 'signal':
      console.log('signal', msg.data);
      eventBus.emit('signalReceived', msg.data);
      break;
    default:
      return null;
  }
};
