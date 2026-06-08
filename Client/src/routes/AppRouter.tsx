import { Routes, Route } from 'react-router-dom';
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { GiverDashboard } from "../pages/GiverDashboard";
import { ReceiverDashboard } from "../pages/ReceiverDashboard";
import { AdminDashboard } from "../pages/AdminDashboard";



export const AppRouter = () => {
  return ( <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />  
      {/* דפים מוגנים */}
      <Route path="/giver" element={<GiverDashboard />} />
      <Route path="/receiver" element={<ReceiverDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};