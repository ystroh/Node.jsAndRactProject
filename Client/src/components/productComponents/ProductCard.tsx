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
    <div className="card product-card">
      <div className="product-card__media">תמונה</div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <h3 className="product-card__title">{product.title}</h3>
          {product.status === 'archived' && (
            <div className="tag" style={{ background: 'linear-gradient(90deg,#ff7b7b,#ff6b6b)', color: '#04141b' }}>הפריט אינו זמין</div>
          )}
        </div>
        {product.description && <p className="muted-small">{product.description}</p>}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button className="btn btn--ghost" onClick={() => onEdit(product)}>ערוך</button>
          <button className="btn btn--ghost" onClick={() => { if (confirm('להסיר פריט זה?')) onDelete(product.id || (product as any)._id) }}>מחק</button>
          {pendingRequest && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="muted-small">בקשה מ: {requesterName}</span>
              <button
                className="btn btn--primary"
                onClick={() => onApproveRequest(product.id || (product as any)._id, (pendingRequest as any)._id || (pendingRequest as any).id, true)}
              >
                אישור
              </button>
              <button
                className="btn btn--danger"
                onClick={() => onApproveRequest(product.id || (product as any)._id, (pendingRequest as any)._id || (pendingRequest as any).id, false)}
              >
                דחייה
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
