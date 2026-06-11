import { useNavigate } from 'react-router-dom';
import hero from '../../image/10_26.jpg'

export const HomePage = () => {
  const navigate = useNavigate();
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const userName = localStorage.getItem('userName') || ''

  return (
    <div style={{ marginTop: '0px' }}>
      <div className="home-welcome">
        <img className="welcome-image" src={hero} alt="hero" />

        <div className="welcome-text">
          <div className="welcome-content">
            <h1 className="welcome-title">{`ברוך הבא ${userName ? userName : ''}`}</h1>
            <p className="welcome-sub">באיזה תפקיד תרצה לפעול כעת?</p>

            <div className="welcome-actions" style={{ marginTop: 18, display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
            {userRoles.includes('giver') && (
              <button className="btn btn--primary role-btn" onClick={() => navigate('/giver')}>אני רוצה למסור</button>
            )}
            {userRoles.includes('receiver') && (
              <button className="btn btn--ghost role-btn role-btn--ghost" onClick={() => navigate('/receiver')}>אני רוצה לקבל</button>
            )}
            {userRoles.includes('admin') && (
              <button className="btn btn--ghost role-btn role-btn--ghost" onClick={() => navigate('/admin')}>פאנל ניהול</button>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};