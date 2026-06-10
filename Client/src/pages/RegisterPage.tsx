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
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.card}>
                <h2 style={{ textAlign: 'center' }}>יצירת חשבון חדש</h2>
                
                <input type="text" placeholder="שם מלא" style={styles.input} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="אימייל" style={styles.input} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="סיסמה" style={styles.input} onChange={(e) => setFormData({...formData, password: e.target.value})} required />

                <div style={{ margin: '15px 0' }}>
                    <label>בחר תפקיד:</label>
                    <div style={{ marginTop: '10px' }}>
                        <label><input type="checkbox" checked={formData.roles.includes('giver')} onChange={() => toggleRole('giver')} /> מוסר</label>
                        <label style={{ margin: '0 10px' }}><input type="checkbox" checked={formData.roles.includes('receiver')} onChange={() => toggleRole('receiver')} /> מקבל</label>
                        {isAdmin && (
                            <label><input type="checkbox" checked={formData.roles.includes('admin')} onChange={() => toggleRole('admin')} /> מנהל</label>
                        )}
                    </div>
                </div>

                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'רושם...' : 'הירשם'}
                </button>
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