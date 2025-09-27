import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Upload } from '../types';
import UploadCard from './UploadCard';
import { FileText, Plus } from 'lucide-react';

interface MyUploadsProps { onNavigateToUpload: () => void }

const MyUploads: React.FC<MyUploadsProps> = ({ onNavigateToUpload }) => {
  const { user } = useAuth();
  const { getUserUploads, deleteUpload } = useData();
  const [myUploads, setMyUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchUploads = async () => {
      setLoading(true);
      try { const data = await getUserUploads(user.id); setMyUploads(data); } 
      catch { setMyUploads([]); }
      setLoading(false);
    };
    fetchUploads();
  }, [user, getUserUploads]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this upload?')) {
      await deleteUpload(id);
      setMyUploads(prev => prev.filter(u => u.id !== id));
    }
  };

  const sortedUploads = myUploads.sort((a,b)=>b.createdAt.getTime()-a.createdAt.getTime());
  if(loading) return <div className="text-center py-12">Loading your uploads...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Uploads</h1>
            <p className="text-gray-500 mt-1">Manage your uploaded content ({myUploads.length} items)</p>
          </div>
          <button onClick={onNavigateToUpload} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
            <Plus size={18} className="mr-2"/> New Upload
          </button>
        </div>
        {sortedUploads.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No uploads yet</h3>
            <p className="text-gray-500 mb-4">Start sharing your knowledge!</p>
            <button onClick={onNavigateToUpload} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">Create Your First Upload</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUploads.map(upload => <UploadCard key={upload.id} upload={upload} showActions={true} onDelete={handleDelete}/>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyUploads;
