import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Mail, X } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { PinterestIcon } from './icons/PinterestIcon';
import { useShop } from '../context/ShopContext';

export const Footer = () => {
  const { storeSettings } = useShop();
  const [isCareModalOpen, setIsCareModalOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <Link to="/" className="brand-title">
              Dreambasket
            </Link>
            <div className="brand-tagline">
              {storeSettings?.tagline || 'Little treasures, made to make you smile 🎀'}
            </div>
            <p>
              A boutique for romantic anti-tarnish jewellery, dainty hair charms, and heartwarming curated gift hampers.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
              <a
                href={storeSettings?.instagramUrl || 'https://www.instagram.com/dreambasket.studio?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=='}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                aria-label="Dreambasket Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              {storeSettings?.whatsappNumber && (
                <a
                  href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-icon"
                  aria-label="Dreambasket WhatsApp"
                >
                  <MessageCircle size={18} color="#25D366" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/shop" className="footer-link">Shop</Link></li>
              <li><Link to="/new-arrivals" className="footer-link">New Arrivals</Link></li>
              <li><Link to="/anti-tarnish" className="footer-link">Jewellery</Link></li>
              <li><Link to="/bestsellers" className="footer-link">Bestsellers</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-links">
              <li><Link to="/cart" className="footer-link">Shopping Basket</Link></li>
              <li><Link to="/wishlist" className="footer-link">My Wishlist</Link></li>
              <li><Link to="/contact" className="footer-link">Contact & Orders</Link></li>
              <li>
                <a
                  href="mailto:dreambasket16@gmail.com"
                  className="footer-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Mail size={14} style={{ opacity: 0.8 }} />
                  <span>dreambasket16@gmail.com</span>
                </a>
              </li>
              <li><Link to="/about" className="footer-link">Our Story</Link></li>
              <li style={{ marginTop: '0.35rem' }}>
                <a
                  href="https://www.instagram.com/dreambasket.studio?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#FCE7F3',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#BE185D',
                      flexShrink: 0,
                    }}
                  >
                    <InstagramIcon size={12} />
                  </span>
                  <span>Instagram: @dreambasket.studio</span>
                </a>
              </li>
              <li>
                <a
                  href="https://in.pinterest.com/dreambasket16/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#FEE2E2',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E60023',
                      flexShrink: 0,
                    }}
                  >
                    <PinterestIcon size={11} />
                  </span>
                  <span>Pinterest: @dreambasket16</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Policies & Info */}
          <div>
            <h4 className="footer-heading">Policies & Info</h4>
            <ul className="footer-links">
              <li><Link to="/shipping-policy" className="footer-link">Shipping Policy (6–7 business days)</Link></li>
              <li><Link to="/return-policy" className="footer-link">Return & Exchange Policy</Link></li>
              <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
              <li style={{ marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCareModalOpen(true)}
                  className="footer-link"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--lavender-deep)',
                    fontWeight: 600,
                    textAlign: 'left',
                  }}
                >
                  <span>✨ Jewellery Care Instructions</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            © 2026 Dreambasket. All rights reserved. Made with love for dreamy souls 🎀
          </p>
        </div>
      </div>

      {/* ✨ Jewellery Care Instructions Modal */}
      {isCareModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(58, 45, 53, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 1000,
          }}
          onClick={() => setIsCareModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-soft)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>✨</span>
                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>
                  Jewellery Care Instructions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCareModalOpen(false)}
                className="btn-icon"
                aria-label="Close jewellery care instructions"
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Follow these simple care guidelines to keep your delicate Dreambasket treasures shining beautifully:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>💧</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Keep Away From Moisture</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                    Avoid unnecessary exposure to moisture and humidity to help maintain the jewellery's finish.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>🌙</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Remove When Sleeping</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                    Remove jewellery before sleeping to help prevent unnecessary friction, pulling, or damage.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>🌸</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Let Perfume & Lotion Dry</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                    Allow perfume, lotion, creams, and similar products to dry before wearing jewellery.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>🚿</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Remove Before Entering Water</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                    Remove jewellery before showers, swimming, or other water activities.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>🎁</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Store in a Closed Bag or Box</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                    Store jewellery safely in a closed bag or jewellery box when not in use.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>🏃‍♀️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Remove When Active</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                    Remove jewellery during workouts, sports, or activities involving excessive sweat or friction.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setIsCareModalOpen(false)}
                style={{
                  background: 'var(--lavender-deep)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.65rem 1.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                Close & Return to Boutique
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
