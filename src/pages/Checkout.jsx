import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { storeService } from '../services/storeService';
import { InstagramIcon } from '../components/icons/InstagramIcon';
import { Button } from '../components/Button';

export const Checkout = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    orderNotes,
    storeSettings,
    placeOrder,
  } = useShop();

  // Active step: 'details' | 'summary'
  const [currentStep, setCurrentStep] = useState('details');

  // Customer Details Form Fields (Required by user)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    instagramId: '',
    notes: orderNotes || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // If cart is empty and no order created yet, redirect to cart
  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center', maxWidth: '480px' }}>
        <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Your dream basket is empty 💭
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Please add items to your basket before proceeding to order.
        </p>
        <Button to="/shop" variant="primary">
          Explore Treasures
        </Button>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validation: Full Name, Mobile Number, Complete Address, City, State, Pincode
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name cannot be empty.';
    }

    const cleanPhone = formData.phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Complete delivery address cannot be empty.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City cannot be empty.';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State cannot be empty.';
    }

    const cleanPin = formData.pincode.replace(/[^0-9]/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      newErrors.pincode = 'Please enter a valid 6-digit postal pincode.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // When customer clicks "Review Order Summary"
  const handleProceedToSummary = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep('summary');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Order Submission
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      setCurrentStep('details');
      return;
    }

    setIsSubmitting(true);

    try {
      let order = createdOrder;

      // Create order in database if not already created
      if (!order) {
        const result = await placeOrder({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          instagramId: formData.instagramId ? formData.instagramId.trim() : '',
          notes: formData.notes,
        });
        order = result.order;
        setCreatedOrder(order);
      }

      setIsSubmitting(false);

      // Navigate to Order Success confirmation
      navigate(`/order-success/${order.orderNumber}`, {
        state: { order },
      });
    } catch (err) {
      alert(`Could not save order: ${err.message || 'Please check your connection and try again.'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0 5rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Step Navigation Bar */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <Link to="/cart" style={{ color: 'var(--lavender-deep)' }}>
              <span>Cart</span>
            </Link>
            <span style={{ color: 'var(--text-light)' }}>→</span>

            <span
              onClick={() => {
                if (!createdOrder) setCurrentStep('details');
              }}
              style={{
                color: currentStep === 'details' ? 'var(--text-main)' : 'var(--lavender-deep)',
                cursor: createdOrder ? 'default' : 'pointer',
                borderBottom: currentStep === 'details' ? '2px solid var(--lavender-deep)' : 'none',
                paddingBottom: '2px',
              }}
            >
              1. Customer Details
            </span>
            <span style={{ color: 'var(--text-light)' }}>→</span>

            <span
              style={{
                color: currentStep === 'summary' ? 'var(--text-main)' : 'var(--text-light)',
                borderBottom: currentStep === 'summary' ? '2px solid var(--lavender-deep)' : 'none',
                paddingBottom: '2px',
              }}
            >
              2. Order Summary
            </span>
          </div>
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => {
            if (currentStep === 'summary') setCurrentStep('details');
            else navigate('/cart');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--lavender-deep)',
            fontSize: '0.88rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>{currentStep === 'summary' ? 'Edit Customer Details' : 'Back to Cart'}</span>
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            alignItems: 'flex-start',
          }}
          className="checkout-layout"
        >
          {/* Main Column */}
          <div>
            {currentStep === 'details' ? (
              /* =========================================================
                 STEP 1: CUSTOMER DETAILS FORM
                 ========================================================= */
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: '24px',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
                    Customer & Delivery Details 🎀
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Please enter your delivery details. All fields marked with <span style={{ color: '#E84C7A' }}>*</span> are required.
                  </p>
                </div>

                <form onSubmit={handleProceedToSummary} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Full Name <span style={{ color: '#E84C7A' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aanya Sharma"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '12px',
                        border: errors.fullName ? '1.5px solid #E84C7A' : '1px solid var(--border-soft)',
                        background: 'var(--bg-main)',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    {errors.fullName && (
                      <div style={{ fontSize: '0.78rem', color: '#E84C7A', marginTop: '0.25rem' }}>{errors.fullName}</div>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Mobile Number <span style={{ color: '#E84C7A' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '12px',
                        border: errors.phoneNumber ? '1.5px solid #E84C7A' : '1px solid var(--border-soft)',
                        background: 'var(--bg-main)',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    {errors.phoneNumber && (
                      <div style={{ fontSize: '0.78rem', color: '#E84C7A', marginTop: '0.25rem' }}>{errors.phoneNumber}</div>
                    )}
                  </div>

                  {/* Complete Delivery Address */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Complete Delivery Address <span style={{ color: '#E84C7A' }}>*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="House/Flat No, Apartment/Building, Street, Area"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '12px',
                        border: errors.address ? '1.5px solid #E84C7A' : '1px solid var(--border-soft)',
                        background: 'var(--bg-main)',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    {errors.address && (
                      <div style={{ fontSize: '0.78rem', color: '#E84C7A', marginTop: '0.25rem' }}>{errors.address}</div>
                    )}
                  </div>

                  {/* City, State, Pincode */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                        City <span style={{ color: '#E84C7A' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem 1rem',
                          borderRadius: '12px',
                          border: errors.city ? '1.5px solid #E84C7A' : '1px solid var(--border-soft)',
                          background: 'var(--bg-main)',
                          fontSize: '0.92rem',
                          outline: 'none',
                        }}
                      />
                      {errors.city && (
                        <div style={{ fontSize: '0.78rem', color: '#E84C7A', marginTop: '0.25rem' }}>{errors.city}</div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                        State <span style={{ color: '#E84C7A' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Maharashtra"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem 1rem',
                          borderRadius: '12px',
                          border: errors.state ? '1.5px solid #E84C7A' : '1px solid var(--border-soft)',
                          background: 'var(--bg-main)',
                          fontSize: '0.92rem',
                          outline: 'none',
                        }}
                      />
                      {errors.state && (
                        <div style={{ fontSize: '0.78rem', color: '#E84C7A', marginTop: '0.25rem' }}>{errors.state}</div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                        Pincode <span style={{ color: '#E84C7A' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="6 digits"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem 1rem',
                          borderRadius: '12px',
                          border: errors.pincode ? '1.5px solid #E84C7A' : '1px solid var(--border-soft)',
                          background: 'var(--bg-main)',
                          fontSize: '0.92rem',
                          outline: 'none',
                        }}
                      />
                      {errors.pincode && (
                        <div style={{ fontSize: '0.78rem', color: '#E84C7A', marginTop: '0.25rem' }}>{errors.pincode}</div>
                      )}
                    </div>
                  </div>

                  {/* Instagram ID (Optional) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      Instagram ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your Instagram ID"
                      value={formData.instagramId}
                      onChange={(e) => handleInputChange('instagramId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-soft)',
                        background: 'var(--bg-main)',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Optional — helps us contact you about your order on Instagram.
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    style={{ width: '100%', marginTop: '1rem', padding: '0.95rem' }}
                  >
                    Continue to Order Summary →
                  </Button>
                </form>
              </div>
            ) : (
              /* =========================================================
                 STEP 2: FINAL ORDER SUMMARY & ORDER CONFIRMATION
                 ========================================================= */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Order Summary Card */}
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1.5px solid var(--border-soft)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.75rem' }}>
                    <h3 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>
                      Final Order Summary
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('details')}
                      style={{ fontSize: '0.82rem', color: 'var(--lavender-deep)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Edit Details
                    </button>
                  </div>

                  {/* Customer Details Display */}
                  <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    <div><strong>Customer:</strong> {formData.fullName}</div>
                    <div><strong>Mobile Number:</strong> {formData.phoneNumber}</div>
                    {formData.instagramId && (
                      <div><strong>Instagram ID:</strong> {formData.instagramId}</div>
                    )}
                    <div><strong>Delivery Address:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.pincode}</div>
                    {formData.notes && <div><strong>Order Note:</strong> {formData.notes}</div>}
                  </div>

                  {/* Products list with packaging & card options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {cart.map((item) => {
                      const { product, quantity, packaging, packagingPrice = 0, color, theme, cartItemId } = item;
                      const unitPrice = Number(product.price) + (Number(packagingPrice) || 0);
                      const lineTotal = unitPrice * quantity;

                      return (
                        <div
                          key={cartItemId || product.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--border-soft)',
                            paddingBottom: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{ width: '54px', height: '54px', borderRadius: '12px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{product.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Product ID: {product.sku || product.id} • Qty: {quantity} × ₹{unitPrice}
                              </div>
                              {packaging && (
                                <div style={{ fontSize: '0.78rem', color: 'var(--lavender-deep)', fontWeight: 600 }}>
                                  🎁 Packaging: {packaging.name} {packagingPrice > 0 ? `(+₹${packagingPrice})` : '(Included)'}
                                </div>
                              )}
                              {(color || theme) && (
                                <div style={{ fontSize: '0.78rem', color: '#E84C7A', fontWeight: 600 }}>
                                  💌 Card: {color ? `Color: ${color}` : ''} {theme ? `• Theme: ${theme}` : ''}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                            ₹{lineTotal}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.92rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Product Subtotal</span>
                      <span style={{ fontWeight: 600 }}>₹{cartSubtotal}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                      <span style={{ color: 'var(--lavender-deep)', fontWeight: 600, fontStyle: 'italic' }}>
                        To be confirmed
                      </span>
                    </div>

                    <div
                      style={{
                        borderTop: '1.5px dashed var(--border-soft)',
                        paddingTop: '0.75rem',
                        marginTop: '0.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                      }}
                    >
                      <span>Final Amount</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--lavender-deep)' }}>₹{cartSubtotal}</span>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>
                          + Delivery charges to be confirmed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clean Order Placement Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 248, 251, 0.95), rgba(244, 217, 232, 0.4))',
                    border: '1.5px solid var(--border-lavender)',
                    borderRadius: '24px',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                    <Sparkles size={20} color="var(--lavender-deep)" />
                    <h3 className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>
                      Confirm & Place Order 🎀
                    </h3>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Click below to place your order. Our team will review your order details and contact you to confirm delivery and payment.
                  </p>

                  <Button
                    variant="primary"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    icon={<Heart size={18} fill="#FFFFFF" />}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', justifyContent: 'center' }}
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order 🎀'}
                  </Button>

                  <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                    <a
                      href="https://instagram.com/dreambasket.studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.86rem',
                        color: 'var(--lavender-deep)',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <InstagramIcon size={16} />
                      <span>Follow @dreambasket.studio on Instagram</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Quick Items Preview */}
          {currentStep === 'details' && (
            <div>
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <h3 className="font-serif" style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                  Your Basket ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {cart.map((item) => {
                    const { product, quantity, packaging, packagingPrice = 0, color, theme, cartItemId } = item;
                    const unitPrice = Number(product.price) + (Number(packagingPrice) || 0);
                    const lineTotal = unitPrice * quantity;
                    return (
                      <div key={cartItemId || product.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                            Qty: {quantity} • ₹{lineTotal}
                            {packaging && ` (${packaging.name})`}
                            {color && ` (${color})`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Product Total</span>
                    <span style={{ fontWeight: 700 }}>₹{cartSubtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                    <span style={{ color: 'var(--lavender-deep)', fontWeight: 600, fontStyle: 'italic' }}>To be confirmed</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @media (min-width: 820px) {
            .checkout-layout {
              grid-template-columns: ${currentStep === 'details' ? '1.6fr 1fr' : '1fr'} !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
