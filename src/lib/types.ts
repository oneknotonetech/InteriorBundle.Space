// lib/types.ts

export interface UploadedImage {
    id: string;
    file?: File;
    name: string;
    size: number;
    url: string;
    uploadedAt: string;
  }
  
  export interface TableRowData {
    id: number;
    inspirationImages: UploadedImage[];
    areaImages: UploadedImage[];
    outputStatus: 'idle' | 'generating' | 'completed' | 'error';
    outputImage?: string;
    generatedAt?: string;
    userId?: string;
    userName?: string;
    submittedAt?: string;
    adminNotes?: string;
    priority?: 'low' | 'medium' | 'high';
  }
  
  export interface UserSubmission {
    id: string;
    userId: string;
    userName: string;
    userEmail?: string;
    rowId: number;
    inspirationImages: UploadedImage[];
    areaImages: UploadedImage[];
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    submittedAt: string;
    generatedImage?: string;
    adminNotes?: string;
    completedAt?: string;
    processingStartedAt?: string;
    priority: 'low' | 'medium' | 'high';
    progress?: number;
  }