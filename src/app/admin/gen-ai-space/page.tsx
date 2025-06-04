'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Eye, Download, RefreshCw, X, AlertCircle, CheckCircle,
  Search, Filter, FileText, Package, MessageSquare,
  Trash2, Clock 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSharedData } from '../../../lib/context/SharedDataContext';
import { PreviewModal, ProgressBar, StatusBadge, PriorityBadge } from '../../../components/shared/SharedComponents';
import { UserSubmission } from '../../../lib/types';
import { get } from 'idb-keyval';

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

// Notes Modal Component
interface NotesModalProps {
  submission: UserSubmission;
  onSave: (notes: string) => void;
  onClose: () => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ submission, onSave, onClose }) => {
  const [notes, setNotes] = useState(submission.adminNotes || '');

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card className="relative w-full max-w-md mx-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Admin Notes</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Submission from {submission.userName} (Row #{submission.rowId})
            </p>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this submission..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />

          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Add a hook to get object URLs for a list of image ids
function useImageObjectUrls(images: { id: string }[]): { [id: string]: string } {
  const [urls, setUrls] = useState<{ [id: string]: string }>({});
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
      if (isMounted) setUrls(newUrls);
    };
    fetchUrls();
    return () => {
      isMounted = false;
      Object.values(urls).forEach(url => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.map(img => img.id).join(",")]);
  return urls;
}

interface AdminSubmissionCardProps {
  submission: UserSubmission;
  index: number;
  setPreviewImage: (url: string) => void;
  handleStatusUpdate: (id: string, status: UserSubmission['status']) => void;
  handlePriorityUpdate: (id: string, priority: UserSubmission['priority']) => void;
  handleUploadGenerated: (id: string, files: FileList) => void;
  handleDeleteSubmission: (id: string) => void;
  setNotesModal: (submission: UserSubmission) => void;
}

