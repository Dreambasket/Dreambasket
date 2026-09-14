import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { storeService } from '../services/storeService';
import { useShop } from '../context/ShopContext';
import { InstagramIcon } from '../components/icons/InstagramIcon';
import { Button } from '../components/Button';

export const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const { storeSettings } = useShop();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [copied, setCopied] = useState(Boolean(location.state?.messageCopied));
  const [orderMessage, setOrderMessage] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order && orderNumber) {
        try {
          const found = await storeService.getOrderById(orderNumber);
          setOrder(found);
          if (found) {
            setOrderMessage(storeService.generateInstagramOrderMessage(found));
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else if (order) {
        setOrderMessage(storeService.generateInstagramOrderMessage(order));
        setLoading(false);
      }
    };
    fetchOrder();
  }, [order, orderNumber]);

  const handleCopyMessage = async () => {
    if (!orderMessage) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(orderMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
        return;
      }
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = orderMessage;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenInstagram = () => {
    const url = storeSettings?.instagramUrl || 'https://instagram.com/dreambasket.studio';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <p>Retrieving your order details... 🎀</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center', maxWidth: '480px' }}>
        <h2>Order not found 💭</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
          We could not locate order details for #{orderNumber}.
        </p>
        <Button to="/shop" variant="primary">
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Success Banner Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '2px solid var(--pink-blush)',
            borderRadius: '28px',
            padding: '2.5rem 1.75rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--pink-soft), var(--lavender-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '2.4rem',
            }}
          >
            🎀
          </div>

          <h1 className="font-serif" style={{ fontSize: '2.3rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Order placed successfully 🎀
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--lavender-deep)', fontWeight: 600, marginBottom: '1.5rem' }}>
            Thank you for shopping with Dreambasket 💕
          </p>

          {/* Order ID Badge */}
          <div
            style={{
              display: 'inline-block',
              background: 'var(--bg-main)',
              border: '1.5px solid var(--border-soft)',
              borderRadius: '16px',
              padding: '0.6rem 1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order ID: </span>
            <strong style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginLeft: '4px', letterSpacing: '0.5px' }}>
              {order.orderNumber}
            </strong>
          </div>

          {/* Instructions Box */}
          <div
            style={{
              background: '#FFF8FB',
              border: '1px solid var(--border-lavender)',
              borderRadius: '20px',
              padding: '1.75rem',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              textAlign: 'left',
              fontSize: '0.96rem',
              lineHeight: 1.6,
              color: 'var(--text-main)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>
                Please contact us on Instagram{' '}
                <a
                  href="https://instagram.com/dreambasket.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--lavender-deep)', textDecoration: 'underline' }}
                >
                  @dreambasket.studio
                </a>{' '}
                to continue with your order.
              </p>
              <p style={{ margin: 0 }}>
                Payment details will be shared personally via Instagram after we review your order.
              </p>
              <p style={{ margin: 0 }}>
                Delivery charges, if applicable, will be shared before payment.
              </p>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--lavender-deep)' }}>
                Your order will be confirmed after payment verification.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <a
              href="https://instagram.com/dreambasket.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.6rem',
                fontSize: '1rem',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, var(--lavender-deep), #8E54E9)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(142, 84, 233, 0.25)',
              }}
            >
              <Heart size={18} fill="#FFFFFF" />
              <span>💗 Contact us on Instagram</span>
            </a>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.6rem',
                fontSize: '1rem',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                fontWeight: 600,
                background: copied ? '#E8F5E9' : '#FFFFFF',
                borderColor: copied ? '#2E7D32' : 'var(--border-soft)',
                color: copied ? '#2E7D32' : 'var(--text-main)',
                transition: 'all 0.2s ease',
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'Order Details Copied! ✨' : '📋 Copy Order Details'}</span>
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <Button
              to="/shop"
              variant="secondary"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
            >
              Continue Shopping 🛍️
            </Button>
          </div>
        </div>

        {/* Order Details Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-soft)',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Order Items & Recipient
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.productName}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} • ₹{item.price} each
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>₹{item.lineTotal}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Product Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{order.pricing.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Charges</span>
              <span style={{ color: 'var(--lavender-deep)', fontWeight: 600, fontStyle: 'italic' }}>
                To be confirmed
              </span>
            </div>
            <div style={{ borderTop: '1.5px dashed var(--border-soft)', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
              <span>Final Amount</span>
              <span style={{ color: 'var(--lavender-deep)' }}>
                ₹{order.pricing.subtotal} <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)' }}>+ Delivery (to be confirmed)</span>
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '14px', background: 'var(--bg-main)', border: '1px solid var(--border-soft)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              Delivery Recipient Details
            </span>
            <div style={{ fontWeight: 600 }}>
              {order.customer.fullName} • {order.customer.phoneNumber}
              {(order.customer.instagramId || order.customer.instagramUsername) && (
                <span style={{ color: 'var(--lavender-deep)' }}> • Instagram: {order.customer.instagramId || order.customer.instagramUsername}</span>
              )}
              <br />
              {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
