import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Video, Eye } from 'lucide-react';
import VideoGrid from '../frontend/src/components/VideoGrid';
import api from '../frontend/src/api';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.getVideos();
      setVideos(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalVideos = videos.length;
  const totalViews = videos.reduce((total, video) => total + (video.views || 0), 0);

  // Get top 10 videos by views
  const topVideos = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10)
    .map(video => ({
      name: video.title.length > 20 ? video.title.substring(0, 20) + '...' : video.title,
      views: video.views || 0
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-500 dark:text-slate-400 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Overview of your video content</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</span>
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{totalVideos}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Videos uploaded</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</span>
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{totalViews.toLocaleString()}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total views</p>
          </div>
        </div>

        {/* Top Videos Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Top Videos</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Most viewed videos</p>
            </div>
          </div>
          {topVideos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topVideos} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  stroke="#64748b"
                  className="dark:stroke-slate-400"
                />
                <YAxis stroke="#64748b" className="dark:stroke-slate-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ color: '#1e293b', fontWeight: '500' }}
                  labelStyle={{ color: '#64748b', fontWeight: '500' }}
                />
                <Legend />
                <Bar
                  dataKey="views"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">No video data available for analytics</p>
            </div>
          )}
        </div>

        {/* Video Grid */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">All Videos</h2>
          <VideoGrid />
        </div>
      </main>
    </div>
  );
}
