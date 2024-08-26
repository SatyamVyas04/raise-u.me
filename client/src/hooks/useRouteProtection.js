// src/hooks/useRouteProtection.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const protectedRoutes = ['/builder', '/enhancer', '/profile', '/saved-resume', '/generated-resume'];

export const useRouteProtection = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const currentPath = window.location.pathname;
      if (protectedRoutes.includes(currentPath)) {
        navigate('/login');
      }
    }
  }, [isLoaded, isSignedIn, navigate]);
};