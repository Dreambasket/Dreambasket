import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products = [], limit, className = '' }) => {
  const displayProducts = limit ? products.slice(0, limit) : products;

  if (!displayProducts.length) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
        <p>No products found in this collection yet ✨</p>
      </div>
    );
  }

  return (
    <div className={`product-grid ${className}`}>
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
