import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    // ...add other reducers here...
  },
})

export default store
