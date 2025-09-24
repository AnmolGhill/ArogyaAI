import axios from 'axios';

// API base configuration
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Authentication endpoints
  auth: {
    register: (userData) => api.post('/api/auth/register', userData),
    login: (credentials) => api.post('/api/auth/login', credentials),
    sendOTP: (email) => api.post('/api/auth/send-otp', { email }),
    verifyOTP: (email, otp) => api.post('/api/auth/verify-otp', { email, otp }),
  },
  
  // Health profile endpoints
  health: {
    updateProfile: (healthData) => api.post('/api/update-health', healthData),
    getProfile: () => api.get('/api/user-health'),
  },
  
  // Diagnosis endpoint
  diagnosis: {
    getDiagnosis: (symptoms) => api.post('/api/get_diagnosis', { symptoms }),
  },
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred';
    return { success: false, message, status: error.response.status };
  } else if (error.request) {
    // Request made but no response received
    return { success: false, message: 'Server is not responding. Please check your connection.', status: 0 };
  } else {
    // Something else happened
    return { success: false, message: error.message || 'An unexpected error occurred', status: 0 };
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    const response = await apiService.healthCheck();
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export default api;
