import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div>Failed to load stats</div>;
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg"><p className="text-gray-400">Total Users</p><p className="text-3xl font-bold">{stats.totalUsers}</p></div>
        <div className="bg-gray-800 p-4 rounded-lg"><p className="text-gray-400">Movies in DB</p><p className="text-3xl font-bold">{stats.totalMoviesInDb}</p></div>
        <div className="bg-gray-800 p-4 rounded-lg"><p className="text-gray-400">Watchlist Items</p><p className="text-3xl font-bold">{stats.totalWatchlistItems}</p></div>
        <div className="bg-gray-800 p-4 rounded-lg"><p className="text-gray-400">Total Ratings</p><p className="text-3xl font-bold">{stats.totalRatings}</p></div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Users</h3>
        <ul className="space-y-2">
          {stats.recentUsers.map(user => (
            <li key={user._id} className="bg-gray-800 p-3 rounded flex justify-between">
              <span>{user.name} ({user.email})</span>
              <span className="text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;