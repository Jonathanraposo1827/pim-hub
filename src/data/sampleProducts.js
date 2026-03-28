// Sample PIM Product Dataset
// Includes varied completeness levels for AI analysis demos

export const CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Kitchen', 'Sports', 'Beauty', 'Books', 'Toys'
];

export const ATTRIBUTE_DEFINITIONS = [
  { key: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { key: 'color', label: 'Color', type: 'text' },
  { key: 'material', label: 'Material', type: 'text' },
  { key: 'weight', label: 'Weight', type: 'text' },
  { key: 'brand', label: 'Brand', type: 'text' },
  { key: 'warranty', label: 'Warranty', type: 'text' },
  { key: 'origin', label: 'Country of Origin', type: 'text' },
];

let _id = 0;
const uid = () => `pim-${++_id}-${Date.now()}`;

export const sampleProducts = [
  {
    id: uid(), name: 'Wireless Bluetooth Headphones', sku: 'PIM-001',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and deep bass.',
    category: 'Electronics', price: 79.99, salePrice: 64.99, stock: 245,
    status: 'published', wooSynced: true, wooId: 'woo-101',
    attributes: { color: 'Matte Black', material: 'ABS Plastic', weight: '250g', brand: 'SoundMax', warranty: '2 years', origin: 'China' },
    images: [], createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-25T14:30:00Z'
  },
  {
    id: uid(), name: 'Organic Cotton T-Shirt', sku: 'PIM-002',
    description: 'Eco-friendly organic cotton crew-neck t-shirt. Pre-shrunk, breathable fabric.',
    category: 'Clothing', price: 24.99, salePrice: null, stock: 530,
    status: 'published', wooSynced: true, wooId: 'woo-102',
    attributes: { size: 'M', color: 'Navy Blue', material: '100% Organic Cotton', weight: '180g', brand: 'EcoWear', origin: 'India' },
    images: [], createdAt: '2026-02-15T08:00:00Z', updatedAt: '2026-03-20T11:15:00Z'
  },
  {
    id: uid(), name: 'Smart LED Desk Lamp', sku: 'PIM-003',
    description: 'Touch-controlled LED desk lamp with 5 brightness levels and USB charging port.',
    category: 'Electronics', price: 45.00, salePrice: 38.50, stock: 182,
    status: 'published', wooSynced: false, wooId: null,
    attributes: { color: 'White', material: 'Aluminum + ABS', weight: '1.2kg', brand: 'LumiTech', warranty: '1 year', origin: 'China' },
    images: [], createdAt: '2026-03-10T09:30:00Z', updatedAt: '2026-03-26T16:00:00Z'
  },
  {
    id: uid(), name: 'Yoga Mat Premium', sku: 'PIM-004',
    description: 'Non-slip yoga mat with alignment marks. 6mm thickness for joint protection.',
    category: 'Sports', price: 34.99, salePrice: null, stock: 310,
    status: 'published', wooSynced: true, wooId: 'woo-104',
    attributes: { color: 'Purple', material: 'TPE Eco-Foam', weight: '1.8kg', brand: 'ZenFlex', origin: 'Taiwan' },
    images: [], createdAt: '2026-01-20T12:00:00Z', updatedAt: '2026-03-18T09:45:00Z'
  },
  {
    id: uid(), name: 'Stainless Steel Water Bottle', sku: 'PIM-005',
    description: 'Double-wall vacuum insulated. Keeps drinks cold 24hr, hot 12hr.',
    category: 'Home & Kitchen', price: 19.99, salePrice: 16.99, stock: 890,
    status: 'published', wooSynced: false, wooId: null,
    attributes: { color: 'Silver', material: '18/8 Stainless Steel', weight: '350g', brand: 'HydroKeep', warranty: 'Lifetime', origin: 'USA' },
    images: [], createdAt: '2026-02-01T07:00:00Z', updatedAt: '2026-03-22T13:20:00Z'
  },
  {
    id: uid(), name: 'Running Shoes Pro', sku: 'PIM-006',
    description: '', // MISSING description for AI to catch
    category: 'Sports', price: 89.99, salePrice: null, stock: 67,
    status: 'draft', wooSynced: false, wooId: null,
    attributes: { size: 'L', color: 'Red/Black', material: 'Mesh + Rubber', brand: 'SpeedStrike' },
    // Missing: weight, warranty, origin → AI attribute intelligence demo
    images: [], createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-03-15T10:00:00Z'
  },
  {
    id: uid(), name: 'Ceramic Coffee Mug Set', sku: 'PIM-007',
    description: 'Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe.',
    category: 'Home & Kitchen', price: 28.00, salePrice: 22.00, stock: 415,
    status: 'published', wooSynced: true, wooId: 'woo-107',
    attributes: { color: 'Assorted Earth Tones', material: 'Ceramic', weight: '1.6kg', brand: 'ArtisanHome', origin: 'Portugal' },
    images: [], createdAt: '2026-01-10T14:00:00Z', updatedAt: '2026-03-12T08:30:00Z'
  },
  {
    id: uid(), name: 'USB-C Hub Adapter', sku: 'PIM-008',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.',
    category: 'Electronics', price: 39.99, salePrice: 34.99, stock: 0, // OUT OF STOCK
    status: 'published', wooSynced: true, wooId: 'woo-108',
    attributes: { color: 'Space Gray', material: 'Aluminum', weight: '85g', brand: 'ConnectPro', warranty: '18 months', origin: 'China' },
    images: [], createdAt: '2026-02-20T11:00:00Z', updatedAt: '2026-03-24T17:00:00Z'
  },
  {
    id: uid(), name: 'Natural Face Moisturizer', sku: 'PIM-009',
    description: 'Lightweight daily moisturizer with hyaluronic acid and vitamin E.',
    category: 'Beauty', price: 18.50, salePrice: null, stock: 275,
    status: 'published', wooSynced: false, wooId: null,
    attributes: { weight: '50ml', brand: 'PureGlow', origin: 'France' },
    // Missing: color, material → AI demo
    images: [], createdAt: '2026-03-05T09:00:00Z', updatedAt: '2026-03-21T10:45:00Z'
  },
  {
    id: uid(), name: 'Bamboo Cutting Board', sku: 'PIM-010',
    description: '', // MISSING
    category: 'Home & Kitchen', price: 15.99, salePrice: null, stock: 620,
    status: 'draft', wooSynced: false, wooId: null,
    attributes: { material: 'Bamboo', brand: 'GreenChef' },
    // Very incomplete → great for AI
    images: [], createdAt: '2026-03-20T16:00:00Z', updatedAt: '2026-03-20T16:00:00Z'
  },
  {
    id: uid(), name: 'Wireless Charging Pad', sku: 'PIM-011',
    description: '15W fast wireless charger. Compatible with all Qi-enabled devices.',
    category: 'Electronics', price: 22.99, salePrice: 19.99, stock: 340,
    status: 'published', wooSynced: true, wooId: 'woo-111',
    attributes: { color: 'Black', material: 'ABS + Silicone', weight: '120g', brand: 'ChargeMate', warranty: '1 year', origin: 'South Korea' },
    images: [], createdAt: '2026-02-10T13:00:00Z', updatedAt: '2026-03-19T15:30:00Z'
  },
  {
    id: uid(), name: 'Adventure Novel Collection', sku: 'PIM-012',
    description: 'Box set of 5 bestselling adventure novels. Hardcover edition.',
    category: 'Books', price: 49.99, salePrice: 39.99, stock: 88,
    status: 'published', wooSynced: false, wooId: null,
    attributes: { weight: '2.5kg', brand: 'PageTurner Publishing', origin: 'UK' },
    images: [], createdAt: '2026-03-08T10:00:00Z', updatedAt: '2026-03-23T11:00:00Z'
  },
  {
    id: uid(), name: 'Kids Building Blocks Set', sku: 'PIM-013',
    description: '200-piece colorful building blocks. STEM-approved educational toy for ages 3+.',
    category: 'Toys', price: 29.99, salePrice: 24.99, stock: 156,
    status: 'published', wooSynced: false, wooId: null,
    attributes: { color: 'Multicolor', material: 'ABS Plastic (BPA-free)', weight: '1.1kg', brand: 'BuildBright', warranty: '6 months', origin: 'Germany' },
    images: [], createdAt: '2026-02-28T08:00:00Z', updatedAt: '2026-03-17T14:20:00Z'
  },
  {
    id: uid(), name: 'Leather Wallet RFID', sku: 'PIM-014',
    description: 'Slim bifold wallet with RFID blocking technology. 8 card slots.',
    category: 'Clothing', price: 34.99, salePrice: null, stock: 445,
    status: 'published', wooSynced: true, wooId: 'woo-114',
    attributes: { color: 'Brown', material: 'Genuine Leather', weight: '90g', brand: 'CraftHide', origin: 'Italy' },
    images: [], createdAt: '2026-01-25T11:00:00Z', updatedAt: '2026-03-14T09:10:00Z'
  },
  {
    id: uid(), name: 'Resistance Bands Set', sku: 'PIM-015',
    description: '', // MISSING
    category: 'Sports', price: 0, // MISSING price → AI should flag
    salePrice: null, stock: 200,
    status: 'draft', wooSynced: false, wooId: null,
    attributes: { color: 'Multi', brand: 'FlexForce' },
    // Many missing attributes
    images: [], createdAt: '2026-03-25T10:00:00Z', updatedAt: '2026-03-25T10:00:00Z'
  },
];

export default sampleProducts;
