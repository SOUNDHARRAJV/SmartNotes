import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Upload, DataContextType, Category, Department, AddUploadInput } from '../types';
import { storage } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata, updateMetadata } from 'firebase/storage';

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [uploads, setUploads] = useState<Upload[]>([]);

  const fetchUploads = async (): Promise<Upload[]> => {
    const uploadsRef = ref(storage, "uploads");
    const allUploads: Upload[] = [];

    const traverse = async (folderRef: any) => {
      const list = await listAll(folderRef);
      for (const itemRef of list.items) {
        try {
          const [meta, url] = await Promise.all([
            getMetadata(itemRef),
            getDownloadURL(itemRef).catch(() => "")
          ]);
          const cm = meta.customMetadata || {};
          allUploads.push({
            id: itemRef.fullPath,
            title: cm.title || meta.name,
            description: cm.description || "",
            category: (cm.category as Category) || "Others",
            department: (cm.department as Department) || "Others",
            customDepartment: cm.customDepartment || undefined,
            fileUrl: url || undefined,
            fileName: meta.name,
            fileType: meta.contentType || undefined,
            storagePath: itemRef.fullPath,
            uploaderId: cm.uploaderId || "unknown",
            uploaderName: cm.uploaderName || "Unknown",
            uploaderEmail: cm.uploaderEmail || "",
            createdAt: meta.timeCreated ? new Date(meta.timeCreated) : new Date(),
            updatedAt: meta.updated ? new Date(meta.updated) : new Date(),
          });
        } catch {}
      }
      for (const prefix of list.prefixes) {
        await traverse(prefix);
      }
    };

    try { await traverse(uploadsRef); } catch {}
    return allUploads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  // Poll every 5s
  useEffect(() => {
    let timer: any = null;
    const startPolling = async () => {
      const initial = await fetchUploads();
      setUploads(initial);
      timer = setInterval(async () => {
        const updated = await fetchUploads();
        setUploads(updated);
      }, 5000);
    };
    startPolling();
    return () => timer && clearInterval(timer);
  }, []);

  const addUpload = async (uploadData: AddUploadInput) => {
    let fileUrl = uploadData.fileUrl;
    let fileName = uploadData.fileName;
    let fileType = uploadData.fileType;
    let storagePath: string | undefined;

    if (uploadData.file) {
      const path = `uploads/${uploadData.uploaderId}/${Date.now()}_${uploadData.file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, uploadData.file, {
        customMetadata: {
          title: uploadData.title,
          description: uploadData.description,
          category: uploadData.category,
          department: uploadData.department,
          customDepartment: uploadData.customDepartment || '',
          uploaderId: uploadData.uploaderId,
          uploaderName: uploadData.uploaderName,
          uploaderEmail: uploadData.uploaderEmail,
        },
      });
      fileUrl = await getDownloadURL(storageRef);
      storagePath = path;
    }

    setUploads(prev => [{
      id: `${Date.now()}`,
      title: uploadData.title,
      description: uploadData.description,
      category: uploadData.category,
      department: uploadData.department,
      customDepartment: uploadData.customDepartment || undefined,
      fileUrl,
      fileName,
      fileType,
      storagePath,
      uploaderId: uploadData.uploaderId,
      uploaderName: uploadData.uploaderName,
      uploaderEmail: uploadData.uploaderEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, ...prev]);
  };

  const updateUpload = async (_id: string, uploadData: Partial<Upload>) => {
    if (!uploadData.storagePath) return;
    const objectRef = ref(storage, uploadData.storagePath);
    const meta = await getMetadata(objectRef);
    await updateMetadata(objectRef, {
      customMetadata: {
        ...(meta.customMetadata || {}),
        title: uploadData.title || meta.customMetadata?.title || '',
        description: uploadData.description || meta.customMetadata?.description || '',
        category: uploadData.category as any || meta.customMetadata?.category || '',
        department: uploadData.department as any || meta.customMetadata?.department || '',
        customDepartment: uploadData.customDepartment || meta.customMetadata?.customDepartment || '',
      },
    });
  };

  const deleteUpload = async (id: string) => {
    const target = uploads.find(u => u.id === id);
    if (target?.storagePath) { try { await deleteObject(ref(storage, target.storagePath)); } catch {} }
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const getUserUploads = async (userId: string) => {
    const userRef = ref(storage, `uploads/${userId}`);
    const allUploads: Upload[] = [];
    try {
      const list = await listAll(userRef);
      for (const itemRef of list.items) {
        const [meta, url] = await Promise.all([
          getMetadata(itemRef),
          getDownloadURL(itemRef).catch(() => "")
        ]);
        const cm = meta.customMetadata || {};
        allUploads.push({
          id: itemRef.fullPath,
          title: cm.title || meta.name,
          description: cm.description || "",
          category: (cm.category as Category) || "Others",
          department: (cm.department as Department) || "Others",
          customDepartment: cm.customDepartment || undefined,
          fileUrl: url || undefined,
          fileName: meta.name,
          fileType: meta.contentType || undefined,
          storagePath: itemRef.fullPath,
          uploaderId: cm.uploaderId || userId,
          uploaderName: cm.uploaderName || "Unknown",
          uploaderEmail: cm.uploaderEmail || "",
          createdAt: meta.timeCreated ? new Date(meta.timeCreated) : new Date(),
          updatedAt: meta.updated ? new Date(meta.updated) : new Date(),
        });
      }
    } catch {}
    return allUploads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const searchUploads = (query: string, category?: Category, department?: Department, customDepartment?: string) => {
    let filtered = uploads;
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(u => u.title.toLowerCase().includes(q) || u.description.toLowerCase().includes(q) || u.uploaderName.toLowerCase().includes(q));
    }
    if (category) filtered = filtered.filter(u => u.category === category);
    if (department) {
      if (department === 'Others') filtered = filtered.filter(u => u.department === 'Others' && u.customDepartment?.toLowerCase().includes(customDepartment?.toLowerCase() || ''));
      else filtered = filtered.filter(u => u.department === department);
    }
    return filtered;
  };

  const value: DataContextType = { uploads, addUpload, updateUpload, deleteUpload, getUserUploads, searchUploads };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
