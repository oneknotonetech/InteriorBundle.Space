'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Upload, Sparkles, Image, Trash2, Eye, Download, RefreshCw, AlertCircle,
  User, Settings2, LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSharedData } from '../../lib/context/SharedDataContext';
import { PreviewModal, ProgressBar, StatusBadge } from '../../components/shared/SharedComponents';
import { TableRowData, UploadedImage, UserSubmission } from '../../lib/types';
import Navigation from '@/components/Navigation';
import { set, get } from 'idb-keyval';

const LOCAL_STORAGE_KEY = 'ai-design-user-rows';

// Fixed downloadImage function that properly handles blob URLs
const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    let blob: Blob;
    
    // Check if it's a blob URL (from IndexedDB)
    if (imageUrl.startsWith('blob:')) {
      // Fetch the blob from the blob URL
      const response = await fetch(imageUrl);
      blob = await response.blob();
    } else {
      // Handle regular URLs (like generated images from server)
      const response = await fetch(imageUrl);
      blob = await response.blob();
    }
    
    // Create a new blob URL for download
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the download URL after a short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1000);
    
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: try direct link approach
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Function to download image directly from IndexedDB
const downloadImageFromIndexedDB = async (imageId: string, filename: string) => {
  try {
    const file = await get(imageId);
    if (file instanceof Blob) {
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } else {
      console.error('No file found in IndexedDB for id:', imageId);
    }
  } catch (error) {
    console.error('IndexedDB download failed:', error);
  }
};

// Add a hook to get object URLs for a list of image ids
function useImageObjectUrls(images: UploadedImage[]) {
  const [urls, setUrls] = useState<{ [id: string]: string }>({});
  const prevUrls = useRef<{ [id: string]: string }>({});

  useEffect(() => {
    let isMounted = true;
    const fetchUrls = async () => {
      const newUrls: { [id: string]: string } = {};
      for (const img of images) {
        const file = await get(img.id);
        if (file) {
          newUrls[img.id] = URL.createObjectURL(file);
        }
      }
      if (isMounted) {
        setUrls(newUrls);
      }
    };
    fetchUrls();
    // Cleanup old object URLs
    return () => {
      isMounted = false;
      Object.values(prevUrls.current).forEach(url => URL.revokeObjectURL(url));
      prevUrls.current = urls;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.map(img => img.id).join(",")]);
  return urls;
}

// UserRow component for rendering each table row
import React from 'react';

interface UserRowProps {
  row: TableRowData;
  index: number;
  getRowStatus: (rowId: number) => 'idle' | 'generating' | 'completed' | 'error';
  getSubmission: (rowId: number) => UserSubmission | undefined;
  draggedCell: { rowId: number; column: 'inspiration' | 'area' } | null;
  handleDragOver: (e: React.DragEvent, rowId: number, column: 'inspiration' | 'area') => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, rowId: number, column: 'inspiration' | 'area') => void;
  handleImageUpload: (rowId: number, column: 'inspiration' | 'area', files: FileList) => void;
  setPreviewImage: (url: string) => void;
  removeImage: (rowId: number, column: 'inspiration' | 'area', imageId: string) => void;
  submitForProcessing: (rowId: number) => void;
}

