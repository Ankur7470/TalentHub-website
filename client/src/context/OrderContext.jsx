import React, { createContext, useReducer, useContext } from 'react';
import { orderReducer, ORDER_INITIAL_STATE } from '../reducers/orderReducer';
import api from '../utils/api';
import { ORDER_ACTIONS } from '../constants/actionTypes';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, ORDER_INITIAL_STATE);

  // Fetch user orders
  const fetchOrders = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.get("/orders");
      dispatch({ type: "SET_ORDERS", payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data || "Failed to fetch orders" });
      throw err;
    }
  };

  // Create payment intent
  const createPaymentIntent = async (gigId) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.post(`/orders/create-payment-intent/${gigId}`);
      return res.data;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data || "Payment initialization failed" });
      throw err;
    }
  };

  // Confirm order after payment
  const confirmOrder = async (payment_intent) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.put("/orders", { payment_intent });
      dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data || "Failed to confirm order" });
      throw err;
    }
  };

  // Mark order as completed
  const completeOrder = async (orderId) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.put(`/orders/${orderId}/complete`);
      dispatch({ type: ORDER_ACTIONS.COMPLETE_ORDER, payload: orderId });
      return res.data;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data || "Failed to complete order" });
      throw err;
    }
  };

  return (
    <OrderContext.Provider value={{ 
      ...state, 
      fetchOrders, 
      createPaymentIntent, 
      confirmOrder,
      completeOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
