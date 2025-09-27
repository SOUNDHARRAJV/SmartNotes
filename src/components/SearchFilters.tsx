import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Category, Department } from '../types';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category | '';
  onCategoryChange: (category: Category | '') => void;
  selectedDepartment: Department | '';
  onDepartmentChange: (department: Department | '') => void;
  customDepartment?: string;
  onCustomDepartmentChange?: (customDepartment: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDepartment,
  onDepartmentChange,
  customDepartment = '',
  onCustomDepartmentChange,
}) => {
  const categories: Category[] = ['Notes', 'Assignments', 'Projects', 'Study Materials', 'Video', 'Others'];
  const departments: Department[] = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AGRI', 'IT', 'BIOTECH', 'Others'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <Filter size={20} className="text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search titles and descriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as Category | '')}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={selectedDepartment}
            onChange={(e) => {
              onDepartmentChange(e.target.value as Department | '');
              if (e.target.value !== 'Others' && onCustomDepartmentChange) {
                onCustomDepartmentChange('');
              }
            }}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
          >
            <option value="">All Departments</option>
            {departments.map(department => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Department Input */}
      {selectedDepartment === 'Others' && onCustomDepartmentChange && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Specify department..."
            value={customDepartment}
            onChange={(e) => onCustomDepartmentChange(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      )}
    </div>
  );
};

export default SearchFilters;