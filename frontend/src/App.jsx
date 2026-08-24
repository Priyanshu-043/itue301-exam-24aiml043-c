import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ClassesPage from './pages/ClassesPage';
import MyBookingsPage from './pages/MyBookingsPage';

const AdminPanel = lazy(() => import('./pages/AdminPanel'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="status">Loading admin panel...</div>}>
                <AdminPanel />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
