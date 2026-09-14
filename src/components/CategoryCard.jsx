import React from 'react';
import { Link } from 'react-router-dom';

export const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link to={category.slug} className="category-card" aria-label={`Shop ${category.shortName || category.name}`}>
      <div className="category-img-box">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
        />
      </div>
      <span className="category-card-name">
        {category.name}
      </span>
    </Link>
  );
};
