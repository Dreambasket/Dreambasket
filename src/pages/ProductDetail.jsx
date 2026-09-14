import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  Package,
  X
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductGrid } from '../components/ProductGrid';
import { Button } from '../components/Button';
import {
  PACKAGING_OPTIONS,
  isJewelleryPackagingEligible,
  HANDMADE_CARD_COLORS,
  HANDMADE_CARD_THEMES,
} from '../data/packaging';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, isInWishlist, toggleWishlist, storeSettings, packagingOptions, cardColors, cardThemes } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = products.find((p) => p.id === id);

  const availablePackaging = packagingOptions.filter((p) => p.active !== false);
  const [selectedPackaging, setSelectedPackaging] = useState(() => availablePackaging[0] || PACKAGING_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(() => cardColors[0] || HANDMADE_CARD_COLORS[0]);
  const [selectedTheme, setSelectedTheme] = useState(() => cardThemes[0] || HANDMADE_CARD_THEMES[0]);

  // Keep state updated when context options update
  useEffect(() => {
    if (availablePackaging.length && !availablePackaging.some((p) => p.id === selectedPackaging?.id)) {
      setSelectedPackaging(availablePackaging[0]);
    }
  }, [availablePackaging]);

  useEffect(() => {
    if (cardColors.length && !cardColors.some((c) => c.id === selectedColor?.id)) {
      setSelectedColor(cardColors[0]);
    }
  }, [cardColors]);

  useEffect(() => {
    if (cardThemes.length && !cardThemes.includes(selectedTheme)) {
      setSelectedTheme(cardThemes[0]);
    }
  }, [cardThemes]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Treasure not found 💭</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
          This item might have flown away to another dream basket.
        </p>
        <Button to="/shop" variant="primary">
          Back to Shop
        </Button>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[activeImageIndex] || product.image;

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.antiTarnish === product.antiTarnish))
    .slice(0, 4);

  const isJewelleryEligible = isJewelleryPackagingEligible(product);
  const isCard = product.category === 'handmade-cards' || product.category === 'cards';
  const isOutOfStock = product.inStock === false || product.stockStatus === 'out_of_stock' || (product.stockQuantity !== undefined && product.stockQuantity <= 0);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, {
      packaging: isJewelleryEligible ? selectedPackaging : null,
      color: isCard ? selectedColor?.name : null,
      theme: isCard ? selectedTheme : null,
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, {
      packaging: isJewelleryEligible ? selectedPackaging : null,
      color: isCard ? selectedColor?.name : null,
      theme: isCard ? selectedTheme : null,
    });
    navigate('/checkout');
  };

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--lavender-deep)',
            fontSize: '0.88rem',
            fontWeight: 500,
            marginBottom: '2rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            alignItems: 'flex-start',
            marginBottom: '4.5rem',
          }}
          className="product-detail-layout"
        >
          {/* Product Media Column */}
          <div>
            {/* Main Featured Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#FFF5FA',
                boxShadow: 'var(--shadow-md)',
                border: '4px solid #FFFFFF',
                aspectRatio: '1',
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--lavender-deep)',
                    border: '1px solid var(--border-lavender)',
                  }}
                >
                  {product.badge}
                </span>
              )}

              {/* Wishlist button */}
              <button
                type="button"
                className={`product-wishlist-btn ${wishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '40px',
                  height: '40px',
                }}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={19}
                  fill={wishlisted ? 'currentColor' : 'none'}
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Image Gallery Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2.5px solid var(--lavender-deep)' : '1px solid var(--border-soft)',
                      padding: '2px',
                      background: '#FFFFFF',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <img src={img} alt={`${product.name} preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div>
            {/* Category & Product ID */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--lavender-deep)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {product.categoryName || product.category}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', background: 'var(--bg-main)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)' }}>
                Product ID: {product.sku || product.id}
              </div>
            </div>

            <h1
              className="font-serif"
              style={{ fontSize: '2.4rem', lineHeight: 1.2, fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}
            >
              {product.name}
            </h1>

            {/* COMBO PRODUCT SPECIAL BREAKDOWN SECTION */}
            {product.isCombo && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(244, 217, 232, 0.4), rgba(205, 185, 229, 0.3))',
                  border: '1.5px solid var(--pink-blush)',
                  borderRadius: '18px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--lavender-deep)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                  <Sparkles size={16} />
                  <span>Jewellery Combo Pairing 💞</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {product.comboDescription || 'A matching jewellery set curated to pair harmoniously together.'}
                </div>
                {product.comboItems && product.comboItems.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {product.comboItems.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <span
                          style={{
                            background: '#FFFFFF',
                            padding: '0.3rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            border: '1px solid var(--border-soft)',
                          }}
                        >
                          {item}
                        </span>
                        {idx < product.comboItems.length - 1 && (
                          <span style={{ fontWeight: 'bold', color: 'var(--lavender-deep)' }}>+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--lavender-deep)', fontWeight: 600 }}>
                  Special Combo Price: ₹{product.price}
                </div>
              </div>
            )}

            {/* Price Section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                ₹{product.price + (isJewelleryEligible && selectedPackaging ? selectedPackaging.price : 0)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '1.15rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice + (isJewelleryEligible && selectedPackaging ? selectedPackaging.price : 0)}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: 'var(--pink-soft)',
                    color: 'var(--lavender-deep)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                  }}
                >
                  Save ₹{product.originalPrice - product.price}
                </span>
              )}
              {isJewelleryEligible && selectedPackaging && selectedPackaging.price > 0 && (
                <span style={{ fontSize: '0.82rem', color: 'var(--lavender-deep)', fontWeight: 600 }}>
                  ({selectedPackaging.name} +₹{selectedPackaging.price})
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              {!isOutOfStock ? (
                product.stockQuantity < 5 && product.stockQuantity > 0 ? (
                  <>
                    <CheckCircle2 size={16} color="#E65100" />
                    <span style={{ color: '#E65100', fontWeight: 600 }}>Low Stock</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} color="#2E7D32" />
                    <span style={{ color: '#2E7D32', fontWeight: 600 }}>In Stock</span>
                  </>
                )
              ) : (
                <>
                  <X size={16} color="#C62828" />
                  <span style={{ color: '#C62828', fontWeight: 600 }}>Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: isCard ? '1rem' : '2rem', fontSize: '0.98rem' }}>
              {isCard
                ? 'Our handmade cards are crafted with love and creativity to make every special moment a little more meaningful. From birthdays and celebrations to heartfelt messages and surprises, each card is designed to add a personal touch to your wishes.'
                : product.description}
            </p>

            {/* HANDMADE CARDS SPECIAL SECTION: HIGHLIGHTS, COLOR & THEME SELECTOR */}
            {isCard && (
              <div style={{ marginBottom: '2rem' }}>
                {/* Handmade Card Highlights */}
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: '16px',
                    padding: '1.1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.6rem', fontSize: '0.86rem', color: 'var(--text-main)' }}>
                    <div>💕 Handmade with love</div>
                    <div>🎨 Unique & creative designs</div>
                    <div>✂️ Carefully handcrafted</div>
                    <div>🌸 Personalized designs</div>
                    <div>🎁 Perfect for gifting</div>
                    <div>💌 Made for special moments</div>
                  </div>
                </div>

                {/* Card Color Selection */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.6rem' }}>
                    Select Color: <span style={{ color: 'var(--lavender-deep)', fontWeight: 600 }}>{selectedColor?.name}</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {cardColors.map((c) => {
                      const isSelected = selectedColor?.id === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.45rem 0.9rem',
                            borderRadius: 'var(--radius-full)',
                            border: isSelected ? '2px solid var(--lavender-deep)' : '1px solid var(--border-soft)',
                            background: isSelected ? '#FFFFFF' : 'var(--bg-surface)',
                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.86rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              background: c.hex,
                              border: `1px solid ${c.border || '#ccc'}`,
                              display: 'inline-block',
                            }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Theme Selection */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.6rem' }}>
                    Select Theme: <span style={{ color: 'var(--lavender-deep)', fontWeight: 600 }}>{selectedTheme}</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {cardThemes.map((t) => {
                      const isSelected = selectedTheme === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTheme(t)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            border: isSelected ? '2px solid var(--lavender-deep)' : '1px solid var(--border-soft)',
                            background: isSelected ? 'var(--lavender-soft)' : 'var(--bg-surface)',
                            color: isSelected ? 'var(--lavender-deep)' : 'var(--text-main)',
                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.86rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Packaging Options (For jewellery items ONLY) */}
            {isJewelleryEligible && availablePackaging.length > 0 && (
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: '18px',
                  padding: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    🎁 Packaging Option:
                  </label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--lavender-deep)', fontWeight: 600 }}>
                    Select 1 option before adding
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                  {availablePackaging.map((pkg) => {
                    const isSelected = selectedPackaging?.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackaging(pkg)}
                        style={{
                          borderRadius: '14px',
                          border: isSelected ? '2px solid var(--lavender-deep)' : '1px solid var(--border-soft)',
                          background: isSelected ? '#FFFFFF' : 'var(--bg-main)',
                          boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                          padding: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {/* Packaging Image */}
                        <div style={{ width: '100%', height: '80px', borderRadius: '10px', overflow: 'hidden', background: '#F8EFF5' }}>
                          <img
                            src={pkg.image}
                            alt={pkg.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        {/* Title & Price */}
                        <div>
                          <div style={{ fontWeight: isSelected ? 700 : 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                            {pkg.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: pkg.price > 0 ? 'var(--lavender-deep)' : 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>
                            {pkg.price > 0 ? `+₹${pkg.price}` : '₹0 (Included)'}
                          </div>
                        </div>

                        {/* Radio Checkmark */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? '5px solid var(--lavender-deep)' : '2px solid var(--border-soft)',
                            background: '#FFFFFF',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Specifications: ONLY display information actually entered for this specific product */}
            {(() => {
              const specs = [];
              if (product.material && typeof product.material === 'string' && product.material.trim()) {
                specs.push({ label: 'Material', value: product.material.trim() });
              }
              if (product.colour && typeof product.colour === 'string' && product.colour.trim()) {
                specs.push({ label: 'Colour / Finish', value: product.colour.trim() });
              }
              const sizeVal = product.dimensions || product.size;
              if (sizeVal && typeof sizeVal === 'string' && sizeVal.trim()) {
                specs.push({ label: 'Dimensions / Size', value: sizeVal.trim() });
              }
              if (product.waterproof && typeof product.waterproof === 'string' && product.waterproof.trim()) {
                specs.push({ label: 'Waterproof', value: product.waterproof.trim() });
              }

              if (specs.length === 0) return null;

              return (
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    marginBottom: '2rem',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                    {specs.map((spec, idx) => (
                      <div key={idx}>
                        <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          {spec.label}
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Quantity Selector & Action CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Quantity:
                </span>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-soft)',
                    borderRadius: 'var(--radius-full)',
                    padding: '3px 6px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 14px', fontSize: '0.95rem', fontWeight: 700 }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 20, q + 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  icon={<ShoppingBag size={18} />}
                  style={{
                    flex: '1 1 200px',
                    opacity: isOutOfStock ? 0.6 : 1,
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isOutOfStock ? 'Out of Stock ❌' : 'Add to Basket'}
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  style={{
                    flex: '1 1 200px',
                    opacity: isOutOfStock ? 0.6 : 1,
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  }}
                >
                  Buy Now →
                </Button>
              </div>
            </div>

            {/* Product-page clean delivery/gifting points at the bottom */}
            {/* Displayed simply as clean points/lines without separate cards or large headings */}
            <div
              style={{
                borderTop: '1px solid var(--border-soft)',
                paddingTop: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                fontSize: '0.95rem',
                color: 'var(--text-main)',
                fontWeight: 600,
              }}
            >
              <div>4–6 business days 📦</div>
              <div>Perfect for gifting 🎁✨</div>
              <div>All over India Delivery 🇮🇳</div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-serif" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
              You might also adore 💕
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 850px) {
          .product-detail-layout {
            grid-template-columns: 1fr 1.15fr !important;
            gap: 4rem !important;
          }
        }
      `}</style>
    </div>
  );
};
