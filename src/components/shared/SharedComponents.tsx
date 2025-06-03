// components/shared/SharedComponents.tsx
'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, AlertCircle, Clock, CheckCircle, RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserSubmission } from '../../lib/types';

// Preview Modal Component
interface PreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ imageUrl, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card className="relative max-w-4xl w-full mx-4 overflow-hidden">
        <CardContent className="p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-auto object-contain"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Progress Bar Component
export const ProgressBar: React.FC<{ progress: number; status: UserSubmission['status'] }> = ({ progress, status }) => {
  const getProgressColor = () => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressText = () => {
    switch (status) {
      case 'pending': return 'Waiting for admin to start processing...';
      case 'in_progress': return progress < 50 ? 'Admin is analyzing your images...' : 'Generating AI result...';
      case 'completed': return 'Your AI design is ready!';
      case 'failed': return 'Processing failed. Please try again.';
      default: return 'Unknown status';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{getProgressText()}</span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${getProgressColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

// Status Badge Component
export const StatusBadge: React.FC<{ status: 'idle' | 'generating' | 'completed' | 'error' | UserSubmission['status'] }> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'idle':
        return { icon: Clock, variant: "secondary" as const, text: 'Ready to submit' };
      case 'pending':
        return { icon: Clock, variant: "secondary" as const, text: 'Pending' };
      case 'generating':
      case 'in_progress':
        return { icon: RefreshCw, variant: "default" as const, text: 'Processing...' };
      case 'completed':
        return { icon: CheckCircle, variant: "default" as const, text: 'Completed' };
      case 'error':
      case 'failed':
        return { icon: AlertCircle, variant: "destructive" as const, text: 'Failed' };
      default:
        return { icon: Clock, variant: "secondary" as const, text: 'Unknown' };
    }
  };

  const { icon: Icon, variant, text } = getStatusInfo();

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {text}
    </Badge>
  );
};

// Priority Badge Component
export const PriorityBadge: React.FC<{ priority: UserSubmission['priority'] }> = ({ priority }) => {
  const getVariant = () => {
    switch (priority) {
      case 'high': return "destructive" as const;
      case 'medium': return "default" as const;
      case 'low': return "secondary" as const;
      default: return "secondary" as const;
    }
  };

  return (
    <Badge variant={getVariant()}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};