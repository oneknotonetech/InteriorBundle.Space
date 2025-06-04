'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Upload, Sparkles, Image, Trash2, Eye, Download, RefreshCw, AlertCircle,
  User, Settings2, LogOut, Coins, CreditCard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSharedData } from '../../lib/context/SharedDataContext';
import { PreviewModal, ProgressBar, StatusBadge } from '../../components/shared/SharedComponents';
import { TableRowData, UploadedImage, UserSubmission } from '../../lib/types';
import { set, get } from 'idb-keyval';

const LOCAL_STORAGE_KEY = 'ai-design-user-rows';

// Token Management System
interface TokenData {
  totalTokens: number;
  usedTokens: number;
  lastUpdated: string;
}

interface TokenContextType {
  remainingTokens: number;
  totalTokens: number;
  deductTokens: (amount: number) => boolean;
  addTokens: (amount: number) => void;
}

const TokenContext = React.createContext<TokenContextType | undefined>(undefined);

const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokenData, setTokenData] = useState<TokenData>({
    totalTokens: 100,
    usedTokens: 0,
    lastUpdated: new Date().toISOString()
  });

  const remainingTokens = tokenData.totalTokens - tokenData.usedTokens;

  const deductTokens = (amount: number) => {
    if (remainingTokens >= amount) {
      setTokenData(prev => ({
        ...prev,
        usedTokens: prev.usedTokens + amount,
        lastUpdated: new Date().toISOString()
      }));
      return true;
    }
    return false;
  };

  const addTokens = (amount: number) => {
    setTokenData(prev => ({
      ...prev,
      totalTokens: prev.totalTokens + amount,
      lastUpdated: new Date().toISOString()
    }));
  };

  return (
    <TokenContext.Provider value={{ remainingTokens, totalTokens: tokenData.totalTokens, deductTokens, addTokens }}>
      {children}
    </TokenContext.Provider>
  );
};

const useTokenContext = () => {
  const context = React.useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokenContext must be used within a TokenProvider');
  }
  return context;
};

// Token Display Component
const TokenCounter: React.FC<{
  remainingTokens: number;
  totalTokens: number;
  onBuyTokens: () => void;
}> = ({ remainingTokens, totalTokens, onBuyTokens }) => {
  const percentage = (remainingTokens / totalTokens) * 100;
  
  const getColorClass = () => {
    if (percentage > 50) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage > 20) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <Card className={`border-2 ${getColorClass()}`}>
      <CardContent className="p-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
            <div className="relative">
              <Coins className="w-8 h-8" />
              {remainingTokens === 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
                </div>
                <div>
              <h3 className="font-semibold text-lg">AI Tokens</h3>
              <p className="text-sm opacity-75">
                {remainingTokens} of {totalTokens} remaining
              </p>
                </div>
              </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{remainingTokens}</div>
            <Button
              size="sm"
              onClick={onBuyTokens}
              className="mt-2"
              variant={remainingTokens < 10 ? "default" : "outline"}
            >
              <CreditCard className="w-3 h-3 mr-1" />
              {remainingTokens < 10 ? "Buy Tokens" : "Get More"}
              </Button>
        </div>
      </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Usage</span>
            <span>{Math.round(100 - percentage)}% used</span>
                </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                percentage > 50 ? 'bg-green-500' : 
                percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
              </div>
                </div>

        {/* Low Token Warning */}
        {remainingTokens < 10 && (
          <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                {remainingTokens === 0 ? 'No tokens remaining!' : 'Low tokens - refill soon!'}
              </span>
                  </div>
                </div>
        )}
      </CardContent>
    </Card>
  );
};

