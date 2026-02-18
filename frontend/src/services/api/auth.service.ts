import api from "./axios.config"

// Types for authentication
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
  token: string
  refreshToken: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role?: string
}

// Authentication service
export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", credentials)
      
      // Store tokens and user data
      localStorage.setItem("authToken", response.data.token)
      localStorage.setItem("refreshToken", response.data.refreshToken)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("isAuthenticated", "true")
      
      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  // Register user
  async register(userData: RegisterRequest): Promise<any> {
    try {
      const response = await api.post("/auth/register", userData)
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear all auth data
      localStorage.removeItem("authToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      localStorage.removeItem("isAuthenticated")
    }
  },

  // Get current user
  getCurrentUser(): any {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return localStorage.getItem("isAuthenticated") === "true" && 
           localStorage.getItem("authToken") !== null
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem("authToken")
  }
}

export default authService
