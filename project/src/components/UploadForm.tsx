import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Category, Department } from "../types";
import { Upload, FileText, X, CheckCircle, XCircle } from "lucide-react";

const UploadForm: React.FC = () => {
  const { user } = useAuth();
  const { addUpload } = useData(); // ✅ Use context

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as Category,
    department: "" as Department,
    customDepartment: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<{ message: string; type: "success" | "error" }>({
    message: "",
    type: "success",
  });

  const categories: Category[] = [
    "Notes",
    "Assignments",
    "Projects",
    "Study Materials",
    "Video",
    "Others",
  ];
  const departments: Department[] = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "AGRI", "IT", "BIOTECH", "Others"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      await addUpload({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        department: formData.department,
        customDepartment: formData.department === "Others" ? formData.customDepartment : "",
        file: selectedFile || undefined,
        uploaderId: user.id,
        uploaderName: user.name,
        uploaderEmail: user.email,
        fileUrl: "", // will be set inside addUpload
        fileName: "",
        fileType: "",
      });

      setPopupData({ message: "Upload successful!", type: "success" });
      setShowPopup(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "" as Category,
        department: "" as Department,
        customDepartment: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setPopupData({ message: "Upload failed. Please try again.", type: "error" });
      setShowPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const removeFile = () => setSelectedFile(null);
  const closePopup = () => setShowPopup(false);

  return (
    <div className="relative max-w-2xl mx-auto">
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
            {popupData.type === "success" ? (
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
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
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                id="department"
                required
                value={formData.department}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  department: e.target.value as Department, 
                  customDepartment: e.target.value !== "Others" ? "" : formData.customDepartment
                })}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="">Select department</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Custom Department */}
          {formData.department === "Others" && (
            <div>
              <label htmlFor="customDepartment" className="block text-sm font-medium text-gray-700 mb-2">Specify Department *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">File Attachment (Optional)</label>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            {selectedFile && (
              <div className="flex justify-between mt-2 items-center">
                <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                <button type="button" onClick={() => setSelectedFile(null)}>Remove</button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? "Uploading..." : "Upload Content"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
