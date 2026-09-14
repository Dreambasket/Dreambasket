import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Grid, ShoppingBag } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { useShop } from '../context/ShopContext';

export const MobileBottomNav = () => {
  const { wishlist, cartTotalCount } = useShop();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <NavLink
        to="/"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <Home size={19} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Heart size={19} />
        {wishlist.length > 0 && (
          <span className="bottom-nav-badge">{wishlist.length}</span>
        )}
        <span>Wishlist</span>
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Grid size={19} />
        <span>Shop</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <ShoppingBag size={19} />
        {cartTotalCount > 0 && (
          <span className="bottom-nav-badge">{cartTotalCount}</span>
        )}
        <span>Cart</span>
      </NavLink>

      <a
        href="https://instagram.com/dreambasket.studio"
        target="_blank"
        rel="noopener noreferrer"
        className="bottom-nav-item"
        aria-label="Instagram @dreambasket.studio"
      >
        <InstagramIcon size={19} />
        <span>Instagram</span>
      </a>
    </nav>
  );
};
