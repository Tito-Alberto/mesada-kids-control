
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  type: 'parent' | 'child';
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, userType: 'parent' | 'child', ticketNumber?: string) => Promise<boolean>;
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

  const login = async (identifier: string, password: string, userType: 'parent' | 'child', ticketNumber?: string): Promise<boolean> => {
    if (identifier && password) {
      let userData: User;
      
      if (userType === 'parent') {
        // Verificar se o pai está cadastrado na base de dados
        const parentsData = localStorage.getItem('parents');
        const parents = parentsData ? JSON.parse(parentsData) : [];
        
        // Procurar o pai pelo email e senha
        const parentFound = parents.find((parent: any) => 
          parent.email === identifier && parent.password === password
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
        // Para filhos, verificar se existem no sistema usando nome + número do bilhete + senha
        const childrenData = localStorage.getItem('children');
        const children = childrenData ? JSON.parse(childrenData) : [];
        
        // Procurar a criança pelo nome, número do bilhete e senha
        const childFound = children.find((child: any) => {
          // Suportar tanto o sistema antigo (username) quanto o novo (nome + bilhete)
          if (child.username) {
            // Sistema antigo
            return child.username === identifier && child.password === password;
          } else {
            // Sistema novo
            return child.name === identifier && 
                   child.ticketNumber === ticketNumber && 
                   child.password === password;
          }
        });
        
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
