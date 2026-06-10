import React, { useState, useMemo } from 'react'
import * as requestsApi from '../api/requests'
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

  // load requests for owner's items and attach to products for display
  const [ownerRequests, setOwnerRequests] = useState<any[]>([])

  React.useEffect(() => {
    let mounted = true
    async function loadOwnerRequests() {
      try {
        const data = await requestsApi.getRequestsForOwner()
        if (!mounted) return
        setOwnerRequests(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed loading owner requests', err)
      }
    }
    loadOwnerRequests()
    return () => { mounted = false }
  }, [])

  // attach requests to products for rendering in ProductCard
  const myProductsWithRequests = React.useMemo(() => {
    return myProducts.map(p => ({ ...p, requests: ownerRequests.filter(r => {
      const item = r.itemId
      const itemId = typeof item === 'object' ? (item.id ?? item._id) : item
      return String(itemId) === String(p.id || p.id)
    }) }))
  }, [myProducts, ownerRequests])

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
        products={myProductsWithRequests}
        onEdit={(p) => { setEditing(p); setShowForm(true) }}
        onDelete={async (id) => { if (confirm('Delete product?')) await deleteProduct(id) }}
        onApproveRequest={async (productId, requestId, isApproved) => {
          const action = isApproved ? 'Approve' : 'Reject';
          if (!confirm(`Are you sure you want to ${action} this request?`)) return
          try {
            await approveRequest(productId, requestId, isApproved)
            // refresh owner requests and products
            const refreshed = await requestsApi.getRequestsForOwner()
            setOwnerRequests(Array.isArray(refreshed) ? refreshed : [])
            await reload()
          } catch (err) {
            console.error('Approve request failed', err)
            alert('Failed to change request status')
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
