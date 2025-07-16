import React, { useContext } from 'react';
import { Download, Eye, CheckCircle, Trash2 } from 'lucide-react';
import { DataContext } from '../contexts/DataContext';

interface Upload {
  title: string;
  uploaderName: string;
  date: string | number | Date;
  url: string;
  valid: boolean;
}

const AdminUploadsTable: React.FC = () => {
  const { uploads } = useContext(DataContext);

  const handleApprove = (upload: Upload) => {
    // TODO: Implement actual approve logic (e.g., update Firestore)
    console.log('Approving:', upload.title);
  };

  const handleDelete = (upload: Upload) => {
    // TODO: Implement actual delete logic (e.g., delete from storage and database)
    console.log('Deleting:', upload.title);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">All Uploaded Resources</h2>
      {uploads.length === 0 ? (
        <p className="text-gray-500 text-sm">No uploads found.</p>
      ) : (
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-600 bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Uploaded By</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload: Upload, index: number) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{upload.title}</td>
                <td className="py-3 px-4">{upload.uploaderName}</td>
                <td className="py-3 px-4">{new Date(upload.date).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  {upload.valid ? (
                    <span className="text-green-600 font-semibold">✅ Valid</span>
                  ) : (
                    <span className="text-black-600 font-semibold">❌ Invalid</span>
                  )}
                </td>
                <td className="py-3 px-4 flex flex-wrap gap-2">
                  <a
                    href={upload.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-400 text-white rounded hover:bg-blue-600"
                  >
                    <Eye size={16} className="mr-1" /> View
                  </a>

                  <a
                    href={upload.url}
                    download
                    className="inline-flex items-center px-3 py-1 text-sm bg-violet-400 text-white rounded hover:bg-violet-600"
                  >
                    <Download size={16} className="mr-1" /> Download
                  </a>

                  {!upload.valid && (
                    <>
                      <button
                        onClick={() => handleApprove(upload)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        <CheckCircle size={16} className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleDelete(upload)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUploadsTable;
