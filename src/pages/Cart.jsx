import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/Button';

export const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    storeSettings,
  } = useShop();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center', maxWidth: '500px' }}>
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'var(--pink-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.2rem',
          }}
        >
          🎀
        </div>
        <h1 className="font-serif" style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
          Your dream basket is empty
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.96rem', lineHeight: 1.6 }}>
          Explore our delicate jewels, bows, and little gifts to fill your basket with joy.
        </p>
        <Button to="/shop" variant="primary" icon={<Sparkles size={16} />}>
          Explore All Treasures
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 6rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="font-serif" style={{ fontSize: '2.4rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Shopping Cart 🎀
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Review your treasures before continuing to your delivery details
          </p>
        </div>

        {/* Cart Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            alignItems: 'flex-start',
            maxWidth: '1080px',
            margin: '0 auto',
          }}
          className="cart-layout"
        >
          {/* Left Column: Items List */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {cart.map((item) => {
                const { product, quantity, packaging, packagingPrice = 0, color, theme, cartItemId } = item;
                const unitPrice = Number(product.price) + (Number(packagingPrice) || 0);
                const lineTotal = unitPrice * quantity;
                const itemKey = cartItemId || product.id;

                return (
                  <div
                    key={itemKey}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-soft)',
                      borderRadius: '18px',
                      padding: '1.1rem',
                      boxShadow: 'var(--shadow-sm)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Link to={`/product/${product.id}`} style={{ flexShrink: 0 }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '14px',
                          objectFit: 'cover',
                          background: 'var(--pink-soft)',
                        }}
                      />
                    </Link>

                    <div style={{ flexGrow: 1, minWidth: '200px' }}>
                      <Link
                        to={`/product/${product.id}`}
                        style={{
                          fontWeight: 600,
                          fontSize: '1.02rem',
                          color: 'var(--text-main)',
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {product.name}
                      </Link>

                      <div style={{ fontSize: '0.78rem', color: 'var(--lavender-deep)', marginTop: '2px' }}>
                        {product.categoryName || product.category}
                        <span style={{ color: 'var(--text-light)', marginLeft: '6px' }}>
                          (ID: {product.sku || product.id})
                        </span>
                        {product.isCombo && ' • Matching Combo Set'}
                      </div>

                      {/* Selected Packaging */}
                      {packaging && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📦 Packaging:</span>
                          <strong style={{ color: 'var(--lavender-deep)' }}>{packaging.name}</strong>
                          {packagingPrice > 0 && <span>(+₹{packagingPrice})</span>}
                        </div>
                      )}

                      {/* Selected Card Options */}
                      {(color || theme) && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {color && (
                            <span>
                              🎨 Color: <strong>{color}</strong>
                            </span>
                          )}
                          {theme && (
                            <span>
                              💌 Theme: <strong>{theme}</strong>
                            </span>
                          )}
                        </div>
                      )}

                      <div style={{ fontWeight: 700, fontSize: '0.98rem', marginTop: '6px' }}>
                        ₹{lineTotal}{' '}
                        <span style={{ fontSize: '0.76rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                          (₹{unitPrice} each)
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border-soft)',
                          borderRadius: '10px',
                          padding: '3px 5px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemKey, -1)}
                          style={{ width: '28px', height: '28px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.92rem', fontWeight: 700 }}>
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemKey, 1)}
                          style={{ width: '28px', height: '28px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(itemKey)}
                        className="btn-icon"
                        style={{ width: '34px', height: '34px', color: 'var(--text-light)', cursor: 'pointer' }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--border-soft)',
              borderRadius: '24px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '100px',
            }}
          >
            <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Product Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{cartSubtotal}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Charges</span>
              <span style={{ color: 'var(--lavender-deep)', fontWeight: 600, fontStyle: 'italic' }}>
                To be confirmed
              </span>
            </div>

            <div
              style={{
                borderTop: '1.5px dashed var(--border-soft)',
                paddingTop: '1rem',
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.2rem',
                fontWeight: 700,
                alignItems: 'baseline',
              }}
            >
              <span>Total Amount</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--lavender-deep)' }}>
                  ₹{cartSubtotal}
                </span>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>
                  + Delivery (to be confirmed)
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.85rem', background: 'var(--bg-main)', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-soft)', lineHeight: 1.5 }}>
              💌 <em>Your order will be confirmed through Instagram. Delivery charges will be shared with you before payment.</em>
            </div>

            {/* Buttons: Proceed to Order & Continue Shopping */}
            <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Button
                to="/checkout"
                variant="primary"
                icon={<ArrowRight size={18} />}
                style={{ width: '100%', padding: '0.95rem', fontSize: '1.02rem', justifyContent: 'center' }}
              >
                Proceed to Order
              </Button>

              <Button
                to="/shop"
                variant="outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 840px) {
            .cart-layout {
              grid-template-columns: 1.55fr 1fr !important;
            }
          }
        `}</style>
      </div>

      {/* Mobile Sticky Checkout Total Bar */}
      <div className="mobile-sticky-cart-bar">
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Product Total</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--lavender-deep)' }}>
            ₹{cartSubtotal}
          </div>
        </div>
        <Button to="/checkout" variant="primary" icon={<ArrowRight size={16} />}>
          Proceed to Order
        </Button>
      </div>

      <style>{`
        .mobile-sticky-cart-bar {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-sticky-cart-bar {
            display: flex;
            align-items: center;
            justifyContent: space-between;
            position: fixed;
            bottom: 60px;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(8px);
            border-top: 1px solid var(--border-soft);
            padding: 0.75rem 1.25rem;
            z-index: 90;
            box-shadow: 0 -4px 16px rgba(142, 114, 159, 0.08);
          }
        }
      `}</style>
    </div>
  );
};
