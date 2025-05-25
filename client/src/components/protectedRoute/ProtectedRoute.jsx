import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../loader/Loader'; // Show spinner during hydration

const ProtectedRoute = ({ children, sellerOnly = false }) => {
  const { currentUser, isInitializing } = useAuth();

  if (isInitializing) {
    return <Loader />; 
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (sellerOnly && !currentUser.isSeller) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
