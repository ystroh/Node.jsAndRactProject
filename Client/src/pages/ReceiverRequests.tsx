import React, { useEffect } from 'react';
import { RequestsProvider } from '../context/ReceiverContext';
import { MyRequestsList } from '../components/requestComponents/RequestsList';

export const ReceiverRequestsPage = () => {
  useEffect(() => {
    document.title = 'הבקשות שלי';
  }, []);

  return (
    <RequestsProvider>
      <div dir="rtl" style={{ maxWidth: 900, margin: '20px auto', padding: 16 }}>
        <h2 style={{ textAlign: 'right' }}>הבקשות שלי</h2>
        <MyRequestsList />
      </div>
    </RequestsProvider>
  );
};

export default ReceiverRequestsPage;
