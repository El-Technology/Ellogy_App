import axios, { AxiosError } from 'axios';
import { VaultService } from './storage';

const storage = new VaultService();

const axiosConfig = {
  baseURL: 'https://api-dev.elottdev.pp.ua/api/',
};
const instance = axios.create(axiosConfig);

// Interceptors
instance.interceptors.request.use(
  (req) => {
    const TOKEN = storage.getItem('token');

    if (TOKEN && req.headers) {
      Object.assign(req.headers, { Authorization: `bearer ${TOKEN}` });
    }

    if (!TOKEN) {
      // deleting the token from header
      delete instance.defaults.headers.common.Authorization;
    }
    return req;
  },
  (error: AxiosError) => {
    return Promise.reject(error.response);
  },
);

//on successful response
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error && error.response && error.response.status === 401) {
      storage.clearStorage();
      sessionStorage.clear();
      window.location.href = '/';
    } else {
      return Promise.reject(error.response);
    }
  },
);

export default instance;
