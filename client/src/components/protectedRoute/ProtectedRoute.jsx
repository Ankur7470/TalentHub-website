import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, sellerOnly = false }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (sellerOnly && !currentUser.isSeller) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute;
