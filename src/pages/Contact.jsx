import React, { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { Button } from '../components/Button';
import { Mail, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { InstagramIcon } from '../components/icons/InstagramIcon';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <SectionHeading
          tag="get in touch"
          title="We'd Love to Hear From You 💌"
          subtitle="Have questions about sizing, custom hampers or an order? Send us a sweet note!"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2.5rem',
            maxWidth: '960px',
            margin: '0 auto',
          }}
          className="contact-grid-layout"
        >
          {/* Quick Connect info */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-soft)',
              borderRadius: '20px',
              padding: '2rem',
            }}
          >
            <h3 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
              Direct Chat & Socials 🎀
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              We are most active on Instagram! For instant replies, custom combo requests, and proof photos before shipping:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <a
                href="https://instagram.com/dreambasket.studio"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--pink-soft)',
                  borderRadius: '12px',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                }}
              >
                <InstagramIcon size={22} color="var(--lavender-deep)" />
                <div>
                  <div>Instagram DMs</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--lavender-deep)', fontWeight: 400 }}>
                    @dreambasket.studio (Fastest response)
                  </div>
                </div>
              </a>

              <a
                href="mailto:dreambasket16@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: '12px',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                }}
              >
                <Mail size={22} color="var(--lavender-deep)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Email Inquiry</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    dreambasket16@gmail.com
                  </div>
                </div>
              </a>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#FFFDF9', border: '1px solid rgba(201, 168, 106, 0.3)', borderRadius: '12px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gold-accent)', marginBottom: '0.3rem' }}>
                ✨ Gifting & Bulk Inquiries
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Planning bridesmaid hampers, birthday return favors, or corporate giveaways? Message us on Instagram for curated box discounts.
              </p>
            </div>
          </div>

          {/* Form */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-soft)',
              borderRadius: '20px',
              padding: '2rem',
            }}
          >
            <h3 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }}>
              Send a Note ✉️
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle2 size={48} color="var(--lavender-deep)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Message Received with Love! 🎀</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  Thank you for writing to us. We will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maya Sharma"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-soft)',
                      background: 'var(--bg-main)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.92rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Email or Instagram Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. @yourname or email@domain.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-soft)',
                      background: 'var(--bg-main)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.92rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    How can we help?
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what piece you are interested in, question about delivery, etc."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-soft)',
                      background: 'var(--bg-main)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.92rem',
                    }}
                  />
                </div>

                <Button type="submit" variant="primary" icon={<Sparkles size={16} />}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>

        <style>{`
          @media (min-width: 800px) {
            .contact-grid-layout {
              grid-template-columns: 1fr 1.2fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
