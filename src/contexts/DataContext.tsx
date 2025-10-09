import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Upload, DataContextType, Category, AddUploadInput } from "../types";

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const API_URL = "http://localhost:5000/api/uploads";

  const fetchUploads = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data: Upload[] = await res.json();
      setUploads(data);
      console.log("✅ Fetched uploads:", data);
      return data;
    } catch (err) {
      console.error("❌ Error fetching uploads:", err);
      setUploads([]);
      return [];
    }
  };

  const addUpload = async (uploadData: AddUploadInput) => {
    try {
      const newUpload: Upload = {
        id: Date.now().toString(),
        title: uploadData.title?.trim() || "Untitled",
        description: uploadData.description?.trim() || "No description provided.",
        department: uploadData.department || "Others",
        category: uploadData.category || "Others",
        customDepartment:
          uploadData.department === "Others" ? uploadData.customDepartment || "Others" : undefined,
        file_url: uploadData.file_url || "",
        uploaderName: uploadData.uploaderName || "Unknown",
        uploaderEmail: uploadData.uploaderEmail || "",
        uploaded_at: new Date().toISOString(),
      };

      setUploads((prev) => [newUpload, ...prev]);
      console.log("🆕 Upload added locally:", newUpload);
    } catch (err) {
      console.error("❌ Error adding upload:", err);
    }
  };

  const deleteUpload = async (id: number | string) => {
    try {
      setUploads((prev) => prev.filter((u) => u.id !== id));
      console.log(`🗑️ Upload ${id} deleted locally`);
    } catch (err) {
      console.error("❌ Error deleting upload:", err);
    }
  };

  const getUserUploads = async (userId: string) => {
    return uploads.filter((u) => u.uploaderEmail === userId || u.uploaderName === userId);
  };

  const searchUploads = (
    query: string,
    category?: Category,
    department?: string,
    customDepartment?: string
  ) => {
    return uploads.filter((u) => {
      const matchesQuery = query ? u.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesCategory = category ? u.category === category : true;
      const matchesDepartment = department
        ? department === "Others"
          ? u.department === "Others" &&
            u.customDepartment?.toLowerCase().includes(customDepartment?.toLowerCase() || "")
          : u.department === department
        : true;
      return matchesQuery && matchesCategory && matchesDepartment;
    });
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const value: DataContextType = {
    uploads,
    addUpload,
    deleteUpload,
    getUserUploads,
    searchUploads,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
