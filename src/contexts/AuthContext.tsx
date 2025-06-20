
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
    console.log('Tentativa de login:', { identifier, password, userType });
    
    if (identifier && password) {
      let userData: User;
      
      if (userType === 'parent') {
        // Verificar se o pai está cadastrado na base de dados
        const parentsData = localStorage.getItem('parents');
        const parents = parentsData ? JSON.parse(parentsData) : [];
        
        console.log('Pais disponíveis:', parents);
        
        // Procurar o pai pelo email e senha
        const parentFound = parents.find((parent: any) => 
          parent.email === identifier && parent.password === password
        );
        
        if (!parentFound) {
          console.log('Pai não encontrado');
          return false; // Pai não cadastrado
        }
        
        userData = {
          id: parentFound.id,
          name: parentFound.name,
          type: userType,
          email: parentFound.email,
        };
      } else {
        // Para filhos, verificar se existem no sistema usando nome completo ou primeiro nome e senha
        const childrenData = localStorage.getItem('children');
        const children = childrenData ? JSON.parse(childrenData) : [];
        
        console.log('Crianças disponíveis:', children);
        console.log('Procurando por:', { name: identifier, password: password });
        
        // Procurar a criança pelo nome completo, primeiro nome ou último nome e senha
        const childFound = children.find((child: any) => {
          const childFullName = child.name ? child.name.trim() : '';
          const childFirstName = child.firstName ? child.firstName.trim() : '';
          const inputName = identifier.trim();
          
          // Permitir login com nome completo ou primeiro nome
          const nameMatch = childFullName === inputName || childFirstName === inputName;
          const passwordMatch = child.password === password;
          
          console.log('Comparando com criança:', { 
            childFullName,
            childFirstName,
            inputName,
            childPassword: child.password,
            nameMatch,
            passwordMatch,
            finalMatch: nameMatch && passwordMatch
          });
          
          return nameMatch && passwordMatch;
        });
        
        console.log('Criança encontrada:', childFound);
        
        if (!childFound) {
          console.log('Criança não encontrada com os dados fornecidos');
          return false; // Criança não cadastrada pelos pais
        }
        
        userData = {
          id: childFound.id.toString(),
          name: childFound.name,
          type: userType,
        };
      }
      
      console.log('Login bem-sucedido:', userData);
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
