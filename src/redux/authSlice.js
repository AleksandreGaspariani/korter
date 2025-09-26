import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // persist to localStorage
      localStorage.setItem("auth", JSON.stringify({
        user: action.payload.user,
        token: action.payload.token
      }));
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth");
    },
    loadAuth: (state) => {
      const savedAuth = localStorage.getItem("auth");
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        state.user = parsed.user;
        state.token = parsed.token;
      }
    }
  }
});

export const { setAuth, clearAuth, loadAuth } = authSlice.actions;
export default authSlice.reducer;