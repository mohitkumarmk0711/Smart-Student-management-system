import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Assignments from './pages/Assignments';
import Marks from './pages/Marks';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <ProtectedRoute>
            <Assignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/marks"
        element={
          <ProtectedRoute>
            <Marks />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
