import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/db';

export interface User {
  id: number;
  name: string;
  avatarUri?: string | null;
  createdAt: number;
}

interface UserContextType {
  activeUser: User | null;
  users: User[];
  setActiveUser: (user: User | null) => void;
  loadUsers: () => Promise<void>;
  createUser: (name: string) => Promise<User | null>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    try {
      const allUsers = await db.getAllAsync<User>('SELECT * FROM users ORDER BY createdAt DESC');
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const createUser = async (name: string) => {
    try {
      const result = await db.runAsync('INSERT INTO users (name) VALUES (?)', [name]);
      if (result.lastInsertRowId) {
        const newUser = await db.getFirstAsync<User>('SELECT * FROM users WHERE id = ?', [result.lastInsertRowId]);
        if (newUser) {
          setUsers(prev => [newUser, ...prev]);
          return newUser;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to create user:', error);
      return null;
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <UserContext.Provider value={{ activeUser, users, setActiveUser, loadUsers, createUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
