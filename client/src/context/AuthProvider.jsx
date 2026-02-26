import { useState, useEffect } from 'react';
import { AuthContext } from './authContext';
import { refreshSession, setAccessToken, clearAccessToken, logoutUser as apiLogout } from '../api/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we check the refresh cookie

  // On mount, try to restore session from the HTTP-only refresh cookie
  useEffect(() => {
    const restore = async () => {
      try {
        const { data } = await refreshSession();
        const userData = data.data;
        setAccessToken(userData.accessToken);
        setUser({ _id: userData._id, name: userData.name, email: userData.email });
      } catch {
        // No valid refresh cookie — user is not logged in
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = (userData) => {
    setAccessToken(userData.accessToken);
    setUser({ _id: userData._id, name: userData.name, email: userData.email });
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch { /* ignore */ }
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
