// types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  customDepartment?: string;
}

export interface Upload {
  id: string;
  title: string;
  description: string;
  category: Category;
  department: Department;
  customDepartment?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  storagePath?: string;
  uploaderId: string;
  uploaderName: string;
  uploaderEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Category = 
  | 'Notes'
  | 'Assignments'
  | 'Projects'
  | 'Study Materials'
  | 'Video'
  | 'Others';

export type Department = 
  | 'CSE'
  | 'ECE'
  | 'EEE'
  | 'MECH'
  | 'CIVIL'
  | 'AGRI'
  | 'IT'
  | 'BIOTECH'
  | 'Others';

export interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  isLoading: boolean;
}

export interface DataContextType {
  uploads: Upload[];
  addUpload: (upload: AddUploadInput) => Promise<void>;
  updateUpload: (id: string, upload: Partial<Upload>) => void;
  deleteUpload: (id: string) => void;
  getUserUploads: (userId: string) => Upload[];
  searchUploads: (
    query: string,
    category?: Category,
    department?: Department,
    customDepartment?: string
  ) => Upload[];
}

// Input payload accepted by addUpload. Includes optional File for storage upload.
export interface AddUploadInput {
  title: string;
  description: string;
  category: Category;
  department: Department;
  customDepartment?: string;
  file?: File;
  uploaderId: string;
  uploaderName: string;
  uploaderEmail: string;
  // Optional precomputed fields when no file is provided
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CommunityForm {
  name: string;
  email: string;
  department: Department;
  customDepartment?: string;
  interests: string;
  reason: string;
}
