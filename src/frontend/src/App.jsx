import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import Dashboard from '../../../pages/Dashboard';
import UploadPage from './pages/UploadPage';
import VideoPlayerPage from './pages/VideoPlayerPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<UploadPage />} />
        </Route>
        <Route path="/video/:id" element={<VideoPlayerPage />} />
      </Routes>
    </Router>
  );
}
