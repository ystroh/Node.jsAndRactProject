import React from 'react'
import { Product } from '../../types'

type Props = {
  product: Product
  onEdit: (p: Product) => void
  onDelete: (id: string) => void
  onApproveRequest: (productId: string, requestId: string, isApproved: boolean) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onApproveRequest }: Props) {
  const pendingRequest = product.requests?.find((r) => r.status === 'pending')
  const requesterRaw = pendingRequest?.requesterId
  const requesterName = requesterRaw && typeof requesterRaw === 'object' ? (requesterRaw.name || requesterRaw.email || requesterRaw._id || requesterRaw.id) : (requesterRaw || '')

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, marginBottom: 12 }}>
      <h3>{product.title}</h3>
      {product.status === 'archived' && (
        <div style={{ color: 'white', background: '#d9534f', display: 'inline-block', padding: '4px 8px', borderRadius: 4, marginLeft: 8 }}>הפריט אינו זמין</div>
      )}
      {product.description && <p>{product.description}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onEdit(product)}>Edit</button>
        <button onClick={() => { if (confirm('Delete product?')) onDelete(product.id || (product as any)._id) }}>Delete</button>
        {pendingRequest && (
          <div style={{ marginTop: 8 }}>
            <span>Request from: {requesterName} </span>
            <button
              onClick={() => onApproveRequest(product.id || (product as any)._id, (pendingRequest as any)._id || (pendingRequest as any).id, true)}
              style={{ backgroundColor: 'green', color: 'white' }}
            >
              Approve
            </button>
            <button
              onClick={() => onApproveRequest(product.id || (product as any)._id, (pendingRequest as any)._id || (pendingRequest as any).id, false)}
              style={{ backgroundColor: 'red', color: 'white' }}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
