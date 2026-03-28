// Script to add default categories to Firebase - run this in browser console
import { productCategoriesService } from './src/services/productCategoriesService.js';

const addDefaultCategories = async () => {
  const defaultCategories = [
    {
      name: 'Electronics',
      description: 'Electronic devices, gadgets, and accessories'
    },
    {
      name: 'Furniture', 
      description: 'Chairs, tables, desks, and other furniture items'
    },
    {
      name: 'Tools',
      description: 'Hand tools, power tools, and equipment'
    },
    {
      name: 'Office',
      description: 'Office supplies, stationery, and equipment'
    },
    {
      name: 'Hardware',
      description: 'Screws, bolts, nuts, and other hardware items'
    },
    {
      name: 'Food & Beverages',
      description: 'Food items, drinks, and consumables'
    },
    {
      name: 'Clothing',
      description: 'Apparel, shoes, and accessories'
    },
    {
      name: 'Medical Supplies',
      description: 'Medical equipment, medicines, and healthcare items'
    }
  ];

  console.log('Adding default categories to Firebase...');
  
  try {
    for (const category of defaultCategories) {
      await productCategoriesService.create(category);
      console.log(`✓ Added category: ${category.name}`);
    }
    console.log('✅ All categories added successfully!');
    return 'Categories added successfully';
  } catch (error) {
    console.error('❌ Error adding categories:', error);
    throw error;
  }
};

// Export for use in console
window.addDefaultCategories = addDefaultCategories;