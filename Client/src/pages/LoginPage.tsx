import React, { useState, useEffect } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom'; // אם את משתמשת ב-React Router

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // אם המשתמש כבר מחובר - ננתב אותו לדף הבית
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(''); // איפוס שגיאות קודמות

  try {
    const { user, token } = await loginUser(email, password);
    
    localStorage.setItem('ownerId', user._id);
    localStorage.setItem('token', token);
    localStorage.setItem('userRoles', JSON.stringify(user.roles));
    // store user name for greetings
    if (user.name) localStorage.setItem('userName', user.name);
    
    navigate('/home');
  } catch (err: any) {
    console.error('Login failed:', err?.message || err);

    const msg = String(err?.message || err || 'שגיאה בהתחברות');

    // במקרה של משתמש לא קיים או ולידציה (נתונים לא תקינים) - להציע לעבור לרישום
    if (
      msg === 'USER_NOT_FOUND' ||
      msg.includes('not found') ||
      msg.includes('משתמש') ||
      msg.includes('נתונים לא תקינים')
    ) {
      if (window.confirm('לא נמצא משתמש עם פרטים אלו. האם לעבור לדף הרישום?')) {
        navigate('/register');
      }
      return;
    }

    if (msg === 'SERVER_ERROR' || msg.includes('שגיאת שרת') || msg.includes('Server')) {
      setError('שגיאה בשרת, נסה שנית');
      return;
    }

    // כל שאר השגיאות (סיסמה שגויה, הודעות שרת ספציפיות וכו')
    setError(msg);
  }
};

  return (
    <div className="auth-page">
      <form onSubmit={handleLogin} className="auth-card animate-fade-up">
        <h2 className="auth-title">התחברות</h2>
        <input className="form-input" type="email" placeholder="אימייל" onChange={(e) => setEmail(e.target.value)} required />
        <input className="form-input" type="password" placeholder="סיסמה" onChange={(e) => setPassword(e.target.value)} required />
        {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">התחבר</button>
          <div className="muted-small">אין לך חשבון? <a href="/register">הירשם</a></div>
        </div>
      </form>
    </div>
  );
};
 