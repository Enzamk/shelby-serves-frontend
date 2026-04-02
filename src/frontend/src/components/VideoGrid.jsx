import React, { useState, useEffect } from 'react';
import api from '../api';
import { Eye, Calendar } from 'lucide-react';

export default function VideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.getVideos();
      setVideos(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch videos');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-slate-500 text-lg">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-slate-400 text-6xl mb-4">📹</div>
        <div className="text-slate-600 text-lg">No videos found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <div
          key={video._id}
          className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
        >
          <div className="aspect-video bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
            <video
              src={video.url}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              controls
              preload="metadata"
            />
          </div>
          <div className="p-5">
            <h3
              className="font-semibold text-slate-900 dark:text-white truncate mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
              title={video.title}
            >
              {video.title}
            </h3>
            {video.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4" title={video.description}>
                {video.description}
              </p>
            )}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{video.views.toLocaleString()} views</span>
              </div>
              {video.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
