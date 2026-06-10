const API_BASE = '/api';
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();

  // בדיקה אם קיבלנו HTML (זה סימן לתקלה בשרת או נתיב שגוי)
  if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
    throw new Error('SERVER_ERROR');
  }

  const data = JSON.parse(text);

  if (!res.ok) {
    if (res.status === 404) {
      // משתמש לא נמצא
      throw new Error('USER_NOT_FOUND');
    }
    if (res.status >= 500) {
      throw new Error('SERVER_ERROR');
    }
    throw new Error(data.message || 'שגיאה בהתחברות');
  }

  return data;
}
export async function registerUser(userData: any) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const contentType = res.headers.get('content-type') || '';
  // אם החזרה היא JSON, נקרא כ-json, אחרת כטקסט רגיל
  if (contentType.includes('application/json')) {
    const payload = await res.json();
    if (!res.ok) {
      // זרוק אובייקט שמכיל הודעה ופירוט אם יש
      throw { message: payload.message || 'שגיאה ביצירת משתמש', details: payload.details };
    }
    return payload;
  } else {
    const text = await res.text();
    if (!res.ok) throw new Error(text || 'שגיאה ביצירת משתמש');
    return JSON.parse(text);
  }
}