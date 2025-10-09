import React, { useState } from "react";
import { Calendar, User, FileText, X } from "lucide-react";
import type { Upload } from "../types";

interface UploadCardProps {
  upload: Upload;
  showActions?: boolean;
  onEdit?: (upload: Upload) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({
  upload,
  showActions = false,
  onEdit,
}) => {
  const [showModal, setShowModal] = useState(false);

  const cdnUrl = upload.file_url?.trim() || "";
  const isValidUrl =
    cdnUrl.startsWith("https://ucarecdn.com/") ||
    cdnUrl.startsWith("https://") ||
    cdnUrl.startsWith("http://");

  const getFileType = () => {
    if (cdnUrl.endsWith(".pdf")) return "pdf";
    if (cdnUrl.match(/\.(jpg|jpeg|png|gif)$/i)) return "image";
    if (cdnUrl.match(/\.(mp4|webm|ogg)$/i)) return "video";
    return "other";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Notes: "bg-blue-100 text-blue-800",
      Assignments: "bg-green-100 text-green-800",
      Projects: "bg-purple-100 text-purple-800",
      "Study Materials": "bg-yellow-100 text-yellow-800",
      Video: "bg-red-100 text-red-800",
      Others: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.Others;
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      CSE: "bg-indigo-100 text-indigo-800",
      ECE: "bg-emerald-100 text-emerald-800",
      EEE: "bg-orange-100 text-orange-800",
      MECH: "bg-teal-100 text-teal-800",
      CIVIL: "bg-cyan-100 text-cyan-800",
      AGRI: "bg-lime-100 text-lime-800",
      IT: "bg-pink-100 text-pink-800",
      Others: "bg-gray-100 text-gray-800",
    };
    return colors[department] || colors.Others;
  };

  const fileType = getFileType();
  const formattedDate = upload.uploaded_at
    ? new Date(upload.uploaded_at).toLocaleDateString()
    : "—";

  const displayDepartment =
    upload.customDepartment && upload.department === "Others"
      ? upload.customDepartment
      : upload.department;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 flex flex-col min-h-[320px] w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] mx-auto p-6">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
        {upload.title || "Untitled"}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm line-clamp-3 min-h-[40px] mb-3">
        {upload.description || "No description provided."}
      </p>

      {/* Category & Department */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
            upload.category || ""
          )}`}
        >
          {upload.category || "Others"}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(
            upload.department || ""
          )}`}
        >
          {displayDepartment || "Others"}
        </span>
      </div>

      {/* File name */}
      {cdnUrl && (
        <div className="text-sm text-gray-500 truncate mb-2">
          <FileText size={16} className="inline-block mr-2 text-gray-400" />
          {decodeURIComponent(cdnUrl.split("/").pop() || "File")}
        </div>
      )}

      {/* View & Download Buttons */}
      {cdnUrl && isValidUrl && (
        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            View
          </button>
          <a
            href={cdnUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium border border-green-300 transition"
          >
            Download
          </a>
        </div>
      )}

      {/* Uploader & Date */}
      <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
        <span className="flex items-center">
          <User size={14} className="mr-1" />
          {upload.uploaderName || "Unknown"}
        </span>
        <span className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {formattedDate}
        </span>
      </div>

      {/* File broken fallback */}
      {!isValidUrl && (
        <div className="text-sm text-red-500 font-medium mt-2">
          File link unavailable. Please check upload.
        </div>
      )}

      {/* Modal Preview */}
      {showModal && cdnUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>

            <h2 className="text-lg font-semibold mb-4">{upload.title}</h2>

            {fileType === "image" ? (
              <img
                src={cdnUrl}
                alt={upload.title}
                className="max-h-[75vh] w-auto mx-auto rounded-lg shadow"
              />
            ) : fileType === "video" ? (
              <video
                controls
                className="max-h-[75vh] w-full mx-auto rounded-lg shadow"
              >
                <source src={cdnUrl} />
                Your browser does not support the video tag.
              </video>
            ) : fileType === "pdf" ? (
              <iframe
                src={cdnUrl}
                title={upload.title}
                className="w-full h-[75vh] border rounded-lg shadow"
              />
            ) : (
              <p className="text-gray-600 text-center mt-4">
                Preview not available.{" "}
                <a
                  href={cdnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download the file
                </a>
                .
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
