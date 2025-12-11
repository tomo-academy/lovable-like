import React from 'react';
import { X, Mail, Send } from 'lucide-react';

interface EmailPreviewModalProps {
  isOpen: boolean;
  recipient: string;
  subject: string;
  body: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  recipient,
  subject,
  body,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-200 dark:border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <Mail className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email Preview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Review before sending</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Email Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          {/* Recipient */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              To:
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
              <p className="text-gray-900 dark:text-white font-medium">{recipient}</p>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Subject:
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
              <p className="text-gray-900 dark:text-white font-medium">{subject}</p>
            </div>
          </div>

          {/* Body */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Message:
            </label>
            <div className="px-4 py-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {body}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 shadow-lg shadow-pink-500/25"
          >
            <Send className="w-4 h-4" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};
