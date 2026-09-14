// Jewellery Packaging Options for Dreambasket
// Separate images and additional prices for each packaging option.
// Upload/replace images anytime.

export const PACKAGING_OPTIONS = [
  {
    id: 'normal-packaging',
    name: 'Normal Packaging',
    price: 0,
    badge: 'Included',
    active: true,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80', // Soft pouch with ribbon
    description: 'Boutique pastel pouch with protective bubble lining & ribbon',
  },
  {
    id: 'floating-box',
    name: 'Floating Box',
    price: 50,
    badge: '+₹50',
    active: true,
    image: 'https://images.unsplash.com/photo-1513885535727-862c21285366?auto=format&fit=crop&w=400&q=80', // 3D clear frame floating display
    description: 'Transparent 3D floating membrane box that showcases jewellery suspended in air',
  },
  {
    id: 'jewellery-box',
    name: 'Jewellery Box',
    price: 100,
    badge: '+₹100',
    active: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80', // Premium velvet drawer/box
    description: 'Hardcover pastel cushioned keepsake box with velvet interior, perfect for gifting',
  },
];

// Helper to determine if a product is eligible for jewellery packaging
export const isJewelleryPackagingEligible = (product) => {
  if (!product) return false;
  // Explicitly excluded
  if (product.category === 'handmade-cards' || product.category === 'cards' || product.category === 'hair-accessories') {
    return false;
  }
  const eligibleCategories = [
    'anti-tarnish',
    'earrings',
    'necklaces',
    'bracelets',
    'rings',
    'jewellery-combos',
    'princess-chains',
    'budget-friendly',
  ];
  return eligibleCategories.includes(product.category) || Boolean(product.isCombo) || Boolean(product.antiTarnish);
};

// Handmade Cards Color & Theme Options
export const HANDMADE_CARD_COLORS = [
  { id: 'pink', name: 'Pink', hex: '#F4D9E8', border: '#E8B8D0' },
  { id: 'lavender', name: 'Lavender', hex: '#EBE3F5', border: '#CDB9E5' },
  { id: 'blue', name: 'Blue', hex: '#E0F2FE', border: '#BAE6FD' },
  { id: 'red', name: 'Red', hex: '#FEE2E2', border: '#FCA5A5' },
  { id: 'black', name: 'Black', hex: '#374151', border: '#1F2937', dark: true },
];

export const HANDMADE_CARD_THEMES = [
  'Happy Birthday',
  'Happy Anniversary',
  'Best Friends',
];
