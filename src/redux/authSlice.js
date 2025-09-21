import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../plugins/axios' // Use your default axios instance

// Example async thunk to fetch user info
export const fetchAuthUser = createAsyncThunk(
  'auth/fetchAuthUser',
  async (_, thunkAPI) => {
    // Use axios for API call
    const response = await axios.get('auth/me')
    // Only return the user data
    return response.data
  }
)

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post('login', { email, password })
      localStorage.setItem('access_token', response.data.access_token)
      return response.data.user
    } catch (error) {
      // Forward backend error response
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await axios.post('register', { name, email, password })
      localStorage.setItem('access_token', response.data.access_token)
      return response.data.user
    } catch (error) {
      // Forward backend error response
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    await axios.post('logout')
    localStorage.removeItem('access_token')
    return null
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
      localStorage.removeItem('access_token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
  },
})

// Auto-fetch user if token exists
export const initAuth = () => async (dispatch) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    try {
      const user = await dispatch(fetchAuthUser()).unwrap()
      dispatch(setUser(user))
    } catch (err) {
      dispatch(logout())
    }
  }
}

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
