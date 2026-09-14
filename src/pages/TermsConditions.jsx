import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { PolicyNavigation } from '../components/PolicyNavigation';
import { TrustSection } from '../components/TrustSection';

export const TermsConditions = () => {
  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <SectionHeading
          tag="terms & info"
          title="Terms & Conditions 📋"
          subtitle="Simple, clear guidelines for using the Dreambasket boutique and placing orders."
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
              Welcome to Dreambasket
            </h3>
            <p>
              By using the Dreambasket website or placing an order, you agree to use the website responsibly and provide accurate information when required.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Products
            </h3>
            <p>
              Product images, colours, appearance, and other visual details may vary slightly depending on lighting, photography, display settings, and screen differences.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Where product-specific specifications are provided, they will be based on the information available for that particular product.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Prices
            </h3>
            <p>
              Product prices displayed on the website are the current selling prices at the time of purchase.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Dreambasket may update product prices, offers, availability, or product information at any time.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Orders
            </h3>
            <p>
              Customers are responsible for providing accurate information during checkout, including:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Name</li>
              <li>Phone number</li>
              <li>Delivery address</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>
              Providing an Instagram ID is optional.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              An order is considered successfully placed only after the website confirms successful order creation.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Product Availability
            </h3>
            <p>
              Product availability may change depending on stock.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              If an item becomes unavailable, Dreambasket may need to contact the customer regarding the order and provide an appropriate resolution.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Customer-Selected Options
            </h3>
            <p>
              Where applicable, customers are responsible for selecting the correct:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Jewellery packaging</li>
              <li>Handmade Card colour</li>
              <li>Handmade Card theme</li>
              <li>Other available product options</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>
              Selected options become part of the order.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Delivery
            </h3>
            <p>
              Standard delivery is generally: <strong>6–7 business days</strong>.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Delivery times may vary due to courier delays, holidays, weather, incorrect address information, or other circumstances outside Dreambasket's control.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Website Use
            </h3>
            <p>
              Customers must not misuse the website, attempt unauthorized access, interfere with website functionality, or use the website for fraudulent or unlawful purposes.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Intellectual Property
            </h3>
            <p>
              Dreambasket's branding, website content, images, product descriptions, graphics, and other original materials may not be copied, reproduced, or used commercially without permission.
            </p>
          </div>

          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Policy Changes
            </h3>
            <p>
              Dreambasket may update these Terms & Conditions when necessary. Updated terms will be displayed on the website.
            </p>
          </div>
        </div>

        <TrustSection />
      </div>
    </div>
  );
};

export default TermsConditions;
