import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SearchModal = () => {
  const { isSearchOpen, closeSearch, products } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName?.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="search-modal-backdrop" onClick={closeSearch}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <Search size={20} color="var(--lavender-deep)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search earrings, necklaces, combos, hampers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="btn-icon"
            onClick={closeSearch}
            style={{ width: '32px', height: '32px' }}
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        <div className="search-results-list">
          {query.trim() === '' ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Try searching for "Tulip", "Combo", "Pearl", or "Hamper" ✨
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="search-result-item"
                onClick={closeSearch}
              >
                <img src={p.image} alt={p.name} className="search-result-img" />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--lavender-deep)' }}>
                    {p.categoryName || p.category} • ₹{p.price}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No treasures found matching "{query}" 💭
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
