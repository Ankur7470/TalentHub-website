import { ORDER_ACTIONS } from '../constants/actionTypes';

export const ORDER_INITIAL_STATE = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

export const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTIONS.CREATE_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
        loading: false,
        error: null
      };
    case ORDER_ACTIONS.UPDATE_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
        orders: state.orders.map(order => 
          order._id === action.payload._id ? action.payload : order
        ),
        loading: false,
        error: null
      };
    case ORDER_ACTIONS.COMPLETE_ORDER:
      return {
        ...state,
        currentOrder: { ...state.currentOrder, isCompleted: true },
        orders: state.orders.map(order => 
          order._id === action.payload ? { ...order, isCompleted: true } : order
        ),
        loading: false,
        error: null
      };
    case ORDER_ACTIONS.CANCEL_ORDER:
      return {
        ...state,
        currentOrder: null,
        loading: false,
        error: null
      };
    case "SET_ORDERS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
        error: null
      };
    case "SET_CURRENT_ORDER":
      return {
        ...state,
        currentOrder: action.payload,
        loading: false,
        error: null
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
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
