import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ArrowRight, ShieldCheck, Gift, Crown, ShoppingBag } from 'lucide-react';
import { Hero } from '../components/Hero';
import { SectionHeading } from '../components/SectionHeading';
import { CategoryCard } from '../components/CategoryCard';
import { ProductGrid } from '../components/ProductGrid';
import { InstagramSection } from '../components/InstagramSection';
import { TrustSection } from '../components/TrustSection';
import { Button } from '../components/Button';
import { useShop } from '../context/ShopContext';

export const Home = () => {
  const { products, categories, addToCart, storeSettings } = useShop();

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const antiTarnishList = products.filter((p) => p.antiTarnish).slice(0, 4);
  const featuredCombo = products.find((p) => p.isCombo || p.category === 'jewellery-combos') || products[4];
  const giftHampers = products.filter((p) => p.category === 'gift-hampers').slice(0, 4);
  const princessChains = products.filter((p) => p.category === 'princess-chains').slice(0, 4);

  // Curated primary visual categories for homepage
  const homepageCategories = categories.filter((c) =>
    ['anti-tarnish', 'budget-friendly', 'handmade-cards', 'jewellery-combos', 'princess-chains', 'gift-hampers'].includes(c.id)
  );

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Shop by Category Section */}
      <section style={{ padding: '3.5rem 0 2rem' }} aria-label="Shop by Category">
        <div className="container">
          <SectionHeading
            tag="explore by aesthetic"
            title="Find something dreamy ✨"
            subtitle="Explore delicate jewels, romantic bows, and thoughtful gifting baskets."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            }}
            className="category-cards-grid"
          >
            {homepageCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>

          <style>{`
            @media (min-width: 640px) {
              .category-cards-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 1.5rem !important;
              }
            }
            @media (min-width: 1024px) {
              .category-cards-grid {
                grid-template-columns: repeat(6, 1fr) !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* 3. New Arrivals Section */}
      <section style={{ padding: '3.5rem 0' }} aria-label="New Arrivals">
        <div className="container">
          <SectionHeading
            tag="fresh in our basket"
            title="New Arrivals ✨"
            subtitle="Delicate pieces recently crafted to brighten your everyday sparkle."
          />

          <ProductGrid products={newArrivals.length ? newArrivals : products.slice(0, 4)} />

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Button
              to="/new-arrivals"
              variant="outline"
              icon={<Sparkles size={16} />}
            >
              View All New Arrivals
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Bestsellers Section */}
      <section style={{ padding: '3.5rem 0', background: 'rgba(244, 217, 232, 0.25)' }} aria-label="Bestselling Treasures">
        <div className="container">
          <SectionHeading
            tag="community favourites"
            title="Bestsellers 💕"
            subtitle="The romantic community favourites that keep selling out."
          />

          <ProductGrid products={bestsellers.length ? bestsellers : products.slice(0, 4)} />

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Button
              to="/bestsellers"
              variant="outline"
              icon={<Heart size={16} color="#E84C7A" />}
            >
              Explore All Bestsellers
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Anti-Tarnish Jewellery Section */}
      <section style={{ padding: '3.5rem 0' }} aria-label="Anti-Tarnish Jewellery">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--lavender-deep)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                <ShieldCheck size={16} />
                <span>Waterproof & Everyday Radiance</span>
              </div>
              <h2 className="font-serif" style={{ fontSize: '2.2rem', marginTop: '0.3rem', color: 'var(--text-main)' }}>
                Anti-Tarnish Jewellery ✨
              </h2>
            </div>
            <Button to="/anti-tarnish" variant="outline" style={{ marginTop: '0.5rem' }}>
              View Anti-Tarnish Collection →
            </Button>
          </div>

          <ProductGrid products={antiTarnishList} />
        </div>
      </section>

      {/* 6. Jewellery Combos Section (Single Category with bundle pricing) */}
      {featuredCombo && (
        <section style={{ padding: '3.5rem 0' }} aria-label="Jewellery Combos">
          <div className="container">
            <div className="combo-promo-card">
              {/* Promo Text */}
              <div>
                <div className="combo-badge">
                  <Sparkles size={14} />
                  <span>Jewellery Combos 💞 • Made to Match</span>
                </div>

                <h2 className="combo-title">
                  {featuredCombo.name}
                </h2>

                <p className="combo-copy">
                  Why pick just one when they were designed for each other? Our matching jewellery combo pairings bundle harmonious chains and earrings with an aesthetic gift pouch at a special bundle price.
                </p>

                {/* Bundle Breakdown Box */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border-soft)', marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    {featuredCombo.comboDescription || 'Matching Chain + Earrings Pairing'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--lavender-deep)', marginTop: '0.2rem', marginBottom: '0.6rem' }}>
                    Individual pieces: Chain (₹300) + Earrings (₹300) = ₹600 value
                  </div>

                  <div className="combo-pricing-box" style={{ marginBottom: '0.25rem' }}>
                    <span className="combo-price">₹{featuredCombo.price}</span>
                    {featuredCombo.originalPrice && (
                      <span className="combo-original">₹{featuredCombo.originalPrice}</span>
                    )}
                    <span className="combo-sample-label">Bundle Savings</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button
                    to="/jewellery-combos"
                    variant="lavender"
                    icon={<Sparkles size={16} />}
                  >
                    View All Jewellery Combos
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => addToCart(featuredCombo, 1)}
                    icon={<ShoppingBag size={16} />}
                  >
                    Add Combo to Basket
                  </Button>
                </div>
              </div>

              {/* Visual Combo Box */}
              <div className="combo-visual-box">
                <img
                  src={featuredCombo.image}
                  alt={featuredCombo.name}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Gift Hampers Section */}
      {giftHampers.length > 0 && (
        <section style={{ padding: '3.5rem 0', background: '#FFFDF9' }} aria-label="Gift Hampers">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--lavender-deep)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  <Gift size={16} />
                  <span>Curated for your sweetest souls</span>
                </div>
                <h2 className="font-serif" style={{ fontSize: '2.2rem', marginTop: '0.3rem', color: 'var(--text-main)' }}>
                  Gift Hampers 🎁
                </h2>
              </div>
              <Button to="/gift-hampers" variant="outline" style={{ marginTop: '0.5rem' }}>
                Explore All Hampers →
              </Button>
            </div>

            <ProductGrid products={giftHampers} />
          </div>
        </section>
      )}

      {/* 8. Princess Chains Section */}
      {princessChains.length > 0 && (
        <section style={{ padding: '3.5rem 0' }} aria-label="Princess Chains">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-accent)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  <Crown size={16} />
                  <span>Fairy-tale Royal Motifs</span>
                </div>
                <h2 className="font-serif" style={{ fontSize: '2.2rem', marginTop: '0.3rem', color: 'var(--text-main)' }}>
                  Princess Chains 👑
                </h2>
              </div>
              <Button to="/princess-chains" variant="outline" style={{ marginTop: '0.5rem' }}>
                View Princess Chains →
              </Button>
            </div>

            <ProductGrid products={princessChains} />
          </div>
        </section>
      )}

      {/* 9. Brand / About Story Section */}
      <section className="story-section" aria-label="Brand Story">
        <div className="container">
          <div className="story-card">
            <span className="story-icon">🎀</span>
            <h2 className="story-title">
              {storeSettings?.tagline || 'Little treasures, made to make you smile 🎀'}
            </h2>
            <p className="story-text">
              Dreambasket was born out of a passion for whimsical details, soft pastels, and thoughtful gifting. We believe that wearing jewellery should feel like wearing a gentle dream — lightweight, comforting, and filled with little moments of joy.
            </p>
            <p className="story-text">
              Every chain, earring set, ring, and hair accessory in our boutique is chosen with care: anti-tarnish everyday finishes, sensitive-skin safe metals, and packaging designed to feel like an unboxing experience from your sweetest friend.
            </p>
            <div className="story-signature">
              with love, {storeSettings?.instagramHandle || '@dreambasket.studio'} 💕
            </div>
          </div>
        </div>
      </section>

      {/* 10. Instagram Section */}
      <InstagramSection />

      {/* 11. Trust Section */}
      <TrustSection />
    </div>
  );
};
