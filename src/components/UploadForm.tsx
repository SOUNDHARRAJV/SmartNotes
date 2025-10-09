import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Category, Department } from "../types";
import { Upload, X, CheckCircle, XCircle } from "lucide-react";
import { UploadClient } from "@uploadcare/upload-client";

const client = new UploadClient({ publicKey: "186d566592a8ae8dee1b" });

const UploadForm: React.FC = () => {
  const { user } = useAuth();
  const { addUpload } = useData();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as Category,
    department: "" as Department,
    customDepartment: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const categories: Category[] = [
    "Notes",
    "Assignments",
    "Projects",
    "Study Materials",
    "Video",
    "Others",
  ];

  const departments: Department[] = [
    "CSE",
    "ECE",
    "EEE",
    "MECH",
    "CIVIL",
    "AGRI",
    "IT",
    "BIOTECH",
    "Others",
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title || !formData.description || !formData.category || !formData.department) {
      setPopup({ message: "Please fill all required fields.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      let file_url: string | undefined = undefined;

      if (selectedFile) {
        const uploadedFile = await client.uploadFile(selectedFile);
        file_url = uploadedFile.cdnUrl;
        console.log("✅ Uploaded to Uploadcare:", file_url);
      }

      await addUpload({
        title: formData.title.trim(),
        description: formData.description.trim(),
        department: formData.department,
        category: formData.category,
        customDepartment:
          formData.department === "Others" ? formData.customDepartment : undefined,
        file_url,
        uploaderId: user.id,
        uploaderName: user.name,
        uploaderEmail: user.email,
      });

      setPopup({ message: "Upload successful!", type: "success" });

      setFormData({
        title: "",
        description: "",
        category: "" as Category,
        department: "" as Department,
        customDepartment: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setPopup({ message: "Upload failed. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => setPopup(null);

  return (
    <div className="relative max-w-2xl mx-auto">
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full animate-fade-in">
            {popup.type === "success" ? (
              <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
            ) : (
              <XCircle className="text-red-500 mx-auto mb-3" size={48} />
            )}
            <h2 className="text-lg font-semibold mb-2">{popup.message}</h2>
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
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Provide a detailed description"
            />
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as Category })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
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
                    customDepartment:
                      e.target.value !== "Others" ? "" : formData.customDepartment,
                  })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Department */}
          {formData.department === "Others" && (
            <div>
              <label
                htmlFor="customDepartment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Specify Department *
              </label>
              <input
                type="text"
                id="customDepartment"
                required
                value={formData.customDepartment}
                onChange={(e) =>
                  setFormData({ ...formData, customDepartment: e.target.value })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your department"
              />
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Attachment (Optional)
            </label>
            <div className="flex items-center justify-between gap-3">
              <input
                type="file"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-700"
              />
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                >
                  <X size={16} /> Remove
                </button>
              )}
            </div>

            {previewUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">{selectedFile?.name}</p>
                {selectedFile?.type.startsWith("image/") ? (
                  <img src={previewUrl} alt="Preview" className="w-32 rounded-md border" />
                ) : (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline"
                  >
                    Preview File
                  </a>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition"
          >
            {isSubmitting ? "Uploading..." : "Upload Content"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
