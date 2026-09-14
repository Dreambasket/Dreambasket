import React from 'react';
import { NavLink } from 'react-router-dom';

export const PolicyNavigation = () => {
  const tabs = [
    { label: 'Shipping Policy 📦', path: '/shipping-policy' },
    { label: 'Return & Exchange 💕', path: '/return-policy' },
    { label: 'Privacy Policy 🔒', path: '/privacy-policy' },
    { label: 'Terms & Conditions 📋', path: '/terms' },
    { label: 'Jewellery Care ✨', path: '/jewellery-care' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.6rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '0 auto 2.5rem',
        maxWidth: '850px',
      }}
    >
      {tabs.map((t) => (
        <NavLink
          key={t.path}
          to={t.path}
          style={({ isActive }) => ({
            padding: '0.5rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.86rem',
            fontWeight: isActive ? 700 : 500,
            color: isActive ? '#FFFFFF' : 'var(--text-main)',
            background: isActive ? 'var(--lavender-deep)' : 'var(--bg-surface)',
            border: isActive ? '1px solid var(--lavender-deep)' : '1px solid var(--border-soft)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
          })}
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );
};
