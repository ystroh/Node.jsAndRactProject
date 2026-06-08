import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/productComponents/ProductToShow';
import { RequestForm } from '../components/requestComponents/RequestForm';
import { Product } from '../types';
import { MyRequestsList } from '../components/requestComponents/RequestsList';
import { RequestsProvider, useRequests } from '../context/ReceiverContext'



export const CatalogPage = () => {
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (loading) return <div>Loading items...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2>Available Items</h2>
      
      {/* רשימת המוצרים */}
      <div style={{ display: 'grid', gap: 12 }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} />
        ))}
      </div>

      {/* חלון הטופס (Modal/Popup פשוט) */}
      {selectedProduct && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center' 
        }}>
          <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 8 }}>
            <RequestForm 
              itemId={selectedProduct.id} 
              onCancel={() => setSelectedProduct(null)} 
            />
          </div>
        </div>
      )}


      <MyRequestsList/>
    </div>

    
  );
};

export default function ReceiverDashboard() {
  return (
    <RequestsProvider>
      <CatalogPage />
    </RequestsProvider>
  )
}