import React, { useState } from 'react';
import { useRequests } from '../../context/ReceiverContext';

export const RequestForm = ({ itemId, onCancel }: { itemId: string; onCancel: () => void }) => {
  const [message, setMessage] = useState('');
  const { submitRequest, loading } = useRequests();

  const handleSubmit = async () => {
    await submitRequest(itemId, message);
    onCancel();
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 10 }}>
      <h4>Request this item</h4>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message to giver..." />
      <button disabled={loading} onClick={handleSubmit}>Send Request</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};