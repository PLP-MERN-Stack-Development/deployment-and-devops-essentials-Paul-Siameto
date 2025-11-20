import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

export const getTasks = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data || [];
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, updates) => {
  const response = await api.patch(`/tasks/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
  return id;
};

export default api;
