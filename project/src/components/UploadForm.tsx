import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Category, Department } from '../types';
import { Upload, FileText, X, CheckCircle, XCircle } from 'lucide-react';

const UploadForm: React.FC = () => {
  const { user } = useAuth();
  const { addUpload } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as Category,
    department: '' as Department,
    customDepartment: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<{ message: string; type: 'success' | 'error' }>({
    message: '',
    type: 'success',
  });

  const categories: Category[] = ['Notes', 'Assignments', 'Projects', 'Study Materials', 'Video', 'Others'];
  const departments: Department[] = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AGRI', 'IT', 'BIOTECH', 'Others'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const fileUrl = selectedFile ? URL.createObjectURL(selectedFile) : undefined;

      addUpload({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        department: formData.department,
        customDepartment: formData.department === 'Others' ? formData.customDepartment : undefined,
        fileUrl,
        fileName: selectedFile?.name,
        fileType: selectedFile?.type,
        uploaderId: user.id,
        uploaderName: user.name,
        uploaderEmail: user.email,
      });

      setPopupData({ message: 'Upload successful!', type: 'success' });
      setShowPopup(true);

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '' as Category,
        department: '' as Department,
        customDepartment: '',
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setPopupData({ message: 'Upload failed. Please try again.', type: 'error' });
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
            {popupData.type === 'success' ? (
              <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
            ) : (
              <XCircle className="text-red-500 mx-auto mb-3" size={48} />
            )}
            <h2 className="text-lg font-semibold mb-2">{popupData.message}</h2>
            <button
              onClick={closePopup}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Upload size={24} className="text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Upload Content</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter a descriptive title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Provide a detailed description of your content"
            />
          </div>

          {/* Category and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                id="department"
                required
                value={formData.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value as Department,
                    customDepartment: e.target.value !== 'Others' ? '' : formData.customDepartment,
                  })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Select department</option>
                {departments.map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Department Input */}
          {formData.department === 'Others' && (
            <div>
              <label htmlFor="customDepartment" className="block text-sm font-medium text-gray-700 mb-2">
                Specify Department *
              </label>
              <input
                type="text"
                id="customDepartment"
                required
                value={formData.customDepartment}
                onChange={(e) => setFormData({ ...formData, customDepartment: e.target.value })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your department"
              />
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Attachment (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                <FileText size={48} className="mx-auto text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, ZIP, Images, Videos up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <FileText size={20} className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">{selectedFile.name}</span>
                <span className="text-xs text-blue-700 ml-2">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-blue-600 hover:text-blue-800"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Upload size={18} className="mr-2" />
                Upload Content
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
