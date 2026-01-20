import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storageKeys';

// Your backend API (OutRay tunnel URL)
const API_BASE_URL = 'https://hard-power.outray.app/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Attach token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response, // Return successful response
  (error) => {
    let errorMessage = 'An unexpected error occurred';

    // Check if error response exists
    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      errorMessage = 'No response from server. Check your network or tunnel.';
    } else {
      errorMessage = error.message;
    }

    // Optionally, you can log the error
    console.error('API Error:', errorMessage);

    // Reject the promise with a structured error
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
