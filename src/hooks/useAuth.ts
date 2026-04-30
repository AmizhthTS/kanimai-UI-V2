// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  userId: string;
  customerID: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Get user from localStorage
  const getUserFromStorage = useCallback((): UserData | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      const customerID = localStorage.getItem('customerID');
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      
      if (token && name && email && userId) {
        return {
          token,
          name,
          email,
          customerID: customerID || '',
          userId,
          role: role || 'user',
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      clearUserData();
    }
    
    return null;
  }, []);

  // Clear user data
  const clearUserData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('customerID');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }, []);

  // Check if JWT token is valid
  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }, []);

  // Check authentication status - make this public so components can call it
  const checkAuth = useCallback(() => {
    const userData = getUserFromStorage();
    
    if (userData && isTokenValid(userData.token)) {
      setUser(userData);
      return true;
    } else {
      clearUserData();
      setUser(null);
      return false;
    }
  }, [getUserFromStorage, isTokenValid, clearUserData]);

  // Initial check on mount
  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, [checkAuth]);

  // Login function
  const login = useCallback((userData: Omit<UserData, 'token'>, token: string) => {
    const user: UserData = {
      ...userData,
      token
    };
    
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('name', userData.name);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('customerID', userData.customerID);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('role', userData.role);
    
    // Update state
    setUser(user);
    
    // Dispatch a storage event to notify other tabs
    window.dispatchEvent(new Event('storage'));
    
    navigate('/');
  }, [navigate]);

  // Logout function
  const logout = useCallback(() => {
    clearUserData();
    setUser(null);
    
    // Dispatch a storage event to notify other tabs
    window.dispatchEvent(new Event('storage'));
    
    navigate('/login');
  }, [clearUserData, navigate]);

  return {
    user,
    isLoading,
    login,
    logout,
    checkAuth, // Export checkAuth so components can manually trigger re-check
    isAuthenticated: !!user,
  };
};