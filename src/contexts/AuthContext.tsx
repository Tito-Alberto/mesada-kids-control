
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
    if (username && password) {
      let userData: User;
      
      if (userType === 'parent') {
        // Verificar se o pai está cadastrado na base de dados
        const parentsData = localStorage.getItem('parents');
        const parents = parentsData ? JSON.parse(parentsData) : [];
        
        // Procurar o pai pelo email e senha
        const parentFound = parents.find((parent: any) => 
          parent.email === username && parent.password === password
        );
        
        if (!parentFound) {
          return false; // Pai não cadastrado
        }
        
        userData = {
          id: parentFound.id,
          name: parentFound.name,
          type: userType,
          email: parentFound.email,
        };
      } else {
        // Para filhos, verificar se existem no sistema
        const childrenData = localStorage.getItem('children');
        const children = childrenData ? JSON.parse(childrenData) : [];
        
        // Procurar a criança pelo username e password
        const childFound = children.find((child: any) => 
          child.username === username && child.password === password
        );
        
        if (!childFound) {
          return false; // Criança não cadastrada pelos pais
        }
        
        userData = {
          id: childFound.id.toString(),
          name: childFound.name,
          type: userType,
        };
      }
      
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
