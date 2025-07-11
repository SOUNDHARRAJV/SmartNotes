import React from 'react';
import { BookOpen, Upload, User, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600 cursor-pointer" onClick={() => onTabChange('home')}>
            <BookOpen size={24} />
            Smart Notes
          </div>

          <div className="hidden md:flex gap-6 ml-10 text-gray-700 font-medium">
            <button onClick={() => onTabChange('home')} className={activeTab === 'home' ? 'text-blue-600' : ''}>Home</button>
            <button onClick={() => onTabChange('upload')} className={activeTab === 'upload' ? 'text-blue-600' : ''}>Upload</button>
            <button onClick={() => onTabChange('my-uploads')} className={activeTab === 'my-uploads' ? 'text-blue-600' : ''}>My Uploads</button>
            <button onClick={() => onTabChange('about')} className={activeTab === 'about' ? 'text-blue-600' : ''}>About</button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="text-right">
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">
                {user.customDepartment || user.department}
              </div>
            </div>
            <button onClick={logout} title="Logout">
              <User className="ml-3 text-gray-500 hover:text-red-600 cursor-pointer" size={20} />
            </button>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
};

export default Layout;
