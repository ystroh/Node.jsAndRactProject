import React, { useState, useEffect } from 'react';
import { useRequests } from '../../context/ReceiverContext';
import * as productsApi from '../../api/products'

export const RequestForm = ({ itemId, onCancel }: { itemId: string; onCancel: () => void }) => {
  const [message, setMessage] = useState('');
  const { submitRequest, loading } = useRequests();
  const [itemStatus, setItemStatus] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setChecking(true)
      try {
        const item = await productsApi.getProductById(itemId)
        if (!mounted) return
        setItemStatus((item as any).status || null)
      } catch (err) {
        console.error('Failed to fetch item status', err)
        setItemStatus(null)
      } finally { if (mounted) setChecking(false) }
    }
    load()
    return () => { mounted = false }
  }, [itemId])

  const handleSubmit = async () => {
    // re-check status before sending
    try {
      const item = await productsApi.getProductById(itemId)
      if ((item as any).status && (item as any).status !== 'available') {
        alert('Item is no longer available for requests.')
        onCancel()
        return
      }
    } catch (err) {
      console.error('Failed to re-check item status', err)
    }

    await submitRequest(itemId, message);
    onCancel();
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 10 }}>
      <h4>Request this item</h4>
      {checking ? <div>Checking availability...</div> : (
        <>
          {itemStatus && itemStatus !== 'available' ? (
            <div>Item is not available (status: {itemStatus}). You cannot request it.</div>
          ) : (
            <>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message to giver..." />
              <button disabled={loading} onClick={handleSubmit}>Send Request</button>
            </>
          )}
          <div style={{ marginTop: 8 }}><button onClick={onCancel}>Cancel</button></div>
        </>
      )}
    </div>
  );
};