import React, { useEffect } from 'react';
import { useRequests } from '../../context/ReceiverContext';
import { RequestItem } from './RequestItem';

export const MyRequestsList = () => {
  // כאן אנחנו מסתמכים על הפונקציות מהקונטקסט
  const { myRequests, fetchMyRequests, loading, deleteRequest } = useRequests();

  useEffect(() => {
    fetchMyRequests();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Requests</h2>
      {myRequests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {myRequests.map((req) => (
            <RequestItem 
              key={req._id} 
              request={req} 
              onDelete={deleteRequest} // מעבירים את הפונקציה מהקונטקסט
            />
          ))}
        </div>
      )}
    </div>
  );
};