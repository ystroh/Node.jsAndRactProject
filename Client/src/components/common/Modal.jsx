import React from 'react'

export default function Modal({ children, onClose }) {
  console.log('Modal rendered')
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose() }}>
      <div className="modal-card" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  )
}
