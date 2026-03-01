import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { RootState, AppDispatch } from '../store'
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  refreshToken,
  clearAuth,
  setTokens 
} from '../store/slices/authSlice'
import { authService } from '../services/api/auth.service'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)
  
  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const userStr = localStorage.getItem('user')
    
    if (token && userStr) {
      const user = JSON.parse(userStr)
      dispatch(setTokens({ token, refreshToken }))
      dispatch({ type: 'auth/setUser', payload: user })
    }
  }, [dispatch])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap()
      // Store tokens in localStorage
      localStorage.setItem('authToken', result.token)
      localStorage.setItem('refreshToken', result.refreshToken)
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('isAuthenticated', 'true')
      return result
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap()
      return result
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      // Clear localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      dispatch(clearAuth())
    } catch (error) {
      // Even if logout fails, clear local storage and state
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
      dispatch(clearAuth())
      throw error
    }
  }

  const refreshTokens = async () => {
    try {
      await dispatch(refreshToken()).unwrap()
    } catch (error) {
      // Token refresh failed, logout user
      await logout()
      throw error
    }
  }

  const isAuthenticated = auth.isAuthenticated || authService.isAuthenticated()

  return {
    user: auth.user,
    token: auth.token,
    refreshToken: auth.refreshToken,
    isAuthenticated,
    isLoading: auth.loading,
    error: auth.error,
    login,
    register,
    logout,
    refreshTokens,
  }
}
