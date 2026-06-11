import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', roles: ['receiver'] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // שליפת תפקידים מה-localStorage בצורה בטוחה
    const savedRoles = localStorage.getItem('userRoles');
    const userRoles = savedRoles ? JSON.parse(savedRoles) : [];
    const isAdmin = userRoles.includes('admin');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // client-side validation and normalization
            const name = String(formData.name || '').trim();
            const email = String(formData.email || '').trim().toLowerCase();
            const password = String(formData.password || '');
            const roles = Array.isArray(formData.roles) && formData.roles.length > 0 ? formData.roles : ['receiver'];

            if (name.length < 2) throw { message: 'השם חייב להכיל לפחות 2 תווים' };
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw { message: 'כתובת אימייל לא תקינה' };
            if (password.length < 6) throw { message: 'הסיסמה חייבת להכיל לפחות 6 תווים' };

            const payload = { name, email, password, roles };
            console.debug('Register payload:', payload);

            await registerUser(payload);
            alert('נרשמת בהצלחה! מעביר אותך לדף ההתחברות...');
            navigate('/');
        } catch (err: any) {
            console.error('Registration error:', err);
            // אם השרת החזיר אובייקט עם פירוט ולידציה
            if (err && typeof err === 'object') {
                const msg = err.message || 'אירעה שגיאה לא צפויה, אנא נסה שוב';
                if (err.details && Array.isArray(err.details)) {
                    // עצב מסר המבוסס על פרטי ולידציה
                    const detailMessages = err.details.map((d: any) => d.message || JSON.stringify(d)).join(' | ');
                    setError(`${msg}: ${detailMessages}`);
                } else {
                    setError(msg);
                }
            } else {
                setError(String(err) || 'אירעה שגיאה לא צפויה, אנא נסה שוב');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = (role: string) => {
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role]
        }));
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleRegister} className="auth-card animate-fade-up">
                <h2 className="auth-title">יצירת חשבון חדש</h2>
                
                <input className="form-input" type="text" placeholder="שם מלא" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <input className="form-input" type="email" placeholder="אימייל" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input className="form-input" type="password" placeholder="סיסמה" onChange={(e) => setFormData({...formData, password: e.target.value})} required />

                <div style={{ margin: '12px 0' }}>
                    <div className="muted-small">בחר תפקיד:</div>
                    <div style={{ marginTop: '10px', display:'flex', gap:12 }}>
                        <label className="tag"><input type="checkbox" checked={formData.roles.includes('giver')} onChange={() => toggleRole('giver')} /> &nbsp;מוסר</label>
                        <label className="tag"><input type="checkbox" checked={formData.roles.includes('receiver')} onChange={() => toggleRole('receiver')} /> &nbsp;מקבל</label>
                        {isAdmin && (
                            <label className="tag"><input type="checkbox" checked={formData.roles.includes('admin')} onChange={() => toggleRole('admin')} /> &nbsp;מנהל</label>
                        )}
                    </div>
                </div>

                {error && <p style={{ color: '#ff6b6b', fontSize: '14px' }}>{error}</p>}
                
                <div className="form-actions">
                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? 'רושם...' : 'הירשם'}
                    </button>
                    <div className="muted-small">כבר רשום? <a href="/">התחבר</a></div>
                </div>
            </form>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', direction: 'rtl' },
    card: { padding: '40px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', width: '350px' },
    input: { width: '100%', padding: '14px', margin: '10px 0', borderRadius: '10px', border: '1px solid #e1e1e1', boxSizing: 'border-box' },
    button: { width: '100%', padding: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '15px' }
};