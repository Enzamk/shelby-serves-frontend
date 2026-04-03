import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  url: { type: String },
  videoUrl: { type: String },
  cloudinaryPublicId: { type: String },
  thumbnailUrl: { type: String },
  uploaderAddress: { type: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
