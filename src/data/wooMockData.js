// Mock WooCommerce Store Data
// Simulates products that exist in a WooCommerce store

export const wooProducts = [
  {
    wooId: 'woo-101', name: 'Wireless Bluetooth Headphones', sku: 'PIM-001',
    price: '79.99', regularPrice: '79.99', salePrice: '64.99',
    status: 'publish', stockStatus: 'instock', stockQuantity: 240,
    categories: [{ id: 1, name: 'Electronics' }],
    attributes: [
      { name: 'Color', options: ['Matte Black'] },
      { name: 'Brand', options: ['SoundMax'] }
    ],
    lastSynced: '2026-03-25T14:30:00Z'
  },
  {
    wooId: 'woo-102', name: 'Organic Cotton T-Shirt', sku: 'PIM-002',
    price: '24.99', regularPrice: '24.99', salePrice: '',
    status: 'publish', stockStatus: 'instock', stockQuantity: 520,
    categories: [{ id: 2, name: 'Clothing' }],
    attributes: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Navy Blue'] }
    ],
    lastSynced: '2026-03-20T11:15:00Z'
  },
  {
    wooId: 'woo-104', name: 'Yoga Mat Premium', sku: 'PIM-004',
    price: '34.99', regularPrice: '34.99', salePrice: '',
    status: 'publish', stockStatus: 'instock', stockQuantity: 305,
    categories: [{ id: 3, name: 'Sports' }],
    attributes: [
      { name: 'Color', options: ['Purple'] },
      { name: 'Material', options: ['TPE Eco-Foam'] }
    ],
    lastSynced: '2026-03-18T09:45:00Z'
  },
  {
    wooId: 'woo-107', name: 'Ceramic Coffee Mug Set', sku: 'PIM-007',
    price: '28.00', regularPrice: '28.00', salePrice: '22.00',
    status: 'publish', stockStatus: 'instock', stockQuantity: 410,
    categories: [{ id: 4, name: 'Home & Kitchen' }],
    attributes: [
      { name: 'Color', options: ['Assorted Earth Tones'] },
      { name: 'Material', options: ['Ceramic'] }
    ],
    lastSynced: '2026-03-12T08:30:00Z'
  },
  {
    wooId: 'woo-108', name: 'USB-C Hub Adapter', sku: 'PIM-008',
    price: '39.99', regularPrice: '39.99', salePrice: '34.99',
    status: 'publish', stockStatus: 'outofstock', stockQuantity: 0,
    categories: [{ id: 1, name: 'Electronics' }],
    attributes: [
      { name: 'Color', options: ['Space Gray'] }
    ],
    lastSynced: '2026-03-24T17:00:00Z'
  },
  {
    wooId: 'woo-111', name: 'Wireless Charging Pad', sku: 'PIM-011',
    price: '22.99', regularPrice: '22.99', salePrice: '19.99',
    status: 'publish', stockStatus: 'instock', stockQuantity: 335,
    categories: [{ id: 1, name: 'Electronics' }],
    attributes: [
      { name: 'Color', options: ['Black'] },
      { name: 'Brand', options: ['ChargeMate'] }
    ],
    lastSynced: '2026-03-19T15:30:00Z'
  },
  {
    wooId: 'woo-114', name: 'Leather Wallet RFID', sku: 'PIM-014',
    price: '34.99', regularPrice: '34.99', salePrice: '',
    status: 'publish', stockStatus: 'instock', stockQuantity: 440,
    categories: [{ id: 2, name: 'Clothing' }],
    attributes: [
      { name: 'Color', options: ['Brown'] },
      { name: 'Material', options: ['Genuine Leather'] }
    ],
    lastSynced: '2026-03-14T09:10:00Z'
  },
  // WooCommerce-only product (not in PIM yet) — for Pull demo
  {
    wooId: 'woo-201', name: 'Portable Bluetooth Speaker', sku: 'WOO-201',
    price: '49.99', regularPrice: '49.99', salePrice: '42.99',
    status: 'publish', stockStatus: 'instock', stockQuantity: 180,
    categories: [{ id: 1, name: 'Electronics' }],
    attributes: [
      { name: 'Color', options: ['Red'] },
      { name: 'Brand', options: ['BassBoost'] }
    ],
    lastSynced: null
  },
];

export const syncLog = [
  { id: 1, action: 'push', sku: 'PIM-001', status: 'success', timestamp: '2026-03-25T14:30:00Z', message: 'Product synced to WooCommerce' },
  { id: 2, action: 'push', sku: 'PIM-002', status: 'success', timestamp: '2026-03-20T11:15:00Z', message: 'Product synced to WooCommerce' },
  { id: 3, action: 'pull', sku: 'PIM-004', status: 'success', timestamp: '2026-03-18T09:45:00Z', message: 'Product pulled from WooCommerce' },
  { id: 4, action: 'push', sku: 'PIM-008', status: 'warning', timestamp: '2026-03-24T17:00:00Z', message: 'Synced but stock mismatch detected' },
];

export default wooProducts;
