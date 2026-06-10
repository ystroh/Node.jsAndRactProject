import { Product } from '../types'

const API_BASE = '/api'

async function handleRes(res: Response) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

// Get items by ownerId -> GET /api/items/user/:userId
export async function getProductsByOwner(ownerId: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/items/user/${encodeURIComponent(ownerId)}`)
  const data = await handleRes(res)
  // normalize Mongoose _id -> id for client usage
  return (Array.isArray(data) ? data : []).map((it: any) => {
    const owner = it?.ownerId
    const normalizedOwnerId = owner && typeof owner === 'object' ? (owner.id ?? owner._id) : owner
    return ({ ...(it || {}), id: it.id ?? it._id, ownerId: normalizedOwnerId })
  })
}

// Create item -> POST /api/items
export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await handleRes(res)
  const item = data?.item ?? data
  return { ...(item || {}), id: item.id ?? item._id }
}

// Update item -> PATCH /api/items/:id
export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await handleRes(res)
  const item = data?.item ?? data
  return { ...(item || {}), id: item.id ?? item._id }
}

// Delete item -> DELETE /api/items/:id
export async function deleteProduct(id: string): Promise<{ success?: boolean }> {
  const res = await fetch(`${API_BASE}/items/${id}`, { method: 'DELETE' })
  return handleRes(res)
}

// Approve a request -> PUT /api/requests/:requestId/approve with body { isApproved: boolean }
export async function approveRequest(productId: string, requestId: string, isApproved:boolean): Promise<any> {
  const res = await fetch(`${API_BASE}/requests/${encodeURIComponent(requestId)}/approve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isApproved}),
  })
  return handleRes(res)
}

// Get all products (for the catalog) -> GET /api/items
export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/items`);
  const data = await handleRes(res);
  return (Array.isArray(data) ? data : []).map((it: any) => {
    const owner = it?.ownerId
    const normalizedOwnerId = owner && typeof owner === 'object' ? (owner.id ?? owner._id) : owner
    return { ...(it || {}), id: it.id ?? it._id, ownerId: normalizedOwnerId }
  });
}

// Get single product by id -> GET /api/items/:id
export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/items/${encodeURIComponent(id)}`)
  const data = await handleRes(res)
  const it = data as any
  const owner = it?.ownerId
  const normalizedOwnerId = owner && typeof owner === 'object' ? (owner.id ?? owner._id) : owner
  return { ...(it || {}), id: it.id ?? it._id, ownerId: normalizedOwnerId }
}


