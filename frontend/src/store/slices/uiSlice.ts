import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
}

interface UIState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  notifications: Notification[]
  loading: boolean
  activeModal: string | null
  breadcrumbs: Array<{ label: string; href: string }>
}

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: 'system',
  notifications: [],
  loading: false,
  activeModal: null,
  breadcrumbs: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; href: string }>>) => {
      state.breadcrumbs = action.payload
    },
    addBreadcrumb: (state, action: PayloadAction<{ label: string; href: string }>) => {
      state.breadcrumbs.push(action.payload)
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = []
    },
  },
})

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
  setLoading,
  setActiveModal,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
} = uiSlice.actions

export default uiSlice.reducer
