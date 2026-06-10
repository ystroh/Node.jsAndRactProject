import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>ברוך הבא!</h1>
      <p>באיזה תפקיד תרצה לפעול כעת?</p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {userRoles.includes('giver') && (
          <button onClick={() => navigate('/giver')}>אני רוצה למסור</button>
        )}
        {userRoles.includes('receiver') && (
          <button onClick={() => navigate('/receiver')}>אני רוצה לקבל</button>
        )}
        {userRoles.includes('admin') && (
          <button onClick={() => navigate('/admin')}>פאנל ניהול</button>
        )}
      </div>
    </div>
  );
};