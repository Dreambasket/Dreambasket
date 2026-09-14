import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { ProductGrid } from '../components/ProductGrid';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/Button';
import { Heart, Sparkles } from 'lucide-react';

export const Wishlist = () => {
  const { wishlist, products } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center', maxWidth: '500px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--pink-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#E84C7A',
          }}
        >
          <Heart size={32} />
        </div>
        <h1 className="font-serif" style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
          Your Wishlist is Empty
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.96rem' }}>
          Tap the heart icon on any piece to save your favorite treasures here for later.
        </p>
        <Button to="/shop" variant="primary" icon={<Sparkles size={16} />}>
          Discover Treasures ✨
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <SectionHeading
          tag="your saved favourites"
          title="My Dream Wishlist 💕"
          subtitle="Everything you have your eye on in one lovely spot."
        />

        <ProductGrid products={wishlistedProducts} />
      </div>
    </div>
  );
};
