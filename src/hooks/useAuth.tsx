import {internalService} from '../service/internalServices';
import {setUser} from '../store/slices/authSlice';
import {useAppDispatch} from '../store/store';
import {setEvent} from '../store/slices/eventSlice';
import {EventNames} from '../const/enums';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const setUserFunction = (user: IUser) => {
    dispatch(setUser(user));
  };

  const removeUserFunction = () => {
    dispatch(setUser(null));
  };

  const login = async () => {
    const res = await internalService.login();
    setUserFunction(res);
    dispatch(setEvent({slug: EventNames.LOGIN_SUCCESS, data: res}));
    return res;
  };

  return {login};
};
