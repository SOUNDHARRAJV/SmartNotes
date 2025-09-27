import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import UploadCard from './UploadCard';
import { FileText, Plus } from 'lucide-react';
import { Upload } from '../types';

interface MyUploadsProps {
  onNavigateToUpload: () => void;
}

const MyUploads: React.FC<MyUploadsProps> = ({ onNavigateToUpload }) => {
  const { user } = useAuth();
  const { fetchUserUploads, deleteUpload } = useData();
  const [myUploads, setMyUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadMyUploads = async () => {
      setLoading(true);
      const uploads = await fetchUserUploads(user.uid);
      setMyUploads(uploads);
      setLoading(false);
    };

    loadMyUploads();
  }, [user, fetchUserUploads]);

  const sortedUploads = myUploads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const handleDelete = (upload: Upload) => {
    if (window.confirm('Are you sure you want to delete this upload?')) {
      deleteUpload(upload);
      setMyUploads(prev => prev.filter(u => u.id !== upload.id));
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-12">Loading your uploads...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Uploads</h1>
              <p className="text-gray-500 mt-1">{myUploads.length} items</p>
            </div>
            <button
              onClick={onNavigateToUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center"
            >
              <Plus size={18} className="mr-2" /> New Upload
            </button>
          </div>

          {sortedUploads.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Start uploading your files!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedUploads.map(upload => (
                <UploadCard
                  key={upload.id}
                  upload={upload}
                  showActions
                  onDelete={() => handleDelete(upload)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyUploads;
