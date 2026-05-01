import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Demographics from './pages/Demographics';
import SIAS from './pages/SIAS';
import LDQ from './pages/LDQ';
import SpeechTask from './pages/SpeechTask';
import TextTask from './pages/TextTask';
import Results from './pages/Results';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demographics" element={<Demographics />} />
        <Route path="/sias" element={<SIAS />} />
        <Route path="/ldq" element={<LDQ />} />
        <Route path="/speech" element={<SpeechTask />} />
        <Route path="/text" element={<TextTask />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}