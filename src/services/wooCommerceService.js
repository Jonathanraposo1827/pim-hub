// WooCommerce Mock Sync Service
import { wooProducts, syncLog as initialSyncLog } from '../data/wooMockData';

let currentSyncLog = [...initialSyncLog];
let nextLogId = initialSyncLog.length + 1;

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const wooCommerceService = {
  // Get all WooCommerce products
  async getWooProducts() {
    await delay(600);
    return [...wooProducts];
  },

  // Push products to WooCommerce (simulation)
  async pushToWoo(products) {
    await delay(1500); // Simulate API call
    const results = products.map(product => {
      const logEntry = {
        id: nextLogId++,
        action: 'push',
        sku: product.sku,
        name: product.name,
        status: 'success',
        timestamp: new Date().toISOString(),
        message: `Product "${product.name}" synced to WooCommerce`
      };
      currentSyncLog.unshift(logEntry);
      return { ...product, wooSynced: true, wooId: `woo-${Date.now()}-${product.sku}` };
    });
    return { success: true, synced: results.length, results };
  },

  // Pull products from WooCommerce (simulation)
  async pullFromWoo() {
    await delay(1200);
    // Return WooCommerce-only products that don't exist in PIM
    const wooOnlyProducts = wooProducts.filter(wp => wp.wooId === 'woo-201');
    const imported = wooOnlyProducts.map(wp => ({
      name: wp.name,
      sku: wp.sku,
      description: `Imported from WooCommerce (${wp.wooId})`,
      category: wp.categories[0]?.name || 'Uncategorized',
      price: parseFloat(wp.price),
      salePrice: wp.salePrice ? parseFloat(wp.salePrice) : null,
      stock: wp.stockQuantity,
      status: 'draft',
      wooSynced: true,
      wooId: wp.wooId,
      attributes: wp.attributes.reduce((acc, attr) => {
        acc[attr.name.toLowerCase()] = attr.options.join(', ');
        return acc;
      }, {}),
    }));

    imported.forEach(p => {
      currentSyncLog.unshift({
        id: nextLogId++, action: 'pull', sku: p.sku, name: p.name,
        status: 'success', timestamp: new Date().toISOString(),
        message: `Product "${p.name}" pulled from WooCommerce`
      });
    });

    return { success: true, imported };
  },

  // Get sync status comparison
  async getSyncStatus(pimProducts) {
    await delay(400);
    const comparison = pimProducts.map(pim => {
      const woo = wooProducts.find(w => w.sku === pim.sku);
      if (!woo) {
        return { ...pim, syncStatus: 'not_synced', diff: null };
      }
      const priceDiff = parseFloat(woo.price) !== pim.price;
      const stockDiff = woo.stockQuantity !== pim.stock;
      if (priceDiff || stockDiff) {
        return { ...pim, syncStatus: 'conflict', diff: { priceDiff, stockDiff, wooPrice: woo.price, wooStock: woo.stockQuantity } };
      }
      return { ...pim, syncStatus: 'synced', diff: null };
    });
    return comparison;
  },

  // Get sync log
  getSyncLog() {
    return [...currentSyncLog];
  }
};

export default wooCommerceService;