function AdminSubmissionCard({
  submission,
  index,
  setPreviewImage,
  handleStatusUpdate,
  handlePriorityUpdate,
  handleUploadGenerated,
  handleDeleteSubmission,
  setNotesModal
}: AdminSubmissionCardProps) {
  const inspirationImageUrls = useImageObjectUrls(submission.inspirationImages);
  const areaImageUrls = useImageObjectUrls(submission.areaImages);

  const handleDownloadAllImages = async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Download inspiration images from IndexedDB
    for (let i = 0; i < submission.inspirationImages.length; i++) {
      const image = submission.inspirationImages[i];
      await downloadImageFromIndexedDB(image.id, `inspiration_${i + 1}_${image.name || 'image.jpg'}`);
      if (i < submission.inspirationImages.length - 1) await delay(200);
    }
    
    // Download area images from IndexedDB
    for (let i = 0; i < submission.areaImages.length; i++) {
      const image = submission.areaImages[i];
      await downloadImageFromIndexedDB(image.id, `area_${i + 1}_${image.name || 'image.jpg'}`);
      if (i < submission.areaImages.length - 1) await delay(200);
    }
    
    // Download generated image if available
    if (submission.generatedImage) {
      await delay(200);
      await downloadImage(submission.generatedImage, `generated_result_row_${submission.rowId}.jpg`);
    }
  };

  return (
    <motion.div
      key={submission.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-orange-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">{submission.userName}</h3>
              <p className="text-sm text-gray-500">{submission.userEmail}</p>
              <p className="text-xs text-gray-400">
                Row #{submission.rowId} • {new Date(submission.submittedAt).toLocaleDateString()} • 
                {Math.round((Date.now() - new Date(submission.submittedAt).getTime()) / (1000 * 60))}min ago
              </p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <StatusBadge status={submission.status} />
              <PriorityBadge priority={submission.priority} />
            </div>
          </div>

          {/* Progress Bar for In Progress items */}
          {submission.status === 'in_progress' && submission.progress !== undefined && (
            <div className="mb-4">
              <ProgressBar progress={submission.progress} status={submission.status} />
            </div>
          )}

          {/* Images Preview */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">
                  Inspiration ({submission.inspirationImages.length})
                </p>
                {submission.inspirationImages.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadAllImages}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {submission.inspirationImages.slice(0, 4).map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={inspirationImageUrls[image.id]}
                      alt={image.name || 'Inspiration image'}
                      className="w-full h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setPreviewImage(inspirationImageUrls[image.id])}
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded flex items-center justify-center">
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(inspirationImageUrls[image.id]);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImageFromIndexedDB(image.id, image.name || 'inspiration.jpg');
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">
                  Area ({submission.areaImages.length})
                </p>
                {submission.areaImages.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadAllImages}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    All
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {submission.areaImages.slice(0, 4).map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={areaImageUrls[image.id]}
                      alt={image.name || 'Area image'}
                      className="w-full h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setPreviewImage(areaImageUrls[image.id])}
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded flex items-center justify-center">
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(areaImageUrls[image.id]);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImageFromIndexedDB(image.id, image.name || 'area.jpg');
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Download All Source Images */}
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAllImages}
              className="w-full border-orange-200 hover:bg-orange-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download All Source Images
            </Button>
          </div>

          {/* Generated Result */}
          {submission.status === 'completed' && submission.generatedImage && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">Generated AI Result</p>
              <div className="relative group">
                <img
                  src={submission.generatedImage}
                  alt="Generated result"
                  className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => submission.generatedImage && setPreviewImage(submission.generatedImage)}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 bg-white/90 hover:bg-white text-gray-700 hover:text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (submission.generatedImage) {
                        downloadImage(submission.generatedImage, `generated_result_row_${submission.rowId}.jpg`);
                      }
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          {submission.adminNotes && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-500 mb-1 font-medium">Admin Notes:</p>
              <p className="text-sm text-gray-700">{submission.adminNotes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Action */}
            <div className="flex space-x-2">
              {submission.status === 'pending' && (
                <Button
                  onClick={() => handleStatusUpdate(submission.id, 'in_progress')}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  size="sm"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Start Processing
                </Button>
              )}
              {submission.status === 'in_progress' && (
                <Button
                  onClick={() => handleStatusUpdate(submission.id, 'failed')}
                  variant="destructive"
                  size="sm"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Mark Failed
                </Button>
              )}
              {submission.status === 'completed' && (
                <div className="flex-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium text-center">
                  ✓ Delivered to User
                </div>
              )}
              {submission.status === 'failed' && (
                <Button
                  onClick={() => handleStatusUpdate(submission.id, 'pending')}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  Reset to Pending
                </Button>
              )}
            </div>

            {/* Upload AI Result */}
            {submission.status === 'in_progress' && (
              <div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleUploadGenerated(submission.id, e.target.files)}
                  />
                  <div className="w-full px-3 py-4 border-2 border-dashed border-green-300 bg-green-50 rounded-lg text-center cursor-pointer hover:border-green-400 hover:bg-green-100 transition-colors">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Upload Generated AI Result</span>
                    <p className="text-xs text-green-600 mt-1">Complete submission and notify user instantly</p>
                  </div>
                </label>
              </div>
            )}

            {/* Secondary Actions */}
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNotesModal(submission)}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Notes
                </Button>
                <Select
                  value={submission.priority}
                  onValueChange={(value) => handlePriorityUpdate(submission.id, value as UserSubmission['priority'])}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteSubmission(submission.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const AdminDashboard: React.FC = () => {
  const { submissions, updateSubmission, deleteSubmission } = useSharedData();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | UserSubmission['status']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | UserSubmission['priority']>('all');
  const [notesModal, setNotesModal] = useState<UserSubmission | null>(null);

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.id.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || submission.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStats = () => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    const inProgress = submissions.filter(s => s.status === 'in_progress').length;
    const completed = submissions.filter(s => s.status === 'completed').length;
    const failed = submissions.filter(s => s.status === 'failed').length;

    return { total, pending, inProgress, completed, failed };
  };

  const stats = getStats();

  const handleStatusUpdate = (submissionId: string, newStatus: UserSubmission['status']) => {
    const updates: Partial<UserSubmission> = { status: newStatus };
    
    if (newStatus === 'in_progress') {
      updates.processingStartedAt = new Date().toISOString();
      updates.progress = 25;
      
      setTimeout(() => {
        updateSubmission(submissionId, { progress: 50 });
      }, 2000);
      
      setTimeout(() => {
        updateSubmission(submissionId, { progress: 75 });
      }, 4000);
      
    } else if (newStatus === 'completed') {
      updates.completedAt = new Date().toISOString();
      updates.progress = 100;
    } else if (newStatus === 'failed') {
      updates.progress = 0;
    }
    
    updateSubmission(submissionId, updates);
  };

  const handlePriorityUpdate = (submissionId: string, newPriority: UserSubmission['priority']) => {
    updateSubmission(submissionId, { priority: newPriority });
  };

  const handleUploadGenerated = (submissionId: string, files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      updateSubmission(submissionId, {
        status: 'completed',
        generatedImage: imageUrl,
        completedAt: new Date().toISOString(),
        progress: 100
      });
    }
  };

  const handleNotesUpdate = (notes: string) => {
    if (notesModal) {
      updateSubmission(notesModal.id, { adminNotes: notes });
    }
  };

  const handleDeleteSubmission = (submissionId: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      deleteSubmission(submissionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-600 to-red-600 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Submission Management Center</h1>
            <p className="text-orange-100 mb-6">Monitor user submissions • Download source images • Upload AI results</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">Total</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <FileText className="w-8 h-8 text-white/60" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/20 border-yellow-400/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-100">Pending</p>
                    <p className="text-2xl font-bold text-yellow-50">{stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/20 border-blue-400/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Processing</p>
                    <p className="text-2xl font-bold text-blue-50">{stats.inProgress}</p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-500/20 border-green-400/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">Completed</p>
                    <p className="text-2xl font-bold text-green-50">{stats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-500/20 border-red-400/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-100">Failed</p>
                    <p className="text-2xl font-bold text-red-50">{stats.failed}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by user name, email, or submission ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as 'all' | UserSubmission['status'])}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterPriority}
                  onValueChange={(value) => setFilterPriority(value as 'all' | UserSubmission['priority'])}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Grid */}
        {filteredSubmissions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSubmissions.map((submission, index) => (
              <AdminSubmissionCard
                key={submission.id}
                submission={submission}
                index={index}
                setPreviewImage={setPreviewImage}
                handleStatusUpdate={handleStatusUpdate}
                handlePriorityUpdate={handlePriorityUpdate}
                handleUploadGenerated={handleUploadGenerated}
                handleDeleteSubmission={handleDeleteSubmission}
                setNotesModal={setNotesModal}
              />
            ))}
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-3">No Submissions Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                  ? 'No submissions match your current filters. Try adjusting your search criteria.'
                  : 'Waiting for users to upload and submit their images...'
                }
              </p>
              {(searchTerm || filterStatus !== 'all' || filterPriority !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterPriority('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
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

      {/* Notes Modal */}
      <AnimatePresence>
        {notesModal && (
          <NotesModal
            submission={notesModal}
            onSave={handleNotesUpdate}
            onClose={() => setNotesModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;