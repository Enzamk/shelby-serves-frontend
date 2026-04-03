import dotenv from 'dotenv';
dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("Dotenv loaded?", process.env.MONGO_URI ? "Yes" : "No");

import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js';
import videoRoutes, { streamRouter } from './routes/videoRoutes.js';
import { Inngest } from "inngest";
import { serve } from "inngest/express.js";

// Connect to Database
connectDB();

const app = express();

// --- INNGEST SETUP (Merged here to fix the 'undefined' error) ---
const inngest = new Inngest({
  id: "shelby-serves",
  name: "Shelby Serves"
});

const processVideo = inngest.createFunction(
  { id: "process-video" },
  { event: "video/uploaded" },
  async ({ event, step }) => {
    console.log("Processing video:", event.data.videoId);
    return { success: true };
  }
);
// ---------------------------------------------------------------

// Middleware
app.use(cors({
  origin: ['https://shelby-serves-frontend.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Inngest Route
// app.use("/api/inngest", serve({
//   client: inngest,
//   functions: [processVideo]
// }));

// API Routes
app.use('/api/videos', videoRoutes);
app.use('/api/stream', streamRouter);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Force Build Update v2.0.
