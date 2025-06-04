import { UserSubmission, UploadedImage, TableRowData } from '../types';

const DB_NAME = 'interiorDesignDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  SUBMISSIONS: 'submissions',
  USER_ROWS: 'userRows',
  IMAGES: 'images'
} as const;

// Type for store names
type StoreNames = typeof STORES[keyof typeof STORES];

// Type for generic database items with id
interface DatabaseItem {
  id: string | number;
}

// Type for update operations
type UpdateData<T> = Partial<T>;

// Add browser compatibility check with SSR support
const isIndexedDBSupported = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return 'indexedDB' in window;
};

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private isSupported: boolean;

  constructor() {
    this.isSupported = isIndexedDBSupported();
  }

  async initDB(): Promise<void> {
    if (!this.isSupported) {
      throw new Error('IndexedDB is not supported in this environment');
    }

    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
          console.error('Database error:', event);
          reject(new Error('Failed to open database'));
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          
          // Handle database connection errors
          this.db.onerror = (event) => {
            console.error('Database connection error:', event);
          };

          // Handle database close
          this.db.onclose = () => {
            console.log('Database connection closed');
            this.db = null;
          };

          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Create stores with error handling
          try {
            // Create submissions store
            if (!db.objectStoreNames.contains(STORES.SUBMISSIONS)) {
              const submissionsStore = db.createObjectStore(STORES.SUBMISSIONS, { keyPath: 'id' });
              submissionsStore.createIndex('userId', 'userId', { unique: false });
              submissionsStore.createIndex('status', 'status', { unique: false });
              submissionsStore.createIndex('priority', 'priority', { unique: false });
            }

            // Create userRows store
            if (!db.objectStoreNames.contains(STORES.USER_ROWS)) {
              const userRowsStore = db.createObjectStore(STORES.USER_ROWS, { keyPath: 'id' });
              userRowsStore.createIndex('userId', 'userId', { unique: false });
            }

            // Create images store
            if (!db.objectStoreNames.contains(STORES.IMAGES)) {
              const imagesStore = db.createObjectStore(STORES.IMAGES, { keyPath: 'id' });
              imagesStore.createIndex('submissionId', 'submissionId', { unique: false });
            }
          } catch (error) {
            console.error('Error creating stores:', error);
            reject(error);
          }
        };
      } catch (error) {
        console.error('Error initializing database:', error);
        reject(error);
      }
    });
  }

  // Add a method to check if the database is ready
  isReady(): boolean {
    return this.isSupported && this.db !== null;
  }

  // Add a method to handle database connection issues
  private async ensureConnection(): Promise<void> {
    if (!this.isSupported) {
      throw new Error('IndexedDB is not supported in this browser');
    }

    if (!this.db) {
      await this.initDB();
    }
  }

  // Submissions CRUD operations
  async addSubmission(submission: UserSubmission): Promise<void> {
    return this.addItem<UserSubmission>(STORES.SUBMISSIONS, submission);
  }

  async getSubmission(id: string): Promise<UserSubmission | null> {
    return this.getItem<UserSubmission>(STORES.SUBMISSIONS, id);
  }

  async getAllSubmissions(): Promise<UserSubmission[]> {
    return this.getAllItems<UserSubmission>(STORES.SUBMISSIONS);
  }

  async updateSubmission(id: string, updates: UpdateData<UserSubmission>): Promise<void> {
    return this.updateItem<UserSubmission>(STORES.SUBMISSIONS, id, updates);
  }

  async deleteSubmission(id: string): Promise<void> {
    return this.deleteItem(STORES.SUBMISSIONS, id);
  }

  // UserRows CRUD operations
  async addUserRow(row: TableRowData): Promise<void> {
    return this.addItem<TableRowData>(STORES.USER_ROWS, row);
  }

  async getUserRow(id: number): Promise<TableRowData | null> {
    return this.getItem<TableRowData>(STORES.USER_ROWS, id);
  }

  async getAllUserRows(): Promise<TableRowData[]> {
    return this.getAllItems<TableRowData>(STORES.USER_ROWS);
  }

  async updateUserRow(id: number, updates: UpdateData<TableRowData>): Promise<void> {
    return this.updateItem<TableRowData>(STORES.USER_ROWS, id, updates);
  }

  async deleteUserRow(id: number): Promise<void> {
    return this.deleteItem(STORES.USER_ROWS, id);
  }

  // Images CRUD operations
  async addImage(image: UploadedImage): Promise<void> {
    return this.addItem<UploadedImage>(STORES.IMAGES, image);
  }

  async getImage(id: string): Promise<UploadedImage | null> {
    return this.getItem<UploadedImage>(STORES.IMAGES, id);
  }

  async getImagesBySubmissionId(submissionId: string): Promise<UploadedImage[]> {
    return this.getItemsByIndex<UploadedImage>(STORES.IMAGES, 'submissionId', submissionId);
  }

  async deleteImage(id: string): Promise<void> {
    return this.deleteItem(STORES.IMAGES, id);
  }

  // Generic CRUD operations
  async addItem<T extends DatabaseItem>(storeName: StoreNames, item: T): Promise<void> {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = () => resolve();
        request.onerror = (event) => {
          console.error(`Failed to add item to ${storeName}:`, event);
          reject(new Error(`Failed to add item to ${storeName}`));
        };
      } catch (error) {
        console.error(`Error adding item to ${storeName}:`, error);
        reject(error);
      }
    });
  }

  private async getItem<T>(storeName: StoreNames, id: string | number): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error(`Failed to get item from ${storeName}`));
    });
  }

  private async getAllItems<T>(storeName: StoreNames): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to get all items from ${storeName}`));
    });
  }

  private async updateItem<T extends DatabaseItem>(
    storeName: StoreNames, 
    id: string | number, 
    updates: UpdateData<T>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        const item = request.result;
        if (item) {
          const updatedItem = { ...item, ...updates };
          const updateRequest = store.put(updatedItem);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(new Error(`Failed to update item in ${storeName}`));
        } else {
          reject(new Error(`Item not found in ${storeName}`));
        }
      };

      request.onerror = () => reject(new Error(`Failed to get item from ${storeName}`));
    });
  }

  private async deleteItem(storeName: StoreNames, id: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete item from ${storeName}`));
    });
  }

  private async getItemsByIndex<T>(
    storeName: StoreNames, 
    indexName: string, 
    value: string | number
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to get items by index from ${storeName}`));
    });
  }

  // Utility method to clear all data (useful for development/testing)
  async clearAllData(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const storeNames = Object.values(STORES);
    const transaction = this.db.transaction(storeNames, 'readwrite');

    return new Promise((resolve, reject) => {
      const clearPromises = storeNames.map(storeName => {
        return new Promise<void>((storeResolve, storeReject) => {
          const store = transaction.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => storeResolve();
          request.onerror = () => storeReject(new Error(`Failed to clear ${storeName}`));
        });
      });

      Promise.all(clearPromises)
        .then(() => resolve())
        .catch(reject);
    });
  }

  // Method to get database size (useful for monitoring)
  async getDatabaseSize(): Promise<{ [key: string]: number }> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const sizes: { [key: string]: number } = {};
    const storeNames = Object.values(STORES);

    for (const storeName of storeNames) {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const countRequest = store.count();
      
      sizes[storeName] = await new Promise((resolve, reject) => {
        countRequest.onsuccess = () => resolve(countRequest.result);
        countRequest.onerror = () => reject(new Error(`Failed to count items in ${storeName}`));
      });
    }

    return sizes;
  }
}

// Create and export a singleton instance
export const indexedDBService = new IndexedDBService();