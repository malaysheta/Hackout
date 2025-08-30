import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      // Check token size
      const tokenSize = token.length;
      console.log('Token size:', tokenSize, 'characters');
      
      if (tokenSize > 1000) {
        console.warn('Token is very large, this might cause header size issues');
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token set in axios headers:', token.substring(0, 15) + '...');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log('Token removed from axios headers');
    }
  }, [token]);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Only logout if it's an authentication error, not network error
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      // Clear any existing token
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);
      const { token: newToken, user: userData } = response.data;
      
      // Validate token
      if (!newToken || typeof newToken !== 'string') {
        throw new Error('Invalid token received from server');
      }
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login error details:', error);
      
      let message = 'Login failed';
      if (error.response) {
        if (error.response.status === 431) {
          message = 'Login failed: Request header too large. Please try again.';
        } else if (error.response.data?.error?.message) {
          message = error.response.data.error.message;
        }
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', { 
        username: userData.username, 
        email: userData.email,
        role: userData.role 
      });
      
      // Clear any existing token
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      const response = await axios.post('/api/auth/register', userData);
      
      console.log('Registration response:', response.data);
      const { token: newToken, user: newUser } = response.data;
      
      // Validate token
      if (!newToken || typeof newToken !== 'string') {
        throw new Error('Invalid token received from server');
      }
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      console.error('Registration error details:', error);
      
      let message = 'Registration failed';
      if (error.response) {
        if (error.response.status === 431) {
          message = 'Registration failed: Request header too large. Please try again.';
        } else if (error.response.data?.error?.message) {
          message = error.response.data.error.message;
        }
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
