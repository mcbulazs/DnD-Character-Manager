import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../store/utility/authSlice';

interface AuthGuardProps {
  children: JSX.Element;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (isLoggedIn) {
    // If the user is logged in, redirect them away from the login/register pages
    return <Navigate to="/" replace />;
  }

  // If not logged in, allow access to the route
  return children;
};

export default AuthGuard;