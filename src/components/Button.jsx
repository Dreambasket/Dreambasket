import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({
  children,
  to,
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'lavender' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`.trim();

  const content = (
    <>
      {icon && <span className="btn-icon-inner">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={baseClasses} onClick={onClick} {...props}>
      {content}
    </button>
  );
};
