
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  type: 'parent' | 'child';
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, userType: 'parent' | 'child') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string, userType: 'parent' | 'child'): Promise<boolean> => {
    // Simulação de login - em produção conectar com backend
    if (username && password) {
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: username,
        type: userType,
        email: userType === 'parent' ? username : undefined,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Verificar se há usuário salvo no localStorage ao carregar
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
