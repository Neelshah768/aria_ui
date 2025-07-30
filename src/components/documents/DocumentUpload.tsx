'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useUploadDocument, useUploadDocuments } from '@/hooks/api-hooks';
import { formatFileSize } from '@/lib/utils';

interface DocumentUploadProps {
  onUploadComplete?: (results: any) => void;
  clientId?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
}

export default function DocumentUpload({ 
  onUploadComplete,
  clientId,
  multiple = true,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024 // 50MB
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [metadata, setMetadata] = useState({
    author: '',
    tags: ''
  });

  const uploadSingle = useUploadDocument();
  const uploadMultiple = useUploadDocuments();

  // Supported file types
  const acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'text/plain': ['.txt'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/bmp': ['.bmp'],
    'image/tiff': ['.tiff']
  };

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      // Handle rejected files
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          console.error(`File ${file.name}: ${error.message}`);
        });
      });
    }

    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({});

    try {
      if (acceptedFiles.length === 1 && !multiple) {
        // Single file upload
        const result = await uploadSingle.mutateAsync({
          file: acceptedFiles[0],
          metadata: {
            ...metadata,
            clientId
          }
        });
        onUploadComplete?.(result);
      } else {
        // Multiple file upload
        const result = await uploadMultiple.mutateAsync({
          files: acceptedFiles,
          metadata: {
            ...metadata,
            clientId
          }
        });
        onUploadComplete?.(result);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [uploadSingle, uploadMultiple, metadata, clientId, multiple, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: multiple ? maxFiles : 1,
    maxSize: maxFileSize,
    multiple
  });

  const getFileTypeIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📺';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📃';
    return '📁';
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive && !isDragReject
            ? 'border-blue-400 bg-blue-500/10' 
            : isDragReject
            ? 'border-red-400 bg-red-500/10'
            : uploading
            ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed'
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
          }
        `}
        whileHover={!uploading ? { scale: 1.01 } : {}}
        whileTap={!uploading ? { scale: 0.99 } : {}}
      >
        <input {...getInputProps()} disabled={uploading} />
        
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-semibold text-white">Processing Upload...</h3>
              <p className="text-gray-400">
                Your documents are being uploaded and processed in the background
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </motion.div>
          ) : isDragActive ? (
            <motion.div
              key="drag-active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-blue-400">
                {isDragReject ? 'Unsupported file type!' : 'Drop files here...'}
              </h3>
              <p className={isDragReject ? 'text-red-400' : 'text-blue-300'}>
                {isDragReject 
                  ? 'Please upload supported document types only'
                  : 'Release to upload your documents'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white">
                Upload Knowledge Documents
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Drag & drop documents here, or click to browse. 
                {multiple && ` Upload up to ${maxFiles} files at once.`}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 max-w-lg mx-auto">
                <div className="flex items-center gap-1">
                  <span>📄</span> PDF
                </div>
                <div className="flex items-center gap-1">
                  <span>📝</span> Word
                </div>
                <div className="flex items-center gap-1">
                  <span>📊</span> Excel
                </div>
                <div className="flex items-center gap-1">
                  <span>📺</span> PowerPoint
                </div>
                <div className="flex items-center gap-1">
                  <span>🖼️</span> Images
                </div>
                <div className="flex items-center gap-1">
                  <span>📃</span> Text
                </div>
                <div className="text-gray-600">Max {formatFileSize(maxFileSize)}</div>
                <div className="text-gray-600">
                  {multiple ? `${maxFiles} files max` : 'Single file'}
                </div>
              </div>

              <motion.button
                className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Files
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Metadata Input */}
      {!uploading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Author
            </label>
            <input
              type="text"
              value={metadata.author}
              onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
              placeholder="Enter author name..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={metadata.tags}
              onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
              placeholder="e.g., policy, manual, faq..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </motion.div>
      )}

      {/* Upload Guidelines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/30 border border-gray-700 rounded-lg p-4"
      >
        <h4 className="text-sm font-semibold text-white mb-2">📋 Upload Guidelines</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Upload company-specific documents for better AI responses</li>
          <li>• Include manuals, FAQs, policies, and product documentation</li>
          <li>• Files are processed automatically in the background</li>
          <li>• Processing includes text extraction, OCR, and AI embedding generation</li>
          <li>• Once processed, documents become part of your AI knowledge base</li>
        </ul>
      </motion.div>
    </div>
  );
} 