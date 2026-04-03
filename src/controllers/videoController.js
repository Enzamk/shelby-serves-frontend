import Video from '../../models/Video.js';
import cloudinary from '../config/cloudinary.js';
import { inngest } from '../jobs/videoProcessing.js';

// 1. Get all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    
    // Generate thumbnails for videos that don't have them
    const videosWithThumbnails = videos.map(video => {
      if (!video.thumbnailUrl && video.cloudinaryPublicId) {
        const thumbnailUrl = cloudinary.url(video.cloudinaryPublicId, {
          resource_type: 'video',
          format: 'jpg',
          transformation: [
            { width: 400, height: 250, crop: 'fill' }
          ]
        });
        return { ...video.toObject(), thumbnailUrl };
      }
      return video;
    });
    
    res.json(videosWithThumbnails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get a single video by ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    
    // Generate thumbnail if it doesn't exist
    if (!video.thumbnailUrl && video.cloudinaryPublicId) {
      const thumbnailUrl = cloudinary.url(video.cloudinaryPublicId, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
          { width: 400, height: 250, crop: 'fill' }
        ]
      });
      video.thumbnailUrl = thumbnailUrl;
    }
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Stream URL
export const getStreamUrl = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ url: video.videoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Increment Views (The missing function!)
export const incrementViews = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Upload Video
export const uploadVideo = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { title } = req.body;
    const uploaderAddress = req.headers['x-uploader-address'];
    
    if (!req.file) {
      console.error('No video file uploaded');
      return res.status(400).json({ message: 'No video file uploaded' });
    }
    
    if (!title) {
      console.error('Title is required');
      return res.status(400).json({ message: 'Title is required' });
    }
    
    if (!uploaderAddress) {
      console.error('Wallet address is required');
      return res.status(403).json({ message: 'Wallet connection required. Please connect your Aptos wallet to upload videos.' });
    }

    console.log('Creating video document...');
    
    // Generate thumbnail URL using Cloudinary
    const thumbnailUrl = cloudinary.url(req.file.filename, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        { width: 400, height: 250, crop: 'fill' }
      ]
    });
    
    // Create new video document
    const video = new Video({
      title: title,
      videoUrl: req.file.path, // Cloudinary URL
      cloudinaryPublicId: req.file.filename, // Cloudinary public ID
      thumbnailUrl: thumbnailUrl,
      uploaderAddress: uploaderAddress,
      views: 0,
    });

    await video.save();
    console.log('Video saved successfully:', video);

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: video
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message || 'Failed to upload video' });
  }
};

// 6. Delete Video
export const deleteVideo = async (req, res) => {
  try {
    // Find video first to get Cloudinary public ID
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Delete from Cloudinary if public ID exists
    if (video.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
          resource_type: 'video'
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue with MongoDB deletion even if Cloudinary fails
      }
    }
    
    // Delete from MongoDB
    await Video.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete video' });
  }
};

// 7. Update Video (Extra safety)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
