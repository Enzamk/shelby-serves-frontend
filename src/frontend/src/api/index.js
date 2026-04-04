import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'https://shelby-serves-backend.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second default timeout
});

console.log("Current Backend API URL:", BASE_URL);

export default {
  // Video endpoints
  uploadVideo: (formData, uploaderAddress) => api.post('/api/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Uploader-Address': uploaderAddress
    },
    timeout: 120000 // 2 minutes for upload (Render free tier can take time to wake up)
  }),
  getVideos: () => api.get('/api/videos'),
  getVideosByUploaderAddress: (address) => api.get(`/api/videos/user/${address}`),
  getUserVideos: (address) => api.get(`/api/videos/user/${address}`),
  getVideo: (id) => api.get(`/api/videos/${id}`),
  getStreamUrl: (id) => api.get(`/api/stream/${id}`),
  incrementViews: (id) => api.post(`/api/videos/${id}/view`),
  incrementViewById: (id) => api.post(`/api/videos/view/${id}`),
  deleteVideo: (id) => api.delete(`/api/videos/${id}`)
};
