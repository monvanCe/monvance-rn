import {eventType} from '../middleware/eventMiddleware';
import {eventBus} from '../middleware/eventMiddleware';

export function waitForEvent<K extends keyof eventType>(
  eventName: K,
): Promise<eventType[K]> {
  return new Promise(resolve => {
    const handler = (data: eventType[K]) => {
      eventBus.off(eventName, handler);
      resolve(data);
    };
    eventBus.on(eventName, handler);
  });
}
