import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import {
  getVideos,
  getVideosByUploaderAddress,
  getVideoById,
  getStreamUrl,
  incrementViews,
  uploadVideo,
  deleteVideo
} from '../controllers/videoController.js';

const router = express.Router();

// Configure Multer with Cloudinary storage and increased file size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

router.get('/', getVideos);
router.get('/user/:address', getVideosByUploaderAddress);
router.post('/upload', upload.single('video'), uploadVideo);
router.get('/:id', getVideoById);
router.get('/:id/stream', getStreamUrl);
router.post('/:id/view', incrementViews);
router.post('/view/:id', incrementViews);
router.delete('/:id', deleteVideo);

export default router;

// Export stream router for /api/stream/:id route
export const streamRouter = express.Router();
streamRouter.get('/:id', getStreamUrl);
