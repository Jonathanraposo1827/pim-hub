import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { sampleProducts, CATEGORIES, ATTRIBUTE_DEFINITIONS } from '../data/sampleProducts';

const ProductContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([...sampleProducts]);
  const [loading, setLoading] = useState(true);
  const [useDB, setUseDB] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'

  // ─── Check backend health ────────────────────────────────
  const checkBackend = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/health`, { timeout: 3000 });
      setBackendStatus('online');
      return res.data;
    } catch {
      setBackendStatus('offline');
      return null;
    }
  }, []);

  // ─── Load Products (DB first, fallback to mock) ──────────
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products`, { timeout: 5000 });
      if (Array.isArray(res.data)) {
        setBackendStatus('online');
        setUseDB(true);
        if (res.data.length > 0) {
          setProducts(res.data);
          console.log(`✅ Loaded ${res.data.length} products from database`);
        } else {
          // DB is connected but empty — keep mock data in UI, but mark DB as active
          setProducts([...sampleProducts]);
          console.log('⚠️ DB connected but empty — showing mock data. Click "Seed DB" in Settings.');
        }
      }
    } catch (err) {
      // Check if backend is up but DB endpoint failed
      const health = await checkBackend();
      if (health) {
        setBackendStatus('online');
        // Backend is up but /products failed (DB issue)
        console.log('⚠️ Backend online but DB query failed — using mock data');
      } else {
        setBackendStatus('offline');
        console.log('ℹ️ Backend not available — using mock data');
      }
      setProducts([...sampleProducts]);
      setUseDB(false);
    }
    setLoading(false);
  }, [checkBackend]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ─── CRUD Operations ────────────────────────────────────

  const addProduct = async (productData) => {
    if (useDB) {
      try {
        const res = await axios.post(`${API_URL}/products`, productData);
        setProducts(prev => [res.data, ...prev]);
        return res.data;
      } catch (err) {
        console.error('DB add failed, adding locally:', err);
      }
    }
    const newProduct = {
      ...productData,
      id: `pim-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wooSynced: false,
      wooId: null,
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    if (useDB) {
      try {
        const res = await axios.put(`${API_URL}/products/${id}`, updates);
        setProducts(prev => prev.map(p => p.id === id ? res.data : p));
        return res.data;
      } catch (err) {
        console.error('DB update failed, updating locally:', err);
      }
    }
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
  };

  const deleteProduct = async (id) => {
    if (useDB) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
      } catch (err) {
        console.error('DB delete failed, removing locally:', err);
      }
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const markSynced = async (ids) => {
    for (const id of ids) {
      if (useDB) {
        try {
          await axios.put(`${API_URL}/products/${id}`, { wooSynced: true });
        } catch (err) {
          console.error('DB sync update failed:', err);
        }
      }
    }
    setProducts(prev => prev.map(p =>
      ids.includes(p.id) ? { ...p, wooSynced: true } : p
    ));
  };

  const importProducts = async (newProducts) => {
    if (useDB) {
      try {
        const res = await axios.post(`${API_URL}/products/bulk`, newProducts);
        if (res.data.products) {
          setProducts(prev => [...res.data.products, ...prev]);
          return;
        }
      } catch (err) {
        console.error('DB bulk import failed, importing locally:', err);
      }
    }
    const withIds = newProducts.map(p => ({
      ...p,
      id: p.id || `pim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      wooSynced: false,
      wooId: null,
    }));
    setProducts(prev => [...withIds, ...prev]);
  };

  // ─── Seed DB with sample data ───────────────────────────
  const seedDatabase = async () => {
    try {
      const res = await axios.post(`${API_URL}/products/seed`, {}, { timeout: 10000 });
      console.log('Seed result:', res.data);
      await loadProducts();
      return res.data;
    } catch (err) {
      console.error('Seed failed:', err);
      throw err;
    }
  };

  // ─── Computed Stats ──────────────────────────────────────

  const getStats = () => {
    const total = products.length;
    const published = products.filter(p => p.status === 'published').length;
    const draft = products.filter(p => p.status === 'draft').length;
    const synced = products.filter(p => p.wooSynced).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const missingDesc = products.filter(p => !p.description || p.description.trim() === '').length;

    const allAttributes = ['color', 'material', 'weight', 'brand', 'origin'];
    let totalAttrs = 0;
    let filledAttrs = 0;
    products.forEach(p => {
      const attrs = p.attributes || {};
      allAttributes.forEach(a => {
        totalAttrs++;
        if (attrs[a]) filledAttrs++;
      });
    });

    const inventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

    const categoryCount = {};
    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    return {
      total, published, draft, synced,
      unsynced: total - synced,
      outOfStock, missingDesc,
      attributeCompleteness: totalAttrs > 0 ? Math.round((filledAttrs / totalAttrs) * 100) : 0,
      inventoryValue, categoryCount,
    };
  };

  return (
    <ProductContext.Provider value={{
      products, loading, useDB, backendStatus,
      addProduct, updateProduct, deleteProduct,
      markSynced, importProducts, loadProducts, seedDatabase,
      getStats,
      categories: CATEGORIES,
      attributeDefinitions: ATTRIBUTE_DEFINITIONS,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
