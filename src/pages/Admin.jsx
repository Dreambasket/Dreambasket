import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Gift,
  Mail,
  Boxes,
  DollarSign,
  Users,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Search,
  Check,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Image as ImageIcon,
  Archive,
  RefreshCw,
  Sliders,
  ChevronRight,
  Filter,
  Upload,
} from 'lucide-react';
import { storeService } from '../services/storeService';
import { useShop } from '../context/ShopContext';
import { Button } from '../components/Button';

export const Admin = () => {
  const navigate = useNavigate();
  const { refreshData } = useShop();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => storeService.checkAdminAuth());
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Navigation Tab: 10 Sidebar Items
  const [activeTab, setActiveTab] = useState('dashboard');
  // 'dashboard' | 'orders' | 'products' | 'categories' | 'packaging' | 'cards' | 'inventory' | 'sales' | 'customers' | 'settings'

  // Live Data State
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [cardColors, setCardColors] = useState([]);
  const [cardThemes, setCardThemes] = useState([]);
  const [settings, setSettings] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [salesAnalytics, setSalesAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals & Selected Entities
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Product Add / Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    sku: '',
    price: '',
    originalPrice: '',
    category: 'anti-tarnish',
    categoryName: '✨ Anti-Tarnish Jewellery',
    subCategory: 'chains',
    stockQuantity: 25,
    lowStockThreshold: 5,
    image: '',
    images: [],
    description: '',
    material: '',
    colour: '',
    size: '',
    active: true,
    archived: false,
    isBestseller: false,
    isNewArrival: false,
    isFeatured: false,
    isCombo: false,
    comboItemsStr: '',
    comboDescription: '',
    antiTarnish: true,
  });
  const [newImageUrl, setNewImageUrl] = useState('');

  // Category Add / Edit Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    subcategoriesStr: '',
  });

  // Packaging Add / Edit Modal
  const [isPackagingModalOpen, setIsPackagingModalOpen] = useState(false);
  const [editingPackaging, setEditingPackaging] = useState(null);
  const [packagingFormData, setPackagingFormData] = useState({
    name: '',
    price: 0,
    image: '',
    description: '',
    active: true,
  });

  // Handmade Cards Modals
  const [newColorForm, setNewColorForm] = useState({ name: '', hex: '#F4D9E8', border: '#E8B8D0' });
  const [newThemeText, setNewThemeText] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(null);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState('');

  // Search & Filter State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [customerSearch, setCustomerSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  // Inline Stock Edit State in Inventory Tab
  const [inlineStockMap, setInlineStockMap] = useState({});
  const [stockSavedMsg, setStockSavedMsg] = useState({});

  // -------------------------------------------------------------
  // DATA LOADING
  // -------------------------------------------------------------
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [allOrders, allProds, allCats, storeSettings, pkgOptions, colors, themes, custs, sales] =
        await Promise.all([
          storeService.getOrders(),
          storeService.getAllProductsAdmin(),
          storeService.getCategories(),
          storeService.getStoreSettings(),
          storeService.getPackagingOptions(),
          storeService.getCardColors(),
          storeService.getCardThemes(),
          storeService.getCustomers(),
          storeService.getSalesAnalytics(),
        ]);

      setOrders(allOrders);
      setProducts(allProds);
      setCategories(allCats);
      setSettings(storeSettings);
      setSettingsForm(storeSettings);
      setPackagingOptions(pkgOptions);
      setCardColors(colors);
      setCardThemes(themes);
      setCustomers(custs);
      setSalesAnalytics(sales);

      // Initialize inline stock state
      const stockMap = {};
      allProds.forEach((p) => {
        stockMap[p.id] = p.stockQuantity !== undefined ? p.stockQuantity : 25;
      });
      setInlineStockMap(stockMap);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  // -------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // -------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const success = await storeService.loginAdmin(loginForm.username, loginForm.password);
      if (success) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid username or password. Please verify your boutique credentials.');
      }
    } catch (err) {
      setLoginError('Authentication error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    storeService.logoutAdmin();
    setIsAuthenticated(false);
    navigate('/admin');
  };

  // -------------------------------------------------------------
  // ORDERS HANDLERS
  // -------------------------------------------------------------
  const handleUpdateOrderStatus = async (orderNumber, status) => {
    try {
      const updated = await storeService.updateOrderStatus(orderNumber, status);
      setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? updated : o)));
      if (selectedOrder?.orderNumber === orderNumber) setSelectedOrder(updated);
      const updatedSales = await storeService.getSalesAnalytics();
      setSalesAnalytics(updatedSales);
    } catch (err) {
      alert(`Failed to update order status: ${err.message}`);
    }
  };

  const handleUpdatePaymentStatus = async (orderNumber, status) => {
    try {
      const updated = await storeService.updatePaymentStatus(orderNumber, status);
      setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? updated : o)));
      if (selectedOrder?.orderNumber === orderNumber) setSelectedOrder(updated);
    } catch (err) {
      alert(`Failed to update payment status: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // PRODUCT MANAGEMENT HANDLERS (Add, Edit, Archive, Delete)
  // -------------------------------------------------------------
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      const imgList = Array.isArray(prod.images) && prod.images.length ? prod.images : prod.image ? [prod.image] : [];
      setProductFormData({
        id: prod.id,
        name: prod.name,
        sku: prod.sku || '',
        price: prod.price,
        originalPrice: prod.originalPrice || '',
        costPrice: prod.costPrice !== undefined ? prod.costPrice : '',
        packingCost: prod.packingCost !== undefined ? prod.packingCost : '',
        category: prod.category || 'anti-tarnish',
        categoryName: prod.categoryName || '✨ Anti-Tarnish Jewellery',
        subCategory: prod.subCategory || 'chains',
        stockQuantity: prod.stockQuantity !== undefined ? prod.stockQuantity : 25,
        lowStockThreshold: prod.lowStockThreshold || 5,
        inStock: prod.inStock !== false && prod.stockStatus !== 'out_of_stock',
        stockStatus: prod.inStock === false || prod.stockStatus === 'out_of_stock' ? 'out_of_stock' : 'in_stock',
        image: prod.image || '',
        images: imgList,
        description: prod.description || '',
        material: prod.material || '',
        colour: prod.colour || '',
        size: prod.size || '',
        active: prod.active !== undefined ? prod.active : true,
        archived: Boolean(prod.archived),
        isBestseller: Boolean(prod.isBestseller),
        isNewArrival: Boolean(prod.isNewArrival),
        isFeatured: Boolean(prod.isFeatured),
        isCombo: Boolean(prod.isCombo || prod.category === 'jewellery-combos'),
        comboItemsStr: prod.comboItems ? prod.comboItems.join(', ') : '',
        comboDescription: prod.comboDescription || '',
        antiTarnish: Boolean(prod.antiTarnish || prod.category === 'anti-tarnish'),
      });
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        sku: `DB-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        price: '',
        originalPrice: '',
        costPrice: '',
        packingCost: '',
        category: 'anti-tarnish',
        categoryName: '✨ Anti-Tarnish Jewellery',
        subCategory: 'chains',
        stockQuantity: 25,
        lowStockThreshold: 5,
        inStock: true,
        stockStatus: 'in_stock',
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'],
        description: '',
        material: '',
        colour: '',
        size: '',
        active: true,
        archived: false,
        isBestseller: false,
        isNewArrival: true,
        isFeatured: false,
        isCombo: false,
        comboItemsStr: '',
        comboDescription: '',
        antiTarnish: true,
      });
    }
    setNewImageUrl('');
    setIsProductModalOpen(true);
  };

  // Helper: Read and compress image to base64 DataURL for localStorage persistence
  const readFileAsCompressedDataUrl = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Smart helper to upload to Supabase Storage with local data URL fallback
  const uploadFileSmart = async (file, bucket = 'product-images') => {
    if (storeService.isSupabaseActive()) {
      try {
        return await storeService.uploadImage(file, bucket);
      } catch (err) {
        console.warn('Storage upload error, using local fallback:', err);
      }
    }
    return readFileAsCompressedDataUrl(file);
  };

  // Upload main image from computer
  const handleUploadMainImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFileSmart(file, 'product-images');
    if (!url) return;
    setProductFormData((prev) => {
      const remaining = prev.images.slice(1);
      return {
        ...prev,
        image: url,
        images: [url, ...remaining],
      };
    });
    e.target.value = '';
  };

  // Upload multiple additional images from computer
  const handleUploadAdditionalImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const promises = files.map((f) => uploadFileSmart(f, 'product-images'));
    const urls = (await Promise.all(promises)).filter(Boolean);
    if (!urls.length) return;
    setProductFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...urls],
      image: prev.images[0] || urls[0],
    }));
    e.target.value = '';
  };

  // Move image left / right in gallery
  const handleMoveImage = (fromIdx, toIdx) => {
    setProductFormData((prev) => {
      if (toIdx < 0 || toIdx >= prev.images.length) return prev;
      const copy = [...prev.images];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      return {
        ...prev,
        images: copy,
        image: copy[0],
      };
    });
  };

  // Replace an existing image with a file from device
  const handleReplaceImage = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFileSmart(file, 'product-images');
    if (!url) return;
    setProductFormData((prev) => {
      const copy = [...prev.images];
      copy[index] = url;
      return {
        ...prev,
        images: copy,
        image: index === 0 ? url : (copy[0] || url),
      };
    });
    e.target.value = '';
  };

  const handleAddImageToProduct = () => {
    if (!newImageUrl.trim()) return;
    setProductFormData((prev) => {
      const updatedImages = [...prev.images, newImageUrl.trim()];
      return {
        ...prev,
        images: updatedImages,
        image: prev.image || newImageUrl.trim(),
      };
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductFormData((prev) => {
      const updatedImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updatedImages,
        image: updatedImages[0] || '',
      };
    });
  };

  const handleSetPrimaryImage = (index) => {
    setProductFormData((prev) => {
      const target = prev.images[index];
      const reordered = [target, ...prev.images.filter((_, idx) => idx !== index)];
      return {
        ...prev,
        images: reordered,
        image: target,
      };
    });
  };

  // Quick toggle product stock status (In Stock <-> Out of Stock)
  const handleToggleProductStock = async (prod) => {
    const isCurrentlyInStock = prod.inStock !== false && prod.stockStatus !== 'out_of_stock' && (prod.stockQuantity === undefined || prod.stockQuantity > 0);
    const newInStock = !isCurrentlyInStock;
    const newQty = newInStock && prod.stockQuantity <= 0 ? 10 : prod.stockQuantity;
    try {
      await storeService.updateProductStock(prod.id, newQty, newInStock);
      await loadAdminData();
      refreshData();
    } catch (err) {
      alert(`Could not toggle stock: ${err.message}`);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.price) {
      alert('Please enter product name and price.');
      return;
    }

    const catObj = categories.find((c) => c.id === productFormData.category);
    const comboItems = productFormData.comboItemsStr
      ? productFormData.comboItemsStr.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const isStockAvailable = productFormData.stockStatus === 'in_stock' || (productFormData.inStock !== false && productFormData.stockStatus !== 'out_of_stock');

    const payload = {
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: productFormData.name,
      sku: productFormData.sku,
      price: Number(productFormData.price),
      originalPrice: productFormData.originalPrice ? Number(productFormData.originalPrice) : Number(productFormData.price),
      costPrice: productFormData.costPrice !== '' && productFormData.costPrice !== undefined ? Number(productFormData.costPrice) : 0,
      packingCost: productFormData.packingCost !== '' && productFormData.packingCost !== undefined ? Number(productFormData.packingCost) : 0,
      category: productFormData.category,
      categoryName: catObj ? catObj.name : productFormData.category,
      subCategory: productFormData.subCategory || null,
      stockQuantity: Number(productFormData.stockQuantity) || 0,
      lowStockThreshold: Number(productFormData.lowStockThreshold) || 5,
      inStock: isStockAvailable,
      stockStatus: isStockAvailable ? 'in_stock' : 'out_of_stock',
      image: productFormData.images?.[0] || productFormData.image,
      images: productFormData.images?.length ? productFormData.images : [productFormData.image],
      description: productFormData.description,
      material: productFormData.material,
      colour: productFormData.colour,
      size: productFormData.size,
      active: Boolean(productFormData.active),
      archived: Boolean(productFormData.archived),
      isBestseller: Boolean(productFormData.isBestseller),
      isNewArrival: Boolean(productFormData.isNewArrival),
      isFeatured: Boolean(productFormData.isFeatured),
      isCombo: Boolean(productFormData.isCombo || productFormData.category === 'jewellery-combos'),
      comboItems,
      comboDescription: productFormData.comboDescription,
      antiTarnish: Boolean(productFormData.antiTarnish),
    };

    try {
      await storeService.saveProduct(payload);
      await loadAdminData();
      refreshData();
      setIsProductModalOpen(false);
    } catch (err) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleArchiveProduct = async (prodId, currentArchived) => {
    try {
      if (currentArchived) {
        await storeService.reactivateProduct(prodId);
      } else {
        await storeService.archiveProduct(prodId);
      }
      await loadAdminData();
      await refreshData();
    } catch (err) {
      alert(`Error updating product status: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
      await storeService.deleteProduct(prodId);
      await loadAdminData();
      await refreshData();
    }
  };

  // -------------------------------------------------------------
  // INVENTORY INLINE STOCK UPDATE HANDLER (Part 17)
  // -------------------------------------------------------------
  const handleSaveInlineStock = async (prodId) => {
    const qty = inlineStockMap[prodId];
    try {
      await storeService.updateProductStock(prodId, qty);
      await refreshData();
      setStockSavedMsg((prev) => ({ ...prev, [prodId]: true }));
      setTimeout(() => {
        setStockSavedMsg((prev) => ({ ...prev, [prodId]: false }));
      }, 2000);
    } catch (err) {
      alert(`Failed to update stock: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // CATEGORY MANAGEMENT HANDLERS (Part 13)
  // -------------------------------------------------------------
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryFormData({
        name: cat.name,
        slug: cat.slug || `/${cat.id}`,
        description: cat.description || '',
        image: cat.image || '',
        subcategoriesStr: cat.subcategories ? cat.subcategories.map((s) => s.name).join(', ') : '',
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({
        name: '',
        slug: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
        subcategoriesStr: '',
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name) return;

    const subcats = categoryFormData.subcategoriesStr
      ? categoryFormData.subcategoriesStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((name) => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
          }))
      : [];

    const payload = {
      ...(editingCategory ? { id: editingCategory.id } : {}),
      name: categoryFormData.name,
      slug: categoryFormData.slug || `/${categoryFormData.name.toLowerCase().replace(/\s+/g, '-')}`,
      description: categoryFormData.description,
      image: categoryFormData.image,
      subcategories: subcats,
    };

    try {
      await storeService.saveCategory(payload);
      await loadAdminData();
      await refreshData();
      setIsCategoryModalOpen(false);
    } catch (err) {
      alert(`Error saving category: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await storeService.deleteCategory(catId);
      await loadAdminData();
      await refreshData();
    }
  };

  // -------------------------------------------------------------
  // PACKAGING MANAGEMENT HANDLERS (Part 14)
  // -------------------------------------------------------------
  const handleOpenPackagingModal = (pkg = null) => {
    if (pkg) {
      setEditingPackaging(pkg);
      const pkgImages = Array.isArray(pkg.images) && pkg.images.length ? pkg.images : pkg.image ? [pkg.image] : [];
      setPackagingFormData({
        name: pkg.name,
        price: pkg.price || 0,
        image: pkg.image || '',
        images: pkgImages,
        description: pkg.description || '',
        active: pkg.active !== undefined ? pkg.active : true,
      });
    } else {
      setEditingPackaging(null);
      setPackagingFormData({
        name: '',
        price: 0,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
        images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80'],
        description: '',
        active: true,
      });
    }
    setIsPackagingModalOpen(true);
  };

  const handlePackagingImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const promises = files.map((f) => uploadFileSmart(f, 'packaging-images'));
    const urls = (await Promise.all(promises)).filter(Boolean);
    if (!urls.length) return;
    setPackagingFormData((prev) => {
      const current = prev.images || (prev.image ? [prev.image] : []);
      const combined = [...current, ...urls];
      return {
        ...prev,
        images: combined,
        image: combined[0] || prev.image,
      };
    });
    e.target.value = '';
  };

  const handleRemovePackagingImage = (idxToRemove) => {
    setPackagingFormData((prev) => {
      const current = prev.images || (prev.image ? [prev.image] : []);
      const filtered = current.filter((_, idx) => idx !== idxToRemove);
      return {
        ...prev,
        images: filtered,
        image: filtered[0] || '',
      };
    });
  };

  const handleSavePackaging = async (e) => {
    e.preventDefault();
    if (!packagingFormData.name) return;

    try {
      const finalImages = Array.isArray(packagingFormData.images) && packagingFormData.images.length
        ? packagingFormData.images
        : packagingFormData.image
        ? [packagingFormData.image]
        : [];
      await storeService.savePackagingOption({
        ...(editingPackaging ? { id: editingPackaging.id } : {}),
        name: packagingFormData.name,
        price: Number(packagingFormData.price) || 0,
        image: finalImages[0] || packagingFormData.image,
        images: finalImages,
        description: packagingFormData.description,
        active: Boolean(packagingFormData.active),
      });
      await loadAdminData();
      await refreshData();
      setIsPackagingModalOpen(false);
    } catch (err) {
      alert(`Error saving packaging: ${err.message}`);
    }
  };

  const handleDeletePackaging = async (pkgId) => {
    if (window.confirm('Delete this packaging option?')) {
      await storeService.deletePackagingOption(pkgId);
      await loadAdminData();
      await refreshData();
    }
  };

  // -------------------------------------------------------------
  // HANDMADE CARD OPTIONS HANDLERS (Part 15)
  // -------------------------------------------------------------
  const handleAddCardColor = async (e) => {
    e.preventDefault();
    if (!newColorForm.name.trim()) return;
    const newColor = {
      id: newColorForm.name.toLowerCase().replace(/\s+/g, '-'),
      name: newColorForm.name.trim(),
      hex: newColorForm.hex,
      border: newColorForm.border || '#ccc',
    };
    const updated = [...cardColors, newColor];
    await storeService.saveCardColors(updated);
    setCardColors(updated);
    await refreshData();
    setNewColorForm({ name: '', hex: '#F4D9E8', border: '#E8B8D0' });
  };

  const handleRemoveCardColor = async (idToRemove) => {
    const updated = cardColors.filter((c) => c.id !== idToRemove);
    await storeService.saveCardColors(updated);
    setCardColors(updated);
    await refreshData();
  };

  const handleAddCardTheme = async (e) => {
    e.preventDefault();
    if (!newThemeText.trim()) return;
    const updated = [...cardThemes, newThemeText.trim()];
    await storeService.saveCardThemes(updated);
    setCardThemes(updated);
    await refreshData();
    setNewThemeText('');
  };

  const handleRemoveCardTheme = async (themeToRemove) => {
    const updated = cardThemes.filter((t) => t !== themeToRemove);
    await storeService.saveCardThemes(updated);
    setCardThemes(updated);
    await refreshData();
  };

  // -------------------------------------------------------------
  // STORE SETTINGS HANDLER
  // -------------------------------------------------------------
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const updated = await storeService.updateStoreSettings(settingsForm);
      setSettings(updated);
      await refreshData();
      setSettingsSaveMsg('Store settings saved successfully! ✨');
      setTimeout(() => setSettingsSaveMsg(''), 3500);
    } catch (err) {
      alert(`Failed to save settings: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // COMPUTED METRICS FOR DASHBOARD (Part 8)
  // -------------------------------------------------------------
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'New' || o.paymentStatus === 'PENDING').length;
  const toShipOrdersCount = orders.filter((o) => ['Confirmed', 'Packed'].includes(o.orderStatus)).length;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const lowStockCount = products.filter((p) => p.stockQuantity !== undefined && p.stockQuantity > 0 && p.stockQuantity < (p.lowStockThreshold || 5)).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity !== undefined && p.stockQuantity <= 0).length;
  const totalSalesAmount = salesAnalytics?.totalSales || 0;

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (orderStatusFilter !== 'ALL') {
      result = result.filter((o) => o.orderStatus === orderStatusFilter);
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.customer?.fullName?.toLowerCase().includes(q) ||
          o.customer?.instagramUsername?.toLowerCase().includes(q) ||
          (o.customer?.phoneNumber && o.customer.phoneNumber.includes(q))
      );
    }
    return result;
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = products;
    if (productCategoryFilter !== 'ALL') {
      result = result.filter((p) => p.category === productCategoryFilter);
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, productSearch, productCategoryFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(q) ||
        c.phoneNumber?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q)
    );
  }, [customers, customerSearch]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    if (!inventorySearch.trim()) return products;
    const q = inventorySearch.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
  }, [products, inventorySearch]);

  // -------------------------------------------------------------
  // RENDER: LOGIN SCREEN (if unauthenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '6rem 1rem', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8FB' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid var(--border-lavender)',
            borderRadius: '24px',
            padding: '2.5rem',
            maxWidth: '430px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎀</div>
          <h1 className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Dreambasket Admin
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Protected boutique command center for catalogue, live stock, orders, and sales management.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Admin Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Dreambasket"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-soft)',
                  background: 'var(--bg-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-soft)',
                  background: 'var(--bg-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            {loginError && (
              <div style={{ fontSize: '0.82rem', color: '#C62828', background: '#FFEBEE', padding: '0.75rem', borderRadius: '10px' }}>
                {loginError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loginLoading}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
            >
              {loginLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </Button>
          </form>

          <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
            🔒 Protected area. Secure SHA-256 session authentication.
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SIDEBAR NAVIGATION ITEMS (Part 20)
  // -------------------------------------------------------------
  const sidebarNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} />, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
    { id: 'categories', label: 'Categories', icon: <FolderTree size={18} /> },
    { id: 'packaging', label: 'Packaging', icon: <Gift size={18} /> },
    { id: 'cards', label: 'Handmade Cards', icon: <Mail size={18} /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes size={18} />, badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: '#E65100' },
    { id: 'sales', label: 'Sales', icon: <DollarSign size={18} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div style={{ background: '#FAF7FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid var(--border-soft)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem' }}>🎀</span>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Dreambasket Admin
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--lavender-deep)' }}>
              Live Store Management
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" target="_blank" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>View Live Store</span>
            <ArrowUpRight size={14} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#C62828' }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '240px',
            background: '#FFFFFF',
            borderRight: '1px solid var(--border-soft)',
            padding: '1.5rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          {sidebarNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'var(--lavender-soft)' : 'transparent',
                  color: isActive ? 'var(--lavender-deep)' : 'var(--text-main)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      background: item.badgeColor || '#E84C7A',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-soft)' }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'transparent',
                color: '#C62828',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
          {/* =========================================================
              PART 8: DASHBOARD / OVERVIEW
              ========================================================= */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
                  Welcome back, Dreambasket 🎀
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Here is the live performance across your boutique orders, products, and inventory.
                </p>
              </div>

              {/* 8 Statistic KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>🛍️ Total Products</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.4rem' }}>{totalProductsCount}</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>📦 Total Orders</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.4rem' }}>{totalOrdersCount}</div>
                </div>

                <div style={{ background: '#FFF0F5', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--pink-blush)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#E84C7A', textTransform: 'uppercase', fontWeight: 700 }}>⏳ Pending Orders</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#E84C7A', marginTop: '0.4rem' }}>{pendingOrdersCount}</div>
                </div>

                <div style={{ background: '#F0F9FF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #BAE6FD', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#0284C7', textTransform: 'uppercase', fontWeight: 700 }}>🚚 Orders to Ship</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0284C7', marginTop: '0.4rem' }}>{toShipOrdersCount}</div>
                </div>

                <div style={{ background: '#F0FDF4', padding: '1.25rem', borderRadius: '16px', border: '1px solid #BBF7D0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#16A34A', textTransform: 'uppercase', fontWeight: 700 }}>✅ Completed Orders</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#16A34A', marginTop: '0.4rem' }}>{completedOrdersCount}</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid var(--border-lavender)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--lavender-deep)', textTransform: 'uppercase', fontWeight: 700 }}>💰 Total Sales</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--lavender-deep)', marginTop: '0.4rem' }}>₹{totalSalesAmount}</div>
                </div>

                <div style={{ background: lowStockCount > 0 ? '#FFFBEB' : '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: lowStockCount > 0 ? '1px solid #FCD34D' : '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#D97706', textTransform: 'uppercase', fontWeight: 700 }}>⚠️ Low Stock (&lt;5)</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#D97706', marginTop: '0.4rem' }}>{lowStockCount}</div>
                </div>

                <div style={{ background: outOfStockCount > 0 ? '#FEF2F2' : '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: outOfStockCount > 0 ? '1px solid #FCA5A5' : '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#DC2626', textTransform: 'uppercase', fontWeight: 700 }}>❌ Out-of-Stock</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#DC2626', marginTop: '0.4rem' }}>{outOfStockCount}</div>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--border-soft)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>Recent Customer Orders</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Latest orders placed across Instagram and live boutique.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                    View All Orders →
                  </Button>
                </div>

                {orders.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No orders recorded yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-soft)', textAlign: 'left', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.75rem' }}>Order ID</th>
                          <th style={{ padding: '0.75rem' }}>Customer Name</th>
                          <th style={{ padding: '0.75rem' }}>Date / Time</th>
                          <th style={{ padding: '0.75rem' }}>Total Amount</th>
                          <th style={{ padding: '0.75rem' }}>Payment Status</th>
                          <th style={{ padding: '0.75rem' }}>Order Status</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.orderNumber} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 700 }}>{o.orderNumber}</td>
                            <td style={{ padding: '0.75rem' }}>{o.customer?.fullName || 'Customer'}</td>
                            <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td style={{ padding: '0.75rem', fontWeight: 700 }}>₹{o.pricing?.total}</td>
                            <td style={{ padding: '0.75rem' }}>
                              <span
                                style={{
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: o.paymentStatus === 'PAYMENT_VERIFIED' ? '#E8F5E9' : '#FFF9E6',
                                  color: o.paymentStatus === 'PAYMENT_VERIFIED' ? '#2E7D32' : '#B78103',
                                }}
                              >
                                {o.paymentStatus}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                              <span
                                style={{
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: o.orderStatus === 'Delivered' ? '#E8F5E9' : '#FFF0F5',
                                  color: o.orderStatus === 'Delivered' ? '#2E7D32' : '#E84C7A',
                                }}
                              >
                                {o.orderStatus}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                              <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(o)}>
                                View Order
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              PART 9: ORDERS MANAGEMENT
              ========================================================= */}
          {activeTab === 'orders' && (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-soft)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Customer Orders ({orders.length})</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Manage customer orders, view full delivery addresses and packaging, and update order/payment status.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Status filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    style={{ padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-soft)', background: '#FFFFFF', fontSize: '0.85rem' }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>

                  {/* Search */}
                  <div style={{ position: 'relative', width: '260px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                      type="text"
                      placeholder="Search DB ID, name, phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-soft)',
                        background: '#FFFFFF',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No orders match your filter criteria.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-soft)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem' }}>Order ID</th>
                        <th style={{ padding: '0.75rem' }}>Date / Time</th>
                        <th style={{ padding: '0.75rem' }}>Customer Name</th>
                        <th style={{ padding: '0.75rem' }}>Phone Number</th>
                        <th style={{ padding: '0.75rem' }}>Total Amount</th>
                        <th style={{ padding: '0.75rem' }}>Payment Status</th>
                        <th style={{ padding: '0.75rem' }}>Order Status</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o.orderNumber} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{o.orderNumber}</td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{o.customer?.fullName || 'Customer'}</td>
                          <td style={{ padding: '0.75rem' }}>{o.customer?.phoneNumber || '-'}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>₹{o.pricing?.total}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <select
                              value={o.paymentStatus}
                              onChange={(e) => handleUpdatePaymentStatus(o.orderNumber, e.target.value)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-soft)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                background: o.paymentStatus === 'PAYMENT_VERIFIED' ? '#E8F5E9' : '#FFF9E6',
                                color: o.paymentStatus === 'PAYMENT_VERIFIED' ? '#2E7D32' : '#B78103',
                              }}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="PAYMENT_SENT">PAYMENT_SENT</option>
                              <option value="PAYMENT_VERIFIED">PAYMENT_VERIFIED</option>
                              <option value="REFUNDED">REFUNDED</option>
                            </select>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o.orderNumber, e.target.value)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-soft)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                background: o.orderStatus === 'Delivered' ? '#E8F5E9' : '#FFF0F5',
                                color: o.orderStatus === 'Delivered' ? '#2E7D32' : '#E84C7A',
                              }}
                            >
                              <option value="New">New</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Returned">Returned</option>
                            </select>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(o)}>
                              View Order
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              PART 10, 11, 12, 16: PRODUCTS MANAGEMENT
              ========================================================= */}
          {activeTab === 'products' && (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-soft)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Product Catalogue ({products.length})</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Add, edit, archive, or manage product images, stock, and pricing.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Category filter */}
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    style={{ padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-soft)', background: '#FFFFFF', fontSize: '0.85rem' }}
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  {/* Search */}
                  <div style={{ position: 'relative', width: '220px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', borderRadius: '10px', border: '1px solid var(--border-soft)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <Button variant="primary" size="sm" onClick={() => handleOpenProductModal()} icon={<Plus size={16} />}>
                    Add Product
                  </Button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-soft)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Product</th>
                      <th style={{ padding: '0.75rem' }}>Product ID</th>
                      <th style={{ padding: '0.75rem' }}>Category</th>
                      <th style={{ padding: '0.75rem' }}>Price</th>
                      <th style={{ padding: '0.75rem' }}>MRP</th>
                      <th style={{ padding: '0.75rem' }}>Stock</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => {
                      const isManuallyOutOfStock = p.inStock === false || p.stockStatus === 'out_of_stock';
                      const isOutOfStock = isManuallyOutOfStock || p.stockQuantity <= 0;
                      const isLowStock = !isManuallyOutOfStock && p.stockQuantity > 0 && p.stockQuantity < (p.lowStockThreshold || 5);
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-soft)', opacity: p.archived ? 0.6 : 1 }}>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={p.image || (p.images && p.images[0])}
                                alt={p.name}
                                style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 600 }}>{p.name}</div>
                                {p.badge && (
                                  <span style={{ fontSize: '0.7rem', color: 'var(--lavender-deep)', background: 'var(--lavender-soft)', padding: '1px 6px', borderRadius: '4px' }}>
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-light)', fontSize: '0.82rem' }}>{p.sku || p.id}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ background: 'var(--bg-main)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                              {p.categoryName || p.category}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                            <div>₹{p.price}</div>
                            {((p.costPrice !== undefined && p.costPrice > 0) || (p.packingCost !== undefined && p.packingCost > 0)) && (
                              <div
                                style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}
                                title={`Cost: ₹${(p.costPrice || 0) + (p.packingCost || 0)} (Prod: ₹${p.costPrice || 0} + Pack: ₹${p.packingCost || 0})`}
                              >
                                🔒 Profit: ₹{p.profit !== undefined ? p.profit : (p.price - ((p.costPrice || 0) + (p.packingCost || 0)))}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                            {p.originalPrice ? `₹${p.originalPrice}` : '-'}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleProductStock(p)}
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: isOutOfStock ? '#FEE2E2' : isLowStock ? '#FEF3C7' : '#DCFCE7',
                                  color: isOutOfStock ? '#B91C1C' : isLowStock ? '#B45309' : '#15803D',
                                }}
                                title="Click to toggle In Stock / Out of Stock"
                              >
                                {isOutOfStock ? '❌ Out of Stock' : '✅ In Stock'}
                              </button>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {p.stockQuantity} in qty
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: p.archived ? '#F3F4F6' : p.active ? '#ECFDF5' : '#FEE2E2',
                                color: p.archived ? '#6B7280' : p.active ? '#059669' : '#DC2626',
                              }}
                            >
                              {p.archived ? 'Archived' : p.active ? 'Active' : 'Hidden'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenProductModal(p)}
                                className="btn-icon"
                                title="Edit Product"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleArchiveProduct(p.id, p.archived)}
                                className="btn-icon"
                                title={p.archived ? 'Reactivate in Store' : 'Archive / Hide Product'}
                              >
                                <Archive size={16} color={p.archived ? '#15803D' : '#D97706'} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="btn-icon"
                                title="Delete Product"
                                style={{ color: '#DC2626' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              PART 13: CATEGORY MANAGEMENT
              ========================================================= */}
          {activeTab === 'categories' && (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-soft)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Boutique Categories ({categories.length})</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Manage store categories, descriptions, highlights, and subcategories.
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={() => handleOpenCategoryModal()} icon={<Plus size={16} />}>
                  Add Category
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {categories.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      border: '1px solid var(--border-soft)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      background: 'var(--bg-main)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={c.image} alt={c.name} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--lavender-deep)' }}>slug: {c.slug}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button type="button" onClick={() => handleOpenCategoryModal(c)} className="btn-icon">
                          <Edit2 size={15} />
                        </button>
                        <button type="button" onClick={() => handleDeleteCategory(c.id)} className="btn-icon" style={{ color: '#DC2626' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {c.description || 'No description provided.'}
                    </div>

                    {c.subcategories && c.subcategories.length > 0 && (
                      <div style={{ fontSize: '0.75rem', background: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                        <strong>Subcategories:</strong> {c.subcategories.map((s) => s.name).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              PART 14: PACKAGING MANAGEMENT
              ========================================================= */}
          {activeTab === 'packaging' && (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-soft)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Jewellery Packaging Management</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Manage packaging options (Normal, Floating Box, Jewellery Box). Updated prices immediately reflect across all eligible jewellery.
                  </p>
                </div>
                <Button variant="primary" size="sm" onClick={() => handleOpenPackagingModal()} icon={<Plus size={16} />}>
                  Add Packaging Option
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {packagingOptions.map((pkg) => (
                  <div
                    key={pkg.id}
                    style={{
                      border: '1px solid var(--border-soft)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      background: 'var(--bg-main)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', background: '#FFFFFF' }}>
                      <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{pkg.name}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--lavender-deep)', fontWeight: 700 }}>
                          {pkg.price > 0 ? `+₹${pkg.price}` : '₹0 (Included)'}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: pkg.active !== false ? '#DCFCE7' : '#F3F4F6',
                          color: pkg.active !== false ? '#15803D' : '#6B7280',
                        }}
                      >
                        {pkg.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                      {pkg.description || 'Reusable packaging selection for eligible jewellery.'}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                      <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => handleOpenPackagingModal(pkg)}>
                        Edit Option
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDeletePackaging(pkg.id)}
                        className="btn-icon"
                        style={{ color: '#DC2626' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              PART 15: HANDMADE CARDS CUSTOMIZATION MANAGEMENT
              ========================================================= */}
          {activeTab === 'cards' && (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-soft)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Handmade Cards Options</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Manage selectable card colors and themes available to customers on Handmade Cards product pages.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {/* Colors Manager */}
                <div style={{ border: '1px solid var(--border-soft)', borderRadius: '16px', padding: '1.25rem', background: 'var(--bg-main)' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Color Options</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    {cardColors.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          background: '#FFFFFF',
                          padding: '0.6rem 0.85rem',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1px solid var(--border-soft)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: c.hex, border: `1px solid ${c.border || '#ccc'}` }} />
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>({c.hex})</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveCardColor(c.id)} className="btn-icon" style={{ color: '#DC2626' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Color Form */}
                  <form onSubmit={handleAddCardColor} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Color Name"
                      required
                      value={newColorForm.name}
                      onChange={(e) => setNewColorForm({ ...newColorForm, name: e.target.value })}
                      style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-soft)', fontSize: '0.85rem' }}
                    />
                    <input
                      type="color"
                      value={newColorForm.hex}
                      onChange={(e) => setNewColorForm({ ...newColorForm, hex: e.target.value, border: e.target.value })}
                      style={{ width: '42px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                    />
                    <Button type="submit" variant="primary" size="sm">
                      Add Color
                    </Button>
                  </form>
                </div>

                {/* Themes Manager */}
                <div style={{ border: '1px solid var(--border-soft)', borderRadius: '16px', padding: '1.25rem', background: 'var(--bg-main)' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Occasion Themes</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    {cardThemes.map((t) => (
                      <div
                        key={t}
                        style={{
                          background: '#FFFFFF',
                          padding: '0.6rem 0.85rem',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1px solid var(--border-soft)',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t}</span>
                        <button type="button" onClick={() => handleRemoveCardTheme(t)} className="btn-icon" style={{ color: '#DC2626' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Theme Form */}
                  <form onSubmit={handleAddCardTheme} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="e.g. Thinking of You"
                      required
                      value={newThemeText}
                      onChange={(e) => setNewThemeText(e.target.value)}
                      style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-soft)', fontSize: '0.85rem' }}
                    />
                    <Button type="submit" variant="primary" size="sm">
                      Add Theme
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              PART 17: INVENTORY MANAGEMENT (Quick Stock Inline Updater)
              ========================================================= */}
          {activeTab === 'inventory' && (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-soft)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Live Stock & Inventory Matrix</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Quickly adjust live stock quantities. When stock reaches 0, the store automatically prevents checkout.
                  </p>
                </div>

                <div style={{ position: 'relative', width: '240px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    placeholder="Search SKU or name..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', borderRadius: '10px', border: '1px solid var(--border-soft)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-soft)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Product</th>
                      <th style={{ padding: '0.75rem' }}>SKU</th>
                      <th style={{ padding: '0.75rem' }}>Price</th>
                      <th style={{ padding: '0.75rem' }}>Stock Status</th>
                      <th style={{ padding: '0.75rem' }}>Current Stock</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Quick Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((prod) => {
                      const currentVal = inlineStockMap[prod.id] !== undefined ? inlineStockMap[prod.id] : prod.stockQuantity;
                      const isManuallyOutOfStock = prod.inStock === false || prod.stockStatus === 'out_of_stock';
                      const isOutOfStock = isManuallyOutOfStock || currentVal <= 0;
                      const isLowStock = !isManuallyOutOfStock && currentVal > 0 && currentVal < (prod.lowStockThreshold || 5);
                      const isSaved = stockSavedMsg[prod.id];

                      return (
                        <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                              <div style={{ fontWeight: 600 }}>{prod.name}</div>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-light)', fontSize: '0.82rem' }}>{prod.sku || prod.id}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>₹{prod.price}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleProductStock(prod)}
                              style={{
                                padding: '3px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                background: isOutOfStock ? '#FEE2E2' : isLowStock ? '#FEF3C7' : '#DCFCE7',
                                color: isOutOfStock ? '#B91C1C' : isLowStock ? '#B45309' : '#15803D',
                              }}
                              title="Click to toggle In Stock / Out of Stock"
                            >
                              {isOutOfStock ? '❌ Out of Stock' : '✅ In Stock'}
                            </button>
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, fontSize: '1rem' }}>
                            {prod.stockQuantity} units
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                              <button
                                type="button"
                                onClick={() => setInlineStockMap((prev) => ({ ...prev, [prod.id]: Math.max(0, (prev[prod.id] || 0) - 1) }))}
                                style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border-soft)', background: '#FFFFFF', cursor: 'pointer', fontWeight: 700 }}
                              >
                                −
                              </button>
                              <input
                                type="number"
                                value={inlineStockMap[prod.id] !== undefined ? inlineStockMap[prod.id] : prod.stockQuantity}
                                onChange={(e) => setInlineStockMap({ ...inlineStockMap, [prod.id]: Math.max(0, parseInt(e.target.value) || 0) })}
                                style={{ width: '56px', textAlign: 'center', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border-soft)', fontSize: '0.85rem' }}
                              />
                              <button
                                type="button"
                                onClick={() => setInlineStockMap((prev) => ({ ...prev, [prod.id]: (prev[prod.id] || 0) + 1 }))}
                                style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border-soft)', background: '#FFFFFF', cursor: 'pointer', fontWeight: 700 }}
                              >
                                +
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveInlineStock(prod.id)}
                                className="btn btn-primary btn-sm"
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                              >
                                {isSaved ? '✓ Saved' : 'Save'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================
              PART 18: SALES ANALYTICS
              ========================================================= */}
          {activeTab === 'sales' && salesAnalytics && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="font-serif" style={{ fontSize: '1.8rem' }}>Sales & Revenue Analytics</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Comprehensive breakdown of customer purchases and average order values.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1.5px solid var(--border-lavender)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--lavender-deep)', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--lavender-deep)', marginTop: '0.5rem' }}>₹{salesAnalytics.totalSales}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>From {salesAnalytics.totalOrders} paid orders</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Today's Sales</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>₹{salesAnalytics.todaySales}</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Weekly Sales</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>₹{salesAnalytics.weeklySales}</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Sales</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>₹{salesAnalytics.monthlySales}</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Average Order Value (AOV)</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>₹{salesAnalytics.averageOrderValue}</div>
                </div>
              </div>

              {/* Sales Orders Log */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-soft)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <h4 className="font-serif" style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Order Value Ledger</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-soft)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem' }}>Order ID</th>
                        <th style={{ padding: '0.75rem' }}>Date</th>
                        <th style={{ padding: '0.75rem' }}>Customer</th>
                        <th style={{ padding: '0.75rem' }}>Subtotal</th>
                        <th style={{ padding: '0.75rem' }}>Delivery</th>
                        <th style={{ padding: '0.75rem' }}>Total Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.orderNumber} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{o.orderNumber}</td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '0.75rem' }}>{o.customer?.fullName || 'Customer'}</td>
                          <td style={{ padding: '0.75rem' }}>₹{o.pricing?.subtotal}</td>
                          <td style={{ padding: '0.75rem' }}>₹{o.pricing?.delivery || 0}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--lavender-deep)' }}>₹{o.pricing?.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              PART 19: CUSTOMERS SECTION
              ========================================================= */}
          {activeTab === 'customers' && (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-soft)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Customer Directory ({customers.length})</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Aggregated customer profiles with delivery address and order history.
                  </p>
                </div>

                <div style={{ position: 'relative', width: '260px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    placeholder="Search name, phone, city..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', borderRadius: '10px', border: '1px solid var(--border-soft)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {filteredCustomers.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No customer profiles found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-soft)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem' }}>Customer Name</th>
                        <th style={{ padding: '0.75rem' }}>Phone Number</th>
                        <th style={{ padding: '0.75rem' }}>Delivery Address</th>
                        <th style={{ padding: '0.75rem' }}>Total Orders</th>
                        <th style={{ padding: '0.75rem' }}>Total Spent</th>
                        <th style={{ padding: '0.75rem' }}>Last Order Date</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((cust) => (
                        <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>{cust.fullName}</td>
                          <td style={{ padding: '0.75rem' }}>{cust.phoneNumber}</td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cust.address}
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{cust.ordersCount} orders</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--lavender-deep)' }}>₹{cust.totalSpent}</td>
                          <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(cust.lastOrderDate).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            <Button variant="secondary" size="sm" onClick={() => setSelectedCustomer(cust)}>
                              View Orders
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              PART 20: STORE SETTINGS
              ========================================================= */}
          {activeTab === 'settings' && settingsForm && (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-soft)', padding: '2rem', boxShadow: 'var(--shadow-sm)', maxWidth: '800px' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Store Configuration</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Manage brand details, Instagram handle, and standard delivery timelines.
                </p>
              </div>

              {settingsSaveMsg && (
                <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 600 }}>
                  {settingsSaveMsg}
                </div>
              )}

              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Store Name</label>
                    <input
                      type="text"
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-soft)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Instagram Handle</label>
                    <input
                      type="text"
                      value={settingsForm.instagramHandle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-soft)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Brand Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-soft)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Delivery ETA Line</label>
                    <input
                      type="text"
                      value={settingsForm.deliveryEta}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryEta: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-soft)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>WhatsApp Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 919876543210"
                      value={settingsForm.whatsappNumber || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border-soft)' }}
                    />
                  </div>
                </div>

                <div>
                  <Button type="submit" variant="primary" style={{ marginTop: '0.5rem' }}>
                    Save Configuration
                  </Button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================
          ORDER DETAILS MODAL (Part 9)
          ========================================================= */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 999,
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>Order {selectedOrder.orderNumber}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--lavender-deep)', marginBottom: '0.5rem' }}>Customer Information</h4>
              <div><strong>Customer Name:</strong> {selectedOrder.customer?.fullName || 'N/A'}</div>
              <div><strong>Phone Number:</strong> {selectedOrder.customer?.phoneNumber || 'N/A'}</div>
              {(selectedOrder.customer?.instagramId || selectedOrder.customer?.instagramUsername) && (
                <div>
                  <strong>Instagram ID:</strong>{' '}
                  <span style={{ color: 'var(--lavender-deep)', fontWeight: 600 }}>
                    {selectedOrder.customer.instagramId || selectedOrder.customer.instagramUsername}
                  </span>
                </div>
              )}
              {selectedOrder.customer?.email && <div><strong>Email:</strong> {selectedOrder.customer.email}</div>}
              <div><strong>Delivery Address:</strong> {selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}</div>
              {selectedOrder.customer?.notes && (
                <div style={{ marginTop: '0.5rem', background: '#FFF0F5', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                  <strong>Customer Note:</strong> "{selectedOrder.customer.notes}"
                </div>
              )}
            </div>

            {/* Ordered Items */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--lavender-deep)', marginBottom: '0.75rem' }}>Order Items</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.image && (
                        <img src={item.image} alt={item.productName} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.productName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          ID: {item.sku || item.productId} • Qty: {item.quantity} • ₹{item.price} each
                        </div>
                        {item.packaging && (
                          <div style={{ fontSize: '0.76rem', color: 'var(--lavender-deep)', fontWeight: 600 }}>
                            🎁 Packaging: {item.packaging.name} (+₹{item.packagingPrice || 0})
                          </div>
                        )}
                        {(item.color || item.theme) && (
                          <div style={{ fontSize: '0.76rem', color: '#E84C7A', fontWeight: 600 }}>
                            💌 Customization: {item.color ? `Color: ${item.color}` : ''} {item.theme ? `• Theme: ${item.theme}` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>₹{item.lineTotal}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>Subtotal</span>
                <strong>₹{selectedOrder.pricing?.subtotal}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>Delivery Charge</span>
                <strong>₹{selectedOrder.pricing?.delivery || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--lavender-deep)', marginTop: '0.5rem' }}>
                <span>Final Total</span>
                <span>₹{selectedOrder.pricing?.total}</span>
              </div>
            </div>

            {/* Status Change Dropdowns */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-soft)', paddingTop: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Order Status</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.orderNumber, e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                >
                  <option value="New">New</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>Payment Status</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handleUpdatePaymentStatus(selectedOrder.orderNumber, e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAYMENT_SENT">PAYMENT_SENT</option>
                  <option value="PAYMENT_VERIFIED">PAYMENT_VERIFIED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PRODUCT ADD / EDIT MODAL (Parts 10, 11, 12, 16)
          ========================================================= */}
      {isProductModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 999,
          }}
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Basic Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Product ID / SKU</label>
                  <input
                    type="text"
                    value={productFormData.sku}
                    onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Original / MRP Price (₹)</label>
                  <input
                    type="number"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Stock Status</label>
                  <select
                    value={productFormData.stockStatus || (productFormData.inStock !== false ? 'in_stock' : 'out_of_stock')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProductFormData({
                        ...productFormData,
                        stockStatus: val,
                        inStock: val === 'in_stock',
                        stockQuantity: val === 'in_stock' && Number(productFormData.stockQuantity) <= 0 ? 10 : productFormData.stockQuantity,
                      });
                    }}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)', background: '#FFFFFF', fontWeight: 600 }}
                  >
                    <option value="in_stock">🟢 In Stock</option>
                    <option value="out_of_stock">🔴 Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Stock Quantity</label>
                  <input
                    type="number"
                    value={productFormData.stockQuantity}
                    onChange={(e) => setProductFormData({ ...productFormData, stockQuantity: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Low Stock Alert</label>
                  <input
                    type="number"
                    value={productFormData.lowStockThreshold}
                    onChange={(e) => setProductFormData({ ...productFormData, lowStockThreshold: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                  />
                </div>
              </div>

              {/* 🔒 PRIVATE BUSINESS COSTS SECTION */}
              {(() => {
                const sellingPriceVal = Number(productFormData.price) || 0;
                const costPriceVal = productFormData.costPrice !== '' && productFormData.costPrice !== undefined ? Number(productFormData.costPrice) : 0;
                const packingCostVal = productFormData.packingCost !== '' && productFormData.packingCost !== undefined ? Number(productFormData.packingCost) : 0;
                const totalInternalCostVal = costPriceVal + packingCostVal;
                const liveProfit = sellingPriceVal - totalInternalCostVal;
                const isProfitPositive = liveProfit >= 0;
                const profitMargin = sellingPriceVal > 0 ? Math.round((liveProfit / sellingPriceVal) * 100) : 0;

                return (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #FFFDF7 0%, #FFF9FB 100%)',
                      border: '1.5px solid #FDE68A',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)',
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px dashed #FDE68A', paddingBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🔒</span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#78350F' }}>
                            Private Business Costs
                          </h4>
                          <span style={{ fontSize: '0.74rem', color: '#92400E' }}>
                            Internal manufacturing & packing expenses (NOT customer packaging)
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.72rem',
                          background: '#FEF3C7',
                          color: '#92400E',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700,
                          border: '1px solid #FCD34D',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        🔒 Admin Only • Never Visible to Customers
                      </span>
                    </div>

                    {/* Cost Inputs & Calculated Profit Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', alignItems: 'flex-start' }}>
                      {/* 1. Product Cost Price 🔒 */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#78350F', marginBottom: '0.2rem' }}>
                          Product Cost Price 🔒 (₹)
                        </label>
                        <span style={{ display: 'block', fontSize: '0.72rem', color: '#92400E', marginBottom: '0.4rem' }}>
                          Actual price paid to buy / make product
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="e.g. 50"
                          value={productFormData.costPrice}
                          onChange={(e) => setProductFormData({ ...productFormData, costPrice: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '8px',
                            border: '1.5px solid #FCD34D',
                            background: '#FFFFFF',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: '#78350F',
                          }}
                        />
                      </div>

                      {/* 2. Packing Cost 🔒 */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#78350F', marginBottom: '0.2rem' }}>
                          Packing Cost 🔒 (₹)
                        </label>
                        <span style={{ display: 'block', fontSize: '0.72rem', color: '#92400E', marginBottom: '0.4rem' }}>
                          Box + logo sticker + card + packing materials
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="e.g. 35"
                          value={productFormData.packingCost}
                          onChange={(e) => setProductFormData({ ...productFormData, packingCost: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderRadius: '8px',
                            border: '1.5px solid #FCD34D',
                            background: '#FFFFFF',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: '#78350F',
                          }}
                        />
                      </div>

                      {/* 3. Total Internal Cost 🔒 (Auto Calculated) */}
                      <div
                        style={{
                          background: '#FFFFFF',
                          border: '1.5px solid #E5E7EB',
                          borderRadius: '12px',
                          padding: '0.85rem 1rem',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>
                          Total Internal Cost 🔒
                        </div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1F2937', margin: '0.25rem 0 0.15rem' }}>
                          ₹{totalInternalCostVal}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                          ₹{costPriceVal} (Cost) + ₹{packingCostVal} (Packing)
                        </div>
                      </div>

                      {/* 4. Profit 🔒 (Auto Calculated) */}
                      <div
                        style={{
                          background: isProfitPositive ? '#F0FDF4' : '#FEF2F2',
                          border: isProfitPositive ? '1.5px solid #86EFAC' : '1.5px solid #FCA5A5',
                          borderRadius: '12px',
                          padding: '0.85rem 1rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isProfitPositive ? '#166534' : '#991B1B', textTransform: 'uppercase' }}>
                            Profit 🔒
                          </span>
                          {sellingPriceVal > 0 && (
                            <span style={{ fontSize: '0.68rem', background: isProfitPositive ? '#DCFCE7' : '#FEE2E2', color: isProfitPositive ? '#166534' : '#991B1B', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              {profitMargin}% margin
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: isProfitPositive ? '#16A34A' : '#DC2626', margin: '0.25rem 0 0.15rem' }}>
                          ₹{liveProfit}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: isProfitPositive ? '#15803D' : '#B91C1C' }}>
                          Selling ₹{sellingPriceVal} − Cost ₹{totalInternalCostVal}
                        </div>
                      </div>
                    </div>

                    {/* Automatic calculation formula note */}
                    <div style={{ marginTop: '0.75rem', fontSize: '0.74rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>💡</span>
                      <span>
                        <strong>Automatic Formula:</strong> Total Internal Cost = Product Cost Price + Packing Cost. Profit = Selling Price − Total Internal Cost. Updates live automatically.
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Category & Subcategory Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Category *</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const catObj = categories.find((c) => c.id === newCat);
                      const defaultSub = newCat === 'anti-tarnish' ? 'chains' : newCat === 'budget-friendly' ? 'chains' : '';
                      setProductFormData({
                        ...productFormData,
                        category: newCat,
                        categoryName: catObj ? catObj.name : newCat,
                        subCategory: defaultSub,
                        antiTarnish: newCat === 'anti-tarnish',
                      });
                    }}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)', background: '#FFFFFF' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {(productFormData.category === 'anti-tarnish' || productFormData.category === 'budget-friendly') && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Subcategory *</label>
                    <select
                      value={productFormData.subCategory}
                      onChange={(e) => setProductFormData({ ...productFormData, subCategory: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)', background: '#FFFFFF' }}
                    >
                      {productFormData.category === 'anti-tarnish' ? (
                        <>
                          <option value="chains">Chains</option>
                          <option value="bracelets">Bracelets</option>
                          <option value="earrings">Earrings</option>
                          <option value="rings">Rings</option>
                        </>
                      ) : (
                        <>
                          <option value="chains">Chains</option>
                          <option value="bracelets">Bracelets</option>
                          <option value="rings">Rings</option>
                          <option value="korean-earrings">Korean Earrings</option>
                        </>
                      )}
                    </select>
                  </div>
                )}
              </div>

              {/* Multi-Image Manager (Part 16) */}
              <div style={{ border: '1.5px dashed var(--border-lavender)', borderRadius: '14px', padding: '1.25rem', background: '#FAF7FA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Product Images ({productFormData.images.length})
                    </label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      First image is the primary store display. Reorder, replace, or remove anytime.
                    </span>
                  </div>

                  {/* Device Upload Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.45rem 0.85rem',
                        background: '#FFFFFF',
                        border: '1px solid var(--border-lavender)',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--lavender-deep)',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <Upload size={14} />
                      <span>Upload Main</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleUploadMainImage}
                      />
                    </label>

                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.45rem 0.85rem',
                        background: 'var(--lavender-deep)',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <Plus size={14} />
                      <span>+ Upload Images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleUploadAdditionalImages}
                      />
                    </label>
                  </div>
                </div>

                {/* Thumbnails list with reorder, replace, star, and delete */}
                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '0.5rem 0 1rem' }}>
                  {productFormData.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        width: '90px',
                        height: '90px',
                        flexShrink: 0,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: idx === 0 ? '2.5px solid var(--lavender-deep)' : '1px solid var(--border-soft)',
                        background: '#FFFFFF',
                        boxShadow: 'var(--shadow-xs)',
                      }}
                    >
                      <img src={imgUrl} alt={`preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {idx === 0 && (
                        <span style={{ position: 'absolute', bottom: 3, left: 3, background: 'var(--lavender-deep)', color: '#FFF', fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px', borderRadius: '4px' }}>
                          Primary
                        </span>
                      )}

                      {/* Top Action Overlay (Star & Delete) */}
                      <div style={{ position: 'absolute', top: 3, right: 3, display: 'flex', gap: '2px' }}>
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            title="Set as Primary Image"
                            style={{ background: '#FFF', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', padding: '2px', fontSize: '0.65rem' }}
                          >
                            ★
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="Delete image"
                          style={{ background: '#FFEBEE', color: '#C62828', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px' }}
                        >
                          <X size={12} />
                        </button>
                      </div>

                      {/* Bottom Reorder & Replace Overlay */}
                      <div style={{ position: 'absolute', bottom: 3, right: 3, display: 'flex', gap: '2px' }}>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, idx - 1)}
                            title="Move left"
                            style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer', padding: '1px 3px', fontSize: '0.65rem', lineHeight: 1 }}
                          >
                            ◀
                          </button>
                        )}
                        {idx < productFormData.images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, idx + 1)}
                            title="Move right"
                            style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer', padding: '1px 3px', fontSize: '0.65rem', lineHeight: 1 }}
                          >
                            ▶
                          </button>
                        )}
                        <label
                          title="Replace this image from device"
                          style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer', padding: '1px 3px', fontSize: '0.65rem', lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}
                        >
                          ↻
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            style={{ display: 'none' }}
                            onChange={(e) => handleReplaceImage(idx, e)}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    placeholder="Enter image URL (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-soft)', fontSize: '0.85rem' }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddImageToProduct}>
                    + Add Image
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  placeholder="Optional handcrafted description..."
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                />
              </div>

              {/* Optional Custom Specifications (Blank unless entered) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Material (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Stainless Steel"
                    value={productFormData.material}
                    onChange={(e) => setProductFormData({ ...productFormData, material: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-soft)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Colour / Finish (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Gold Plated"
                    value={productFormData.colour}
                    onChange={(e) => setProductFormData({ ...productFormData, colour: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-soft)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Dimensions / Size (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 40cm chain"
                    value={productFormData.size}
                    onChange={(e) => setProductFormData({ ...productFormData, size: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-soft)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Availability Status */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-soft)', paddingTop: '1rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.active}
                    onChange={(e) => setProductFormData({ ...productFormData, active: e.target.checked })}
                  />
                  <span>Active in Store</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isBestseller}
                    onChange={(e) => setProductFormData({ ...productFormData, isBestseller: e.target.checked })}
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isNewArrival}
                    onChange={(e) => setProductFormData({ ...productFormData, isNewArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          CATEGORY MODAL (Part 13)
          ========================================================= */}
      {isCategoryModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 999,
          }}
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 💍 Rings"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Slug / Route</label>
                <input
                  type="text"
                  placeholder="/rings"
                  value={categoryFormData.slug}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Cover Image URL</label>
                <input
                  type="url"
                  value={categoryFormData.image}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Subcategories (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Chains, Bracelets, Rings"
                  value={categoryFormData.subcategoriesStr}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, subcategoriesStr: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  rows={2}
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          PACKAGING MODAL (Part 14)
          ========================================================= */}
      {isPackagingModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 999,
          }}
          onClick={() => setIsPackagingModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>
                {editingPackaging ? 'Edit Packaging' : 'Add Packaging Option'}
              </h3>
              <button type="button" onClick={() => setIsPackagingModalOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePackaging} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Packaging Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Floating Box"
                  value={packagingFormData.name}
                  onChange={(e) => setPackagingFormData({ ...packagingFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Additional Price (₹)</label>
                <input
                  type="number"
                  required
                  value={packagingFormData.price}
                  onChange={(e) => setPackagingFormData({ ...packagingFormData, price: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                />
              </div>

              {/* Packaging Images Section */}
              <div style={{ border: '1px solid var(--border-soft)', borderRadius: '12px', padding: '1rem', background: '#FAF7FA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                    Packaging Images ({packagingFormData.images?.length || (packagingFormData.image ? 1 : 0)})
                  </label>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      background: 'var(--lavender-deep)',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Plus size={13} />
                    <span>Upload Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      style={{ display: 'none' }}
                      onChange={handlePackagingImagesUpload}
                    />
                  </label>
                </div>

                {/* Thumbnails */}
                {packagingFormData.images && packagingFormData.images.length > 0 ? (
                  <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    {packagingFormData.images.map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          width: '70px',
                          height: '70px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: idx === 0 ? '2px solid var(--lavender-deep)' : '1px solid var(--border-soft)',
                          flexShrink: 0,
                          background: '#fff',
                        }}
                      >
                        <img src={img} alt={`packaging ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {idx === 0 && (
                          <span style={{ position: 'absolute', bottom: 2, left: 2, background: 'var(--lavender-deep)', color: '#fff', fontSize: '0.55rem', padding: '1px 3px', borderRadius: '2px' }}>
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePackagingImage(idx)}
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            background: '#FFEBEE',
                            color: '#C62828',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            padding: '1px',
                          }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Or Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={packagingFormData.image}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPackagingFormData({
                        ...packagingFormData,
                        image: val,
                        images: val ? [val] : [],
                      });
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-soft)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  rows={2}
                  value={packagingFormData.description}
                  onChange={(e) => setPackagingFormData({ ...packagingFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-soft)' }}
                />
              </div>

              <div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={packagingFormData.active}
                    onChange={(e) => setPackagingFormData({ ...packagingFormData, active: e.target.checked })}
                  />
                  <span>Active & Selectable in Boutique</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" variant="outline" onClick={() => setIsPackagingModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Packaging
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          CUSTOMER ORDERS INSPECTOR MODAL (Part 19)
          ========================================================= */}
      {selectedCustomer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 999,
          }}
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.6rem' }}>{selectedCustomer.fullName}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedCustomer.phoneNumber} • {selectedCustomer.ordersCount} total orders
                </span>
              </div>
              <button type="button" onClick={() => setSelectedCustomer(null)} className="btn-icon">
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                <strong>Delivery Address:</strong> {selectedCustomer.address}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Lifetime Spend:</strong> <span style={{ color: 'var(--lavender-deep)', fontWeight: 700 }}>₹{selectedCustomer.totalSpent}</span>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', color: 'var(--lavender-deep)', marginBottom: '0.75rem' }}>Order History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedCustomer.orders?.map((o) => (
                <div
                  key={o.orderNumber}
                  style={{
                    border: '1px solid var(--border-soft)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{o.orderNumber}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(o.createdAt).toLocaleDateString()} • {o.items?.length || 0} items
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--lavender-deep)' }}>₹{o.pricing?.total}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: o.orderStatus === 'Delivered' ? '#2E7D32' : '#E84C7A' }}>
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
