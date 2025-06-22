import {AxiosInstance} from 'axios';

export const loggerInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(config => {
    console.log('Request:', config.url);
    return config;
  });

  instance.interceptors.response.use(response => {
    console.log('Response:', response.config.url, response.data);
    return response;
  });
};
