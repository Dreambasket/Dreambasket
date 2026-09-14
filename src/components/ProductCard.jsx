import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();

  if (!product) return null;

  const wishlisted = isInWishlist(product.id);

  const isOutOfStock = product.inStock === false || product.stockStatus === 'out_of_stock' || (product.stockQuantity !== undefined && product.stockQuantity <= 0);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {isOutOfStock ? (
          <span className="product-badge" style={{ background: '#EF4444', color: '#FFFFFF' }}>
            Out of Stock
          </span>
        ) : product.badge ? (
          <span className="product-badge">
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          className={`product-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            size={17}
            fill={wishlisted ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="product-info">
        {product.categoryName && (
          <span className="product-category-tag">{product.categoryName}</span>
        )}

        <Link to={`/product/${product.id}`} className="product-title" title={product.name}>
          {product.name}
        </Link>

        <div className="product-price-row">
          <span className="product-price">₹{product.price}</span>
          {product.originalPrice && (
            <span className="product-orig-price">₹{product.originalPrice}</span>
          )}
          <span className="product-sample-tag">Sample</span>
        </div>

        <button
          type="button"
          className="product-card-btn"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to basket`}
          style={isOutOfStock ? { opacity: 0.65, cursor: 'not-allowed', background: '#F3F4F6', color: '#9CA3AF' } : {}}
        >
          <ShoppingBag size={15} />
          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Basket'}</span>
        </button>
      </div>
    </div>
  );
};
