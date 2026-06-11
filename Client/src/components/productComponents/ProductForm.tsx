import React, { useEffect, useState } from 'react'
import { Product } from '../../types'

type Props = {
    initial?: Partial<Product>
    onCancel: () => void
    onSave: (payload: Partial<Product>) => Promise<void>
}

export default function ProductForm({ initial, onCancel, onSave }: Props) {
    const [title, setTitle] = useState(initial?.title || '')
    const [description, setDescription] = useState(initial?.description || '')
    const [category, setCategory] = useState(initial?.category || '') // 1. הגדרנו את ה-State    const [saving, setSaving] = useState(false)
    const [saving, setSaving] = useState(false)

    const CATEGORIES = [
    'מטבח וכלי בית',
    'מוצרי חשמל',
    'משחקים וצעצועים',
    'כלי עבודה וגינה',
    'אביזרי חצר וקמפינג',
    'ספרים ומדיה',
    'ביגוד ואופנה',
    'תינוקות וילדים',
    'ספורט וכושר',
    'אחר'
];

    useEffect(() => {
        setTitle(initial?.title || '')
        setDescription(initial?.description || '')
        setCategory(initial?.category || '')
    }, [initial])

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            await onSave({  title, description, category })
        } finally {
            setSaving(false)
        }
    }
    return (
        <form onSubmit={submit} className="card product-form-card">
            <div className="product-form-row">
                <label className="product-form-label">קטגוריה</label>
                <select
                    className="form-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">בחר קטגוריה</option>
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="product-form-row">
                <label className="product-form-label">כותרת</label>
                <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="product-form-row">
                <label className="product-form-label">תיאור</label>
                <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="product-form-actions">
                <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'שומר...' : 'שמור'}</button>
                <button type="button" className="btn btn--ghost" onClick={onCancel}>ביטול</button>
            </div>
        </form>
    )
}
