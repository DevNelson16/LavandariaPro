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

export function AuthProvider({ children }: AuthProviderProps) {
    const [employee, setEmployee] = useState<AuthContextData['employee']>(null);
    const [token, setToken] = useState<string | null>(null);

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                employee,
                token,
                isAuthenticated,
                signIn: (data) => {
                    setEmployee(data.employee);
                    setToken(data.access_token);
                },
                signOut: () => {
                    setEmployee(null);
                    setToken(null);
                },
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