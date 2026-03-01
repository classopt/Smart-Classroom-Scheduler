import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import entitiesSlice from './slices/entitiesSlice'
import schedulingSlice from './slices/schedulingSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    entities: entitiesSlice,
    scheduling: schedulingSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
