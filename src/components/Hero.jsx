import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Button } from './Button';
import { useShop } from '../context/ShopContext';

export const Hero = () => {
  const { storeSettings } = useShop();

  return (
    <section className="hero-section" aria-label="Welcome Hero">
      <div className="container">
        <div className="hero-grid">
          {/* Content Column */}
          <div className="hero-content">
            <div className="hero-subtitle-tag">
              <Sparkles size={15} color="var(--lavender-deep)" />
              <span>{storeSettings?.instagramHandle || '@dreambasket.studio'}</span>
            </div>

            <h1 className="hero-heading">
              Dreambasket
            </h1>

            <p className="hero-description" style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-main)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
              {storeSettings?.tagline || 'Little treasures, made to make you smile 🎀'}
            </p>

            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.98rem', maxWidth: '480px' }}>
              A soft, romantic world of anti-tarnish jewellery, delicate accessories, and curated gift hampers crafted to bring a touch of everyday magic.
            </p>

            <div className="hero-btn-group">
              <Button
                to="/shop"
                variant="primary"
                icon={<Sparkles size={16} />}
              >
                Shop the Collection
              </Button>

              <Button
                to="/bestsellers"
                variant="secondary"
                icon={<Heart size={16} color="#E84C7A" />}
              >
                Explore Bestsellers
              </Button>
            </div>
          </div>

          {/* Visual Column */}
          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85"
                alt="Dreambasket curated pastel jewellery display with bows and pearls"
                loading="eager"
              />

              {/* Floating aesthetic badge */}
              <div className="hero-floating-badge">
                <div className="hero-floating-badge-icon">
                  🎀
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    Packed With Love
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--lavender-deep)' }}>
                    {storeSettings?.instagramHandle || '@dreambasket.studio'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
