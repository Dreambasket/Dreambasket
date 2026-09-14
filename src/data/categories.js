// Central Category Definitions for Dreambasket
// Designed for easy integration with Supabase database in future stages

export const CATEGORIES = [
  {
    id: 'anti-tarnish',
    name: '✨ Anti-Tarnish Jewellery',
    shortName: 'Anti-Tarnish Jewellery',
    slug: '/anti-tarnish',
    tagline: 'Long-lasting shine for your everyday style.',
    description: 'Our anti-tarnish jewellery is designed to resist everyday tarnishing and maintain its beautiful finish with proper care. Perfect for daily wear, work, outings, and gifting—stylish pieces that stay elegant for longer.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
    featured: true,
    accent: '✨',
    isJewelleryParent: true,
    highlights: [
      'Anti-tarnish stainless steel',
      'Long-lasting shine',
      'Waterproof',
      'Hypoallergenic',
      'High quality'
    ],
    subcategories: [
      { id: 'chains', name: 'Chains', slug: 'chains' },
      { id: 'bracelets', name: 'Bracelets', slug: 'bracelets' },
      { id: 'earrings', name: 'Earrings', slug: 'earrings' },
      { id: 'rings', name: 'Rings', slug: 'rings' }
    ]
  },
  {
    id: 'earrings',
    name: '💎 Earrings',
    shortName: 'Earrings',
    slug: '/shop?cat=earrings',
    description: 'Sparkling hoops, gentle studs, and charming drops.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=80',
    featured: false,
    accent: '💎',
  },
  {
    id: 'necklaces',
    name: '📿 Necklaces',
    shortName: 'Necklaces',
    slug: '/shop?cat=necklaces',
    description: 'Dainty chains, pearl chokers, and layered necklaces.',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=700&q=80',
    featured: false,
    accent: '📿',
  },
  {
    id: 'bracelets',
    name: '💕 Bracelets',
    shortName: 'Bracelets',
    slug: '/shop?cat=bracelets',
    description: 'Delicate slider wristlets, charm chains, and beaded cuffs.',
    image: 'https://images.unsplash.com/photo-1611591475878-751b32d0d086?auto=format&fit=crop&w=700&q=80',
    featured: false,
    accent: '💕',
  },
  {
    id: 'rings',
    name: '💍 Rings',
    shortName: 'Rings',
    slug: '/shop?cat=rings',
    description: 'Adjustable bands, micro-bows, and crystal statement rings.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80',
    featured: false,
    accent: '💍',
  },
  {
    id: 'princess-chains',
    name: '👑 Princess Chains',
    shortName: 'Princess Chains',
    slug: '/princess-chains',
    description: 'Royal, fairy-tale inspired crystal and pearl statement neckpieces.',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=700&q=80',
    featured: true,
    accent: '👑',
  },
  {
    id: 'jewellery-combos',
    name: '✨ Jewellery Combos',
    shortName: 'Jewellery Combos',
    slug: '/jewellery-combos',
    description: 'Perfect matching pairings of chains and earrings at a lovely combo bundle price.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80',
    featured: true,
    accent: '✨',
  },
  {
    id: 'budget-friendly',
    name: '💗 Budget-Friendly Jewellery',
    shortName: 'Budget-Friendly Jewellery',
    slug: '/budget-friendly',
    description: 'Our budget-friendly jewellery brings you fashionable designs. Perfect for experimenting with new styles, adding a statement to your outfits, or building your jewellery collection affordably.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80',
    featured: true,
    accent: '💗',
    isJewelleryParent: true,
    highlights: [
      'Budget-Friendly Jewellery',
      'Trendy designs',
      'Affordable fashion',
      'Perfect for casual wear'
    ],
    subcategories: [
      { id: 'chains', name: 'Chains', slug: 'chains' },
      { id: 'bracelets', name: 'Bracelets', slug: 'bracelets' },
      { id: 'rings', name: 'Rings', slug: 'rings' },
      { id: 'korean-earrings', name: 'Korean Earrings', slug: 'korean-earrings' }
    ]
  },
  {
    id: 'handmade-cards',
    name: '💌 Handmade Cards',
    shortName: 'Handmade Cards',
    slug: '/handmade-cards',
    description: 'Our handmade cards are crafted with love and creativity to make every special moment a little more meaningful. From birthdays and celebrations to heartfelt messages and surprises, each card is designed to add a personal touch to your wishes.',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=700&q=80',
    featured: true,
    accent: '💌',
    highlights: [
      '💕 Handmade with love',
      '🎨 Unique & creative designs',
      '✂️ Carefully handcrafted',
      '🌸 Personalized designs',
      '🎁 Perfect for gifting',
      '💌 Made for special moments'
    ]
  },
  {
    id: 'hair-accessories',
    name: 'Hair Accessories 🦋',
    shortName: 'Hair Accessories',
    slug: '/hair-accessories',
    description: 'Silky scrunchies, pastel floral claw clips, and pearl hairpins.',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=700&q=80',
    featured: false,
    accent: '🦋',
  },
  {
    id: 'gift-hampers',
    name: 'Gift Hampers 🎁',
    shortName: 'Gift Hampers',
    slug: '/gift-hampers',
    description: 'Pre-curated gift baskets packed with love, cards, and jewellery.',
    image: 'https://images.unsplash.com/photo-1513885535727-862c21285366?auto=format&fit=crop&w=700&q=80',
    featured: false,
    accent: '🎁',
  }
];

// Dedicated Parent Jewellery Categories:
export const JEWELLERY_PARENT_CATEGORIES = [
  CATEGORIES.find((c) => c.id === 'anti-tarnish'),
  CATEGORIES.find((c) => c.id === 'budget-friendly'),
].filter(Boolean);

// Curated categories for the homepage "Shop by Category" section:
export const HOMEPAGE_CATEGORIES = [
  CATEGORIES.find((c) => c.id === 'anti-tarnish'),
  CATEGORIES.find((c) => c.id === 'budget-friendly'),
  CATEGORIES.find((c) => c.id === 'handmade-cards'),
  CATEGORIES.find((c) => c.id === 'jewellery-combos'),
  CATEGORIES.find((c) => c.id === 'princess-chains'),
].filter(Boolean);
