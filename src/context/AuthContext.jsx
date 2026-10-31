import React, { createContext, useCallback, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => (await api.get('/auth/me')).data.user,
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  const login = useCallback(async (credentials) => {
    const user = (await api.post('/auth/login', credentials)).data.user;
    queryClient.setQueryData(['auth', 'me'], user);
    return user;
  }, [queryClient]);

  const register = useCallback(async (details) => {
    const user = (await api.post('/auth/register', details)).data.user;
    queryClient.setQueryData(['auth', 'me'], user);
    return user;
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      queryClient.clear();
    }
  }, [queryClient]);

  const value = {
    user: meQuery.isError ? null : meQuery.data || null,
    isLoading: meQuery.isLoading,
    login,
    register,
    logout,
    refreshUser: meQuery.refetch
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
