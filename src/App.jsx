import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Wishlist } from './pages/Wishlist';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { ReturnPolicy } from './pages/ReturnPolicy';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { JewelleryCare } from './pages/JewelleryCare';
import { Admin } from './pages/Admin';

// Scroll restoration helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper that keeps boutique header/footer for customers
// and gives a dedicated distraction-free workspace for /admin
const AppLayout = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="page-wrapper">
      {/* Sticky Header (Hidden on Admin dashboard) */}
      {!isAdmin && <Header />}

      {/* Main Routing System */}
      <main>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Home />} />

          {/* Complete Catalogue */}
          <Route path="/shop" element={<Shop />} />

          {/* Exact Categories */}
          <Route path="/new-arrivals" element={<CategoryPage categoryId="new-arrivals" />} />
          <Route path="/anti-tarnish" element={<CategoryPage categoryId="anti-tarnish" />} />
          <Route path="/earrings" element={<CategoryPage categoryId="earrings" />} />
          <Route path="/necklaces" element={<CategoryPage categoryId="necklaces" />} />
          <Route path="/bracelets" element={<CategoryPage categoryId="bracelets" />} />
          <Route path="/rings" element={<CategoryPage categoryId="rings" />} />
          <Route path="/hair-accessories" element={<CategoryPage categoryId="hair-accessories" />} />
          <Route path="/gift-hampers" element={<CategoryPage categoryId="gift-hampers" />} />
          <Route path="/jewellery-combos" element={<CategoryPage categoryId="jewellery-combos" />} />
          <Route path="/princess-chains" element={<CategoryPage categoryId="princess-chains" />} />
          <Route path="/handmade-cards" element={<CategoryPage categoryId="handmade-cards" />} />
          <Route path="/budget-friendly" element={<CategoryPage categoryId="budget-friendly" />} />
          <Route path="/bestsellers" element={<CategoryPage categoryId="bestsellers" />} />

          {/* Product Detail Route */}
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Cart, Checkout & Order Success */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Brand & Support */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Dedicated Policy & Care Routes */}
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/jewellery-care" element={<JewelleryCare />} />

          {/* Protected Admin Route */}
          <Route path="/admin" element={<Admin />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Global Footer (Hidden on Admin) */}
      {!isAdmin && <Footer />}

      {/* Mobile Bottom Navigation (Hidden on Admin) */}
      {!isAdmin && <MobileBottomNav />}

      {/* Interactive Search Overlay */}
      <SearchModal />

      {/* Notification Toast */}
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <AppLayout />
      </Router>
    </ShopProvider>
  );
}

export default App;
