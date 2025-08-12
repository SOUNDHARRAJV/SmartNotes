import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UploadForm from './components/UploadForm';
import MyUploads from './components/MyUploads';
import About from './components/About';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // ✅ Render admin dashboard directly
  if (user.department === 'ADMIN') {
    return <AdminDashboard />;
  }

  // ✅ Render normal student UI
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'upload':
        return <UploadForm />;
      case 'my-uploads':
        return <MyUploads onNavigateToUpload={() => setActiveTab('upload')} />;
      case 'about':
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
