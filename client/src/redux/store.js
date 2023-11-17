import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import userReducer from './slices/user/userSlice.js'

export const store = configureStore({
  reducer: {
    user: userReducer
  },
//   middleware:(getDefaultMiddleware)
})