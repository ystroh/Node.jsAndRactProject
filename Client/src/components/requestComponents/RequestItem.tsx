import React from 'react';

type Props = {
  request: any; // כדאי להחליף בטיפוס המדויק שלך, למשל Request
  onDelete: (id: string) => void;
};

export const RequestItem = ({ request, onDelete }: Props) => {
  const itemTitle = request.itemId?.title || "Unknown Item";
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <strong>Item: {itemTitle}</strong>
        <p>Status: <strong>{request.status}</strong></p>
        <p>Message: {request.message}</p>
      </div>
      <button 
        onClick={() => { if (confirm('Cancel this request?')) onDelete(request._id || request.id) }}
        style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}
      >
        Cancel
      </button>
    </div>
  );
};