import defaultInstance from "./axios";
import { setAuth, clearAuth, loadAuth } from "../redux/authSlice";

export const checkAuth = () => async (dispatch) => {
  dispatch(loadAuth()); // load from localStorage first

  const state = JSON.parse(localStorage.getItem("auth"));
  if (!state?.token) return;

  try {
    // verify token or fetch user profile
    const response = await defaultInstance.get("/me", {
      headers: { Authorization: `Bearer ${state.token}` }
    });

    dispatch(setAuth({
      user: response.data.user,
      token: state.token
    }));
    
  } catch (err) {
    console.error("Auth check failed:", err);
    dispatch(clearAuth());
  }
};
