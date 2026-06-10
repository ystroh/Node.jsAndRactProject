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
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>התחברות</h2>
        <input type="email" placeholder="אימייל" style={styles.input} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="סיסמה" style={styles.input} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={styles.button}>התחבר</button>
      </form>
    </div>
  );
};

const styles: any = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', direction: 'rtl' },
  card: { padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '350px' },
  input: { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }
};