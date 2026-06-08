import React from 'react'
import { Product } from '../../types'
import ProductCard from './ProductCard'

type Props = {
  products: Product[]
  onEdit: (p: Product) => void
  onDelete: (id: string) => void
onApproveRequest: (productId: string, requestId: string, isApproved: boolean) => void; 
}

export default function ProductList({ products, onEdit, onDelete, onApproveRequest }: Props) {
  if (!products.length) return <div>No products yet.</div>
  return (
    <div>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onEdit={onEdit}
          onDelete={onDelete}
          onApproveRequest={onApproveRequest}
        />
      ))}
    </div>
  )
}
