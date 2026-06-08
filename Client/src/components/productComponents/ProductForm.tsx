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
        <form onSubmit={submit} style={{ border: '1px solid #eee', padding: 12, borderRadius: 6, marginBottom: 12 }}>
            <div>
                <label>Category</label>
                <select
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
            <div>
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

            </div>
            <div style={{ marginTop: 8 }}>
                <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
        </form>
    )
}
