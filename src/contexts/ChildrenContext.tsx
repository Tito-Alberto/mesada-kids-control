
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Child {
  id: number;
  name: string;
  age: number;
  username: string;
  password: string;
  balance: number;
  monthlyAllowance: number;
  tasksCompleted: number;
  pendingRequests: number;
  parentId?: string;
}

interface ChildrenContextType {
  children: Child[];
  addChild: (childData: Omit<Child, 'id' | 'balance' | 'tasksCompleted' | 'pendingRequests'>) => void;
  updateChild: (id: number, updates: Partial<Child>) => void;
  getChild: (id: number) => Child | undefined;
  getChildrenByParent: (parentId: string) => Child[];
}

const ChildrenContext = createContext<ChildrenContextType | undefined>(undefined);

export const useChildren = () => {
  const context = useContext(ChildrenContext);
  if (context === undefined) {
    throw new Error('useChildren must be used within a ChildrenProvider');
  }
  return context;
};

export const ChildrenProvider = ({ children }: { children: ReactNode }) => {
  const [childrenList, setChildrenList] = useState<Child[]>([
    { 
      id: 1, 
      name: "Ana", 
      age: 8, 
      username: "ana_user",
      password: "ana123",
      balance: 25.50, 
      monthlyAllowance: 15, 
      tasksCompleted: 3, 
      pendingRequests: 1,
      parentId: "parent1"
    },
    { 
      id: 2, 
      name: "Pedro", 
      age: 12, 
      username: "pedro_user",
      password: "pedro123",
      balance: 48.75, 
      monthlyAllowance: 25, 
      tasksCompleted: 5, 
      pendingRequests: 0,
      parentId: "parent1"
    },
  ]);

  const addChild = (childData: Omit<Child, 'id' | 'balance' | 'tasksCompleted' | 'pendingRequests'>) => {
    const newChild: Child = {
      ...childData,
      id: Math.max(...childrenList.map(c => c.id), 0) + 1,
      balance: 0,
      tasksCompleted: 0,
      pendingRequests: 0,
    };
    setChildrenList(prev => [...prev, newChild]);
  };

  const updateChild = (id: number, updates: Partial<Child>) => {
    setChildrenList(prev => 
      prev.map(child => 
        child.id === id ? { ...child, ...updates } : child
      )
    );
  };

  const getChild = (id: number) => {
    return childrenList.find(child => child.id === id);
  };

  const getChildrenByParent = (parentId: string) => {
    return childrenList.filter(child => child.parentId === parentId);
  };

  return (
    <ChildrenContext.Provider value={{
      children: childrenList,
      addChild,
      updateChild,
      getChild,
      getChildrenByParent,
    }}>
      {children}
    </ChildrenContext.Provider>
  );
};
