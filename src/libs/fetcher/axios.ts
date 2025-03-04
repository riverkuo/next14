import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const axiosConfig = {
  baseURL,
  headers: { 'Content-Type': 'application/json' },
};
const instance = axios.create({
  ...axiosConfig,
});

instance.interceptors.request.use((result) => {
  result.headers['apiKey'] = apiKey;
  return result;
});

instance.interceptors.response.use((result) => {
  return result;
});

export const getAxios = () => instance;
