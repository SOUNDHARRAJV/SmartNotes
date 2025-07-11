import React, { useState } from 'react';
import { Upload } from '../types';
import {
  Calendar,
  User,
  FileText,
  Video,
  Image,
  Archive,
  Download
} from 'lucide-react';

interface UploadCardProps {
  upload: Upload;
  showActions?: boolean;
  onEdit?: (upload: Upload) => void;
  onDelete?: (id: string) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({
  upload,
  showActions = false,
  onEdit,
  onDelete
}) => {
  const [showModal, setShowModal] = useState(false);

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return FileText;
    if (fileType.includes('video')) return Video;
    if (fileType.includes('image')) return Image;
    if (fileType.includes('zip') || fileType.includes('rar')) return Archive;
    return FileText;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Notes: 'bg-blue-100 text-blue-800',
      Assignments: 'bg-green-100 text-green-800',
      Projects: 'bg-purple-100 text-purple-800',
      'Study Materials': 'bg-yellow-100 text-yellow-800',
      Video: 'bg-red-100 text-red-800',
      Others: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.Others;
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      CSE: 'bg-indigo-100 text-indigo-800',
      ECE: 'bg-emerald-100 text-emerald-800',
      EEE: 'bg-orange-100 text-orange-800',
      MECH: 'bg-teal-100 text-teal-800',
      CIVIL: 'bg-cyan-100 text-cyan-800',
      AGRI: 'bg-lime-100 text-lime-800',
      Others: 'bg-gray-100 text-gray-800'
    };
    return colors[department as keyof typeof colors] || colors.Others;
  };

  const FileIcon = getFileIcon(upload.fileType);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden relative">
      <div className="p-6">
        {/* Header with title and buttons */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 w-2/3">
            {upload.title}
          </h3>
          {upload.fileUrl && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-md text-sm font-medium transition-colors"
              >
                View
              </button>
              <a
                href={upload.fileUrl}
                download={upload.fileName}
                className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded-md text-sm font-medium transition-colors"
              >
                <Download size={16} />
              </a>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {upload.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(upload.category)}`}
          >
            {upload.category}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(upload.department)}`}
          >
            {upload.department}
          </span>
        </div>

        {/* File name */}
        {upload.fileName && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <FileIcon size={16} className="mr-2" />
            <span className="truncate">{upload.fileName}</span>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>{upload.uploaderName}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{upload.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Edit/Delete Buttons */}
        {showActions && (
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onEdit?.(upload)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(upload.id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">🚧 Coming Soon</h2>
            <p className="text-gray-600 mb-4">
              This feature is under development. Stay tuned!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
