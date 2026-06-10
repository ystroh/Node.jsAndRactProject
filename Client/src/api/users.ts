const API_BASE = '/api'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    headers: {
      'Content-Type': 'application/json' ,
      ...getAuthHeaders()
    } as any
  })
  if (!res.ok) throw new Error(await res.text() || res.statusText)
  return res.json()
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }as any
  })
  if (!res.ok) throw new Error(await res.text() || res.statusText)
  return res.json()
}

export async function createUser(payload: { name: string; email: string; password: string; roles: string[] }) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }as any,
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await res.text() || res.statusText)
  return res.json()
}

export async function updateUser(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }as any,
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await res.text() || res.statusText)
  return res.json()
}

export default { getUsers, deleteUser }
