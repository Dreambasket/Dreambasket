// Central Data & Store Service for Dreambasket
// Unified database layer connected to Supabase (with automatic local fallback).
// Customer Website ↔ Supabase ↔ Admin Dashboard

import { supabase, isSupabaseConfigured, uploadStorageFile } from './supabase';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categories';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import {
  PACKAGING_OPTIONS as INITIAL_PACKAGING,
  HANDMADE_CARD_COLORS as INITIAL_CARD_COLORS,
  HANDMADE_CARD_THEMES as INITIAL_CARD_THEMES,
} from '../data/packaging';

const STORAGE_KEYS = {
  PRODUCTS: 'dreambasket_db_products',
  CATEGORIES: 'dreambasket_db_categories',
  ORDERS: 'dreambasket_db_orders',
  STORE_SETTINGS: 'dreambasket_db_settings',
  ORDER_COUNTER: 'dreambasket_db_order_counter',
  ADMIN_AUTH: 'dreambasket_admin_session',
  PACKAGING: 'dreambasket_db_packaging',
  CARD_COLORS: 'dreambasket_db_card_colors',
  CARD_THEMES: 'dreambasket_db_card_themes',
};

const DEFAULT_STORE_SETTINGS = {
  storeName: 'Dreambasket',
  instagramHandle: '@dreambasket.studio',
  instagramUrl: 'https://instagram.com/dreambasket.studio',
  whatsappNumber: '',
  tagline: 'Little treasures, made to make you smile 🎀',
  deliveryFee: 0,
  deliveryMethod: 'Standard Shipping',
  deliveryEta: '6–7 business days',
  manualUpiEnabled: false,
  upiId: '',
  paymentInstructions: '',
  paymentProofRequired: false,
  freeShippingThreshold: 799,
};

const AUTH_CONFIG = {
  SALT: 'dreambasket_salt_2026',
  SALTED_HASH: '1231d69b58b1f6f366c75b0fd5981fdee74004bf0508f01a72f7595ad4bcac69',
  DIRECT_HASH: '6a267e815e63784428ec538fb97789bfac3db669117187634f6021fa7e19706c',
  SESSION_DURATION_MS: 24 * 60 * 60 * 1000,
};

async function computeSha256(text) {
  try {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('Crypto error computing hash:', err);
    return null;
  }
}

const getStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

// Map a Supabase row to frontend product object
const mapSupabaseProduct = (p, costsMap = null) => {
  const images = Array.isArray(p.product_images) && p.product_images.length > 0
    ? p.product_images
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((img) => img.image_url)
    : p.images || [];

  const mainImage = images[0] || 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80';
  const sellingPrice = Number(p.selling_price) || 0;
  const originalPrice = p.mrp ? Number(p.mrp) : sellingPrice;
  const costData = costsMap ? costsMap[p.id] : null;

  const costPrice = costData ? Number(costData.cost_price) || 0 : undefined;
  const packingCost = costData ? Number(costData.packing_cost) || 0 : undefined;
  const totalInternalCost = costData !== undefined && costPrice !== undefined && packingCost !== undefined
    ? costPrice + packingCost
    : undefined;
  const profit = totalInternalCost !== undefined ? sellingPrice - totalInternalCost : undefined;

  const parsedStockQty = Number(p.stock_quantity);
  const stockQty = Number.isFinite(parsedStockQty) ? Math.max(0, parsedStockQty) : 25;
  const parsedLowThreshold = Number(p.low_stock_threshold);
  const lowStockThreshold = Number.isFinite(parsedLowThreshold) ? Math.max(0, parsedLowThreshold) : 5;
  const stockStatus = p.stock_status === 'Out of Stock' || stockQty <= 0
    ? 'Out of Stock'
    : stockQty <= lowStockThreshold
      ? 'Low Stock'
      : 'In Stock';
  const inStock = stockQty > 0 && stockStatus !== 'Out of Stock';

  return {
    id: p.id,
    sku: p.product_id || p.sku || `DB-SKU-${p.id}`,
    name: p.name,
    slug: p.slug,
    price: sellingPrice,
    salePrice: p.mrp ? sellingPrice : null,
    originalPrice,
    category: p.category_id,
    categoryName: p.categories?.name || p.categoryName || '',
    subCategory: p.subcategory_id || null,
    description: p.description || '',
    images: images.length ? images : [mainImage],
    image: mainImage,
    stockQuantity: stockQty,
    stockStatus,
    inStock,
    lowStockThreshold,
    active: p.is_active !== undefined ? Boolean(p.is_active) : true,
    archived: Boolean(p.is_archived),
    isBestseller: Boolean(p.is_bestseller),
    isNew: Boolean(p.is_new_arrival),
    isNewArrival: Boolean(p.is_new_arrival),
    isFeatured: Boolean(p.is_featured),
    isCombo: Boolean(p.is_combo),
    comboItems: p.combo_items || [],
    comboDescription: p.combo_description || null,
    material: p.material || '',
    colour: p.colour || '',
    size: p.size || '',
    waterproof: p.waterproof || '',
    antiTarnish: Boolean(p.anti_tarnish),
    hypoallergenic: p.hypoallergenic || '',
    badge: p.badge || (p.is_bestseller ? 'Bestseller' : p.is_new_arrival ? 'New' : ''),
    rating: Number(p.rating) || 5.0,
    reviewsCount: Number(p.reviews_count) || 0,
    createdDate: p.created_at,
    updatedDate: p.updated_at,
    // Private financial fields: ONLY populated for Admin when costsMap is provided
    ...(costsMap
      ? {
        costPrice,
        packingCost,
        totalInternalCost,
        profit,
      }
      : {}),
  };
};

