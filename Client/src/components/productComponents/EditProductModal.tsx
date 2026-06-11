import React, { useState, useEffect } from 'react'
import Modal from '../common/Modal'

export default function EditProductModal({ product, onCancel, onSave }: { product: any, onCancel: ()=>void, onSave: (p:any)=>void }){
  useEffect(() => { console.log('EditProductModal mounted') }, [])
  useEffect(() => { console.log('EditProductModal product prop:', product && (product.id || product._id || product.title)) }, [product])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('available')

  useEffect(() => {
    if (!product) return
    setTitle(product.title || '')
    setDescription(product.description || '')
    setCategory(product.category || '')
    setStatus(product.status || 'available')
  }, [product])

  function submit(e: React.FormEvent){
    e.preventDefault()
    const payload = { ...product, title: title.trim(), description: description.trim(), category: category.trim(), status }
    onSave(payload)
  }

  if (!product) return null

  return (
    <Modal onClose={onCancel}>
      <div>
        <div className="modal-header">
          <h3 style={{margin:0}}>עריכת פריט</h3>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn--ghost" onClick={onCancel}>בטל</button>
          </div>
        </div>

        <form onSubmit={submit} className="modal-body">
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
            <input className="form-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="כותרת" required />
            <textarea className="form-input" value={description} onChange={e=>setDescription(e.target.value)} placeholder="תיאור" rows={4} />
            <div style={{display:'flex',gap:12}}>
              <input className="form-input" value={category} onChange={e=>setCategory(e.target.value)} placeholder="קטגוריה" />
              <select className="form-input" value={status} onChange={e=>setStatus(e.target.value)}>
                <option value="available">זמין</option>
                <option value="borrowed">בהשאלה</option>
                <option value="archived">לא זמין</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn--primary">שמור שינויים</button>
            <button type="button" className="btn btn--ghost" onClick={onCancel}>ביטול</button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
