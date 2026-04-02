import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Upload, Eye, Video as VideoIcon, Calendar } from 'lucide-react';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-slate-500 text-lg">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-8 text-center">
          <div className="text-red-500 font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Videos</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your uploaded videos</p>
          </div>
          <button
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Upload className="w-5 h-5" />
            Upload Video
          </button>
        </div>

        {/* Main Content */}
        {videos.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-16 text-center">
            <VideoIcon className="w-20 h-20 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">No videos yet</h3>
            <p className="text-slate-600 mb-8">Upload your first video to get started</p>
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Upload className="w-5 h-5" />
              Upload Your First Video
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-slate-200/60 text-sm font-semibold text-slate-700">
              <div className="col-span-6">Video</div>
              <div className="col-span-3">Views</div>
              <div className="col-span-3">Uploaded</div>
            </div>

            {/* Video List */}
            <div className="divide-y divide-slate-200/60">
              {videos.map((video) => (
                <div
                  key={video._id}
                  onClick={() => handleVideoClick(video._id)}
                  className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                >
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="w-36 h-24 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                      <video
                        src={video.url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold tracking-tight text-slate-900 truncate group-hover:text-indigo-600 transition-colors" title={video.title}>
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-slate-600 truncate mt-1" title={video.description}>
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center gap-2 text-slate-600">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{video.views.toLocaleString()}</span>
                  </div>
                  <div className="col-span-3 flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
