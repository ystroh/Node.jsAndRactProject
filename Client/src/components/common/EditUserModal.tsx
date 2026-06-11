import React, { useState, useEffect } from 'react'
import Modal from './Modal'

export default function EditUserModal({ user, onCancel, onSave }: { user: any, onCancel: ()=>void, onSave: (p:any)=>void }){
  React.useEffect(() => { console.log('EditUserModal mounted') }, [])
  React.useEffect(() => { console.log('EditUserModal user prop:', user && (user._id || user.id || user.email || user.name)) }, [user])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const availableRoles = ['admin','giver','receiver']

  useEffect(()=>{
    if (!user) return
    setName(user.name || '')
    setEmail(user.email || '')
    setRoles(Array.isArray(user.roles)? user.roles : [])
  },[user])

  function toggleRole(r: string){
    setRoles(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r])
  }

  function submit(e: React.FormEvent){
    e.preventDefault()
    onSave({ ...user, name: name.trim(), email: email.trim(), roles })
  }

  if (!user) return null

  return (
    <Modal onClose={onCancel}>
      <div>
        <div className="modal-header">
          <h3 style={{margin:0}}>עריכת משתמש</h3>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn--ghost" onClick={onCancel}>בטל</button>
          </div>
        </div>

        <form onSubmit={submit} className="modal-body">
          <div style={{display:'grid',gap:12}}>
            <input className="form-input" value={name} onChange={e=>setName(e.target.value)} placeholder="שם מלא" required />
            <input className="form-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="אימייל" required />
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {availableRoles.map(r=> (
                <label key={r} className="tag" style={{display:'flex',alignItems:'center',gap:8}}>
                  <input type="checkbox" checked={roles.includes(r)} onChange={()=>toggleRole(r)} /> {r}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn--primary">שמור</button>
            <button type="button" className="btn btn--ghost" onClick={onCancel}>ביטול</button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
