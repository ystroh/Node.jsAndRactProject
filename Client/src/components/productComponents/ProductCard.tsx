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

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, marginBottom: 12 }}>
      <h3>{product.title}</h3>
      {product.description && <p>{product.description}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onEdit(product)}>Edit</button>
        <button onClick={() => { if (confirm('Delete product?')) onDelete(product.id) }}>Delete</button>
        {pendingRequest && (
          <div style={{ marginTop: 8 }}>
            <span>Request from: {pendingRequest.requesterId} </span>
            <button
              onClick={() => onApproveRequest(product.id, pendingRequest.id, true)}
              style={{ backgroundColor: 'green', color: 'white' }}
            >
              Approve
            </button>
            <button
              onClick={() => onApproveRequest(product.id, pendingRequest.id, false)}
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
