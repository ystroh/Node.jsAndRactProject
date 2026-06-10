import React, { useState, useMemo } from 'react';
import { ProductProvider, useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/productComponents/ProductToShow';
import { RequestForm } from '../components/requestComponents/RequestForm';
import { Product } from '../types';
import { RequestsProvider } from '../context/ReceiverContext'
import { useNavigate } from 'react-router-dom';



export const CatalogPage = () => {
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  // Extract unique categories from products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.category) set.add(p.category); });
    return ['All', ...Array.from(set).sort()];
  }, [products]);

  // Filter products by selected category and search term (incremental)
  const visibleProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products
      .filter(p => selectedCategory === 'All' ? true : p.category === selectedCategory)
      .filter(p => term === '' ? true : p.title.toLowerCase().includes(term))
      .sort((a,b) => a.title.localeCompare(b.title));
  }, [products, selectedCategory, searchTerm]);

  if (loading) return <div>Loading items...</div>;
  const userName = localStorage.getItem('userName') || '';

  return (
    <div dir="rtl" style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 20, boxSizing: 'border-box', textAlign: 'right', fontFamily: 'Segoe UI, Roboto, Arial' }}>
      {/* Site-style header: centered title and requests button */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div />
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 28, color: '#184e77' }}>שלום {userName ? userName : ''}!</h1>
          <p style={{ margin: '6px 0 0', color: '#55606a' }}>גלוש בקטלוג ובחר פריטים מתאימים לך</p>
        </div>
        <div>
          <button onClick={() => navigate('/receiver/requests')} style={{ padding: '8px 12px', borderRadius: 8, background: '#007bff', color: 'white', border: 'none' }}>הבקשות שלי</button>
        </div>
      </header>

      {/* Category menu styled like site header (centered links) */}
      <nav style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '10px 0', marginBottom: 18 }}>
        <ul style={{ display: 'flex', gap: 16, listStyle: 'none', padding: 0, margin: 0, overflowX: 'auto', alignItems: 'center', justifyContent: 'center' }}>
          {categories.map(cat => (
            <li key={cat} style={{ margin: 0 }}>
              <button
                onClick={() => { setSelectedCategory(cat); setSearchTerm(''); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  color: selectedCategory === cat ? '#007bff' : '#333',
                  fontSize: 16
                }}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Large search area under categories (centered) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
        <div style={{ width: '100%', maxWidth: 820, display: 'flex', gap: 12 }}>
          <input
            aria-label="חיפוש מוצרים"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={selectedCategory === 'All' ? 'חפש מוצר בכל הקטגוריות...' : `חפש ב־${selectedCategory}...`}
            style={{ width: '100%', padding: '16px 18px', borderRadius: 12, border: '1px solid #e0e6ef', fontSize: 18, boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)' }}
          />
          <button onClick={() => { setSearchTerm(''); }} style={{ padding: '12px 18px', borderRadius: 12, background: '#f0f4f8', border: '1px solid #e0e6ef' }}>נקה</button>
        </div>
      </div>

      {/* רשימת המוצרים המסוננת */}
      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {visibleProducts.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} />
        ))}
      </main>
      {visibleProducts.length === 0 && <div style={{ marginTop: 12 }}>לא נמצאו מוצרים בקטגוריה/חיפוש זה.</div>}

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


    </div>

    
  );
};

export default function ReceiverDashboard() {
  return (
 <ProductProvider>
      <RequestsProvider>
        <CatalogPage />
      </RequestsProvider>
    </ProductProvider>
  )
}