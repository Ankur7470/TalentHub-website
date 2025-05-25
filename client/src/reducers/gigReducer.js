import { GIG_ACTIONS } from '../constants/actionTypes';

export const GIG_INITIAL_STATE = {
  userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
  title: "",
  cat: "",
  cover: "",
  images: [],
  desc: "",
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,
  revisionNumber: 0,
  features: [],
  price: 0,
  loading: false,
  error: null,
  success: false
};

export const gigReducer = (state, action) => {
  switch (action.type) {
    case GIG_ACTIONS.CHANGE_INPUT:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case GIG_ACTIONS.ADD_IMAGES:
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };
    case GIG_ACTIONS.ADD_FEATURE:
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case GIG_ACTIONS.REMOVE_FEATURE:
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload
        ),
      };
    case GIG_ACTIONS.INIT_GIG:  // Changed from "INIT_GIG" to GIG_ACTIONS.INIT_GIG
      return {
        ...action.payload,
        userId: state.userId  // Preserve the current user ID
      };
    case GIG_ACTIONS.UPDATE_GIG:
      return {
        ...state,
        ...action.payload,
        loading: false,
        success: true
      };
    case GIG_ACTIONS.RESET_FORM:
      return {
        ...GIG_INITIAL_STATE,
        userId: state.userId
      };
    case GIG_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    case GIG_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case "SET_SUCCESS":
      return {
        ...state,
        success: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
