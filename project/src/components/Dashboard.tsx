import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Category, Department } from '../types';
import UploadCard from './UploadCard';
import SearchFilters from './SearchFilters';
import { BookOpen, Users, TrendingUp, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { uploads, searchUploads } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [customDepartment, setCustomDepartment] = useState('');

  const filteredUploads = searchUploads(
    searchQuery, 
    selectedCategory || undefined, 
    selectedDepartment || undefined,
    selectedDepartment === 'Others' ? customDepartment : undefined
  );
  const sortedUploads = filteredUploads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const stats = {
    totalUploads: uploads.length,
    totalUsers: new Set(uploads.map(u => u.uploaderId)).size,
    categoriesCount: new Set(uploads.map(u => u.category)).size,
    thisWeek: uploads.filter(u => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return u.createdAt >= weekAgo;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Smart Notes</h1>
        <p className="text-blue-100 text-lg">
          Your intelligent academic resource hub for sharing and discovering study materials
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalUploads}</p>
              <p className="text-gray-500">Total Resources</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-gray-500">Contributors</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.categoriesCount}</p>
              <p className="text-gray-500">Categories</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar size={24} className="text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
              <p className="text-gray-500">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        customDepartment={customDepartment}
        onCustomDepartmentChange={setCustomDepartment}
      />

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Uploads {filteredUploads.length !== uploads.length && `(${filteredUploads.length} results)`}
          </h2>
        </div>

        {sortedUploads.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No uploads found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or be the first to upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUploads.map(upload => (
              <UploadCard key={upload.id} upload={upload} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;