import {internalService} from '../service/internalServices';
import {setUser} from '../store/slices/authSlice';
import {useAppDispatch} from '../store/store';
import {useChatService} from './useChatService';

export const useAuth = () => {
  const {getChatToken} = useChatService();
  const dispatch = useAppDispatch();
  const setUserFunction = (user: IUser) => {
    dispatch(setUser(user));
  };

  const removeUserFunction = () => {
    dispatch(setUser(null));
  };

  const login = async () => {
    const res = await internalService.login();
    if (res.token) {
      getChatToken(res.token);
    }
    setUserFunction(res);
    return res;
  };

  return {login, setUserFunction, removeUserFunction};
};
