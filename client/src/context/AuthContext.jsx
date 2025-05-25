import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import { authReducer, AUTH_INITIAL_STATE } from '../reducers/authReducer';
import newRequest from '../utils/newRequest';
import { AUTH_ACTIONS } from '../constants/actionTypes';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const [isInitializing, setIsInitializing] = useState(true); // NEW

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: JSON.parse(storedUser) });
    }
    setIsInitializing(false);
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await newRequest.post("/auth/login", credentials);
      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: res.data });
      localStorage.setItem("currentUser", JSON.stringify(res.data)); // Save to storage
      return res.data;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data || "Login failed" });
      throw err;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await newRequest.post("/auth/register", userData);
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
      await newRequest.post("/auth/logout");
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

      const res = await newRequest.put(`/users/${state.currentUser._id}`, userData);
      dispatch({ type: AUTH_ACTIONS.UPDATE_PROFILE, payload: res.data });
      localStorage.setItem("currentUser", JSON.stringify({ ...state.currentUser, ...res.data }));
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
      isInitializing,
      login,
      register,
      logout,
      updateProfile,
      isSeller,
      getCurrentUserId,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
