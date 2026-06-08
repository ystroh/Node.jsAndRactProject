import React, { useState, useMemo } from 'react'
import { ProductProvider, useProducts } from '../context/ProductContext'
import ProductList from '../components/productComponents/ProductList'
import ProductForm from '../components/productComponents/ProductForm'
import { Product } from '../types'

function Inner() {
  const { products, loading, error, reload, createProduct, updateProduct, deleteProduct, approveRequest } = useProducts()
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  const myProducts = useMemo(() => {
    const ownerId = localStorage.getItem('ownerId') || localStorage.getItem('userId');
    return products.filter((p) => p.ownerId === ownerId);
  }, [products]); // יתעדכן בכל פעם שרשימת ה-products המלאה משתנה

  async function handleSave(payload: Partial<Product>) {
    if (editing) {
      await updateProduct(editing.id, payload)
      setEditing(null)
    } else {
      // ensure ownerId from localStorage is attached if present
      const ownerId = localStorage.getItem('ownerId') || undefined
      await createProduct({ ...payload, ownerId } as Partial<Product>)
    }
    setShowForm(false)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h2>Giver Dashboard</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => { setEditing(null); setShowForm((s) => !s) }}>{showForm ? 'Close' : 'Add product'}</button>
        <button onClick={() => reload()} style={{ marginLeft: 8 }}>Reload</button>
      </div>

      {showForm && (
        <ProductForm initial={editing ?? undefined} onCancel={() => setShowForm(false)} onSave={handleSave} />
      )}

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <ProductList
        products={myProducts}
        onEdit={(p) => { setEditing(p); setShowForm(true) }}
        onDelete={async (id) => { if (confirm('Delete product?')) await deleteProduct(id) }}
        onApproveRequest={async (productId, requestId, isApproved) => {
          const action = isApproved ? 'Approve' : 'Reject';
          if (confirm(`Are you sure you want to ${action} this request?`)) {
            await approveRequest(productId, requestId, isApproved)
          }
        }}
      />


    </div>
  )
}

export default function GiverDashboardPage() {
  return (
    <ProductProvider>
      <Inner />
    </ProductProvider>
  )
}
