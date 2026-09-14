import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storeService } from '../services/storeService';
import {
  PACKAGING_OPTIONS as DEFAULT_PACKAGING,
  HANDMADE_CARD_COLORS as DEFAULT_CARD_COLORS,
  HANDMADE_CARD_THEMES as DEFAULT_CARD_THEMES,
} from '../data/packaging';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Store dynamic data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packagingOptions, setPackagingOptions] = useState(DEFAULT_PACKAGING);
  const [cardColors, setCardColors] = useState(DEFAULT_CARD_COLORS);
  const [cardThemes, setCardThemes] = useState(DEFAULT_CARD_THEMES);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Dreambasket',
    instagramHandle: '@dreambasket.studio',
    instagramUrl: 'https://instagram.com/dreambasket.studio',
    whatsappNumber: '',
    tagline: 'Little treasures, made to make you smile 🎀',
    deliveryFee: 0,
    deliveryMethod: 'Standard Shipping',
    deliveryEta: '4–6 business days',
    manualUpiEnabled: false,
    upiId: '',
    paymentInstructions: '',
    paymentProofRequired: false,
    freeShippingThreshold: 799,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Wishlist persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('dreambasket_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
    } catch {
      return ['prod-1', 'prod-3'];
    }
  });

  // Cart persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('dreambasket_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load database entities
  const refreshData = useCallback(async () => {
    try {
      const [prods, cats, settings, pkgOptions, colors, themes] = await Promise.all([
        storeService.getProducts(),
        storeService.getCategories(),
        storeService.getStoreSettings(),
        storeService.getPackagingOptions(),
        storeService.getCardColors(),
        storeService.getCardThemes(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setStoreSettings(settings);
      if (pkgOptions && pkgOptions.length) setPackagingOptions(pkgOptions);
      if (colors && colors.length) setCardColors(colors);
      if (themes && themes.length) setCardThemes(themes);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dreambasket_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dreambasket_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.includes(product.id);
    if (exists) {
      setWishlist(wishlist.filter((id) => id !== product.id));
      showToast(`Removed "${product.name}" from wishlist 💭`);
    } else {
      setWishlist([...wishlist, product.id]);
      showToast(`Added "${product.name}" to wishlist 💕`);
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const addToCart = (product, quantity = 1, options = {}) => {
    // Check stock availability (manual control + quantity)
    const isOutOfStock = product.inStock === false || product.stockStatus === 'out_of_stock' || (product.stockQuantity !== undefined && product.stockQuantity <= 0);
    if (isOutOfStock) {
      showToast(`Sorry, "${product.name}" is currently Out of Stock ❌`);
      return false;
    }

    const packaging = options.packaging || null;
    const packagingPrice = packaging ? Number(packaging.price) || 0 : 0;
    const color = options.color || null;
    const theme = options.theme || null;

    const cartItemId = `${product.id}_${packaging ? packaging.id : 'std'}_${color || ''}_${theme || ''}`;

    setCart((prev) => {
      const existing = prev.find((item) => (item.cartItemId || item.product.id) === cartItemId);
      if (existing) {
        return prev.map((item) =>
          (item.cartItemId || item.product.id) === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          quantity,
          packaging,
          packagingPrice,
          color,
          theme,
        },
      ];
    });
    showToast(`Added "${product.name}" to your basket 🎀`);
    return true;
  };

  const removeFromCart = (identifier) => {
    setCart((prev) => prev.filter((item) => (item.cartItemId || item.product.id) !== identifier));
    showToast('Item removed from basket');
  };

  const updateQuantity = (identifier, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if ((item.cartItemId || item.product.id) === identifier) {
            const maxStock = item.product.stockQuantity !== undefined ? item.product.stockQuantity : 99;
            const newQty = item.quantity + delta;
            if (newQty > maxStock) {
              showToast(`Only ${maxStock} items available in stock`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    setOrderNotes('');
    try {
      localStorage.removeItem('dreambasket_cart');
    } catch (e) {
      console.error(e);
    }
  };

  // Calculations: includes product price + packaging price
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const unitPrice = (Number(item.product.price) || 0) + (Number(item.packagingPrice) || 0);
    return acc + unitPrice * item.quantity;
  }, 0);

  // Delivery charge from store settings
  const deliveryFee = Number(storeSettings.deliveryFee) || 0;
  const cartTotal = cartSubtotal + deliveryFee;

  // Checkout order placement function
  const placeOrder = async (customerDetails) => {
    if (cart.length === 0) {
      throw new Error('Your dream basket is empty. Please add items before placing an order.');
    }

    try {
      const cartItems = cart.map((item) => ({
        id: item.product.id,
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        lineTotal: ((Number(item.product.price) || 0) + (Number(item.packagingPrice) || 0)) * item.quantity,
        packaging: item.packaging,
        packagingPrice: item.packagingPrice,
        color: item.color,
        theme: item.theme,
        isCombo: item.product.isCombo,
      }));

      const createdOrder = await storeService.createOrder({
        customer: customerDetails,
        cartItems,
        pricing: {
          subtotal: cartSubtotal,
          delivery: deliveryFee,
          total: cartTotal,
        },
        deliveryMethod: storeSettings.deliveryMethod || 'Standard Shipping',
      });

      // Clear cart only after verified order creation in database
      clearCart();
      await refreshData(); // refresh products stock and settings

      return {
        success: true,
        order: createdOrder,
      };
    } catch (err) {
      console.error('Order creation error:', err);
      throw err;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        packagingOptions,
        cardColors,
        cardThemes,
        storeSettings,
        refreshData,
        isLoading,
        wishlist,
        toggleWishlist,
        isInWishlist,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        orderNotes,
        setOrderNotes,
        placeOrder,
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    return {
      products: [],
      categories: [],
      packagingOptions: DEFAULT_PACKAGING,
      cardColors: DEFAULT_CARD_COLORS,
      cardThemes: DEFAULT_CARD_THEMES,
      storeSettings: {
        storeName: 'Dreambasket',
        instagramHandle: '@dreambasket.studio',
        instagramUrl: 'https://instagram.com/dreambasket.studio',
        tagline: 'Little treasures, made to make you smile 🎀',
        deliveryMethod: 'Standard Shipping',
        deliveryEta: '4–6 business days',
      },
      cart: [],
      wishlist: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      cartTotalCount: 0,
      cartSubtotal: 0,
      deliveryFee: 0,
      cartTotal: 0,
      isInWishlist: () => false,
      toggleWishlist: () => {},
      placeOrder: async () => ({ success: false }),
      showToast: () => {},
      openSearch: () => {},
      closeSearch: () => {},
    };
  }
  return context;
};
