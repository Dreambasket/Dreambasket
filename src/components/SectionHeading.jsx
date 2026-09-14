import React from 'react';

export const SectionHeading = ({
  title,
  subtitle,
  tag,
  align = 'center',
  className = '',
}) => {
  return (
    <div
      className={`section-header ${className}`}
      style={{ textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start' }}
    >
      {tag && <div className="section-tag">{tag}</div>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};
