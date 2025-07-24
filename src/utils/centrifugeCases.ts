import {eventBus} from '../middleware/eventMiddleware';

export const centrifugeCases = (msg: {type: string; data: any}) => {
  switch (msg.type) {
    case 'chat-message':
      eventBus.emit('getMessageFromCentrifuge', msg.data);
    default:
      return null;
  }
};