function UserRow({
  row,
  index,
  getRowStatus,
  getSubmission,
  draggedCell,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleImageUpload,
  setPreviewImage,
  removeImage,
  submitForProcessing,
}: UserRowProps) {
  const rowStatus = getRowStatus(row.id);
  const submission = getSubmission(row.id);
  const inspirationImageUrls = useImageObjectUrls(row.inspirationImages);
  const areaImageUrls = useImageObjectUrls(row.areaImages);

  // Enhanced download function for all images in this row
  const handleDownloadAllImages = async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Download inspiration images
    for (let i = 0; i < row.inspirationImages.length; i++) {
      const img = row.inspirationImages[i];
      await downloadImageFromIndexedDB(img.id, `inspiration-${i + 1}-${img.name}`);
      if (i < row.inspirationImages.length - 1) await delay(200);
    }
    
    // Download area images
    for (let i = 0; i < row.areaImages.length; i++) {
      const img = row.areaImages[i];
      await downloadImageFromIndexedDB(img.id, `area-${i + 1}-${img.name}`);
      if (i < row.areaImages.length - 1) await delay(200);
    }
    
    // Download generated image if available
    if (submission?.generatedImage) {
      await delay(200);
      await downloadImage(submission.generatedImage, `ai-design-row-${row.id}.jpg`);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="hover:bg-gray-50 transition-colors"
    >
      {/* Row Number */}
      <td className="px-6 py-6 text-center">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {row.id}
          </div>
          {submission && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
              <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </td>
      {/* Inspirations Column */}
      <td className="px-6 py-6">
        <div className="space-y-3">
          <div
            onDragOver={(e) => handleDragOver(e, row.id, 'inspiration')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, row.id, 'inspiration')}
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50 ${
              draggedCell?.rowId === row.id && draggedCell?.column === 'inspiration'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id={`inspiration-${row.id}`}
              onChange={(e) => e.target.files && handleImageUpload(row.id, 'inspiration', e.target.files)}
            />
            <label
              htmlFor={`inspiration-${row.id}`}
              className="cursor-pointer flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Inspiration</span>
            </label>
          </div>
          {row.inspirationImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {row.inspirationImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={inspirationImageUrls[image.id]}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all" />
                  <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => setPreviewImage(inspirationImageUrls[image.id])}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => downloadImageFromIndexedDB(image.id, image.name)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => removeImage(row.id, 'inspiration', image.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </td>
      {/* Area Column */}
      <td className="px-6 py-6">
        <div className="space-y-3">
          <div
            onDragOver={(e) => handleDragOver(e, row.id, 'area')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, row.id, 'area')}
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer hover:border-purple-400 hover:bg-purple-50 ${
              draggedCell?.rowId === row.id && draggedCell?.column === 'area'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300'
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id={`area-${row.id}`}
              onChange={(e) => e.target.files && handleImageUpload(row.id, 'area', e.target.files)}
            />
            <label
              htmlFor={`area-${row.id}`}
              className="cursor-pointer flex items-center justify-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Your Space</span>
            </label>
          </div>
          {row.areaImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {row.areaImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={areaImageUrls[image.id]}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all" />
                  <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => setPreviewImage(areaImageUrls[image.id])}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => downloadImageFromIndexedDB(image.id, image.name)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-white hover:bg-white/20"
                      onClick={() => removeImage(row.id, 'area', image.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </td>
      {/* Status & Progress Column */}
      <td className="px-6 py-6">
        <div className="space-y-3">
          {rowStatus === 'idle' && row.inspirationImages.length > 0 && row.areaImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <StatusBadge status={rowStatus} />
              </div>
              <Button
                onClick={() => submitForProcessing(row.id)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Generate AI Design
              </Button>
            </div>
          )}
          {rowStatus === 'idle' && (row.inspirationImages.length === 0 || row.areaImages.length === 0) && (
            <div className="text-center py-4">
              <StatusBadge status={rowStatus} />
              <p className="text-xs text-gray-500 mt-2">Upload images to both columns to get started</p>
            </div>
          )}
          {rowStatus === 'generating' && submission && (
            <div className="space-y-3">
              <div className="text-center py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <StatusBadge status={submission.status} />
                {submission.status === 'in_progress' && (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    ✓ Our AI is creating your design
                  </p>
                )}
              </div>
              <ProgressBar
                progress={submission.progress || 10}
                status={submission.status}
              />
            </div>
          )}
          {rowStatus === 'completed' && (
            <div className="text-center py-3 bg-green-50 rounded-lg border border-green-200">
              <StatusBadge status={rowStatus} />
              <p className="text-xs text-green-600 mt-2 font-medium">✨ Design ready for download</p>
            </div>
          )}
          {rowStatus === 'error' && (
            <div className="text-center py-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="w-6 h-6 mx-auto text-red-600 mb-2" />
              <StatusBadge status={rowStatus} />
              <Button
                variant="link"
                size="sm"
                onClick={() => submitForProcessing(row.id)}
                className="text-blue-600 hover:text-blue-800 underline mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </td>
      {/* Result Column */}
      <td className="px-6 py-6">
        <div className="space-y-3">
          {rowStatus === 'completed' && submission?.generatedImage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3"
            >
              <div className="relative group">
                <img
                  src={submission.generatedImage}
                  alt="AI Generated Design"
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg" />
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 bg-white/90 hover:bg-white text-gray-700 hover:text-black"
                    onClick={() => setPreviewImage(submission.generatedImage!)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 bg-white/90 hover:bg-white text-gray-700 hover:text-black"
                    onClick={() => downloadImage(submission.generatedImage!, `ai-design-row-${row.id}.jpg`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadImage(submission.generatedImage!, `ai-design-row-${row.id}.jpg`)}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Design
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadAllImages}
                >
                  <Download className="w-3 h-3 mr-1" />
                  All Files
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex gap-2 items-center min-h-[128px]">
              {row.inspirationImages.concat(row.areaImages).length > 0 ? (
                row.inspirationImages.concat(row.areaImages).slice(0, 2).map((img) => (
                  <img
                    key={img.id}
                    src={inspirationImageUrls[img.id] || areaImageUrls[img.id]}
                    alt={img.name}
                    className="w-16 h-16 object-cover rounded shadow"
                  />
                ))
              ) : (
                <Card className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <CardContent className="p-4 text-center">
                    <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">
                      Upload images to get started
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

const UserDashboard: React.FC = () => {
  const { submissions, addSubmission } = useSharedData();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [userRows, setUserRows] = useState<TableRowData[]>(() => 
    Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      inspirationImages: [],
      areaImages: [],
      outputStatus: 'idle' as const,
      userId: 'user1',
      userName: 'John Doe',
      priority: 'medium' as const
    }))
  );

  // Load data from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserRows(parsed);
      } catch {
        // If parsing fails, keep the default state
      }
    }
  }, []);

  // Save to localStorage whenever userRows changes
  useEffect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userRows));
  }, [userRows]);

  const [draggedCell, setDraggedCell] = useState<{ rowId: number; column: 'inspiration' | 'area' } | null>(null);
  const userSubmissions = submissions.filter(s => s.userId === 'user1') || [];

  // Update handleImageUpload to use IndexedDB
  const handleImageUpload = async (rowId: number, column: 'inspiration' | 'area', files: FileList) => {
    const newImages: UploadedImage[] = await Promise.all(Array.from(files).map(async (file) => {
      const id = `${rowId}-${column}-${Date.now()}-${Math.random()}`;
      await set(id, file); // Store the file blob in IndexedDB
      return {
        id,
        file,
        name: file.name,
        size: file.size,
        url: '', // Not used anymore
        uploadedAt: new Date().toISOString()
      };
    }));

    setUserRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const updatedRow = { 
          ...row,
          submittedAt: new Date().toISOString()
        };
        if (column === 'inspiration') {
          updatedRow.inspirationImages = [...row.inspirationImages, ...newImages];
        } else {
          updatedRow.areaImages = [...row.areaImages, ...newImages];
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const removeImage = (rowId: number, column: 'inspiration' | 'area', imageId: string) => {
    setUserRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const updatedRow = { ...row };
        if (column === 'inspiration') {
          updatedRow.inspirationImages = row.inspirationImages.filter(img => img.id !== imageId);
        } else {
          updatedRow.areaImages = row.areaImages.filter(img => img.id !== imageId);
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const submitForProcessing = (rowId: number) => {
    const row = userRows.find(r => r.id === rowId);
    if (!row || row.inspirationImages.length === 0 || row.areaImages.length === 0) {
      return;
    }

    const newSubmission: Omit<UserSubmission, 'id'> = {
      userId: 'user1',
      userName: 'John Doe',
      userEmail: 'john.doe@email.com',
      rowId: rowId,
      inspirationImages: row.inspirationImages,
      areaImages: row.areaImages,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      priority: 'medium',
      progress: 10
    };

    addSubmission(newSubmission);

    setUserRows(prev => prev.map(r => 
      r.id === rowId 
        ? { ...r, outputStatus: 'generating' as const, submittedAt: new Date().toISOString() }
        : r
    ));
  };

  const getRowStatus = (rowId: number): 'idle' | 'generating' | 'completed' | 'error' => {
    const submission = userSubmissions.find(s => s.rowId === rowId);
    if (!submission) return 'idle';
    
    switch (submission.status) {
      case 'pending':
      case 'in_progress':
        return 'generating';
      case 'completed':
        return 'completed';
      case 'failed':
        return 'error';
      default:
        return 'idle';
    }
  };

  const getSubmission = (rowId: number): UserSubmission | undefined => {
    return userSubmissions.find(s => s.rowId === rowId);
  };

  const handleDragOver = (e: React.DragEvent, rowId: number, column: 'inspiration' | 'area') => {
    e.preventDefault();
    setDraggedCell({ rowId, column });
  };

  const handleDragLeave = () => {
    setDraggedCell(null);
  };

  const handleDrop = (e: React.DragEvent, rowId: number, column: 'inspiration' | 'area') => {
    e.preventDefault();
    setDraggedCell(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(rowId, column, files);
    }
  };

  const totalInspiration = userRows.reduce((sum, row) => sum + row.inspirationImages.length, 0);
  const totalArea = userRows.reduce((sum, row) => sum + row.areaImages.length, 0);
  const totalGenerated = userSubmissions.filter(s => s.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      {/* User Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Design Studio</h1>
                  <p className="text-sm text-gray-500">User Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                John Doe
              </Button>
              <Button variant="ghost" size="sm">
                <Settings2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Transform Your Space with AI
            </h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8">
              Upload inspiration images and area photos to generate AI-powered interior design outputs. 
              Our advanced AI will create stunning design concepts tailored to your space.
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Image className="w-4 h-4" />
                </div>
                <span>{totalInspiration} Inspirations Uploaded</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <span>{totalArea} Areas Captured</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>{totalGenerated} Designs Generated</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Submissions Banner */}
      {userSubmissions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-b border-blue-200"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-blue-900">Your Active Submissions</CardTitle>
                    <p className="text-sm text-blue-700">
                      {userSubmissions.length} total submissions • 
                      {userSubmissions.filter(s => s.status === 'pending' || s.status === 'in_progress').length} currently processing • 
                      {userSubmissions.filter(s => s.status === 'completed').length} completed designs ready
                    </p>
                  </div>
                  <Badge className="bg-blue-600 text-white">
                    {userSubmissions.filter(s => s.status === 'pending' || s.status === 'in_progress').length} In Queue
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-bold">Design Generator Workspace</CardTitle>
            <p className="text-gray-600">Upload images to each row and submit for AI processing</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <motion.table 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full min-w-[1200px]"
              >
                <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide w-8">#</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide w-1/4">
                      <div className="flex items-center justify-center space-x-2">
                        <Image className="w-5 h-5" />
                        <span>Inspiration Images</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide w-1/4">
                      <div className="flex items-center justify-center space-x-2">
                        <Upload className="w-5 h-5" />
                        <span>Your Space</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide w-1/4">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="w-5 h-5" />
                        <span>Processing Status</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide w-1/4">
                      <div className="flex items-center justify-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>AI Design Result</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {userRows.map((row, index) => (
                      <UserRow
                        key={row.id}
                        row={row}
                        index={index}
                        getRowStatus={getRowStatus}
                        getSubmission={getSubmission}
                        draggedCell={draggedCell}
                        handleDragOver={handleDragOver}
                        handleDragLeave={handleDragLeave}
                        handleDrop={handleDrop}
                        handleImageUpload={handleImageUpload}
                        setPreviewImage={setPreviewImage}
                        removeImage={removeImage}
                        submitForProcessing={submitForProcessing}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </motion.table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <PreviewModal
            imageUrl={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;