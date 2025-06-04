// lib/context/SharedDataContext.tsx
'use client'

import React, { createContext, useContext, useState, useRef } from 'react';
import { UserSubmission } from '../types';

interface SharedDataContextType {
  submissions: UserSubmission[];
  addSubmission: (submission: Omit<UserSubmission, 'id'>) => void;
  updateSubmission: (id: string, updates: Partial<UserSubmission>) => void;
  deleteSubmission: (id: string) => void;
}

const SharedDataContext = createContext<SharedDataContextType | null>(null);

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (!context) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};

interface SharedDataProviderProps {
  children: React.ReactNode;
}

export const SharedDataProvider: React.FC<SharedDataProviderProps> = ({ children }) => {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const idCounter = useRef(1);

  const addSubmission = (submission: Omit<UserSubmission, 'id'>) => {
    const newSubmission: UserSubmission = {
      ...submission,
      id: (idCounter.current++).toString()
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const updateSubmission = (id: string, updates: Partial<UserSubmission>) => {
    setSubmissions(prev => prev.map(submission =>
      submission.id === id ? { ...submission, ...updates } : submission
    ));
  };

  const deleteSubmission = (id: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const sharedDataValue: SharedDataContextType = {
    submissions,
    addSubmission,
    updateSubmission,
    deleteSubmission
  };

  return (
    <SharedDataContext.Provider value={sharedDataValue}>
      {children}
    </SharedDataContext.Provider>
  );
};