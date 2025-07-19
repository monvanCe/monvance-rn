import axios from 'axios';
import {loggerInterceptor} from '../middleware/loggerInterceptor';
import {authInterceptor} from '../middleware/authInterceptor';

const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

loggerInterceptor(instance);
authInterceptor(instance);

export default instance;
