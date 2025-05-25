import React, { createContext, useReducer, useEffect } from 'react';
import { authReducer, AUTH_INITIAL_STATE } from '../reducers/authReducer';
import api from '../utils/api';
import { AUTH_ACTIONS } from '../constants/actionTypes';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const res = await api.get("/auth/me");
        dispatch({ type: AUTH_ACTIONS.LOGIN, payload: res.data });
      } catch (err) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    if (localStorage.getItem("accessToken")) {
      fetchCurrentUser();
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.post("/auth/login", credentials);

      // Save token in localStorage
      localStorage.setItem("accessToken", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));

      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: res.data.user });
      return res.data.user;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data || "Login failed" });
      throw err;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.post("/auth/register", userData);
      dispatch({ type: AUTH_ACTIONS.REGISTER });
      return res.data;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data || "Registration failed" });
      throw err;
    }
  };

  const logout = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await api.post("/auth/logout");

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data || "Logout failed" });
      throw err;
    }
  };

  const updateProfile = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      if (!state.currentUser) throw new Error("User not authenticated");
      const res = await api.put(`/users/${state.currentUser._id}`, userData);
      dispatch({ type: AUTH_ACTIONS.UPDATE_PROFILE, payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data || "Profile update failed" });
      throw err;
    }
  };

  const isSeller = () => state.currentUser?.isSeller || false;
  const getCurrentUserId = () => state.currentUser?._id;

  return (
    <AuthContext.Provider value={{
      currentUser: state.currentUser,
      loading: state.loading,
      error: state.error,
      login,
      register,
      logout,
      updateProfile,
      isSeller,
      getCurrentUserId
    }}>
      {children}
    </AuthContext.Provider>
  );
};
