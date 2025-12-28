import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Only check auth if there's a token present
      const hasToken = localStorage.getItem('authToken') || sessionStorage.getItem('teacherSession');

      if (!hasToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_CURRENT_USER,
          { withCredentials: true }
        );

        if (response.data.success) {
          setUser(response.data.user);
          // Update session storage with latest user data
          sessionStorage.setItem('teacherSession', JSON.stringify(response.data.user));
        } else {
          // Try loading from session storage as fallback
          const cachedUser = sessionStorage.getItem('teacherSession');
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
          } else {
            // If auth check fails, clear tokens
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('teacherSession');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Try loading from session storage as fallback
        const cachedUser = sessionStorage.getItem('teacherSession');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        } else {
          // Clear any stale tokens
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('teacherSession');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        //change this when deploying
        //'http://localhost/SMS-GCA-3H/Teacher/backend/api/auth/login.php',
        API_ENDPOINTS.LOGIN,
        { employee_number: username, password }, // Fixed: backend expects employee_number
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        // Store auth token to persist session
        localStorage.setItem('authToken', 'authenticated');
        sessionStorage.setItem('teacherSession', JSON.stringify(response.data.user));
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        API_ENDPOINTS.LOGOUT,
        //'http://localhost/SMS-GCA-3H/Teacher/backend/api/auth/logout.php',
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('teacherSession');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.GET_CURRENT_USER,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};