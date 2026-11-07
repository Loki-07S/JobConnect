import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const validateTokenAndRole = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/validate');
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserRole(response.data.user.role);
          // Update localStorage with fresh user role
          localStorage.setItem('userRole', response.data.user.role);
        }
      } catch (error) {
        // Token is invalid, remove it from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateTokenAndRole();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;
