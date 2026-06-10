import { Navigate } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';

export const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  
  // בדיקה אם יש למשתמש לפחות תפקיד אחד מורשה
  const hasAccess = userRoles.some((role: string) => allowedRoles.includes(role));

  if (!localStorage.getItem('token')) {
    return <Navigate to="/" replace />; // אם לא מחובר בכלל
  }

  if (!hasAccess) {
    return <Navigate to="/home" replace />; // אם מחובר אבל אין הרשאה - מחזירים לבית
  }

  return children;
};