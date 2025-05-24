import { AUTH_ACTIONS } from '../constants/actionTypes';

// Initialize state from localStorage to persist after refresh
export const AUTH_INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  loading: false,
  error: null
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      return {
        ...state,
        currentUser: action.payload,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        currentUser: null,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.REGISTER:
      return {
        ...state,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        currentUser: {...state.currentUser, ...action.payload},
        loading: false,
        error: null
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
