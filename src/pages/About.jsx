import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { TrustSection } from '../components/TrustSection';
import { InstagramSection } from '../components/InstagramSection';
import { Heart, Sparkles } from 'lucide-react';

export const About = () => {
  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <SectionHeading
          tag="our journey"
          title="A Little Basket of Pretty Things 🎀"
          subtitle="How Dreambasket began as a dream and turned into your go-to studio for dainty daily jewels."
        />

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
            fontSize: '1.02rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🌷</span>
          </div>

          <p style={{ marginBottom: '1.5rem' }}>
            Dreambasket was born out of a gentle wish: to create accessories and little treasures that feel soft, feminine, romantic, and truly special.
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            From delicate everyday jewellery and charming statement pieces to handmade cards and thoughtful gifting details, every item in our studio is carefully selected or crafted with love.
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            We believe the little things can make ordinary moments feel beautiful. Whether you're choosing something for yourself, celebrating a special milestone, or building a thoughtful gift for a cherished friend, we are honored to be a small part of your happiest moments.
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            Every item is hand-inspected, thoughtfully wrapped in our signature pastel style, and sprinkled with pretty little details to make opening your Dreambasket feel just as special as receiving it.
          </p>

          <div
            style={{
              textAlign: 'center',
              marginTop: '2.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-soft)',
            }}
          >
            <div className="font-script" style={{ fontSize: '2rem', color: 'var(--lavender-deep)' }}>
              Thank you for supporting small handmade dreams 💕
            </div>
            <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
              @dreambasket.studio
            </div>
          </div>
        </div>

        <TrustSection />
        <InstagramSection />
      </div>
    </div>
  );
};
