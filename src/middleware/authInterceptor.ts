import {AxiosInstance} from 'axios';
import {store} from '../store/store';

export const authInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(config => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};
