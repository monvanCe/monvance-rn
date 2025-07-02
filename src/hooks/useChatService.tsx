import {internalService} from '../service/internalServices';
import {Centrifuge} from 'centrifuge';
import {useAppSelector} from '../store/store';

export const useChatService = () => {
  const user = useAppSelector(state => state.auth);

  const getChatToken = async (token: string) => {
    const res = await internalService.getChatToken(token);
    connectToChat(res.token, res.wsUrl);
    return res;
  };

  const connectToChat = async (chatToken: string, url: string) => {
    debugger;
    const centrifuge = new Centrifuge(url);

    centrifuge.setToken(chatToken);

    const publicSub = centrifuge.newSubscription('signal');
    publicSub.on('publication', ctx => {
      console.log('Public:', ctx);
    });
    publicSub.subscribe();

    const privateSub = centrifuge.newSubscription(`users#${user._id}`);
    privateSub.on('publication', ctx => {
      const decoded = new TextDecoder().decode(ctx.data);
      console.log('Private:', JSON.parse(decoded));
    });
    privateSub.subscribe();

    centrifuge.on('connected', ctx => {
      console.log('Connected:', ctx);
    });

    centrifuge.on('disconnected', ctx => {
      console.log('Disconnected:', ctx);
    });

    centrifuge.on('error', ctx => {
      console.log('Centrifuge error:', ctx);
    });

    centrifuge.connect();
  };

  return {getChatToken, connectToChat};
};
