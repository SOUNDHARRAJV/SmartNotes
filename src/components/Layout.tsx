import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Upload, 
  FileText, 
  LogOut,
  Menu,
  X,
  Info,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'my-uploads', label: 'My Uploads', icon: FileText },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen size={28} className="text-blue-600 mr-2" />
                <h1 className="text-2xl font-bold text-blue-600">Smart Notes</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.department}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;