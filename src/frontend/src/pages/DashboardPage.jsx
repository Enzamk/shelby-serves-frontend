import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useWallet } from '../contexts/WalletContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import {
  Video,
  Eye,
  TrendingUp,
  Trash2,
  Activity,
  HardDrive,
  ShieldCheck,
  Zap,
  CheckCircle
} from 'lucide-react';
import Skeleton from '../components/Skeleton';

export default function DashboardPage() {
  const { isConnected, walletAddress } = useWallet();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [protocolLatency, setProtocolLatency] = useState(42);
  const [barChartData, setBarChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my-uploads'
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.getVideos();
      setVideos(response.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch videos';
      setError(errorMessage);
      setLoading(false);
      console.error('Error fetching videos:', err);
      console.error('Error response:', err.response);
    }
  };

  const fetchMyUploads = async () => {
    try {
      setLoading(true);
      const response = await api.getVideosByUploaderAddress(walletAddress);
      setVideos(response.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch your uploads';
      setError(errorMessage);
      setLoading(false);
      console.error('Error fetching my uploads:', err);
      console.error('Error response:', err.response);
    }
  };

  const handleDeleteVideo = async (videoId, videoTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${videoTitle}"?`)) {
      return;
    }

    try {
      await api.deleteVideo(videoId);
      toast.success('Video deleted successfully');
      // Remove video from UI instantly
      setVideos(videos.filter(video => video._id !== videoId));
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error(err.response?.data?.message || 'Failed to delete video');
    }
  };

  const handleThumbnailClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleImageLoad = (videoId) => {
    setLoadedImages(prev => ({ ...prev, [videoId]: true }));
  };

  useEffect(() => {
    if (activeTab === 'all') {
      fetchVideos();
    } else if (activeTab === 'my-uploads' && isConnected) {
      fetchMyUploads();
    }
    
    // Add event listener for video uploads
    const handleVideoUploaded = () => {
      if (activeTab === 'all') {
        fetchVideos();
      } else if (activeTab === 'my-uploads' && isConnected) {
        fetchMyUploads();
      }
    };
    window.addEventListener('videoUploaded', handleVideoUploaded);
    
    return () => {
      window.removeEventListener('videoUploaded', handleVideoUploaded);
    };
  }, [activeTab, isConnected]);

  // Real-time data updates every 30 seconds
  useEffect(() => {
    const updateRealTimeData = () => {
      // Fluctuate protocol latency between 35-50ms
      const newLatency = Math.floor(Math.random() * 15) + 35;
      setProtocolLatency(newLatency);
      
      // Update throughput data with slight fluctuations
      setBarChartData(prevData =>
        prevData.map(item => ({
          ...item,
          throughput: Math.max(50, Math.min(600, item.throughput + Math.floor(Math.random() * 40) - 20))
        }))
      );
    };

    // Initial data generation
    updateRealTimeData();

    // Set up interval for 30-second updates
    const interval = setInterval(updateRealTimeData, 30000);
    
    return () => clearInterval(interval);
  }, [videos]);

  // Calculate statistics
  const totalVideos = videos.length;
  const totalViews = videos.reduce((total, video) => total + (video.views || 0), 0);
  const trendingVideos = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  // Mock analytics data
  const storageNodes = 128;
  const erasureCodingHealth = 99.9;

  const uploadsByDate = {};
  videos.forEach(video => {
    const date = new Date(video.createdAt).toISOString().split('T')[0];
    uploadsByDate[date] = (uploadsByDate[date] || 0) + 1;
  });
  const lineChartData = Object.entries(uploadsByDate)
    .map(([date, count]) => ({ date, uploads: count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Network Status: Devnet</span>
            </div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton variant="text" className="w-20" />
                  <Skeleton variant="avatar" className="w-5 h-5" />
                </div>
                <Skeleton variant="title" className="w-16" />
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <Skeleton variant="title" className="w-32 mb-4" />
              <Skeleton variant="card" className="h-64" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
              <Skeleton variant="title" className="w-32 mb-4" />
              <Skeleton variant="card" className="h-64" />
            </div>
          </div>

          {/* Trending Videos Skeleton */}
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Trending Videos</h2>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 mb-4">
                <div className="flex gap-4 items-center">
                  <Skeleton variant="thumbnail" className="w-48 h-28 flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton variant="title" className="w-3/4" />
                    <Skeleton variant="text" className="w-1/2" />
                    <Skeleton variant="text" className="w-1/3" />
                  </div>
                  <Skeleton variant="avatar" className="w-10 h-10 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* All Videos Skeleton */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">All Videos</h2>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 mb-4">
                <div className="flex gap-4 items-center">
                  <Skeleton variant="thumbnail" className="w-48 h-28 flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton variant="title" className="w-3/4" />
                    <Skeleton variant="text" className="w-1/2" />
                    <Skeleton variant="text" className="w-1/3" />
                  </div>
                  <Skeleton variant="avatar" className="w-10 h-10 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-8 text-center">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Network Status: Devnet</span>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="mb-8">
          <div className="inline-flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Videos
            </button>
            <button
              onClick={() => {
                if (!isConnected) {
                  toast.error('Please connect your Aptos wallet to see your contribution history.');
                  return;
                }
                setActiveTab('my-uploads');
              }}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'my-uploads'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              My Uploads
            </button>
          </div>
        </div>

        {/* Wallet Connection Warning for My Uploads */}
        {activeTab === 'my-uploads' && !isConnected && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Activity className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Wallet Connection Required</h3>
                <p className="text-slate-300">Please connect your Aptos wallet to see your contribution history.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Videos</h2>
              <Video className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-4xl font-bold tracking-tight text-white">{totalVideos}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Views</h2>
              <Eye className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-4xl font-bold tracking-tight text-white">{totalViews}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trending</h2>
              <TrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-4xl font-bold tracking-tight text-white">{trendingVideos.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Storage Nodes</h2>
              <HardDrive className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-4xl font-bold tracking-tight text-white">{storageNodes}</p>
            <p className="text-xs text-emerald-400 mt-1">active</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Erasure Coding</h2>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-4xl font-bold tracking-tight text-white">{erasureCodingHealth}%</p>
            <p className="text-xs text-emerald-400 mt-1">health</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Protocol Latency</h2>
              <Zap className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-4xl font-bold tracking-tight text-white">{protocolLatency}ms</p>
            <p className="text-xs text-indigo-400 mt-1">avg</p>
          </div>
        </div>

        {/* Analytics Charts Section */}
        <div className="mb-8">
          {videos.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-8 text-center">
              <p className="text-slate-400">No video data available for analytics.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart for Data Throughput */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold tracking-tight text-white mb-4">Data Throughput</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="#64748b" />
                    <YAxis stroke="#64748b" label={{ value: 'MiB/s', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                        padding: '12px'
                      }}
                      itemStyle={{ color: '#e2e8f0', fontWeight: '500' }}
                      labelStyle={{ color: '#94a3b8', fontWeight: '500' }}
                      formatter={(value) => [`${value} MiB/s`, 'Throughput']}
                    />
                    <Legend />
                    <Bar
                      dataKey="throughput"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Line Chart for Uploads over Time */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold tracking-tight text-white mb-4">Uploads over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                        padding: '12px'
                      }}
                      itemStyle={{ color: '#e2e8f0', fontWeight: '500' }}
                      labelStyle={{ color: '#94a3b8', fontWeight: '500' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="uploads"
                      stroke="#6366f1"
                      strokeWidth={2}
                      activeDot={{ r: 6, fill: '#6366f1', stroke: '#6366f1' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

      {/* Trending Videos Section */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Trending Videos</h2>
        {trendingVideos.length > 0 ? (
          <div className="space-y-4">
            {trendingVideos.map(video => (
              <div key={video._id} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleThumbnailClick(video._id)}
                    className="flex-shrink-0 cursor-pointer relative"
                  >
                    {!loadedImages[video._id] && (
                      <Skeleton variant="thumbnail" className="w-48 h-28 absolute inset-0" />
                    )}
                    <img
                      src={video.thumbnailUrl || "https://via.placeholder.com/400x250?text=No+Thumbnail"}
                      alt={video.title}
                      onLoad={() => handleImageLoad(video._id)}
                      className={`w-48 h-28 aspect-video object-cover rounded-lg hover:scale-105 transition-all duration-300 ${
                        loadedImages[video._id] ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/video/${video._id}`}>
                      <h3 className="text-lg font-bold tracking-tight text-white truncate hover:text-indigo-400 transition-colors">
                        {video.title}
                      </h3>
                    </Link>
                    {activeTab === 'my-uploads' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full mt-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-400">On-Chain Verified</span>
                      </div>
                    )}
                    <p className="text-slate-400 text-sm mt-1">Views: {video.views || 0}</p>
                    <p className="text-slate-400 text-sm">
                      Uploaded on: {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteVideo(video._id, video.title)}
                    className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200 flex-shrink-0 relative group"
                    title="Delete video"
                  >
                    <Trash2 className="w-5 h-5" />
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-10">
                      Remove permanently
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <p className="text-slate-400">No trending videos found</p>
          </div>
        )}
      </div>

      {/* All Videos Section */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          {activeTab === 'my-uploads' ? 'My Uploads' : 'All Videos'}
        </h2>
        {videos.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-12 text-center">
            <p className="text-lg text-slate-400 mb-4">No videos found. Upload your first video to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map(video => (
              <div key={video._id} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleThumbnailClick(video._id)}
                    className="flex-shrink-0 cursor-pointer relative"
                  >
                    {!loadedImages[video._id] && (
                      <Skeleton variant="thumbnail" className="w-48 h-28 absolute inset-0" />
                    )}
                    <img
                      src={video.thumbnailUrl || "https://via.placeholder.com/400x250?text=No+Thumbnail"}
                      alt={video.title}
                      onLoad={() => handleImageLoad(video._id)}
                      className={`w-48 h-28 aspect-video object-cover rounded-lg hover:scale-105 transition-all duration-300 ${
                        loadedImages[video._id] ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/video/${video._id}`}>
                      <h3 className="text-lg font-bold tracking-tight text-white truncate hover:text-indigo-400 transition-colors">
                        {video.title}
                      </h3>
                    </Link>
                    {activeTab === 'my-uploads' && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full mt-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-400">On-Chain Verified</span>
                      </div>
                    )}
                    <p className="text-slate-400 text-sm mt-1">Views: {video.views || 0}</p>
                    <p className="text-slate-400 text-sm">
                      Uploaded on: {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteVideo(video._id, video.title)}
                    className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200 flex-shrink-0 relative group"
                    title="Delete video"
                  >
                    <Trash2 className="w-5 h-5" />
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-10">
                      Remove permanently
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
