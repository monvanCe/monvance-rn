import axios from 'axios';
import {loggerInterceptor} from '../middleware/loggerInterceptor';

const instance = axios.create({
  baseURL: 'https://api.binance.com/api/v3',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

loggerInterceptor(instance);

export default instance;
