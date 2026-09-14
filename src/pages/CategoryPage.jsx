import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SectionHeading } from '../components/SectionHeading';
import { ProductGrid } from '../components/ProductGrid';
import { useShop } from '../context/ShopContext';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export const CategoryPage = ({ categoryId, customTitle, customDescription }) => {
  const { products, categories } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSub = searchParams.get('sub') || 'all';

  const category = categories.find((c) => c.id === categoryId);
  const [activeSubcategory, setActiveSubcategory] = useState(initialSub);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const subParam = searchParams.get('sub');
    if (subParam) {
      setActiveSubcategory(subParam);
    } else {
      setActiveSubcategory('all');
    }
  }, [searchParams, categoryId]);

  const handleSubcategoryChange = (subId) => {
    setActiveSubcategory(subId);
    if (subId === 'all') {
      searchParams.delete('sub');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ sub: subId });
    }
  };

  // Filter products for this category using dynamic store data
  const filteredProducts = useMemo(() => {
    let items = [];

    if (categoryId === 'new-arrivals') {
      items = products.filter((p) => p.isNewArrival || p.isNew);
    } else if (categoryId === 'bestsellers') {
      items = products.filter((p) => p.isBestseller);
    } else if (categoryId === 'anti-tarnish') {
      items = products.filter((p) => p.category === 'anti-tarnish');
      if (activeSubcategory !== 'all') {
        items = items.filter((p) => p.subCategory === activeSubcategory);
      }
    } else if (categoryId === 'budget-friendly') {
      items = products.filter((p) => p.category === 'budget-friendly');
      if (activeSubcategory !== 'all') {
        items = items.filter((p) => p.subCategory === activeSubcategory);
      }
    } else if (categoryId === 'jewellery-combos') {
      items = products.filter((p) => p.category === 'jewellery-combos' || p.isCombo);
    } else {
      items = products.filter((p) => p.category === categoryId);
      if (activeSubcategory !== 'all') {
        items = items.filter((p) => p.subCategory === activeSubcategory);
      }
    }

    // Sort items
    if (sortBy === 'price-low') {
      return [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      return [...items].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      return [...items].sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }
    return items;
  }, [products, categoryId, activeSubcategory, sortBy]);

  const title = customTitle || category?.name || 'Collection';
  const description = customDescription || category?.description || 'Browse our dainty collection.';

  return (
    <div className="category-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Editorial Header */}
        <SectionHeading
          tag={category?.tagline || 'Dreambasket Studio'}
          title={title}
          subtitle={description}
        />

        {/* Highlights if provided for this category */}
        {category?.highlights && category.highlights.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
              maxWidth: '850px',
              margin: '0 auto 2rem',
            }}
          >
            {category.highlights.map((highlight, idx) => (
              <span
                key={idx}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-soft)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  boxShadow: 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.03))',
                }}
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Subcategories Filter for categories that define subcategories */}
        {category?.subcategories && category.subcategories.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            <button
              type="button"
              className={`btn btn-sm ${activeSubcategory === 'all' ? 'btn-lavender' : 'btn-secondary'}`}
              onClick={() => handleSubcategoryChange('all')}
            >
              All {category.name.replace(/[^\w\s-]/gi, '').trim()}
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                className={`btn btn-sm ${activeSubcategory === sub.id ? 'btn-lavender' : 'btn-secondary'}`}
                onClick={() => handleSubcategoryChange(sub.id)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Filter / Sort bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.8rem 1.25rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> dreamy items
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SlidersHorizontal size={16} color="var(--lavender-deep)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-soft)',
                background: 'var(--bg-main)',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="featured">Featured ✨</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated ⭐</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
};
