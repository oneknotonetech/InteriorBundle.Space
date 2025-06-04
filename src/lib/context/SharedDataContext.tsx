// lib/context/SharedDataContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSubmission } from '../types';
import { useIndexedDB } from '../hooks/useIndexedDB';

interface SharedDataContextType {
  submissions: UserSubmission[];
  addSubmission: (submission: Omit<UserSubmission, 'id'>) => void;
  updateSubmission: (id: string, updates: Partial<UserSubmission>) => void;
  deleteSubmission: (id: string) => void;
  isLoading: boolean;
  error: Error | null;
  retryInitialization: () => Promise<void>;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

export const SharedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    isInitialized,
    error: dbError,
    getAllSubmissions,
    addSubmission: dbAddSubmission,
    updateSubmission: dbUpdateSubmission,
    deleteSubmission: dbDeleteSubmission,
    retryInitialization
  } = useIndexedDB();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      // Skip data loading during SSR
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      if (isInitialized) {
        try {
          const allSubmissions = await getAllSubmissions();
          setSubmissions(allSubmissions);
          setError(null);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to load submissions');
          setError(error);
          console.error('Failed to load submissions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [isInitialized, getAllSubmissions]);

  // Handle database errors
  useEffect(() => {
    if (dbError) {
      setError(dbError);
    }
  }, [dbError]);

  const addSubmission = async (submission: Omit<UserSubmission, 'id'>) => {
    // Skip operation during SSR
    if (typeof window === 'undefined') {
      throw new Error('Database operations are not available during server-side rendering');
    }

    try {
      const newSubmission: UserSubmission = {
        ...submission,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      await dbAddSubmission(newSubmission);
      setSubmissions(prev => [...prev, newSubmission]);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add submission');
      setError(error);
      throw error;
    }
  };

  const updateSubmission = async (id: string, updates: Partial<UserSubmission>) => {
    // Skip operation during SSR
    if (typeof window === 'undefined') {
      throw new Error('Database operations are not available during server-side rendering');
    }

    try {
      await dbUpdateSubmission(id, updates);
      setSubmissions(prev =>
        prev.map(submission =>
          submission.id === id ? { ...submission, ...updates } : submission
        )
      );
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update submission');
      setError(error);
      throw error;
    }
  };

  const deleteSubmission = async (id: string) => {
    // Skip operation during SSR
    if (typeof window === 'undefined') {
      throw new Error('Database operations are not available during server-side rendering');
    }

    try {
      await dbDeleteSubmission(id);
      setSubmissions(prev => prev.filter(submission => submission.id !== id));
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete submission');
      setError(error);
      throw error;
    }
  };

  const value = {
    submissions,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    isLoading,
    error,
    retryInitialization
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (context === undefined) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};