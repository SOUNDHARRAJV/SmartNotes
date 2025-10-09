// types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  customDepartment?: string;
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

// Matches your Supabase “uploads” table
export interface Upload {
  id: number | string;
  title: string;
  department: string;
  file_url: string;
  uploaded_at: string;
  uploader_name: string;
  uploader_email: string;
  category?: Category;
  customDepartment?: string;
}

export interface AddUploadInput {
  title: string;
  department: string;
  file?: File;
  file_url?: string;
  uploaderId: string;
  uploaderName: string;
  uploaderEmail: string;
  category?: Category;
  customDepartment?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  isLoading: boolean;
}

export interface DataContextType {
  uploads: Upload[];
  addUpload: (upload: AddUploadInput) => Promise<void>;
  deleteUpload: (id: number) => Promise<void>;
  getUserUploads: (userId: string) => Promise<Upload[]>;
  searchUploads: (
    query: string,
    category?: Category,
    department?: string,
    customDepartment?: string
  ) => Upload[];
}