// Fixed downloadImage function that properly handles blob URLs
const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    let blob: Blob;
    
    if (imageUrl.startsWith('blob:')) {
      const response = await fetch(imageUrl);
      blob = await response.blob();
    } else {
      const response = await fetch(imageUrl);
      blob = await response.blob();
    }
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 1000);
    
  } catch (error) {
    console.error('Download failed:', error);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

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
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    }
  } catch (error) {
    console.error('IndexedDB download failed:', error);
  }
};

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
    return () => {
      isMounted = false;
      Object.values(prevUrls.current).forEach(url => URL.revokeObjectURL(url));
      prevUrls.current = urls;
    };
  }, [images.map(img => img.id).join(",")]);
  return urls;
}

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
  remainingTokens: number;
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
  remainingTokens,
}: UserRowProps) {
                      const rowStatus = getRowStatus(row.id);
                      const submission = getSubmission(row.id);
  const inspirationImageUrls = useImageObjectUrls(row.inspirationImages);
  const areaImageUrls = useImageObjectUrls(row.areaImages);

  const handleDownloadAllImages = async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (let i = 0; i < row.inspirationImages.length; i++) {
      const img = row.inspirationImages[i];
      await downloadImageFromIndexedDB(img.id, `inspiration-${i + 1}-${img.name}`);
      if (i < row.inspirationImages.length - 1) await delay(200);
    }
    
    for (let i = 0; i < row.areaImages.length; i++) {
      const img = row.areaImages[i];
      await downloadImageFromIndexedDB(img.id, `area-${i + 1}-${img.name}`);
      if (i < row.areaImages.length - 1) await delay(200);
    }
    
    if (submission?.generatedImage) {
      await delay(200);
      await downloadImage(submission.generatedImage, `ai-design-row-${row.id}.jpg`);
    }
  };

  // Calculate token cost for generation
  const getTokenCost = () => {
    return row.inspirationImages.length + row.areaImages.length + 5; // Base cost of 5 + 1 per image
  };

  const canGenerate = () => {
    return (
      row.inspirationImages.length > 0 && 
      row.areaImages.length > 0 && 
      remainingTokens >= getTokenCost()
    );
  };
                      
                      return (
                        <motion.tr
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
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
              
              {/* Token Cost Display */}
              <div className="text-center p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <div className="flex items-center justify-center space-x-1 text-sm">
                  <Coins className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Costs {getTokenCost()} tokens
                  </span>
                </div>
              </div>

                                  <Button
                                    onClick={() => submitForProcessing(row.id)}
                disabled={!canGenerate()}
                className={`w-full ${
                  canGenerate() 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                                    size="sm"
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                {!canGenerate() && remainingTokens < getTokenCost() ? 'Insufficient Tokens' : 'Generate AI Design'}
                                  </Button>
                                </div>
                              )}

                              {rowStatus === 'idle' && (row.inspirationImages.length === 0 || row.areaImages.length === 0) && (
                                <div className="text-center py-4">
                                  <StatusBadge status={rowStatus} />
                                  <p className="text-xs text-gray-500 mt-2">Upload images to both columns to get started</p>
              {row.inspirationImages.length > 0 || row.areaImages.length > 0 ? (
                <div className="mt-2 text-xs text-blue-600">
                  Will cost {getTokenCost()} tokens
                </div>
              ) : null}
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
                disabled={!canGenerate()}
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
  const { remainingTokens, deductTokens, addTokens, totalTokens } = useTokenContext();
  
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

  useEffect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userRows));
  }, [userRows]);

  const [draggedCell, setDraggedCell] = useState<{ rowId: number; column: 'inspiration' | 'area' } | null>(null);
  const userSubmissions = submissions.filter(s => s.userId === 'user1') || [];

  const handleImageUpload = async (rowId: number, column: 'inspiration' | 'area', files: FileList) => {
    const newImages: UploadedImage[] = await Promise.all(Array.from(files).map(async (file) => {
      const id = `${rowId}-${column}-${Date.now()}-${Math.random()}`;
      await set(id, file);
      return {
        id,
        file,
        name: file.name,
        size: file.size,
        url: '',
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

    const tokenCost = row.inspirationImages.length + row.areaImages.length + 5;
    
    if (!deductTokens(tokenCost)) {
      alert(`Insufficient tokens! You need ${tokenCost} tokens but only have ${remainingTokens}.`);
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

  const handleBuyTokens = () => {
    // Simulate buying tokens
    const tokenPackages = [
      { tokens: 50, price: '$5.00' },
      { tokens: 100, price: '$9.00' },
      { tokens: 250, price: '$20.00' },
      { tokens: 500, price: '$35.00' }
    ];
    
    const selectedPackage = tokenPackages[1]; // Default to 100 tokens
    const confirmed = confirm(`Buy ${selectedPackage.tokens} tokens for ${selectedPackage.price}?`);
    
    if (confirmed) {
      addTokens(selectedPackage.tokens);
      alert(`Successfully purchased ${selectedPackage.tokens} tokens!`);
    }
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
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-lg">
                <Coins className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{remainingTokens} tokens</span>
              </div>
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Token Counter */}
        <div className="mb-6">
          <TokenCounter
            remainingTokens={remainingTokens}
            totalTokens={totalTokens}
            onBuyTokens={handleBuyTokens}
          />
        </div>

        {/* Active Submissions Banner */}
        {userSubmissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
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
          </motion.div>
        )}

        {/* Main Content */}
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
                        remainingTokens={remainingTokens}
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

const GenAIStudioPage = () => {
  return (
    <TokenProvider>
      <UserDashboard />
    </TokenProvider>
  );
};

export default GenAIStudioPage;