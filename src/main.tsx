import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/study/react" replace />} />
        <Route path="/study/:categoryId" element={<App />} />
        <Route path="*" element={<Navigate to="/study/react" replace />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>,
);
