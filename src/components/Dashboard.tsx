import React, { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import { Category, Department } from "../types";
import UploadCard from "./UploadCard";
import SearchFilters from "./SearchFilters";
import { BookOpen, Users, TrendingUp, Calendar } from "lucide-react";

const Dashboard: React.FC = () => {
  const { uploads, searchUploads } = useData();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "">("");
  const [customDepartment, setCustomDepartment] = useState("");

  // Loading placeholder for stats
  const [stats, setStats] = useState({
    totalUploads: "...",
    totalUsers: "...",
    categoriesCount: "...",
    thisWeek: "...",
  });

  // Update stats after 1–2 seconds or when uploads change
  useEffect(() => {
    const timer = setTimeout(() => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      setStats({
        totalUploads: uploads.length,
        totalUsers: new Set(uploads.map((u) => u.uploaderId)).size,
        categoriesCount: new Set(uploads.map((u) => u.category)).size,
        thisWeek: uploads.filter((u) => u.createdAt >= weekAgo).length,
      });
    }, 2000); // 1 second placeholder

    return () => clearTimeout(timer);
  }, [uploads]);

  // Filter uploads
  const filteredUploads = searchUploads(
    searchQuery,
    selectedCategory || undefined,
    selectedDepartment || undefined,
    selectedDepartment === "Others" ? customDepartment : undefined
  );

  const sortedUploads = filteredUploads.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="space-y-6 relative min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Smart Notes</h1>
        <p className="text-blue-100 text-lg">
          Your intelligent academic resource hub for sharing and discovering study materials
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<BookOpen size={24} className="text-blue-600" />}
          bg="bg-blue-100"
          value={stats.totalUploads}
          label="Total Resources"
        />
        <StatCard
          icon={<Users size={24} className="text-green-600" />}
          bg="bg-green-100"
          value={stats.totalUsers}
          label="Contributors"
        />
        <StatCard
          icon={<TrendingUp size={24} className="text-purple-600" />}
          bg="bg-purple-100"
          value={stats.categoriesCount}
          label="Categories"
        />
        <StatCard
          icon={<Calendar size={24} className="text-orange-600" />}
          bg="bg-orange-100"
          value={stats.thisWeek}
          label="This Week"
        />
      </div>

      {/* Filters */}
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

      {/* Uploads */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          Recent Uploads{" "}
          {filteredUploads.length !== uploads.length && `(${filteredUploads.length} results)`}
        </h2>
        {sortedUploads.length === 0 ? (
          <EmptyUploads />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUploads.map((upload) => (
              <UploadCard key={upload.id} upload={upload} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* Reusable stat card */
const StatCard = ({
  icon,
  bg,
  value,
  label,
}: {
  icon: JSX.Element;
  bg: string;
  value: number | string;
  label: string;
}) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
    <div className={`p-3 ${bg} rounded-lg`}>{icon}</div>
    <div className="ml-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  </div>
);

/* Empty uploads placeholder */
const EmptyUploads = () => (
  <div className="text-center py-12">
    <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No uploads found</h3>
    <p className="text-gray-500">
      Try adjusting search criteria or upload something first!
    </p>
  </div>
);

export default Dashboard;
