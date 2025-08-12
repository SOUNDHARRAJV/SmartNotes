import { useAuth } from '../contexts/AuthContext';
import AdminStatsCards from './AdminStatsCards';
import AdminUploadsTable from './AdminUploadsTable';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin' || user?.email === 'admin@smartnotes.edu';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow max-w-md text-center border border-yellow-300">
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">🚫 Access Denied</h2>
          <p className="text-gray-600">You do not have admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Welcome Admin 👋</h1>
          <p className="text-gray-500 text-sm">Monitor and manage uploads across the platform</p>
        </div>
        <button
          onClick={logout}
           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <AdminStatsCards />

      {/* Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <AdminUploadsTable />
        <div className="bg-gradient-to-br from-blue-100 to-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">📊 Live Activity</h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>📥 <strong>Soundhar</strong> uploaded <em>"ML Notes"</em></li>
            <li>✏️ <strong>Raj</strong> edited <em>"Circuit Guide"</em></li>
            <li>📤 <strong>Anu</strong> uploaded <em>"OS Assignment"</em></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
