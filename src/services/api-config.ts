// src/api/api-config.ts
import axios, { AxiosInstance } from 'axios';
import { config } from '../config';

const apiClient: AxiosInstance = axios.create({
  baseURL: config.BACKEND_API,
  headers: {
    'Content-Type': 'application/json',
    "x-api-key": config.API_KEY,
  },
});

export default apiClient;
