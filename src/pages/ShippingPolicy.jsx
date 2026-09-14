import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { PolicyNavigation } from '../components/PolicyNavigation';
import { TrustSection } from '../components/TrustSection';

export const ShippingPolicy = () => {
  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <SectionHeading
          tag="customer service"
          title="Shipping Policy 📦"
          subtitle="Clear, reliable delivery information for all orders across India."
        />

        <PolicyNavigation />

        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto 4rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-soft)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-sm)',
            lineHeight: 1.8,
            fontSize: '0.98rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Order Processing
            </h3>
            <p>
              Orders are carefully prepared and packed after they are placed. We aim to process orders as quickly as possible while ensuring that each package is checked and packed with care.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Delivery Time
            </h3>
            <p>
              Standard delivery across India usually takes:
            </p>
            <div
              style={{
                margin: '0.75rem 0',
                padding: '0.85rem 1.25rem',
                background: '#FFF5FA',
                borderRadius: '12px',
                border: '1px solid var(--border-soft)',
                fontWeight: 700,
                color: 'var(--lavender-deep)',
                fontSize: '1.05rem',
                display: 'inline-block',
              }}
            >
              6–7 business days
            </div>
            <p>
              Delivery time may vary slightly depending on the destination, courier service, weather conditions, holidays, or other circumstances beyond our control.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Delivery Area
            </h3>
            <p>
              We currently provide delivery across India 🇮🇳.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Order Tracking
            </h3>
            <p>
              If tracking information is available for your order, it will be shared with you through the contact details provided during checkout.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Delivery Delays
            </h3>
            <p>
              While we do our best to ensure timely delivery, courier delays may occasionally occur. Dreambasket is not responsible for delays caused by courier partners, weather conditions, public holidays, incorrect delivery information, or circumstances outside our control.
            </p>
          </div>

          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Incorrect Address
            </h3>
            <p>
              Customers are responsible for providing a complete and accurate delivery address and phone number during checkout. Delays or additional delivery charges caused by an incorrect or incomplete address may be the customer's responsibility.
            </p>
          </div>
        </div>

        <TrustSection />
      </div>
    </div>
  );
};

export default ShippingPolicy;
