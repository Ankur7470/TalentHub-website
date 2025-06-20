import { AUTH_ACTIONS } from '../constants/actionTypes';

export const AUTH_INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  loading: false,
  error: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      return { ...state, currentUser: action.payload, loading: false, error: null };
    case AUTH_ACTIONS.LOGOUT:
      return { ...state, currentUser: null, loading: false, error: null };
    case AUTH_ACTIONS.REGISTER:
      return { ...state, loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
