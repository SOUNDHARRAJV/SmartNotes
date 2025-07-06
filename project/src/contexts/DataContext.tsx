import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Upload, DataContextType, Category, Department } from '../types';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

// Mock data for demonstration
const mockUploads: Upload[] = [
  {
    id: '1',
    title: 'Data Structures and Algorithms Notes',
    description: 'Comprehensive notes covering arrays, linked lists, trees, and graphs with examples and implementations.',
    category: 'Notes',
    department: 'CSE',
    fileUrl: '#',
    fileName: 'DSA_Notes.pdf',
    fileType: 'application/pdf',
    uploaderId: 'mock-user-1',
    uploaderName: 'John Doe',
    uploaderEmail: 'john.doe@student.edu',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Circuit Analysis Assignment',
    description: 'Assignment on AC and DC circuit analysis with solved examples and practice problems.',
    category: 'Assignments',
    department: 'ECE',
    fileUrl: '#',
    fileName: 'Circuit_Analysis.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploaderId: 'mock-user-2',
    uploaderName: 'Jane Smith',
    uploaderEmail: 'jane.smith@student.edu',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    title: 'Machine Learning Project',
    description: 'Complete machine learning project on image classification using CNN with Python and TensorFlow.',
    category: 'Projects',
    department: 'IT',
    fileUrl: '#',
    fileName: 'ML_Project.zip',
    fileType: 'application/zip',
    uploaderId: 'mock-user-3',
    uploaderName: 'Mike Johnson',
    uploaderEmail: 'mike.johnson@student.edu',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: '4',
    title: 'Biotechnology Lab Manual',
    description: 'Complete lab manual for biotechnology experiments including protocols and safety guidelines.',
    category: 'Study Materials',
    department: 'BIOTECH',
    fileUrl: '#',
    fileName: 'Biotech_Lab_Manual.pdf',
    fileType: 'application/pdf',
    uploaderId: 'mock-user-4',
    uploaderName: 'Sarah Wilson',
    uploaderEmail: 'sarah.wilson@student.edu',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [uploads, setUploads] = useState<Upload[]>([]);

  useEffect(() => {
    // Load uploads from localStorage or use mock data
    const savedUploads = localStorage.getItem('student-portal-uploads');
    if (savedUploads) {
      const parsed = JSON.parse(savedUploads);
      setUploads(parsed.map((upload: any) => ({
        ...upload,
        createdAt: new Date(upload.createdAt),
        updatedAt: new Date(upload.updatedAt),
      })));
    } else {
      setUploads(mockUploads);
    }
  }, []);

  const saveUploads = (newUploads: Upload[]) => {
    localStorage.setItem('student-portal-uploads', JSON.stringify(newUploads));
    setUploads(newUploads);
  };

  const addUpload = (uploadData: Omit<Upload, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUpload: Upload = {
      id: Date.now().toString(),
      ...uploadData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newUploads = [...uploads, newUpload];
    saveUploads(newUploads);
  };

  const updateUpload = (id: string, uploadData: Partial<Upload>) => {
    const newUploads = uploads.map(upload =>
      upload.id === id
        ? { ...upload, ...uploadData, updatedAt: new Date() }
        : upload
    );
    saveUploads(newUploads);
  };

  const deleteUpload = (id: string) => {
    const newUploads = uploads.filter(upload => upload.id !== id);
    saveUploads(newUploads);
  };

  const getUserUploads = (userId: string) => {
    return uploads.filter(upload => upload.uploaderId === userId);
  };

  const searchUploads = (query: string, category?: Category, department?: Department, customDepartment?: string) => {
    return uploads.filter(upload => {
      const matchesQuery = !query || 
        upload.title.toLowerCase().includes(query.toLowerCase()) ||
        upload.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || upload.category === category;
      
      let matchesDepartment = true;
      if (department) {
        if (department === 'Others' && customDepartment) {
          matchesDepartment = upload.department === 'Others' && 
            upload.customDepartment?.toLowerCase().includes(customDepartment.toLowerCase());
        } else {
          matchesDepartment = upload.department === department;
        }
      }
      
      return matchesQuery && matchesCategory && matchesDepartment;
    });
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
      {children}
    </DataContext.Provider>
  );
};