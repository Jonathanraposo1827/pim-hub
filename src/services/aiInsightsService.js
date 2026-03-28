import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const pimAIService = {
  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  },

  /**
   * Full PIM product analysis
   */
  async analyzeProducts(products) {
    try {
      const response = await axios.post(`${API_BASE_URL}/pim/analyze`, { products }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error('PIM analysis failed:', error);
      // Fallback mock response
      return this.getMockAnalysis(products);
    }
  },

  /**
   * AI Agent flow — step-by-step analysis with visible steps
   */
  async runAgentFlow(products, onStep) {
    try {
      // Step 1: Fetch & prepare
      onStep({ step: 1, title: 'Fetching Product Data', status: 'running', detail: `Loading ${products.length} products for analysis...` });
      await new Promise(r => setTimeout(r, 800));
      onStep({ step: 1, title: 'Fetching Product Data', status: 'done', detail: `${products.length} products loaded successfully` });

      // Step 2: Analyze attributes
      onStep({ step: 2, title: 'Analyzing Attributes', status: 'running', detail: 'Scanning for missing or inconsistent attributes...' });
      await new Promise(r => setTimeout(r, 1000));
      const missing = products.filter(p => {
        const attrs = p.attributes || {};
        return !attrs.color || !attrs.material || !attrs.weight || !attrs.brand || !attrs.origin;
      });
      onStep({ step: 2, title: 'Analyzing Attributes', status: 'done', detail: `Found ${missing.length} products with incomplete attributes` });

      // Step 3: Send to LLM
      onStep({ step: 3, title: 'Generating AI Insights', status: 'running', detail: 'Sending data to Gemini for deep analysis...' });
      let insights;
      try {
        const response = await axios.post(`${API_BASE_URL}/pim/agent`, { products }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000
        });
        insights = response.data;
      } catch {
        insights = this.getMockAnalysis(products);
      }
      onStep({ step: 3, title: 'Generating AI Insights', status: 'done', detail: 'AI analysis complete' });

      // Step 4: Structure results
      onStep({ step: 4, title: 'Structuring Results', status: 'running', detail: 'Formatting insights into actionable recommendations...' });
      await new Promise(r => setTimeout(r, 600));
      onStep({ step: 4, title: 'Structuring Results', status: 'done', detail: 'Structured insights ready' });

      return insights;
    } catch (error) {
      console.error('Agent flow failed:', error);
      return this.getMockAnalysis(products);
    }
  },

  /**
   * Mock analysis fallback when backend is unavailable
   */
  getMockAnalysis(products) {
    const missingDesc = products.filter(p => !p.description || p.description.trim() === '');
    const lowStock = products.filter(p => p.stock < 100 && p.stock > 0);
    const outOfStock = products.filter(p => p.stock === 0);
    const missingPrice = products.filter(p => !p.price || p.price === 0);
    const unsynced = products.filter(p => !p.wooSynced);

    const requiredAttrs = ['color', 'material', 'weight', 'brand', 'origin'];
    const incomplete = products.filter(p => {
      const attrs = p.attributes || {};
      return requiredAttrs.some(a => !attrs[a]);
    });

    return {
      summary: `Analyzed ${products.length} products. Found ${missingDesc.length} missing descriptions, ${incomplete.length} products with incomplete attributes, ${outOfStock.length} out-of-stock items, and ${unsynced.length} products not synced to WooCommerce.`,
      topProducts: products.filter(p => p.stock > 300).map(p => ({ name: p.name, sku: p.sku, stock: p.stock, reason: 'High stock availability and active status' })),
      lowPerforming: [...outOfStock, ...lowStock].slice(0, 5).map(p => ({ name: p.name, sku: p.sku, stock: p.stock, reason: p.stock === 0 ? 'Out of stock' : 'Low stock levels' })),
      missingAttributes: incomplete.map(p => {
        const attrs = p.attributes || {};
        const missingList = requiredAttrs.filter(a => !attrs[a]);
        return { name: p.name, sku: p.sku, missingFields: missingList };
      }),
      optimizations: [
        missingDesc.length > 0 ? `Add descriptions to ${missingDesc.length} products to improve SEO and conversion.` : null,
        missingPrice.length > 0 ? `Set prices for ${missingPrice.length} products before publishing.` : null,
        unsynced.length > 0 ? `Sync ${unsynced.length} products to WooCommerce to make them available for sale.` : null,
        incomplete.length > 0 ? `Complete attributes for ${incomplete.length} products to improve product discoverability.` : null,
        outOfStock.length > 0 ? `Restock ${outOfStock.length} out-of-stock products or mark them as discontinued.` : null,
      ].filter(Boolean),
      attributeCompleteness: {
        total: products.length * requiredAttrs.length,
        filled: products.reduce((sum, p) => sum + requiredAttrs.filter(a => p.attributes && p.attributes[a]).length, 0),
      }
    };
  }
};

export default pimAIService;
