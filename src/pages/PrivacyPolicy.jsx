import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { PolicyNavigation } from '../components/PolicyNavigation';
import { TrustSection } from '../components/TrustSection';

export const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <SectionHeading
          tag="your privacy"
          title="Privacy Policy 🔒"
          subtitle="How Dreambasket respects and protects your personal information."
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
              Your Privacy Matters
            </h3>
            <p>
              Dreambasket respects your privacy and aims to handle your personal information responsibly.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Information We Collect
            </h3>
            <p>
              When you place an order, we may collect information such as:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Name</li>
              <li>Phone number</li>
              <li>Delivery address</li>
              <li>Instagram ID, if you choose to provide it</li>
              <li>Order and product details</li>
              <li>Information required to process and deliver your order</li>
            </ul>
            <p style={{ marginTop: '0.75rem', fontSize: '0.92rem', color: 'var(--lavender-deep)', fontWeight: 600 }}>
              Instagram ID is optional and is not required to place an order.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              How We Use Your Information
            </h3>
            <p>
              Your information may be used to:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Process your orders</li>
              <li>Contact you regarding your order</li>
              <li>Arrange delivery</li>
              <li>Provide customer support</li>
              <li>Handle returns or exchanges</li>
              <li>Maintain order records</li>
              <li>Improve our products and services</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Payment Information
            </h3>
            <p>
              Dreambasket should not unnecessarily store sensitive payment credentials. Payment information should be handled through the applicable payment provider or payment process used by the website.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Information Security
            </h3>
            <p>
              We take reasonable measures to protect customer information and restrict access to information that should only be available to authorized administrators.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Sharing Information
            </h3>
            <p>
              Customer information may be shared only when reasonably necessary to fulfil an order or provide a required service, such as with delivery/courier partners.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              We do not intend to sell customers' personal information.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Instagram
            </h3>
            <p>
              If you voluntarily provide your Instagram ID, it may be used for customer communication related to your order or support.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Following Dreambasket on Instagram is optional.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Data Retention
            </h3>
            <p>
              Order information may be retained for legitimate business, customer service, accounting, security, and record-keeping purposes.
            </p>
          </div>

          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Changes to This Policy
            </h3>
            <p>
              This Privacy Policy may be updated from time to time. Any updated version will be displayed on the Dreambasket website.
            </p>
          </div>
        </div>

        <TrustSection />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
