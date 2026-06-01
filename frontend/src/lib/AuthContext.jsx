import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: 'globalhub', public_settings: {} });

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      
      // Check if user is authenticated via our custom backend
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const userRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
      const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
      const userEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
      
      if (token && userRole && userId) {
        // User is authenticated
        setUser({
          id: userId,
          email: userEmail,
          role: userRole
        });
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoadingAuth(false);
    } catch (error) {
      console.warn('Auth check failed:', error?.message);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    // Clear all auth data from storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
