import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../api';
import { useWallet } from '../contexts/WalletContext';
import { UploadCloud, FileVideo, CheckCircle, Hash, Loader2, Lock, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const { isConnected, walletAddress } = useWallet();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState(0);
  const [shelbyContentId, setShelbyContentId] = useState(null);

  const generateMockHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) return;
    
    // File size validation (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error(`File size exceeds 100MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      return;
    }
    
    setIsUploading(true);
    setUploadStage(0);
    setShelbyContentId(null);
    
    try {
      // Stage 1: Encoding for Shelby Network
      setUploadStage(1);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Stage 2: Distributing to 10+ storage shards
      setUploadStage(2);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Stage 3: Broadcasting to Aptos Indexer
      setUploadStage(3);
      
      // Health check ping to wake up Render instance (free tier spins down after inactivity)
      try {
        await api.getVideos(); // Simple GET request to wake up backend
      } catch (healthError) {
        console.log('Health check ping completed (backend may be waking up)');
      }
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('video', file);
      
      // Add longer timeout for upload (Render free tier can take time to wake up)
      const response = await api.uploadVideo(formData, walletAddress);
      console.log('Upload response:', response);
      
      // Generate mock Shelby Content ID
      const mockContentId = generateMockHash();
      setShelbyContentId(mockContentId);
      
      toast.success(
        () => (
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-white">Video uploaded successfully!</div>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <Hash className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-400">Shelby Content ID:</span>
                <span className="text-indigo-400 font-mono text-xs">{mockContentId}</span>
              </div>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
      
      // Trigger dashboard update
      window.dispatchEvent(new Event('videoUploaded'));
      setTitle('');
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Upload timeout. The backend is waking up (Render free tier). Please try again in 30 seconds.';
      } else if (error.response?.status === 413) {
        errorMessage = 'File too large. Maximum file size is 100MB.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Wallet connection required. Please connect your wallet to upload videos.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadStage(0);
    }
  };

  const uploadStages = [
    { id: 1, label: 'Encoding for Shelby Network...', icon: Loader2 },
    { id: 2, label: 'Distributing to 10+ storage shards...', icon: Loader2 },
    { id: 3, label: 'Broadcasting to Aptos Indexer...', icon: Loader2 },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Upload Video</h1>
      
      {/* Wallet Connection Required Alert */}
      {!isConnected && (
        <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Action Required</h3>
              <p className="text-slate-300 mb-4">Connect Aptos Wallet to access Shelby Storage sharding.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
              >
                <AlertCircle className="w-4 h-4" />
                Connect Wallet
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Video Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isConnected}
            className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all text-white placeholder-slate-500 ${
              !isConnected
                ? 'bg-slate-800/50 border border-slate-700/50 cursor-not-allowed opacity-50'
                : 'bg-slate-800 border border-slate-700 focus:ring-indigo-500'
            }`}
            placeholder="Enter video title..."
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Video File</label>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={!isConnected}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium ${
                !isConnected
                  ? 'bg-slate-800/50 border border-slate-700/50 cursor-not-allowed opacity-50 file:bg-slate-700/50 file:text-slate-500'
                  : 'bg-slate-800 border border-slate-700 focus:ring-indigo-500 file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 text-white'
              }`}
              required
            />
            <FileVideo className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>
          {file && (
            <p className="mt-2 text-sm text-slate-400">
              Selected: <span className="font-medium text-white">{file.name}</span>
            </p>
          )}
        </div>

        {/* Upload Progress Stages */}
        {isUploading && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              <span className="text-sm font-medium text-white">Processing upload...</span>
            </div>
            <div className="space-y-3">
              {uploadStages.map((stage, index) => {
                const StageIcon = stage.icon;
                const isCompleted = index < uploadStage - 1;
                const isCurrent = index === uploadStage - 1;
                const isPending = index > uploadStage - 1;
                
                return (
                  <div key={stage.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-emerald-500/20 border border-emerald-500/50' :
                      isCurrent ? 'bg-indigo-500/20 border border-indigo-500/50' :
                      'bg-slate-700 border border-slate-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <StageIcon className="w-4 h-4 text-indigo-400 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-500" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      isCompleted ? 'text-emerald-400' :
                      isCurrent ? 'text-white font-medium' :
                      'text-slate-500'
                    }`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isUploading || !isConnected}
          className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all ${
            !isConnected
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : isUploading
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              Upload Video
            </>
          )}
        </button>
      </form>
    </div>
  );
}