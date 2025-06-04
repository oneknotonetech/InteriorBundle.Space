import { useState, useEffect, useCallback } from 'react';
import { indexedDBService } from '../services/indexedDB';
import { UserSubmission, UploadedImage, TableRowData } from '../types';

// Type for update operations
type UpdateData<T> = Partial<T>;

// Hook return type for better type safety
interface UseIndexedDBReturn {
  isInitialized: boolean;
  error: Error | null;
  // Submissions
  addSubmission: (submission: UserSubmission) => Promise<void>;
  getSubmission: (id: string) => Promise<UserSubmission | null>;
  getAllSubmissions: () => Promise<UserSubmission[]>;
  updateSubmission: (id: string, updates: UpdateData<UserSubmission>) => Promise<void>;
  deleteSubmission: (id: string) => void;
  // UserRows
  addUserRow: (row: TableRowData) => Promise<void>;
  getUserRow: (id: number) => Promise<TableRowData | null>;
  getAllUserRows: () => Promise<TableRowData[]>;
  updateUserRow: (id: number, updates: UpdateData<TableRowData>) => Promise<void>;
  deleteUserRow: (id: number) => Promise<void>;
  // Images
  addImage: (image: UploadedImage) => Promise<void>;
  getImage: (id: string) => Promise<UploadedImage | null>;
  getImagesBySubmissionId: (submissionId: string) => Promise<UploadedImage[]>;
  deleteImage: (id: string) => Promise<void>;
  // Utility functions
  clearAllData: () => Promise<void>;
  getDatabaseSize: () => Promise<{ [key: string]: number }>;
  clearError: () => void;
  retryInitialization: () => Promise<void>;
}

export const useIndexedDB = (): UseIndexedDBReturn => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const initializeDB = useCallback(async () => {
    // Skip initialization during SSR
    if (typeof window === 'undefined') {
      return;
    }

    try {
      await indexedDBService.initDB();
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to initialize database');
      setError(errorMessage);
      console.error('Database initialization failed:', errorMessage);
    }
  }, []);

  useEffect(() => {
    initializeDB();
  }, [initializeDB]);

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Retry initialization
  const retryInitialization = async () => {
    await initializeDB();
  };

  // Wrap all database operations with error handling and connection checks
  const wrapOperation = async <T>(operation: () => Promise<T>): Promise<T> => {
    // Skip operations during SSR
    if (typeof window === 'undefined') {
      throw new Error('Database operations are not available during server-side rendering');
    }

    try {
      if (!indexedDBService.isReady()) {
        await initializeDB();
      }
      return await operation();
    } catch (err) {
      console.error('Database operation failed:', err);
      throw err;
    }
  };

  // Submissions
  const addSubmission = async (submission: UserSubmission): Promise<void> => {
    return wrapOperation(async () => {
      await indexedDBService.addSubmission(submission);
      setError(null);
    });
  };

  const getSubmission = async (id: string): Promise<UserSubmission | null> => {
    return wrapOperation(async () => {
      const result = await indexedDBService.getSubmission(id);
      setError(null);
      return result;
    });
  };

  const getAllSubmissions = async (): Promise<UserSubmission[]> => {
    return wrapOperation(async () => {
      const result = await indexedDBService.getAllSubmissions();
      setError(null);
      return result;
    });
  };

  const updateSubmission = async (id: string, updates: UpdateData<UserSubmission>): Promise<void> => {
    return wrapOperation(async () => {
      await indexedDBService.updateSubmission(id, updates);
      setError(null);
    });
  };

  const deleteSubmission = async (id: string): Promise<void> => {
    return wrapOperation(async () => {
      await indexedDBService.deleteSubmission(id);
      setError(null);
    });
  };

  // UserRows
  const addUserRow = async (row: TableRowData): Promise<void> => {
    return wrapOperation(async () => {
      await indexedDBService.addUserRow(row);
      setError(null);
    });
  };

  const getUserRow = async (id: number): Promise<TableRowData | null> => {
    return wrapOperation(async () => {
      const result = await indexedDBService.getUserRow(id);
      setError(null);
      return result;
    });
  };

  const getAllUserRows = async (): Promise<TableRowData[]> => {
    return wrapOperation(async () => {
      const result = await indexedDBService.getAllUserRows();
      setError(null);
      return result;
    });
  };

  const updateUserRow = async (id: number, updates: UpdateData<TableRowData>): Promise<void> => {
    return wrapOperation(async () => {
      await indexedDBService.updateUserRow(id, updates);
      setError(null);
    });
  };

  const deleteUserRow = async (id: number): Promise<void> => {
    return wrapOperation(async () => {
      await indexedDBService.deleteUserRow(id);
      setError(null);
    });
  };

  // Images
  const addImage = async (image: UploadedImage): Promise<void> => {
    return wrapOperation(async () => {
      await indexedDBService.addImage(image);
      setError(null);
    });
  };

  const getImage = async (id: string): Promise<UploadedImage | null> => {
    return wrapOperation(async () => {
      const result = await indexedDBService.getImage(id);
      setError(null);
      return result;
    });
  };

  const getImagesBySubmissionId = async (submissionId: string): Promise<UploadedImage[]> => {
    return wrapOperation(async () => {
      const result = await indexedDBService.getImagesBySubmissionId(submissionId);
      setError(null);
      return result;
    });
  };

  const deleteImage = async (id: string): Promise<void> => {
    return wrapOperation(async () => {
      await indexedDBService.deleteImage(id);
      setError(null);
    });
  };

  // Utility functions
  const clearAllData = async (): Promise<void> => {
    return wrapOperation(async () => {
      await indexedDBService.clearAllData();
      setError(null);
    });
  };

  const getDatabaseSize = async (): Promise<{ [key: string]: number }> => {
    return wrapOperation(async () => {
      const result = await indexedDBService.getDatabaseSize();
      setError(null);
      return result;
    });
  };

  return {
    isInitialized,
    error,
    // Submissions
    addSubmission,
    getSubmission,
    getAllSubmissions,
    updateSubmission,
    deleteSubmission,
    // UserRows
    addUserRow,
    getUserRow,
    getAllUserRows,
    updateUserRow,
    deleteUserRow,
    // Images
    addImage,
    getImage,
    getImagesBySubmissionId,
    deleteImage,
    // Utility functions
    clearAllData,
    getDatabaseSize,
    clearError,
    retryInitialization,
  };
};