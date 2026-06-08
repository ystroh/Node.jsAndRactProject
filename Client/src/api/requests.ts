const API_BASE = '/api';

export async function createRequest(payload: { itemId: string; message: string }) {
  const requesterId = getUserId();
  
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-id': requesterId || '' // העברה ב-Header במקום ב-Body
    },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

const getUserId = () =>  localStorage.getItem('ownerId');

export async function getMyRequests() {
  const requesterId = getUserId(); // הערך מ-localStorage
  
  const res = await fetch(`${API_BASE}/requests`, {
    headers: {
      'x-user-id': requesterId || '' // העברה מאובטחת ב-Header
    }
  });
  return handleRes(res);
}
// נשאיר כאן את ה-handleRes או נייבא אותו מקובץ משותף
async function handleRes(res: Response) {
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return res.json();
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