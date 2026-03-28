import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductProvider } from './contexts/ProductContext';
import { Layout } from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AIInsights from './pages/AIInsights';
import WooCommerceSync from './pages/WooCommerceSync';
import Settings from './pages/Settings';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.remove('dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    void document.documentElement.offsetHeight;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
        <Router>
          <Routes>
            {/* All routes are accessible in demo mode (no auth) */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/ai-insights" element={<Layout><AIInsights /></Layout>} />
            <Route path="/woo-sync" element={<Layout><WooCommerceSync /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ProductProvider>
    </QueryClientProvider>
  );
}

export default App;
