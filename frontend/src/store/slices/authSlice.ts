import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '../../services/api/auth.service'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string; role?: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return null
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        return rejectWithValue('No refresh token available')
      }
      // Implementation would depend on your backend API
      // const response = await authService.refreshToken(refreshToken)
      // return response
      return null
    } catch (error: any) {
      return rejectWithValue('Token refresh failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    setTokens: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        // Registration doesn't automatically log in, so we don't set auth state
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.token = action.payload.token
          state.refreshToken = action.payload.refreshToken
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        // On refresh failure, clear auth state
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setUser, setTokens, clearAuth } = authSlice.actions
export default authSlice.reducer
