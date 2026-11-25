import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse } from '../../types/auth';

interface AuthContextData {
  employee: AuthResponse['employee'] | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (data: AuthResponse) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredAuth(): AuthResponse | null {
  const storedAuth = sessionStorage.getItem('lavandariapro_auth');

  if (!storedAuth) {
    return null;
  }

  try {
    return JSON.parse(storedAuth) as AuthResponse;
  } catch {
    sessionStorage.removeItem('lavandariapro_auth');
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authData, setAuthData] = useState<AuthResponse | null>(getStoredAuth);

  const employee = authData?.employee ?? null;
  const token = authData?.access_token ?? null;
  const isAuthenticated = Boolean(token);

  function signIn(data: AuthResponse) {
    sessionStorage.setItem('lavandariapro_auth', JSON.stringify(data));
    setAuthData(data);
  }

  function signOut() {
    sessionStorage.removeItem('lavandariapro_auth');
    setAuthData(null);
  }

  return (
    <AuthContext.Provider
      value={{
        employee,
        token,
        isAuthenticated,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  }

  return context;
}