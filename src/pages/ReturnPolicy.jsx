import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { PolicyNavigation } from '../components/PolicyNavigation';
import { TrustSection } from '../components/TrustSection';

export const ReturnPolicy = () => {
  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <SectionHeading
          tag="our promise"
          title="Return & Exchange Policy 💕"
          subtitle="Everything you need to know about returns, exchanges, and damaged items."
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
              Our Commitment
            </h3>
            <p>
              At Dreambasket, we carefully check products before packing them. We want every order to reach you safely and in good condition.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Damaged or Incorrect Product
            </h3>
            <p>
              If you receive a damaged, defective, or incorrect product, please contact us as soon as possible after delivery.
            </p>
            <p style={{ marginTop: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Please provide:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Your Order ID</li>
              <li>Your name</li>
              <li>A description of the issue</li>
              <li>Clear photographs/videos of the product and packaging if requested</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              We will review the issue and provide the appropriate resolution.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Change of Mind
            </h3>
            <p>
              Returns or exchanges for change of mind may not be available for every product. Please contact Dreambasket before sending anything back so we can confirm whether your particular item is eligible.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Personalized / Selected Items
            </h3>
            <p>
              Items with customer-selected options, such as Handmade Card colour or theme, may not be eligible for return or exchange unless the item arrives damaged, defective, or incorrect.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Jewellery Packaging
            </h3>
            <p>
              Customer-selected packaging is part of the order selection. Packaging charges may not be refundable once the order has been processed, except where Dreambasket determines that the packaging was incorrectly supplied.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Return Approval
            </h3>
            <p>
              Please do not send an item back without contacting Dreambasket first. Return instructions will be provided if your request is approved.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Condition of Returned Products
            </h3>
            <p>
              Where a return is approved, the product should be unused and returned in its original condition and packaging.
            </p>
          </div>

          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Important
            </h3>
            <p>
              Return and exchange requests are reviewed individually. Dreambasket reserves the right to decline a request that does not meet the applicable return or exchange requirements.
            </p>
          </div>
        </div>

        <TrustSection />
      </div>
    </div>
  );
};

export default ReturnPolicy;
