
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Child {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  age: number;
  ticketNumber: string;
  birthDate: string;
  username?: string; // Manter para compatibilidade com dados antigos
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
  messages?: {
    id: number;
    text: string;
    sender: 'parent' | 'child';
    timestamp: string;
  }[];
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
  // Carregar dados do localStorage ou usar dados padrão apenas se não existirem
  const loadChildrenFromStorage = () => {
    const stored = localStorage.getItem('children');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Erro ao carregar dados das crianças:', error);
        return [];
      }
    }
    // Retornar array vazio se não houver dados salvos
    return [];
  };

  const loadTasksFromStorage = () => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        return [];
      }
    }
    return [];
  };

  const loadMoneyRequestsFromStorage = () => {
    const stored = localStorage.getItem('moneyRequests');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Erro ao carregar solicitações de dinheiro:', error);
        return [];
      }
    }
    return [];
  };

  const [childrenList, setChildrenList] = useState<Child[]>(loadChildrenFromStorage);
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage);
  const [moneyRequests, setMoneyRequests] = useState<MoneyRequest[]>(loadMoneyRequestsFromStorage);

  // Salvar no localStorage sempre que as listas mudarem
  useEffect(() => {
    localStorage.setItem('children', JSON.stringify(childrenList));
  }, [childrenList]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('moneyRequests', JSON.stringify(moneyRequests));
  }, [moneyRequests]);

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
