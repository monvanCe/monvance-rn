import axiosInstance from './axiosConfig';
import {AxiosRequestConfig, AxiosResponse} from 'axios';

const baseUrl = (requestType: 'internal' | 'external') => {
  if (requestType === 'internal') {
    return 'https://vens.cekolabs.com';
  }
  return 'https://api.binance.com/api/v3';
};

export const api = {
  get: async <T>(
    url: string,
    requestType: 'internal' | 'external',
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(
      baseUrl(requestType) + url,
      config,
    );
    return response.data;
  },

  post: async <T>(
    url: string,
    requestType: 'internal' | 'external',
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(
      baseUrl(requestType) + url,
      data,
      config,
    );
    return response.data;
  },

  put: async <T>(
    url: string,
    requestType: 'internal' | 'external',
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(
      baseUrl(requestType) + url,
      data,
      config,
    );
    return response.data;
  },

  delete: async <T>(
    url: string,
    requestType: 'internal' | 'external',
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(
      baseUrl(requestType) + url,
      config,
    );
    return response.data;
  },

  patch: async <T>(
    url: string,
    requestType: 'internal' | 'external',
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.patch(
      baseUrl(requestType) + url,
      data,
      config,
    );
    return response.data;
  },
};
