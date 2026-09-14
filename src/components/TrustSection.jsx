import React from 'react';
import { Gift, Heart, Sparkles } from 'lucide-react';

export const TrustSection = () => {
  const highlights = [
    {
      icon: <Gift size={24} />,
      title: 'Packed with love 🎁',
      desc: 'Every order arrives carefully wrapped in soft pastel pouches, ribbons and sweet handwritten touches.',
    },
    {
      icon: <Heart size={24} />,
      title: 'Pretty little details 💕',
      desc: 'Selected with utmost care for sensitive skin — hypoallergenic, anti-tarnish and comfortable for all-day wear.',
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Made for gifting ✨',
      desc: 'Ideal for birthdays, anniversaries, bridesmaids or simply treating yourself to something lovely.',
    },
  ];

  return (
    <section aria-label="Brand Highlights">
      <div className="container">
        <div className="trust-grid">
          {highlights.map((item, index) => (
            <div key={index} className="trust-item">
              <div className="trust-icon-box">
                {item.icon}
              </div>
              <h3 className="trust-title">{item.title}</h3>
              <p className="trust-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
