import {AxiosInstance} from 'axios';

export const loggerInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(config => {
    console.log('Request:', config.method, config.url, config.data);
    return config;
  });

  instance.interceptors.response.use(response => {
    console.log('Response:', response.config.url, response.data);
    return response;
  });

  instance.interceptors.response.use(undefined, error => {
    console.log('Error:', error.response.data);
    return Promise.reject(error);
  });
};
