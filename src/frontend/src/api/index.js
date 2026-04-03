import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export default {
  // Video endpoints
  uploadVideo: (formData, uploaderAddress) => api.post('/api/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Uploader-Address': uploaderAddress
    }
  }),
  getVideos: () => api.get('/api/videos'),
  getVideosByUploaderAddress: (address) => api.get(`/api/videos/user/${address}`),
  getVideo: (id) => api.get(`/api/videos/${id}`),
  getStreamUrl: (id) => api.get(`/api/stream/${id}`),
  incrementViews: (id) => api.post(`/api/videos/${id}/view`),
  incrementViewById: (id) => api.post(`/api/videos/view/${id}`),
  deleteVideo: (id) => api.delete(`/api/videos/${id}`)
};
