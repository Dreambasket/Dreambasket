import React, { useState, useMemo } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { ProductGrid } from '../components/ProductGrid';
import { useShop } from '../context/ShopContext';
import { SlidersHorizontal, Search, Sparkles } from 'lucide-react';

export const Shop = () => {
  const { products, categories } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [subFilter, setSubFilter] = useState('all'); // For anti-tarnish subcategories
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'new-arrivals') {
        list = list.filter((p) => p.isNewArrival || p.isNew);
      } else if (selectedCategory === 'bestsellers') {
        list = list.filter((p) => p.isBestseller);
      } else if (selectedCategory === 'anti-tarnish') {
        list = list.filter((p) => p.category === 'anti-tarnish');
        if (subFilter !== 'all') {
          list = list.filter((p) => p.subCategory === subFilter);
        }
      } else if (selectedCategory === 'budget-friendly') {
        list = list.filter((p) => p.category === 'budget-friendly');
        if (subFilter !== 'all') {
          list = list.filter((p) => p.subCategory === subFilter);
        }
      } else if (selectedCategory === 'jewellery-combos') {
        list = list.filter((p) => p.category === 'jewellery-combos' || p.isCombo);
      } else {
        list = list.filter((p) => p.category === selectedCategory);
      }
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [products, selectedCategory, subFilter, searchQuery, sortBy]);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setSubFilter('all');
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <SectionHeading
          tag="our full catalogue"
          title="Explore the Dream Collection 🎀"
          subtitle="Delicate jewels, waterproof anti-tarnish chains, and romantic combos designed to make you smile."
        />

        {/* Search Bar on Shop Page */}
        <div style={{ maxWidth: '520px', margin: '0 auto 1.75rem', position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--lavender-deep)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search jewellery, combos, cards, charms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 2.8rem',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--border-lavender)',
              background: 'var(--bg-surface)',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.85rem',
                color: 'var(--text-light)',
                fontWeight: 600,
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* 12 Category Filter Pills (Horizontal scroll on mobile) */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.25rem',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          className="shop-category-pills"
        >
          <button
            type="button"
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-lavender' : 'btn-secondary'}`}
            onClick={() => handleCategoryClick('all')}
            style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
          >
            All Items ✨
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-lavender' : 'btn-secondary'}`}
              onClick={() => handleCategoryClick(cat.id)}
              style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategory Chips for Anti-Tarnish Jewellery */}
        {selectedCategory === 'anti-tarnish' && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
              background: 'var(--bg-surface)',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-soft)',
              width: 'fit-content',
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--lavender-deep)' }}>
              Subcategories:
            </span>
            {[
              { id: 'all', label: 'All Anti-Tarnish' },
              { id: 'chains', label: 'Chains' },
              { id: 'bracelets', label: 'Bracelets' },
              { id: 'earrings', label: 'Earrings' },
              { id: 'rings', label: 'Rings' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSubFilter(sub.id)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: subFilter === sub.id ? 600 : 500,
                  background: subFilter === sub.id ? 'var(--pink-soft)' : 'transparent',
                  color: 'var(--text-main)',
                  border: subFilter === sub.id ? '1px solid var(--pink-blush)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Subcategory Chips for Budget-Friendly Jewellery */}
        {selectedCategory === 'budget-friendly' && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
              background: 'var(--bg-surface)',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-soft)',
              width: 'fit-content',
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--lavender-deep)' }}>
              Subcategories:
            </span>
            {[
              { id: 'all', label: 'All Budget-Friendly' },
              { id: 'chains', label: 'Chains' },
              { id: 'bracelets', label: 'Bracelets' },
              { id: 'korean-earrings', label: 'Korean Earrings' },
              { id: 'rings', label: 'Rings' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSubFilter(sub.id)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: subFilter === sub.id ? 600 : 500,
                  background: subFilter === sub.id ? 'var(--pink-soft)' : 'transparent',
                  color: 'var(--text-main)',
                  border: subFilter === sub.id ? '1px solid var(--pink-blush)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Toolbar: Counter & Sorting */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.85rem 1.25rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> dreamy items
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SlidersHorizontal size={16} color="var(--lavender-deep)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.4rem 0.85rem',
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
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border-soft)' }}>
            <span style={{ fontSize: '2.5rem' }}>💭</span>
            <h3 className="font-serif" style={{ fontSize: '1.6rem', margin: '0.75rem 0' }}>
              No treasures found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              We couldn't find any items matching "{searchQuery || selectedCategory}".
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSubFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
