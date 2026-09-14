import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { PolicyNavigation } from '../components/PolicyNavigation';
import { TrustSection } from '../components/TrustSection';

export const JewelleryCare = () => {
  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <SectionHeading
          tag="care guide"
          title="Jewellery Care Instructions ✨"
          subtitle="Simple guidelines to keep your delicate Dreambasket treasures shining for years."
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>💧</span>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                  Keep Away From Moisture
                </h3>
                <p style={{ margin: 0 }}>
                  Avoid unnecessary exposure to moisture and humidity to help maintain the jewellery's finish.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🌙</span>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                  Remove When Sleeping
                </h3>
                <p style={{ margin: 0 }}>
                  Remove jewellery before sleeping to help prevent unnecessary friction, pulling, or damage.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🌸</span>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                  Let Perfume & Lotion Dry
                </h3>
                <p style={{ margin: 0 }}>
                  Allow perfume, lotion, creams, and similar products to dry before wearing jewellery.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🚿</span>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                  Remove Before Entering Water
                </h3>
                <p style={{ margin: 0 }}>
                  Remove jewellery before showers, swimming, or other water activities.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🎁</span>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                  Store in a Closed Bag or Box
                </h3>
                <p style={{ margin: 0 }}>
                  Store jewellery safely in a closed bag or jewellery box when not in use.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🏃‍♀️</span>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0 0 0.35rem' }}>
                  Remove When Active
                </h3>
                <p style={{ margin: 0 }}>
                  Remove jewellery during workouts, sports, or activities involving excessive sweat or friction.
                </p>
              </div>
            </div>
          </div>
        </div>

        <TrustSection />
      </div>
    </div>
  );
};

export default JewelleryCare;