// Initialize fallback local products
const initializeProducts = () => {
  return INITIAL_PRODUCTS.map((prod, index) => ({
    id: prod.id || `prod-${index + 1}`,
    name: prod.name,
    sku: `DB-SKU-${String(index + 1).padStart(4, '0')}`,
    images: [
      prod.image,
      prod.image.includes('photo-') ? `${prod.image}&auto=format&fit=crop&w=1000&q=85` : prod.image,
    ],
    image: prod.image,
    price: Number(prod.price) || 0,
    salePrice: prod.originalPrice ? Number(prod.price) : null,
    originalPrice: Number(prod.originalPrice) || Number(prod.price),
    category: prod.category,
    categoryName: prod.categoryName || prod.category,
    subCategory: prod.subCategory || null,
    description: prod.description || 'Handcrafted with love by Dreambasket.',
    material: prod.material || '',
    colour: prod.colour || '',
    size: prod.dimensions || prod.size || '',
    stockQuantity: prod.stockQuantity !== undefined ? prod.stockQuantity : 25,
    stockStatus: 'In Stock',
    inStock: true,
    lowStockThreshold: 5,
    active: prod.active !== undefined ? prod.active : true,
    archived: false,
    isBestseller: Boolean(prod.isBestseller),
    isNewArrival: Boolean(prod.isNew),
    isFeatured: Boolean(prod.isBestseller || prod.isCombo),
    isCombo: Boolean(prod.isCombo || prod.category === 'jewellery-combos'),
    comboItems: prod.id === 'prod-5' ? ['Tulip Chain', 'Tulip Earrings'] : [],
    comboDescription: prod.id === 'prod-5' ? 'Tulip Chain + Tulip Earrings matching bundle' : null,
    antiTarnish: Boolean(prod.antiTarnish),
    badge: prod.badge || (prod.isBestseller ? 'Bestseller' : prod.isNew ? 'New' : ''),
    rating: prod.rating || 4.9,
    reviewsCount: prod.reviewsCount || 24,
    costPrice: prod.id === 'prod-14' ? 50 : 80,
    packingCost: 35,
    totalInternalCost: (prod.id === 'prod-14' ? 50 : 80) + 35,
    profit: (Number(prod.price) || 0) - ((prod.id === 'prod-14' ? 50 : 80) + 35),
    createdDate: new Date('2026-01-01').toISOString(),
    updatedDate: new Date().toISOString(),
  }));
};

