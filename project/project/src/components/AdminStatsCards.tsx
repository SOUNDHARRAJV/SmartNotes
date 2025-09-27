
const stats = [
  { label: 'Total Uploads', value: 24, icon: '📄' },
  { label: 'Contributors', value: 12, icon: '👥' },
  { label: 'Edits This Week', value: 5, icon: '✏️' },
];

const AdminStatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={`${stat.label}-${stat.value}`}
          className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow duration-200 text-center"
          aria-label={stat.label}
        >
          <div className="text-4xl mb-2">{stat.icon}</div>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-gray-500 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;
