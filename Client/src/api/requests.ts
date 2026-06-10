const API_BASE = '/api';

export async function createRequest(payload: { itemId: string; message: string }) {
  const requesterId = getUserId();

  // include requesterId in body (server validation expects it) and also set header
  const body = { ...payload, requesterId } as any;

  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': requesterId || ''
    },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

const getUserId = () => localStorage.getItem('ownerId');

export async function getMyRequests() {
  const requesterId = getUserId(); // הערך מ-localStorage

  const res = await fetch(`${API_BASE}/requests`, {
    headers: {
      'x-user-id': requesterId || '' // העברה מאובטחת ב-Header
    }
  });
  return handleRes(res);
}

export async function getAllRequests() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/requests/all`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('AUTH_EXPIRED');
  }
  return handleRes(res);

}

// נשאיר כאן את ה-handleRes או נייבא אותו מקובץ משותף
async function handleRes(res: Response) {
  // 1. אם הכל תקין, נחזיר את ה-JSON
  if (res.ok) {
    return await res.json();
  }

  // 2. אם יש שגיאה, ננסה להוציא הודעה מפורטת מהשרת
  let errorMessage;
  try {
    const errorData = await res.json(); // רוב השרתים מחזירים JSON גם בשגיאות
    errorMessage = errorData.message || errorData.error || res.statusText;
  } catch {
    // אם השרת לא החזיר JSON (למשל תקלה גנרית של השרת), נקרא כטקסט
    errorMessage = await res.text() || res.statusText;
  }

  throw new Error(errorMessage);
}

export async function deleteRequest(requestId: string) {
  const requesterId = getUserId();

  const res = await fetch(`${API_BASE}/requests/${requestId}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': requesterId || '' // גם כאן נדרש ה-ID כדי לוודא הרשאה
    }
  });

  return handleRes(res);
}

export async function getRequestsForOwner() {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/requests/owner`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('AUTH_EXPIRED');
  }
  return handleRes(res);
}