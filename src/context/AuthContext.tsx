'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient, { clearSession, getStoredToken, getStoredUser, saveSession, setAuthToken } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (values: { email: string; password: string }) => Promise<void>;
  register: (values: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser as User);
      setAuthToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const auth = response.data.data as AuthPayload;
      saveSession(auth.token, auth.user);
      setToken(auth.token);
      setUser(auth.user);
      router.push('/dashboard');
    } catch (error) {
      const message = parseApiError(error);
      throw new Error(message);
    }
  };

  const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      const auth = response.data.data as AuthPayload;
      saveSession(auth.token, auth.user);
      setToken(auth.token);
      setUser(auth.user);
      router.push('/dashboard');
    } catch (error) {
      const message = parseApiError(error);
      throw new Error(message);
    }
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

function parseApiError(error: unknown) {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return 'Error inesperado. Intenta de nuevo.';
  }

  const axiosError = error as { response?: { data?: { error?: string } } };
  const apiMessage = axiosError.response?.data?.error;

  if (!apiMessage) {
    return 'Error inesperado. Intenta de nuevo.';
  }

  return apiMessage;
}
