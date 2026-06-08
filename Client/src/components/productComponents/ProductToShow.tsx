import React from 'react';
import { Product } from '../../types';

type Props = {
  product: Product;
  onSelect: (product: Product) => void;
};

export const ProductCard = ({ product, onSelect }: Props) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 12 }}>
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <button 
        onClick={() => onSelect(product)}
        style={{ padding: '8px 16px', cursor: 'pointer' }}
      >
        Request Item
      </button>
    </div>
  );
};