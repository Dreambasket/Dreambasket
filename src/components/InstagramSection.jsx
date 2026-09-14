import React from 'react';
import { InstagramIcon } from './icons/InstagramIcon';
import { SectionHeading } from './SectionHeading';
import { Button } from './Button';

const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
    alt: 'Dainty heart necklace styling in natural sunlight',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    alt: 'Pearl bow earrings pastel unboxing aesthetic',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1611591475878-751b32d0d086?auto=format&fit=crop&w=600&q=80',
    alt: 'Delicate freshwater pearl bracelet wrist stack',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1513885535727-862c21285366?auto=format&fit=crop&w=600&q=80',
    alt: 'Dreamy gift hamper packaging with ribbon bows and dried florals',
  }
];

export const InstagramSection = () => {
  return (
    <section style={{ padding: '3.5rem 0' }} aria-label="Instagram Gallery">
      <div className="container">
        <SectionHeading
          tag="follow our journal"
          title="Little moments from Dreambasket 📸"
          subtitle="Join our community of pastel lovers on Instagram for styling inspo, new drops & packing videos."
        />

        <div className="instagram-grid">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/dreambasket.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-item"
              aria-label={`View Instagram post @dreambasket.studio: ${post.alt}`}
            >
              <img src={post.image} alt={post.alt} loading="lazy" />
              <div className="instagram-overlay">
                <InstagramIcon size={28} color="#FFFFFF" />
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--lavender-deep)' }}>
            @dreambasket.studio
          </div>
          <Button
            href="https://instagram.com/dreambasket.studio"
            variant="lavender"
            icon={<InstagramIcon size={17} />}
          >
            Follow us on Instagram
          </Button>
        </div>
      </div>
    </section>
  );
};
