import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import http from '../api/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    http.get('/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => {
        sessionStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    async login(payload) {
      const response = await http.post('/auth/login', payload);
      sessionStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    },
    async register(payload) {
      const response = await http.post('/auth/register', payload);
      sessionStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    },
    logout() {
      sessionStorage.removeItem('token');
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth trebuie folosit în interiorul AuthProvider.');
  }
  return context;
}