import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlist, cartTotalCount, openSearch, storeSettings } = useShop();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="header-wrapper">
        {/* Subtle Top Notification Ribbon with Final Tagline */}
        <div className="header-top-banner">
          <span>✨ {storeSettings?.tagline || 'Little treasures, made to make you smile 🎀'} ✨</span>
        </div>

        <div className="container header-container">
          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="btn-icon mobile-nav-toggle"
            onClick={toggleMobileMenu}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Dreambasket Logo */}
          <Link to="/" className="header-logo" onClick={closeMobileMenu}>
            <span className="brand-title">Dreambasket</span>
            <span className="brand-subtitle">{storeSettings?.instagramHandle || '@dreambasket.studio'}</span>
          </Link>

          {/* Desktop Navigation Links - Exact requirement:
              Home, Shop, New Arrivals, Jewellery, Bestsellers
              (Accessories & Gifts are strictly NOT in the main header) */}
          <nav className="nav-links-desktop" aria-label="Main Navigation">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Shop
            </NavLink>
            <NavLink to="/anti-tarnish" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              ✨ Anti-Tarnish
            </NavLink>
            <NavLink to="/budget-friendly" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              💎 Budget-Friendly
            </NavLink>
            <NavLink to="/new-arrivals" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              New Arrivals
            </NavLink>
            <NavLink to="/bestsellers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Bestsellers
            </NavLink>
          </nav>

          {/* Action Icons */}
          <div className="header-actions">
            {/* Search Trigger */}
            <button
              type="button"
              className="btn-icon"
              onClick={openSearch}
              aria-label="Search items"
            >
              <Search size={19} />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="btn-icon action-badge-btn"
              aria-label={`Wishlist (${wishlist.length} items)`}
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="badge-counter">{wishlist.length}</span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="btn-icon action-badge-btn"
              aria-label={`Shopping Basket (${cartTotalCount} items)`}
            >
              <ShoppingBag size={19} />
              {cartTotalCount > 0 && (
                <span className="badge-counter">{cartTotalCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Modal */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      >
        <div
          className="mobile-drawer-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-drawer-header">
            <div>
              <div className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                Dreambasket 🎀
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--lavender-deep)' }}>
                {storeSettings?.instagramHandle || '@dreambasket.studio'}
              </div>
            </div>
            <button
              type="button"
              className="btn-icon"
              onClick={closeMobileMenu}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>

          <nav>
            {/* Primary Mobile Navigation */}
            <ul className="mobile-nav-list">
              <li>
                <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>Home</span>
                  <ChevronRight size={16} color="var(--text-light)" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/shop" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>Shop All</span>
                  <ChevronRight size={16} color="var(--text-light)" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/new-arrivals" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>New Arrivals ✨</span>
                  <ChevronRight size={16} color="var(--text-light)" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/bestsellers" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>Bestsellers 💕</span>
                  <ChevronRight size={16} color="var(--text-light)" />
                </NavLink>
              </li>
            </ul>

            {/* 1. Anti-Tarnish Jewellery Section */}
            <div style={{ padding: '0.85rem 1rem 0.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--lavender-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ✨ Anti-Tarnish Jewellery
            </div>
            <ul className="mobile-nav-list" style={{ borderTop: 'none' }}>
              <li>
                <NavLink to="/anti-tarnish" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span style={{ fontWeight: 600 }}>All Anti-Tarnish</span>
                  <ChevronRight size={14} color="var(--text-light)" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/anti-tarnish?sub=chains" className="mobile-nav-link" onClick={closeMobileMenu} style={{ paddingLeft: '1.5rem', fontSize: '0.88rem' }}>
                  <span>→ Chains</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/anti-tarnish?sub=bracelets" className="mobile-nav-link" onClick={closeMobileMenu} style={{ paddingLeft: '1.5rem', fontSize: '0.88rem' }}>
                  <span>→ Bracelets</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/anti-tarnish?sub=earrings" className="mobile-nav-link" onClick={closeMobileMenu} style={{ paddingLeft: '1.5rem', fontSize: '0.88rem' }}>
                  <span>→ Earrings</span>
                </NavLink>
              </li>
            </ul>

            {/* 2. Budget-Friendly Jewellery Section */}
            <div style={{ padding: '0.85rem 1rem 0.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--lavender-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              💎 Budget-Friendly Jewellery
            </div>
            <ul className="mobile-nav-list" style={{ borderTop: 'none' }}>
              <li>
                <NavLink to="/budget-friendly" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span style={{ fontWeight: 600 }}>All Budget-Friendly</span>
                  <ChevronRight size={14} color="var(--text-light)" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/budget-friendly?sub=chains" className="mobile-nav-link" onClick={closeMobileMenu} style={{ paddingLeft: '1.5rem', fontSize: '0.88rem' }}>
                  <span>→ Chains</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/budget-friendly?sub=bracelets" className="mobile-nav-link" onClick={closeMobileMenu} style={{ paddingLeft: '1.5rem', fontSize: '0.88rem' }}>
                  <span>→ Bracelets</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/budget-friendly?sub=korean-earrings" className="mobile-nav-link" onClick={closeMobileMenu} style={{ paddingLeft: '1.5rem', fontSize: '0.88rem' }}>
                  <span>→ Korean Earrings</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/budget-friendly?sub=rings" className="mobile-nav-link" onClick={closeMobileMenu} style={{ paddingLeft: '1.5rem', fontSize: '0.88rem' }}>
                  <span>→ Rings</span>
                </NavLink>
              </li>
            </ul>

            {/* Other Boutique Collections */}
            <div style={{ padding: '0.85rem 1rem 0.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              More Treasures
            </div>
            <ul className="mobile-nav-list" style={{ borderTop: 'none' }}>
              <li>
                <NavLink to="/handmade-cards" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>Handmade Cards 💌</span>
                  <ChevronRight size={14} color="var(--text-light)" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/jewellery-combos" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>Jewellery Combos 💞</span>
                  <ChevronRight size={14} color="var(--text-light)" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/princess-chains" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>Princess Chains 👑</span>
                  <ChevronRight size={14} color="var(--text-light)" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/hair-accessories" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>Hair Accessories 🦋</span>
                  <ChevronRight size={14} color="var(--text-light)" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/gift-hampers" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>Gift Hampers 🎁</span>
                  <ChevronRight size={14} color="var(--text-light)" />
                </NavLink>
              </li>
            </ul>
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', textAlign: 'center' }}>
            <a
              href="https://instagram.com/dreambasket.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ width: '100%' }}
            >
              Follow @dreambasket.studio 📸
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
