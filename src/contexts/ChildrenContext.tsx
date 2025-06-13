
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

export interface Task {
  id: number;
  childId: number;
  title: string;
  description?: string;
  reward: number;
  status: 'pending' | 'completed' | 'approved';
  createdAt: string;
  completedAt?: string;
}

export interface MoneyRequest {
  id: number;
  childId: number;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ChildrenContextType {
  children: Child[];
  tasks: Task[];
  moneyRequests: MoneyRequest[];
  addChild: (childData: Omit<Child, 'id' | 'balance' | 'tasksCompleted' | 'pendingRequests'>) => void;
  updateChild: (id: number, updates: Partial<Child>) => void;
  getChild: (id: number) => Child | undefined;
  getChildrenByParent: (parentId: string) => Child[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  getTasksByChild: (childId: number) => Task[];
  addMoneyRequest: (request: Omit<MoneyRequest, 'id' | 'createdAt'>) => void;
  updateMoneyRequest: (id: number, updates: Partial<MoneyRequest>) => void;
  getMoneyRequestsByChild: (childId: number) => MoneyRequest[];
  addBalance: (childId: number, amount: number) => void;
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

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      childId: 1,
      title: "Organizar o quarto",
      description: "Arrumar a cama e guardar os brinquedos",
      reward: 5.00,
      status: "completed",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  ]);

  const [moneyRequests, setMoneyRequests] = useState<MoneyRequest[]>([
    {
      id: 1,
      childId: 1,
      amount: 12.00,
      description: "Comprar livro de colorir",
      status: "pending",
      createdAt: new Date().toISOString()
    }
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

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const getTasksByChild = (childId: number) => {
    return tasks.filter(task => task.childId === childId);
  };

  const addMoneyRequest = (request: Omit<MoneyRequest, 'id' | 'createdAt'>) => {
    const newRequest: MoneyRequest = {
      ...request,
      id: Math.max(...moneyRequests.map(r => r.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    setMoneyRequests(prev => [...prev, newRequest]);
    
    // Atualizar contador de solicitações pendentes
    updateChild(request.childId, {
      pendingRequests: getMoneyRequestsByChild(request.childId).filter(r => r.status === 'pending').length + 1
    });
  };

  const updateMoneyRequest = (id: number, updates: Partial<MoneyRequest>) => {
    setMoneyRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const getMoneyRequestsByChild = (childId: number) => {
    return moneyRequests.filter(request => request.childId === childId);
  };

  const addBalance = (childId: number, amount: number) => {
    updateChild(childId, {
      balance: (getChild(childId)?.balance || 0) + amount
    });
  };

  return (
    <ChildrenContext.Provider value={{
      children: childrenList,
      tasks,
      moneyRequests,
      addChild,
      updateChild,
      getChild,
      getChildrenByParent,
      addTask,
      updateTask,
      getTasksByChild,
      addMoneyRequest,
      updateMoneyRequest,
      getMoneyRequestsByChild,
      addBalance,
    }}>
      {children}
    </ChildrenContext.Provider>
  );
};
