import React, { useState, useEffect } from 'react';
import { useFeatureFlag } from '@/lib/features/featureFlags';
import { Eye, X } from 'lucide-react';

interface PreviewModeProps {
  content: any;
  onClose: () => void;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({ content, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const previewEnabled = useFeatureFlag('previewMode');

  useEffect(() => {
    if (previewEnabled) {
      setIsVisible(true);
    }
  }, [previewEnabled]);

  if (!previewEnabled || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview Mode
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {content}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t p-4 dark:border-gray-700">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Handle publish action
                onClose();
              }}
              className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 