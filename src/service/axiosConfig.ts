import axios from 'axios';
import {loggerInterceptor} from '../middleware/loggerInterceptor';

const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

loggerInterceptor(instance);

export default instance;
