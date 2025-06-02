'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload, Sparkles, Image, Trash2, Eye, Download, RefreshCw, X } from 'lucide-react';

// TypeScript Interfaces
interface UploadedImage {
  id: string;
  file: File;
  name: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface TableRowData {
  id: number;
  inspirationImages: UploadedImage[];
  areaImages: UploadedImage[];
  outputStatus: 'idle' | 'generating' | 'completed' | 'error';
  outputImage?: string;
  generatedAt?: string;
}

interface TableData {
  rows: TableRowData[];
  totalInspirationImages: number;
  totalAreaImages: number;
  totalGeneratedOutputs: number;
}

interface PreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ imageUrl, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl w-full mx-4 bg-white rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-black" />
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

const DesignGeneratorTable: React.FC = () => {
  // Table Data Management - Separate from other pages
  const [tableData, setTableData] = useState<TableData>({
    rows: Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      inspirationImages: [],
      areaImages: [],
      outputStatus: 'idle' as const
    })),
    totalInspirationImages: 0,
    totalAreaImages: 0,
    totalGeneratedOutputs: 0
  });

  const [draggedCell, setDraggedCell] = useState<{ rowId: number; column: 'inspiration' | 'area' } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Image Upload Handler
  const handleImageUpload = (rowId: number, column: 'inspiration' | 'area', files: FileList) => {
    const newImages: UploadedImage[] = Array.from(files).map(file => ({
      id: `${rowId}-${column}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString()
    }));

    setTableData(prev => ({
      ...prev,
      rows: prev.rows.map(row => {
        if (row.id === rowId) {
          const updatedRow = { ...row };
          if (column === 'inspiration') {
            updatedRow.inspirationImages = [...row.inspirationImages, ...newImages];
          } else {
            updatedRow.areaImages = [...row.areaImages, ...newImages];
          }
          return updatedRow;
        }
        return row;
      }),
      totalInspirationImages: column === 'inspiration' 
        ? prev.totalInspirationImages + newImages.length 
        : prev.totalInspirationImages,
      totalAreaImages: column === 'area' 
        ? prev.totalAreaImages + newImages.length 
        : prev.totalAreaImages
    }));
  };

  // Remove Image Handler
  const removeImage = (rowId: number, column: 'inspiration' | 'area', imageId: string) => {
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.map(row => {
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
      }),
      totalInspirationImages: column === 'inspiration' 
        ? prev.totalInspirationImages - 1 
        : prev.totalInspirationImages,
      totalAreaImages: column === 'area' 
        ? prev.totalAreaImages - 1 
        : prev.totalAreaImages
    }));
  };

  // Generate Output Handler
  const generateOutput = async (rowId: number) => {
    const row = tableData.rows.find(r => r.id === rowId);
    if (!row || row.inspirationImages.length === 0 || row.areaImages.length === 0) {
      return;
    }

    // Set generating status
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.map(row => 
        row.id === rowId 
          ? { ...row, outputStatus: 'generating' as const }
          : row
      )
    }));

    // Simulate AI generation process
    setTimeout(() => {
      const mockOutputImages = [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop'
      ];

      const randomOutputImage = mockOutputImages[Math.floor(Math.random() * mockOutputImages.length)];

      setTableData(prev => ({
        ...prev,
        rows: prev.rows.map(row => 
          row.id === rowId 
            ? { 
                ...row, 
                outputStatus: 'completed' as const,
                outputImage: randomOutputImage,
                generatedAt: new Date().toISOString()
              }
            : row
        ),
        totalGeneratedOutputs: prev.totalGeneratedOutputs + 1
      }));
    }, 3000);
  };

  // Drag and Drop Handlers
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

  // Animation Variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const generateVariants = {
    idle: { scale: 1 },
    generating: { 
      scale: [1, 1.05, 1],
      transition: { 
        repeat: Infinity, 
        duration: 1.5 
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">
              AI Design Generator Table
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Upload inspiration images and area photos to generate AI-powered interior design outputs. 
              Each row represents a unique design generation task.
            </p>
            
            {/* Statistics */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4 text-black" />
                <span>{tableData.totalInspirationImages} Inspirations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-black" />
                <span>{tableData.totalAreaImages} Areas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-black" />
                <span>{tableData.totalGeneratedOutputs} Generated</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <motion.table 
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="w-full min-w-[1000px]"
            >
              {/* Table Header */}
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide w-8">
                    #
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide w-1/3">
                    <div className="flex items-center justify-center space-x-2">
                      <Image className="w-5 h-5" />
                      <span>Inspirations</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide w-1/3">
                    <div className="flex items-center justify-center space-x-2">
                      <Upload className="w-5 h-5" />
                      <span>Area</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide w-1/3">
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Output</span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {tableData.rows.map((row) => (
                    <motion.tr
                      key={row.id}
                      variants={rowVariants}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Row Number */}
                      <td className="px-6 py-6 text-center">
                        <div className="w-8 h-8 bg-gray-100 text-black rounded-full flex items-center justify-center font-semibold text-sm">
                          {row.id}
                        </div>
                      </td>

                      {/* Inspirations Column */}
                      <td className="px-6 py-6">
                        <div className="space-y-3">
                          {/* Upload Area */}
                          <div
                            onDragOver={(e) => handleDragOver(e, row.id, 'inspiration')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, row.id, 'inspiration')}
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                              draggedCell?.rowId === row.id && draggedCell?.column === 'inspiration'
                                ? 'border-black bg-gray-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <label className="cursor-pointer block">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files && handleImageUpload(row.id, 'inspiration', e.target.files)}
                              />
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center space-x-2 text-gray-600 hover:text-black transition-colors"
                              >
                                <Plus className="w-5 h-5" />
                                <span className="text-sm font-medium">Add Inspiration</span>
                              </motion.div>
                            </label>
                          </div>

                          {/* Uploaded Images */}
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
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all" />
                                  <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => setPreviewImage(image.url)}
                                      className="p-1 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => removeImage(row.id, 'inspiration', image.id)}
                                      className="p-1 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
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
                          {/* Upload Area */}
                          <div
                            onDragOver={(e) => handleDragOver(e, row.id, 'area')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, row.id, 'area')}
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                              draggedCell?.rowId === row.id && draggedCell?.column === 'area'
                                ? 'border-black bg-gray-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <label className="cursor-pointer block">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files && handleImageUpload(row.id, 'area', e.target.files)}
                              />
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center space-x-2 text-gray-600 hover:text-black transition-colors"
                              >
                                <Plus className="w-5 h-5" />
                                <span className="text-sm font-medium">Add Area</span>
                              </motion.div>
                            </label>
                          </div>

                          {/* Uploaded Images */}
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
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all" />
                                  <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => setPreviewImage(image.url)}
                                      className="p-1 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => removeImage(row.id, 'area', image.id)}
                                      className="p-1 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Output Column */}
                      <td className="px-6 py-6">
                        <div className="space-y-3">
                          {/* Generate Button */}
                          <motion.button
                            variants={generateVariants}
                            animate={row.outputStatus}
                            whileHover={{ scale: row.outputStatus === 'generating' ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => generateOutput(row.id)}
                            disabled={
                              row.outputStatus === 'generating' || 
                              row.inspirationImages.length === 0 || 
                              row.areaImages.length === 0
                            }
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                              row.outputStatus === 'generating'
                                ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                                : row.inspirationImages.length === 0 || row.areaImages.length === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}
                          >
                            {row.outputStatus === 'generating' ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Generating...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                <span>Generate</span>
                              </>
                            )}
                          </motion.button>

                          {/* Output Image */}
                          {row.outputStatus === 'completed' && row.outputImage && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group"
                            >
                              <img
                                src={row.outputImage}
                                alt="Generated output"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg" />
                              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => row.outputImage && setPreviewImage(row.outputImage)}
                                  className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:text-black transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>
                                <button className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:text-black transition-colors">
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                              {row.generatedAt && (
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {new Date(row.generatedAt).toLocaleTimeString()}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </motion.table>
          </div>
        </div>
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

export default DesignGeneratorTable;