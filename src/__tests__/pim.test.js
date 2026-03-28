import { sampleProducts, CATEGORIES, ATTRIBUTE_DEFINITIONS } from '../data/sampleProducts';
import { wooProducts } from '../data/wooMockData';

// ─── Functional Tests ──────────────────────────────────────

describe('PIM Product Data', () => {
  test('sample products dataset loads correctly', () => {
    expect(sampleProducts).toBeDefined();
    expect(sampleProducts.length).toBeGreaterThanOrEqual(10);
    sampleProducts.forEach(p => {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('sku');
      expect(p).toHaveProperty('category');
      expect(p).toHaveProperty('attributes');
    });
  });

  test('products have required PIM schema fields', () => {
    const required = ['id', 'name', 'sku', 'description', 'category', 'price', 'stock', 'status', 'attributes'];
    sampleProducts.forEach(p => {
      required.forEach(field => {
        expect(p).toHaveProperty(field);
      });
    });
  });

  test('categories list is populated', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
    expect(CATEGORIES).toContain('Electronics');
    expect(CATEGORIES).toContain('Clothing');
  });

  test('attribute definitions are valid', () => {
    expect(ATTRIBUTE_DEFINITIONS.length).toBeGreaterThan(0);
    ATTRIBUTE_DEFINITIONS.forEach(attr => {
      expect(attr).toHaveProperty('key');
      expect(attr).toHaveProperty('label');
      expect(attr).toHaveProperty('type');
    });
  });
});

// ─── WooCommerce Mock Tests ─────────────────────────────────

describe('WooCommerce Mock Data', () => {
  test('mock WooCommerce products exist', () => {
    expect(wooProducts).toBeDefined();
    expect(wooProducts.length).toBeGreaterThanOrEqual(5);
  });

  test('WooCommerce products have required fields', () => {
    wooProducts.forEach(wp => {
      expect(wp).toHaveProperty('wooId');
      expect(wp).toHaveProperty('name');
      expect(wp).toHaveProperty('sku');
      expect(wp).toHaveProperty('price');
      expect(wp).toHaveProperty('status');
    });
  });

  test('at least one WooCommerce-only product exists for pull demo', () => {
    const wooOnly = wooProducts.filter(wp => wp.wooId === 'woo-201');
    expect(wooOnly.length).toBe(1);
  });
});

// ─── AI / Data Quality Tests ────────────────────────────────

describe('AI Data Quality Detection', () => {
  test('identifies products with missing descriptions', () => {
    const missingDesc = sampleProducts.filter(p => !p.description || p.description.trim() === '');
    expect(missingDesc.length).toBeGreaterThan(0);
    missingDesc.forEach(p => {
      expect(p.description === '' || p.description === undefined).toBe(true);
    });
  });

  test('identifies products with incomplete attributes', () => {
    const requiredAttrs = ['color', 'material', 'weight', 'brand', 'origin'];
    const incomplete = sampleProducts.filter(p => {
      const attrs = p.attributes || {};
      return requiredAttrs.some(a => !attrs[a]);
    });
    expect(incomplete.length).toBeGreaterThan(0);
  });

  test('identifies out-of-stock products', () => {
    const outOfStock = sampleProducts.filter(p => p.stock === 0);
    expect(outOfStock.length).toBeGreaterThan(0);
  });

  test('identifies products with zero price', () => {
    const noPrice = sampleProducts.filter(p => !p.price || p.price === 0);
    expect(noPrice.length).toBeGreaterThan(0);
  });

  test('handles empty dataset gracefully', () => {
    const emptyProducts = [];
    expect(emptyProducts.length).toBe(0);
    const missingDesc = emptyProducts.filter(p => !p.description);
    expect(missingDesc.length).toBe(0);
  });
});

// ─── Edge Cases ─────────────────────────────────────────────

describe('Edge Cases', () => {
  test('product with all attributes filled has complete profile', () => {
    const requiredAttrs = ['color', 'material', 'weight', 'brand', 'origin'];
    const complete = sampleProducts.filter(p => {
      const attrs = p.attributes || {};
      return requiredAttrs.every(a => attrs[a]);
    });
    expect(complete.length).toBeGreaterThan(0);
  });

  test('wooSynced products have wooId', () => {
    const synced = sampleProducts.filter(p => p.wooSynced);
    synced.forEach(p => {
      expect(p.wooId).toBeTruthy();
    });
  });

  test('draft products are not synced to WooCommerce', () => {
    const drafts = sampleProducts.filter(p => p.status === 'draft');
    drafts.forEach(p => {
      expect(p.wooSynced).toBe(false);
    });
  });
});
