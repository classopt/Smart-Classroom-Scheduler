import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest) {
      // Token expired or invalid
      try {
        // TODO: Implement token refresh logic
        localStorage.removeItem("authToken")
        localStorage.removeItem("isAuthenticated")
        window.location.href = "/login"
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
