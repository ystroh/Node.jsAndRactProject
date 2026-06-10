import { Routes, Route } from 'react-router-dom';
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import GiverDashboardPage from "../pages/GiverDashboard";

import ReceiverDashboard from "../pages/ReceiverDashboard";
import ReceiverRequestsPage from "../pages/ReceiverRequests";
import { HomePage } from '../pages/HomePage';
import { ProtectedRoute } from './ProtactedRoute';
import AdminDashboard from "../pages/AdminDashboard";



export const AppRouter = () => {
  return (<Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/home" element={<HomePage />} />


    <Route path="/giver" element={
      <ProtectedRoute allowedRoles={['giver', 'admin']}>
        <GiverDashboardPage />
      </ProtectedRoute>
    } />

    <Route path="/receiver" element={
      <ProtectedRoute allowedRoles={['receiver', 'admin']}>
        <ReceiverDashboard />
      </ProtectedRoute>
    } />

    <Route path="/receiver/requests" element={
      <ProtectedRoute allowedRoles={['receiver', 'admin']}>
        <ReceiverRequestsPage />
      </ProtectedRoute>
    } />

    <Route path="/admin" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    } />
  </Routes>
  );
};