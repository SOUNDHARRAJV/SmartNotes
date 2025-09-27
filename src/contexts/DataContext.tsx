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
  const [loading, setLoading] = useState(true);

  const fetchUploads = async (): Promise<Upload[]> => {
    const uploadsRef = ref(storage, 'uploads');
    const allUploads: Upload[] = [];

    const traverse = async (folderRef: any) => {
      const list = await listAll(folderRef);

      for (const itemRef of list.items) {
        try {
          const [meta, url] = await Promise.all([
            getMetadata(itemRef),
            getDownloadURL(itemRef).catch(() => undefined),
          ]);

          const cm = meta.customMetadata || {};

          allUploads.push({
            id: itemRef.fullPath,
            title: cm.title || meta.name,
            description: cm.description || '',
            category: (cm.category as Category) || 'Others',
            department: (cm.department as Department) || 'Others',
            customDepartment: cm.customDepartment || undefined,
            fileUrl: url,
            fileName: meta.name,
            fileType: meta.contentType || undefined,
            storagePath: itemRef.fullPath,
            uploaderId: cm.uploaderId || '',
            uploaderName: cm.uploaderName || 'Unknown',
            uploaderEmail: cm.uploaderEmail || '',
            createdAt: meta.timeCreated ? new Date(meta.timeCreated) : new Date(),
            updatedAt: meta.updated ? new Date(meta.updated) : new Date(),
          });
        } catch (err) {
          console.warn('Skipping problematic file:', err);
        }
      }

      for (const prefix of list.prefixes) {
        await traverse(prefix);
      }
    };

    try {
      await traverse(uploadsRef);
    } catch (err) {
      console.warn('No uploads folder yet or fetch failed:', err);
      return [];
    }

    return allUploads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  useEffect(() => {
    let isMounted = true;

    const loadUploads = async () => {
      setLoading(true);
      const data = await fetchUploads();
      if (isMounted) setUploads(data);
      setLoading(false);
    };

    loadUploads();

    return () => { isMounted = false; };
  }, []);

  const addUpload = async (uploadData: AddUploadInput) => {
    let fileUrl: string | undefined = uploadData.fileUrl;
    let fileName: string | undefined = uploadData.fileName;
    let fileType: string | undefined = uploadData.fileType;
    let storagePath: string | undefined = undefined;

    if (uploadData.file) {
      const file = uploadData.file;
      fileName = file.name;
      fileType = file.type;
      const path = `uploads/${uploadData.uploaderId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, file, {
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

    const newUpload: Upload = {
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
    };

    setUploads(prev => [newUpload, ...prev]);
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
    if (target?.storagePath) {
      try { await deleteObject(ref(storage, target.storagePath)); } catch {}
    }
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  // ✅ Filter uploads by user id or email
  const getUserUploads = (userId: string, userEmail?: string) => {
    return uploads.filter(u => u.uploaderId === userId || u.uploaderEmail === userEmail);
  };

  const searchUploads = (
    query: string,
    category?: Category,
    department?: Department,
    customDepartment?: string
  ) => {
    let filtered = uploads;
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(u =>
        u.title.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q) ||
        u.uploaderName.toLowerCase().includes(q)
      );
    }

    if (category) filtered = filtered.filter(u => u.category === category);
    if (department) {
      if (department === 'Others') {
        filtered = filtered.filter(u =>
          u.department === 'Others' &&
          u.customDepartment?.toLowerCase().includes(customDepartment?.toLowerCase() || '')
        );
      } else filtered = filtered.filter(u => u.department === department);
    }

    return filtered;
  };

  const value: DataContextType = {
    uploads,
    addUpload,
    updateUpload,
    deleteUpload,
    getUserUploads,
    searchUploads,
  };

  return (
    <DataContext.Provider value={value}>
      {loading ? <div className="text-center py-6">Loading uploads...</div> : children}
    </DataContext.Provider>
  );
};