export const seedInitialDatabase = () => {
  const initialProds = initializeProducts();
  const existingProducts = getStorageItem(STORAGE_KEYS.PRODUCTS, null);
  if (!existingProducts) {
    setStorageItem(STORAGE_KEYS.PRODUCTS, initialProds);
  }

  if (!getStorageItem(STORAGE_KEYS.CATEGORIES, null)) {
    setStorageItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  if (!getStorageItem(STORAGE_KEYS.PACKAGING, null)) {
    setStorageItem(STORAGE_KEYS.PACKAGING, INITIAL_PACKAGING);
  }

  if (!getStorageItem(STORAGE_KEYS.CARD_COLORS, null)) {
    setStorageItem(STORAGE_KEYS.CARD_COLORS, INITIAL_CARD_COLORS);
  }
  if (!getStorageItem(STORAGE_KEYS.CARD_THEMES, null)) {
    setStorageItem(STORAGE_KEYS.CARD_THEMES, INITIAL_CARD_THEMES);
  }

  if (!getStorageItem(STORAGE_KEYS.STORE_SETTINGS, null)) {
    setStorageItem(STORAGE_KEYS.STORE_SETTINGS, DEFAULT_STORE_SETTINGS);
  }

  // Real orders database starts at 0 orders
  const ordersCleaned = getStorageItem('dreambasket_orders_cleaned_v3', false);
  if (!ordersCleaned) {
    setStorageItem(STORAGE_KEYS.ORDERS, []);
    setStorageItem(STORAGE_KEYS.ORDER_COUNTER, 1001);
    setStorageItem('dreambasket_orders_cleaned_v3', true);
  }
};

seedInitialDatabase();

// ==========================================
// STORE SERVICE API
// ==========================================
export const storeService = {
  // Check if live Supabase is active
  isSupabaseActive() {
    return isSupabaseConfigured();
  },

  // -------------------------------------------------------------
  // 1. STORE SETTINGS
  // -------------------------------------------------------------
  async getStoreSettings() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return {
            storeName: data.store_name,
            instagramHandle: data.instagram_handle,
            instagramUrl: data.instagram_url,
            whatsappNumber: data.whatsapp_number,
            tagline: data.tagline,
            deliveryFee: Number(data.delivery_fee) || 0,
            deliveryMethod: data.delivery_method,
            deliveryEta: data.delivery_eta,
            manualUpiEnabled: data.manual_upi_enabled,
            upiId: data.upi_id,
            paymentInstructions: data.payment_instructions,
            paymentProofRequired: data.payment_proof_required,
            freeShippingThreshold: Number(data.free_shipping_threshold) || 799,
          };
        }
      } catch (err) {
        console.warn('Supabase getStoreSettings failed, using fallback:', err);
      }
    }
    const settings = getStorageItem(STORAGE_KEYS.STORE_SETTINGS, DEFAULT_STORE_SETTINGS);
    return { ...DEFAULT_STORE_SETTINGS, ...settings };
  },

  async updateStoreSettings(newSettings) {
    if (this.isSupabaseActive()) {
      try {
        const { error } = await supabase
          .from('store_settings')
          .upsert({
            store_name: newSettings.storeName,
            instagram_handle: newSettings.instagramHandle,
            instagram_url: newSettings.instagramUrl,
            whatsapp_number: newSettings.whatsappNumber,
            tagline: newSettings.tagline,
            delivery_fee: Number(newSettings.deliveryFee) || 0,
            delivery_method: newSettings.deliveryMethod,
            delivery_eta: newSettings.deliveryEta,
            manual_upi_enabled: newSettings.manualUpiEnabled,
            upi_id: newSettings.upiId,
            payment_instructions: newSettings.paymentInstructions,
            payment_proof_required: newSettings.paymentProofRequired,
            free_shipping_threshold: Number(newSettings.freeShippingThreshold) || 799,
            updated_at: new Date().toISOString(),
          });

        if (error) console.error('Supabase updateStoreSettings error:', error);
      } catch (err) {
        console.warn('Supabase updateStoreSettings error:', err);
      }
    }
    const current = await this.getStoreSettings();
    const updated = { ...current, ...newSettings, updatedDate: new Date().toISOString() };
    setStorageItem(STORAGE_KEYS.STORE_SETTINGS, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // 2. CATEGORIES
  // -------------------------------------------------------------
  async getCategories() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (!error && data && data.length > 0) {
          return data.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            tagline: c.tagline || '',
            description: c.description || '',
            highlights: Array.isArray(c.highlights) ? c.highlights : [],
            subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
            image: c.image || '',
            featured: Boolean(c.featured),
            active: Boolean(c.is_active),
          }));
        }
      } catch (err) {
        console.warn('Supabase getCategories failed, using fallback:', err);
      }
    }
    return getStorageItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async getCategoryById(categoryId) {
    const categories = await this.getCategories();
    return categories.find((c) => c.id === categoryId) || null;
  },

  async saveCategory(catData) {
    if (this.isSupabaseActive()) {
      try {
        const id = catData.id || catData.slug?.replace(/^\//, '') || `cat-${Date.now()}`;
        const { error } = await supabase
          .from('categories')
          .upsert({
            id,
            name: catData.name,
            slug: catData.slug || `/${id}`,
            description: catData.description || '',
            highlights: catData.highlights || [],
            subcategories: catData.subcategories || [],
            image: catData.image || '',
            featured: Boolean(catData.featured),
            is_active: catData.active !== undefined ? Boolean(catData.active) : true,
            updated_at: new Date().toISOString(),
          });
        if (error) console.error('Supabase saveCategory error:', error);
      } catch (err) {
        console.warn('Supabase saveCategory error:', err);
      }
    }
    const categories = await this.getCategories();
    if (catData.id) {
      const idx = categories.findIndex((c) => c.id === catData.id);
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...catData };
        setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
        return categories[idx];
      }
    }
    const generatedId = catData.id || catData.slug?.replace(/^\//, '') || `cat-${Date.now()}`;
    const newCat = {
      id: generatedId,
      slug: catData.slug || `/${generatedId}`,
      name: catData.name,
      description: catData.description || '',
      highlights: catData.highlights || [],
      subcategories: catData.subcategories || [],
      image: catData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
      featured: Boolean(catData.featured),
      active: catData.active !== undefined ? catData.active : true,
    };
    categories.push(newCat);
    setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  },

  async deleteCategory(categoryId) {
    if (this.isSupabaseActive()) {
      try {
        await supabase.from('categories').delete().eq('id', categoryId);
      } catch (err) {
        console.warn('Supabase deleteCategory error:', err);
      }
    }
    const categories = await this.getCategories();
    const filtered = categories.filter((c) => c.id !== categoryId);
    setStorageItem(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  },

  // -------------------------------------------------------------
  // 3. PACKAGING OPTIONS (Customer-Selectable vs Private Costs)
  // -------------------------------------------------------------
  async getPackagingOptions() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('packaging_options')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (!error && data && data.length > 0) {
          return data.map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.customer_facing_price) || 0,
            images: Array.isArray(p.images) && p.images.length ? p.images : [p.image].filter(Boolean),
            image: p.image || (Array.isArray(p.images) ? p.images[0] : ''),
            description: p.description || '',
            active: Boolean(p.is_active),
            sortOrder: p.sort_order,
          }));
        }
      } catch (err) {
        console.warn('Supabase getPackagingOptions failed, using fallback:', err);
      }
    }
    return getStorageItem(STORAGE_KEYS.PACKAGING, INITIAL_PACKAGING);
  },

  async savePackagingOption(pkgData) {
    const cleanImages = Array.isArray(pkgData.images) && pkgData.images.length
      ? pkgData.images.filter(Boolean)
      : pkgData.image
        ? [pkgData.image]
        : [];

    const pkgId = pkgData.id || `pkg-${Date.now()}`;
    const mainImg = cleanImages[0] || pkgData.image || '';

    if (this.isSupabaseActive()) {
      try {
        await supabase.from('packaging_options').upsert({
          id: pkgId,
          name: pkgData.name || 'Custom Packaging',
          customer_facing_price: Number(pkgData.price) || 0,
          is_active: pkgData.active !== undefined ? Boolean(pkgData.active) : true,
          images: cleanImages,
          image: mainImg,
          description: pkgData.description || '',
          sort_order: pkgData.sortOrder || 1,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase savePackagingOption error:', err);
      }
    }

    const options = await this.getPackagingOptions();
    const idx = options.findIndex((p) => p.id === pkgId);
    const updatedObj = {
      id: pkgId,
      name: pkgData.name || 'Custom Packaging',
      price: Number(pkgData.price) || 0,
      images: cleanImages,
      image: mainImg,
      description: pkgData.description || '',
      active: pkgData.active !== undefined ? pkgData.active : true,
    };

    if (idx !== -1) {
      options[idx] = { ...options[idx], ...updatedObj };
    } else {
      options.push(updatedObj);
    }
    setStorageItem(STORAGE_KEYS.PACKAGING, options);
    return updatedObj;
  },

  async deletePackagingOption(pkgId) {
    if (this.isSupabaseActive()) {
      try {
        await supabase.from('packaging_options').delete().eq('id', pkgId);
      } catch (err) {
        console.warn('Supabase deletePackagingOption error:', err);
      }
    }
    const options = await this.getPackagingOptions();
    const filtered = options.filter((p) => p.id !== pkgId);
    setStorageItem(STORAGE_KEYS.PACKAGING, filtered);
    return true;
  },

  // -------------------------------------------------------------
  // 4. HANDMADE CARDS
  // -------------------------------------------------------------
  async getCardColors() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('handmade_card_options')
          .select('*')
          .eq('option_type', 'color')
          .eq('is_active', true)
          .order('sort_order');

        if (!error && data && data.length > 0) {
          return data.map((c) => ({
            id: c.id,
            name: c.name,
            hex: c.hex,
            border: c.border,
          }));
        }
      } catch (err) {
        console.warn('Supabase getCardColors failed, using fallback:', err);
      }
    }
    return getStorageItem(STORAGE_KEYS.CARD_COLORS, INITIAL_CARD_COLORS);
  },

  async saveCardColors(colors) {
    if (this.isSupabaseActive()) {
      try {
        for (let i = 0; i < colors.length; i++) {
          const c = colors[i];
          await supabase.from('handmade_card_options').upsert({
            id: c.id || `card-color-${c.name.toLowerCase()}`,
            option_type: 'color',
            name: c.name,
            hex: c.hex,
            border: c.border,
            sort_order: i + 1,
            is_active: true,
          });
        }
      } catch (err) {
        console.warn('Supabase saveCardColors error:', err);
      }
    }
    setStorageItem(STORAGE_KEYS.CARD_COLORS, colors);
    return colors;
  },

  async getCardThemes() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('handmade_card_options')
          .select('*')
          .eq('option_type', 'theme')
          .eq('is_active', true)
          .order('sort_order');

        if (!error && data && data.length > 0) {
          return data.map((t) => t.name);
        }
      } catch (err) {
        console.warn('Supabase getCardThemes failed, using fallback:', err);
      }
    }
    return getStorageItem(STORAGE_KEYS.CARD_THEMES, INITIAL_CARD_THEMES);
  },

  async saveCardThemes(themes) {
    if (this.isSupabaseActive()) {
      try {
        for (let i = 0; i < themes.length; i++) {
          const t = themes[i];
          await supabase.from('handmade_card_options').upsert({
            id: `card-theme-${i + 1}`,
            option_type: 'theme',
            name: t,
            sort_order: i + 1,
            is_active: true,
          });
        }
      } catch (err) {
        console.warn('Supabase saveCardThemes error:', err);
      }
    }
    setStorageItem(STORAGE_KEYS.CARD_THEMES, themes);
    return themes;
  },

  // -------------------------------------------------------------
  // 5. PRODUCTS (Customer vs Admin, Private Cost Isolation)
  // -------------------------------------------------------------
  // Customer-facing: active only, non-archived, NO private cost data
  async getProducts() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, product_id, name, slug, description, category_id, subcategory_id,
            selling_price, mrp, stock_quantity, stock_status, low_stock_threshold,
            is_active, is_archived, is_bestseller, is_new_arrival, is_featured,
            is_combo, combo_items, combo_description, material, colour, size,
            waterproof, anti_tarnish, hypoallergenic, badge, rating, reviews_count,
            created_at, updated_at,
            categories (name),
            product_images (image_url, sort_order, is_primary)
          `)
          .eq('is_active', true)
          .eq('is_archived', false)
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Zero private costs returned to customer queries
          return data.map((p) => mapSupabaseProduct(p, null));
        }
      } catch (err) {
        console.warn('Supabase getProducts failed, using fallback:', err);
      }
    }
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    return products
      .filter((p) => p.active !== false && !p.archived)
      .map(({ costPrice, packingCost, totalInternalCost, profit, ...publicFields }) => publicFields);
  },

  // Admin-facing: all products including archived and hidden + Private Cost Data
  async getAllProductsAdmin() {
    if (this.isSupabaseActive()) {
      try {
        // First attempt secure RPC with costs
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_admin_products_with_costs');
        if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
          return rpcData.map((p) => {
            const costPrice = p.cost_price !== null && p.cost_price !== undefined ? Number(p.cost_price) : 0;
            const packingCost = p.packing_cost !== null && p.packing_cost !== undefined ? Number(p.packing_cost) : 0;
            const totalInternalCost = p.total_internal_cost !== null && p.total_internal_cost !== undefined
              ? Number(p.total_internal_cost)
              : costPrice + packingCost;
            const sellingPrice = Number(p.selling_price) || 0;
            const profit = sellingPrice - totalInternalCost;
            const images = Array.isArray(p.product_images) && p.product_images.length
              ? p.product_images.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map((img) => img.image_url)
              : [];
            const mainImage = images[0] || 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80';
            const stockQty = Number(p.stock_quantity) || 0;
            const stockStatus = p.stock_status || (stockQty <= 0 ? 'Out of Stock' : 'In Stock');

            return {
              id: p.id,
              sku: p.product_id || `DB-SKU-${p.id}`,
              name: p.name,
              slug: p.slug,
              price: sellingPrice,
              originalPrice: p.mrp ? Number(p.mrp) : sellingPrice,
              salePrice: p.mrp ? sellingPrice : null,
              category: p.category_id,
              categoryName: p.categoryName || '',
              subCategory: p.subcategory_id,
              description: p.description || '',
              images: images.length ? images : [mainImage],
              image: mainImage,
              stockQuantity: stockQty,
              stockStatus,
              inStock: stockStatus !== 'Out of Stock' && stockQty > 0,
              lowStockThreshold,
              active: Boolean(p.is_active),
              archived: Boolean(p.is_archived),
              isBestseller: Boolean(p.is_bestseller),
              isNewArrival: Boolean(p.is_new_arrival),
              isFeatured: Boolean(p.is_featured),
              isCombo: Boolean(p.is_combo),
              comboItems: p.combo_items || [],
              comboDescription: p.combo_description || null,
              material: p.material || '',
              colour: p.colour || '',
              size: p.size || '',
              waterproof: p.waterproof || '',
              antiTarnish: Boolean(p.anti_tarnish),
              hypoallergenic: p.hypoallergenic || '',
              badge: p.badge || '',
              rating: Number(p.rating) || 5.0,
              reviewsCount: Number(p.reviews_count) || 0,
              costPrice,
              packingCost,
              totalInternalCost,
              profit,
              createdDate: p.created_at,
              updatedDate: p.updated_at,
            };
          });
        }

        const [productsRes, costsRes] = await Promise.all([
          supabase
            .from('products')
            .select(`
              *,
              categories (name),
              product_images (image_url, sort_order, is_primary)
            `)
            .order('created_at', { ascending: false }),
          supabase.from('product_costs').select('*'),
        ]);

        if (!productsRes.error && productsRes.data) {
          const costsMap = {};
          if (costsRes.data) {
            costsRes.data.forEach((c) => {
              costsMap[c.product_id] = c;
            });
          }
          return productsRes.data.map((p) => mapSupabaseProduct(p, costsMap));
        }
      } catch (err) {
        console.warn('Supabase getAllProductsAdmin failed, using fallback:', err);
      }
    }
    return getStorageItem(STORAGE_KEYS.PRODUCTS, []);
  },

  async getProductById(id) {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (name),
            product_images (image_url, sort_order, is_primary)
          `)
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return mapSupabaseProduct(data, null);
        }
      } catch (err) {
        console.warn('Supabase getProductById failed, using fallback:', err);
      }
    }
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    return products.find((p) => p.id === id) || null;
  },

  async saveProduct(productData) {
    const cleanImages =
      Array.isArray(productData.images) && productData.images.length
        ? productData.images.filter(Boolean)
        : productData.image
          ? [productData.image]
          : ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'];

    const costPriceNum = productData.costPrice !== undefined && productData.costPrice !== '' ? Number(productData.costPrice) || 0 : 0;
    const packingCostNum = productData.packingCost !== undefined && productData.packingCost !== '' ? Number(productData.packingCost) || 0 : 0;
    const sellingPriceNum = Number(productData.price ?? productData.sellingPrice) || 0;
    const totalInternalCost = costPriceNum + packingCostNum;
    const profit = sellingPriceNum - totalInternalCost;

    const prodId = String(productData.id || productData.product_id || `prod-${Date.now()}`);
    const sku = String(productData.sku || productData.product_id || `DB-SKU-${Date.now()}`);
    const slug = productData.slug || productData.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || prodId;

    const parsedStockQty = Number(productData.stockQuantity);
    const stockQty = Number.isFinite(parsedStockQty) ? Math.max(0, parsedStockQty) : 25;
    const parsedLowThreshold = Number(productData.lowStockThreshold);
    const lowThreshold = Number.isFinite(parsedLowThreshold) ? Math.max(0, parsedLowThreshold) : 5;
    const stockStatus = productData.stockStatus === 'Out of Stock' || stockQty <= 0
      ? 'Out of Stock'
      : stockQty <= lowThreshold
        ? 'Low Stock'
        : 'In Stock';
    const now = new Date().toISOString();

    if (this.isSupabaseActive()) {
      const productPayload = {
        id: prodId,
        product_id: sku,
        name: productData.name || 'Untitled Treasure',
        slug,
        description: productData.description || '',
        category_id: productData.category || productData.categoryId || 'anti-tarnish',
        subcategory_id: productData.subCategory || productData.subcategoryId || null,
        selling_price: sellingPriceNum,
        mrp: productData.originalPrice !== undefined && productData.originalPrice !== '' ? Number(productData.originalPrice) || sellingPriceNum : sellingPriceNum,
        stock_quantity: stockQty,
        stock_status: stockStatus,
        low_stock_threshold: lowThreshold,
        is_active: productData.active !== undefined ? Boolean(productData.active) : true,
        is_archived: Boolean(productData.archived),
        is_bestseller: Boolean(productData.isBestseller),
        is_new_arrival: Boolean(productData.isNewArrival),
        is_featured: Boolean(productData.isFeatured),
        is_combo: Boolean(productData.isCombo),
        combo_items: productData.comboItems || [],
        combo_description: productData.comboDescription || null,
        material: productData.material || '',
        colour: productData.colour || '',
        size: productData.size || '',
        waterproof: productData.waterproof || '',
        anti_tarnish: Boolean(productData.antiTarnish),
        hypoallergenic: productData.hypoallergenic || '',
        badge: productData.badge || (productData.isBestseller ? 'Bestseller' : productData.isNewArrival ? 'New' : ''),
        rating: productData.rating !== undefined && productData.rating !== '' ? Number(productData.rating) || 5 : 5,
        reviews_count: productData.reviewsCount !== undefined && productData.reviewsCount !== '' ? Number(productData.reviewsCount) || 0 : 0,
        updated_at: now,
      };

      const { error: prodError } = await supabase.from('products').upsert(productPayload, { onConflict: 'id' });
      if (prodError) {
        console.error('Supabase product save error:', prodError);
        throw new Error(`Supabase product save failed: ${prodError.message || 'Unknown database error'}`);
      }

      try {
        const { error: costError } = await supabase.from('product_costs').upsert({
          product_id: prodId,
          cost_price: costPriceNum,
          packing_cost: packingCostNum,
          updated_at: now,
        }, { onConflict: 'product_id' });
        if (costError) console.warn('Private product cost save skipped:', costError.message);
      } catch (err) {
        console.warn('Private product cost save skipped:', err);
      }

      if (cleanImages.length) {
        try {
          const { error: deleteImageError } = await supabase.from('product_images').delete().eq('product_id', prodId);
          if (deleteImageError) console.warn('Old product images could not be removed:', deleteImageError.message);
          const imagesToInsert = cleanImages.map((url, idx) => ({ product_id: prodId, image_url: url, sort_order: idx + 1, is_primary: idx === 0 }));
          const { error: imageError } = await supabase.from('product_images').insert(imagesToInsert);
          if (imageError) console.warn('Product image save skipped:', imageError.message);
        } catch (err) {
          console.warn('Product image operation skipped:', err);
        }
      }
    }

    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    const updatedProduct = {
      id: prodId,
      sku,
      slug,
      name: productData.name || 'Untitled Treasure',
      images: cleanImages,
      image: cleanImages[0],
      price: sellingPriceNum,
      salePrice: productData.originalPrice !== undefined && productData.originalPrice !== '' ? sellingPriceNum : null,
      originalPrice: productData.originalPrice !== undefined && productData.originalPrice !== '' ? Number(productData.originalPrice) || sellingPriceNum : sellingPriceNum,
      costPrice: costPriceNum,
      packingCost: packingCostNum,
      totalInternalCost,
      profit,
      category: productData.category || productData.categoryId || 'anti-tarnish',
      categoryName: productData.categoryName || '✨ Anti-Tarnish Jewellery',
      subCategory: productData.subCategory || productData.subcategoryId || null,
      description: productData.description || '',
      material: productData.material || '',
      colour: productData.colour || '',
      size: productData.size || '',
      waterproof: productData.waterproof || '',
      antiTarnish: Boolean(productData.antiTarnish),
      hypoallergenic: productData.hypoallergenic || '',
      stockQuantity: stockQty,
      lowStockThreshold: lowThreshold,
      inStock: stockQty > 0 && stockStatus !== 'Out of Stock',
      stockStatus,
      tags: productData.tags || [],
      active: productData.active !== undefined ? Boolean(productData.active) : true,
      archived: Boolean(productData.archived),
      isBestseller: Boolean(productData.isBestseller),
      isNewArrival: Boolean(productData.isNewArrival),
      isFeatured: Boolean(productData.isFeatured),
      isCombo: Boolean(productData.isCombo),
      comboItems: productData.comboItems || [],
      comboDescription: productData.comboDescription || null,
      badge: productData.badge || (productData.isBestseller ? 'Bestseller' : productData.isNewArrival ? 'New' : ''),
      rating: Number(productData.rating) || 5,
      reviewsCount: Number(productData.reviewsCount) || 0,
      updatedDate: now,
    };
    const idx = products.findIndex((p) => p.id === prodId);
    if (idx !== -1) products[idx] = { ...products[idx], ...updatedProduct };
    else { updatedProduct.createdDate = now; products.unshift(updatedProduct); }
    setStorageItem(STORAGE_KEYS.PRODUCTS, products);
    return updatedProduct;
  },

  async updateProductStock(productId, qty = null, status = null) {
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    const existing = products.find((p) => p.id === productId);
    const currentQty = Number(existing?.stockQuantity);
    const requestedQty = qty === null || qty === undefined ? currentQty : Number(qty);
    const nextQty = Number.isFinite(requestedQty) ? Math.max(0, requestedQty) : 0;
    const thresholdValue = Number(existing?.lowStockThreshold);
    const lowThreshold = Number.isFinite(thresholdValue) ? Math.max(0, thresholdValue) : 5;
    const nextStatus = status === 'Out of Stock' || status === false || nextQty <= 0
      ? 'Out of Stock'
      : nextQty <= lowThreshold
        ? 'Low Stock'
        : 'In Stock';

    if (this.isSupabaseActive()) {
      const { error } = await supabase.from('products').update({
        stock_quantity: nextQty,
        stock_status: nextStatus,
        updated_at: new Date().toISOString(),
      }).eq('id', productId);
      if (error) {
        console.error('Supabase updateProductStock error:', error);
        throw new Error(`Supabase stock update failed: ${error.message}`);
      }
    }

    const idx = products.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      products[idx].stockQuantity = nextQty;
      products[idx].lowStockThreshold = lowThreshold;
      products[idx].stockStatus = nextStatus;
      products[idx].inStock = nextQty > 0 && nextStatus !== 'Out of Stock';
      products[idx].updatedDate = new Date().toISOString();
      setStorageItem(STORAGE_KEYS.PRODUCTS, products);
      return products[idx];
    }
    return null;
  },

  async toggleProductStockStatus(productId, inStock) {
    return this.updateProductStock(productId, null, inStock);
  },

  async archiveProduct(productId) {
    if (this.isSupabaseActive()) {
      try {
        await supabase
          .from('products')
          .update({ is_archived: true, is_active: false, updated_at: new Date().toISOString() })
          .eq('id', productId);
      } catch (err) {
        console.warn('Supabase archiveProduct error:', err);
      }
    }
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    const idx = products.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      products[idx].archived = true;
      products[idx].active = false;
      setStorageItem(STORAGE_KEYS.PRODUCTS, products);
      return products[idx];
    }
    return null;
  },

  async reactivateProduct(productId) {
    if (this.isSupabaseActive()) {
      try {
        await supabase
          .from('products')
          .update({ is_archived: false, is_active: true, updated_at: new Date().toISOString() })
          .eq('id', productId);
      } catch (err) {
        console.warn('Supabase reactivateProduct error:', err);
      }
    }
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    const idx = products.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      products[idx].archived = false;
      products[idx].active = true;
      setStorageItem(STORAGE_KEYS.PRODUCTS, products);
      return products[idx];
    }
    return null;
  },

  async deleteProduct(productId) {
    if (this.isSupabaseActive()) {
      try {
        const { error: imageError } = await supabase.from('product_images').delete().eq('product_id', productId);
        if (imageError) console.warn('Product image cleanup warning:', imageError.message);
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) throw new Error(`Supabase product delete failed: ${error.message}`);
      } catch (err) {
        console.error('Supabase deleteProduct failed:', err);
        throw err;
      }
    }
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    setStorageItem(STORAGE_KEYS.PRODUCTS, products.filter((p) => p.id !== productId));
    return true;
  },

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 6. ORDERS MANAGEMENT (Atomic Stock Safety & YYMMDDNNN IDs)
  // -------------------------------------------------------------
  getTodayISTCode() {
    try {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      });
      const parts = formatter.formatToParts(new Date());
      const day = parts.find((p) => p.type === 'day')?.value || '01';
      const month = parts.find((p) => p.type === 'month')?.value || '01';
      const year = parts.find((p) => p.type === 'year')?.value || '26';
      return `${year}${month}${day}`;
    } catch {
      const d = new Date();
      const yr = String(d.getFullYear()).slice(-2);
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      return `${yr}${mo}${da}`;
    }
  },

  async getNextOrderNumber() {
    const todayIST = this.getTodayISTCode();

    if (this.isSupabaseActive()) {
      // 1. Try atomic database sequence RPC if available
      try {
        const { data, error } = await supabase.rpc('generate_next_order_id');
        if (!error && data && /^\d{9}$/.test(data)) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase generate_next_order_id RPC not active, falling back to query:', err);
      }

      // 2. Authoritatively query today's existing orders from Supabase database
      try {
        const { data: existingOrders } = await supabase
          .from('orders')
          .select('order_id')
          .or(`order_id.like.${todayIST}%,order_id.like.DB-20${todayIST}%`);

        let maxSeq = 0;
        if (existingOrders && existingOrders.length > 0) {
          existingOrders.forEach((o) => {
            const idStr = String(o.order_id || '').trim();
            if (/^\d{9}$/.test(idStr) && idStr.startsWith(todayIST)) {
              const seq = parseInt(idStr.slice(-3), 10);
              if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
            } else {
              const match = idStr.match(/(\d{3})$/);
              if (match) {
                const seq = parseInt(match[1], 10);
                if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
              }
            }
          });
        }
        const nextSeq = maxSeq + 1;
        return `${todayIST}${String(nextSeq).padStart(3, '0')}`;
      } catch (err) {
        console.warn('Supabase order_id query fallback error:', err);
      }
    }

    // 3. Emergency offline local fallback
    const key = `dreambasket_seq_${todayIST}`;
    const seq = (getStorageItem(key, 0) || 0) + 1;
    setStorageItem(key, seq);
    return `${todayIST}${String(seq).padStart(3, '0')}`;
  },

  async createOrder({ customer, cartItems, pricing, deliveryMethod = 'Standard Shipping' }) {
    let orderNumber = await this.getNextOrderNumber();
    const settings = await this.getStoreSettings();

    if (this.isSupabaseActive()) {
      try {
        // Call atomic PostgreSQL function
        const { data, error } = await supabase.rpc('place_order_with_stock_check', {
          p_order_id: orderNumber,
          p_customer: {
            fullName: customer.fullName || '',
            phoneNumber: customer.phoneNumber || customer.mobileNumber || '',
            address: customer.address || '',
            city: customer.city || '',
            state: customer.state || '',
            pincode: customer.pincode || '',
            instagramId: customer.instagramId || customer.instagramUsername || '',
            notes: customer.notes || '',
          },
          p_items: cartItems.map((item) => ({
            productId: item.id || item.productId,
            sku: item.sku || `DB-SKU-${item.id}`,
            productName: item.name || item.productName,
            image: item.image,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            lineTotal: Number(item.lineTotal) || Number(item.price) * (Number(item.quantity) || 1),
            packaging: item.packaging,
            packagingPrice: item.packagingPrice || 0,
            color: item.color,
            theme: item.theme,
          })),
          p_pricing: {
            subtotal: Number(pricing.subtotal) || 0,
            delivery: Number(pricing.delivery) || 0,
            total: Number(pricing.total) || 0,
          },
          p_delivery_method: deliveryMethod,
          p_delivery_eta: settings.deliveryEta || '6–7 business days',
        });

        if (error) {
          console.error('Supabase place_order_with_stock_check error:', error);
          throw new Error(error.message || 'Failed to place order in database.');
        }

        // Adopt authoritative orderNumber returned from database
        const returnedOrderNumber = typeof data === 'string' ? data : data?.orderNumber || data?.order_id || data?.orderId || null;
        if (returnedOrderNumber) orderNumber = returnedOrderNumber;
      } catch (err) {
        console.error('Atomic order placement error:', err);
        throw err;
      }
    }

    // Always create record in local store for seamless UI persistence
    const order = {
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: customer.fullName || '',
        phoneNumber: customer.phoneNumber || customer.mobileNumber || '',
        email: customer.email || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        pincode: customer.pincode || '',
        notes: customer.notes || '',
        instagramId: customer.instagramId || customer.instagramUsername || '',
        instagramUsername: customer.instagramId || customer.instagramUsername || '',
      },
      items: cartItems.map((item) => ({
        productId: item.id || item.productId,
        productName: item.name || item.productName,
        sku: item.sku || `DB-SKU-${item.id}`,
        image: item.image,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        lineTotal: Number(item.lineTotal) || Number(item.price) * (Number(item.quantity) || 1),
        packaging: item.packaging || null,
        packagingPrice: item.packaging?.price || item.packagingPrice || 0,
        color: item.color || null,
        theme: item.theme || null,
        isCombo: Boolean(item.isCombo),
      })),
      pricing: {
        subtotal: Number(pricing.subtotal) || 0,
        delivery: Number(pricing.delivery) || 0,
        discount: Number(pricing.discount) || 0,
        total: Number(pricing.total) || 0,
      },
      deliveryMethod,
      deliveryEta: settings.deliveryEta || '6–7 business days',
      orderStatus: 'New',
      paymentStatus: 'Pending',
    };

    const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
    orders.unshift(order);
    setStorageItem(STORAGE_KEYS.ORDERS, orders);

    // Update local products stock
    const products = getStorageItem(STORAGE_KEYS.PRODUCTS, []);
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && prod.stockQuantity !== undefined) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        const qty = Number(prod.stockQuantity) || 0;
        const threshold = Number(prod.lowStockThreshold) || 5;
        if (qty <= 0) {
          prod.stockStatus = 'Out of Stock';
          prod.inStock = false;
        } else if (qty <= threshold) {
          prod.stockStatus = 'Low Stock';
          prod.inStock = true;
        } else {
          prod.stockStatus = 'In Stock';
          prod.inStock = true;
        }
      }
    });
    setStorageItem(STORAGE_KEYS.PRODUCTS, products);

    return order;
  },

  async getOrders() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((o) => ({
            orderNumber: o.order_id,
            createdAt: o.created_at,
            customer: {
              fullName: o.customer_name,
              phoneNumber: o.phone,
              address: o.delivery_address,
              city: o.city || '',
              state: o.state || '',
              pincode: o.pincode || '',
              instagramId: o.instagram_id || '',
              instagramUsername: o.instagram_id || '',
              notes: o.order_notes || '',
            },
            items: (o.order_items || []).map((item) => ({
              productId: item.product_id,
              productName: item.product_name_snapshot,
              sku: item.product_id_snapshot,
              image: item.product_image_snapshot,
              price: Number(item.product_price) || 0,
              quantity: Number(item.quantity) || 1,
              lineTotal: Number(item.item_total) || 0,
              packaging: item.selected_packaging_id
                ? {
                  id: item.selected_packaging_id,
                  name: item.selected_packaging_name,
                  price: Number(item.selected_packaging_price) || 0,
                }
                : null,
              packagingPrice: Number(item.selected_packaging_price) || 0,
              color: item.selected_card_color,
              theme: item.selected_card_theme,
            })),
            pricing: {
              subtotal: Number(o.subtotal) || 0,
              delivery: Number(o.delivery_charge) || 0,
              total: Number(o.final_total) || 0,
            },
            deliveryMethod: o.delivery_method || 'Standard Shipping',
            deliveryEta: o.delivery_eta || '6–7 business days',
            orderStatus: o.order_status || 'New',
            paymentStatus: o.payment_status || 'Pending',
          }));
        }
      } catch (err) {
        console.warn('Supabase getOrders failed, using fallback:', err);
      }
    }
    const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getOrderById(orderNumber) {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('order_id', orderNumber)
          .maybeSingle();

        if (!error && data) {
          return {
            orderNumber: data.order_id,
            createdAt: data.created_at,
            customer: {
              fullName: data.customer_name,
              phoneNumber: data.phone,
              address: data.delivery_address,
              city: data.city || '',
              state: data.state || '',
              pincode: data.pincode || '',
              instagramId: data.instagram_id || '',
              instagramUsername: data.instagram_id || '',
              notes: data.order_notes || '',
            },
            items: (data.order_items || []).map((item) => ({
              productId: item.product_id,
              productName: item.product_name_snapshot,
              sku: item.product_id_snapshot,
              image: item.product_image_snapshot,
              price: Number(item.product_price) || 0,
              quantity: Number(item.quantity) || 1,
              lineTotal: Number(item.item_total) || 0,
              packaging: item.selected_packaging_id
                ? {
                  id: item.selected_packaging_id,
                  name: item.selected_packaging_name,
                  price: Number(item.selected_packaging_price) || 0,
                }
                : null,
              packagingPrice: Number(item.selected_packaging_price) || 0,
              color: item.selected_card_color,
              theme: item.selected_card_theme,
            })),
            pricing: {
              subtotal: Number(data.subtotal) || 0,
              delivery: Number(data.delivery_charge) || 0,
              total: Number(data.final_total) || 0,
            },
            deliveryMethod: data.delivery_method || 'Standard Shipping',
            deliveryEta: data.delivery_eta || '6–7 business days',
            orderStatus: data.order_status || 'New',
            paymentStatus: data.payment_status || 'Pending',
          };
        }
      } catch (err) {
        console.warn('Supabase getOrderById failed, using fallback:', err);
      }
    }
    const orders = await this.getOrders();
    return orders.find((o) => o.orderNumber === orderNumber) || null;
  },

  async updateOrderStatus(orderNumber, status) {
    if (this.isSupabaseActive()) {
      try {
        await supabase
          .from('orders')
          .update({ order_status: status, updated_at: new Date().toISOString() })
          .eq('order_id', orderNumber);
      } catch (err) {
        console.warn('Supabase updateOrderStatus error:', err);
      }
    }
    const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
    const orderIndex = orders.findIndex((o) => o.orderNumber === orderNumber);
    if (orderIndex !== -1) {
      orders[orderIndex].orderStatus = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      setStorageItem(STORAGE_KEYS.ORDERS, orders);
      return orders[orderIndex];
    }
    return null;
  },

  async updatePaymentStatus(orderNumber, paymentStatus) {
    if (this.isSupabaseActive()) {
      try {
        await supabase
          .from('orders')
          .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
          .eq('order_id', orderNumber);
      } catch (err) {
        console.warn('Supabase updatePaymentStatus error:', err);
      }
    }
    const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
    const orderIndex = orders.findIndex((o) => o.orderNumber === orderNumber);
    if (orderIndex !== -1) {
      orders[orderIndex].paymentStatus = paymentStatus;
      orders[orderIndex].paymentUpdatedAt = new Date().toISOString();
      setStorageItem(STORAGE_KEYS.ORDERS, orders);
      return orders[orderIndex];
    }
    return null;
  },

  // -------------------------------------------------------------
  // 7. CUSTOMERS DIRECTORY
  // -------------------------------------------------------------
  async getCustomers() {
    if (this.isSupabaseActive()) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select(`
            *,
            orders (id, final_total, created_at, order_status)
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((c) => {
            const validOrders = c.orders || [];
            const totalSpent = validOrders.reduce((sum, o) => sum + (Number(o.final_total) || 0), 0);
            return {
              id: c.id,
              fullName: c.name,
              phoneNumber: c.phone,
              email: '',
              address: [c.delivery_address, c.city, c.state, c.pincode].filter(Boolean).join(', '),
              instagramUsername: c.instagram_id || '',
              ordersCount: validOrders.length,
              totalSpent,
              orders: validOrders,
              lastOrderDate: validOrders.length ? validOrders[0].created_at : c.created_at,
            };
          });
        }
      } catch (err) {
        console.warn('Supabase getCustomers failed, using fallback:', err);
      }
    }

    const orders = await this.getOrders();
    const customerMap = {};

    orders.forEach((o) => {
      const key = (o.customer?.phoneNumber || o.customer?.fullName || 'unknown').trim().toLowerCase();
      if (!customerMap[key]) {
        customerMap[key] = {
          id: key,
          fullName: o.customer?.fullName || 'Customer',
          phoneNumber: o.customer?.phoneNumber || o.customer?.mobileNumber || 'N/A',
          email: o.customer?.email || '',
          address: [o.customer?.address, o.customer?.city, o.customer?.state, o.customer?.pincode].filter(Boolean).join(', '),
          instagramUsername: o.customer?.instagramUsername || o.customer?.instagramId || '',
          ordersCount: 0,
          totalSpent: 0,
          orders: [],
          lastOrderDate: o.createdAt,
        };
      }

      customerMap[key].ordersCount += 1;
      customerMap[key].totalSpent += (Number(o.pricing?.total) || 0);
      customerMap[key].orders.push(o);

      if (new Date(o.createdAt) > new Date(customerMap[key].lastOrderDate)) {
        customerMap[key].lastOrderDate = o.createdAt;
      }
    });

    return Object.values(customerMap).sort((a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate));
  },

  // -------------------------------------------------------------
  // 8. SALES ANALYTICS
  // -------------------------------------------------------------
  async getSalesAnalytics() {
    const orders = await this.getOrders();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let totalSales = 0;
    let todaySales = 0;
    let weeklySales = 0;
    let monthlySales = 0;

    orders.forEach((o) => {
      if (['Cancelled', 'Returned'].includes(o.orderStatus)) return;

      const amount = Number(o.pricing?.total) || 0;
      const time = new Date(o.createdAt).getTime();
      totalSales += amount;
      if (time >= todayStart) todaySales += amount;
      if (time >= weekStart) weeklySales += amount;
      if (time >= monthStart) monthlySales += amount;
    });

    const activeOrders = orders.filter((o) => !['Cancelled', 'Returned'].includes(o.orderStatus));
    const totalOrders = activeOrders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    return {
      totalSales,
      todaySales,
      weeklySales,
      monthlySales,
      totalOrders,
      averageOrderValue,
    };
  },

  // -------------------------------------------------------------
  // 9. IMAGE STORAGE UPLOAD
  // -------------------------------------------------------------
  async uploadImage(file, bucket = 'product-images') {
    if (this.isSupabaseActive()) {
      try {
        const result = await uploadStorageFile(bucket, file);
        return result.publicUrl;
      } catch (err) {
        console.error('Upload to Supabase failed:', err);
        throw err;
      }
    }
    // Fallback data URL if storage is not connected
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  },

  // -------------------------------------------------------------
  // 9B. INSTAGRAM ORDER MESSAGE GENERATOR
  // Formats clean customer order summary for Instagram DM confirmation
  // Strictly excludes private supplier costs, packing costs, and profit
  // -------------------------------------------------------------
  generateInstagramOrderMessage(order) {
    if (!order) return '';

    const items = (order.items || []).map((item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return `* ${item.productName || 'Product'} × ${qty} — ₹${price * qty}`;
    });

    // Extract packaging choices
    const packagingList = [];
    (order.items || []).forEach((item) => {
      const pkgName = item.packaging?.name || item.selectedPackagingName;
      if (pkgName) {
        const pkgPrice = Number(item.packagingPrice || item.packaging?.price || 0);
        packagingList.push(`* ${pkgName} — ₹${pkgPrice}`);
      }
    });

    // Extract handmade card choices if any
    const cardColor = order.items?.find((i) => i.color)?.color;
    const cardTheme = order.items?.find((i) => i.theme)?.theme;

    // Delivery text
    let deliveryText = 'To be confirmed';
    if (order.pricing?.delivery > 0) {
      deliveryText = `₹${order.pricing.delivery}`;
    }

    const fullAddress = [
      order.customer?.address,
      order.customer?.city,
      order.customer?.state,
      order.customer?.pincode,
    ]
      .filter(Boolean)
      .join(', ');

    let msg = `Dreambasket Order 🎀\n\n`;
    msg += `Order ID: ${order.orderNumber}\n\n`;
    msg += `Name: ${order.customer?.fullName || ''}\n`;
    msg += `Phone: ${order.customer?.phoneNumber || order.customer?.mobileNumber || ''}\n`;
    msg += `Address: ${fullAddress}\n\n`;

    msg += `Items:\n${items.join('\n') || '* No items'}\n\n`;

    if (packagingList.length > 0) {
      msg += `Packaging:\n${packagingList.join('\n')}\n\n`;
    }

    if (cardColor || cardTheme) {
      msg += `Handmade Card:\n`;
      if (cardColor) msg += `* Color: ${cardColor}\n`;
      if (cardTheme) msg += `* Theme: ${cardTheme}\n`;
      msg += `\n`;
    }

    msg += `Subtotal: ₹${order.pricing?.subtotal || 0}\n`;
    msg += `Delivery: ${deliveryText}\n`;
    msg += `Total: ₹${order.pricing?.total || order.pricing?.subtotal || 0}\n\n`;
    msg += `Please confirm my order.`;

    return msg;
  },

  // Alias for backward compatibility
  generateInstagramOrderText(order) {
    return this.generateInstagramOrderMessage(order);
  },

  // -------------------------------------------------------------
  // 10. ADMIN AUTHENTICATION
  // -------------------------------------------------------------
  checkAdminAuth() {
    const session = getStorageItem(STORAGE_KEYS.ADMIN_AUTH, null);
    if (!session || !session.token) return false;
    if (session.expiresAt && Date.now() > session.expiresAt) {
      this.logoutAdmin();
      return false;
    }
    return true;
  },

  async loginAdmin(username, password) {
    if (!username || !password) return false;

    const normalizedUser = username.trim().toLowerCase();
    const isAllowedUser = normalizedUser === 'dreambasket' || normalizedUser === 'admin' || normalizedUser === 'admin@dreambasket.studio';
    if (!isAllowedUser) return false;

    const saltedHash = await computeSha256(`${password}:${AUTH_CONFIG.SALT}`);
    const directHash = await computeSha256(password);

    const isMatch = saltedHash === AUTH_CONFIG.SALTED_HASH || directHash === AUTH_CONFIG.DIRECT_HASH;
    if (isMatch) {
      const session = {
        token: `db_token_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        user: normalizedUser,
        createdAt: Date.now(),
        expiresAt: Date.now() + AUTH_CONFIG.SESSION_DURATION_MS,
      };
      setStorageItem(STORAGE_KEYS.ADMIN_AUTH, session);
      return true;
    }
    return false;
  },

  logoutAdmin() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch (e) {
      console.warn('Logout error:', e);
    }
  },
};
