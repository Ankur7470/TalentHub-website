import React, { createContext, useReducer, useContext } from 'react';
import { gigReducer, GIG_INITIAL_STATE } from '../reducers/gigReducer';
import api from '../utils/api';
import { GIG_ACTIONS } from '../constants/actionTypes';
import upload from '../utils/upload';

const GigContext = createContext();

export const GigProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gigReducer, GIG_INITIAL_STATE);

  // Create gig action
  const createGig = async (gigData) => {
    dispatch({ type: GIG_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await api.post("/gigs", gigData);
      dispatch({ type: "SET_SUCCESS", payload: true });
      return res.data;
    } catch (err) {
      dispatch({ type: GIG_ACTIONS.SET_ERROR, payload: err.response?.data || "Failed to create gig" });
      throw err;
    }
  };

  //Update gig
  const updateGig = async (id, gigData) => {
    dispatch({ type: GIG_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await api.put(`/gigs/${id}`, gigData);
      dispatch({ type: GIG_ACTIONS.UPDATE_GIG, payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ 
        type: GIG_ACTIONS.SET_ERROR, 
        payload: err.response?.data || "Failed to update gig" 
      });
      throw err;
    }
  };

  // Upload images action
  const uploadImages = async (cover, images) => {
    dispatch({ type: GIG_ACTIONS.SET_LOADING, payload: true });
    try {
      const coverUrl = await upload(cover);
      
      const imageUrls = await Promise.all(
        [...images].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      
      dispatch({ 
        type: GIG_ACTIONS.ADD_IMAGES, 
        payload: { cover: coverUrl, images: imageUrls }
      });
      
      return { cover: coverUrl, images: imageUrls };
    } catch (err) {
      dispatch({ type: GIG_ACTIONS.SET_ERROR, payload: "Failed to upload images" });
      throw err;
    }
  };

  // Handle input change
  const handleInputChange = (name, value) => {
    dispatch({
      type: GIG_ACTIONS.CHANGE_INPUT,
      payload: { name, value }
    });
  };

  // Add feature
  const addFeature = (feature) => {
    dispatch({
      type: GIG_ACTIONS.ADD_FEATURE,
      payload: feature
    });
  };

  // Remove feature
  const removeFeature = (feature) => {
    dispatch({
      type: GIG_ACTIONS.REMOVE_FEATURE,
      payload: feature
    });
  };

  // Reset form
  const resetForm = () => {
    dispatch({ type: GIG_ACTIONS.RESET_FORM });
  };

  return (
    <GigContext.Provider value={{ 
      ...state, 
      createGig, 
      uploadImages, 
      handleInputChange,
      addFeature,
      removeFeature,
      updateGig,
      resetForm
    }}>
      {children}
    </GigContext.Provider>
  );
};

export const useGig = () => useContext(GigContext);
