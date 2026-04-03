import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import VideosPage from './pages/VideosPage';
import UploadPage from './pages/UploadPage';
import VideoPlayerPage from './pages/VideoPlayerPage';

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="upload" element={<UploadPage />} />
          </Route>
          <Route path="/video/:id" element={<VideoPlayerPage />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}
