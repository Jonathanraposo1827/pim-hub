import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { wooCommerceService } from '../services/wooCommerceService';
import {
  ShoppingCart, Upload, Download, RefreshCw, CheckCircle, AlertTriangle,
  Cloud, ArrowRight, ArrowLeft, Clock, Loader2, XCircle
} from 'lucide-react';

const SyncStatusBadge = ({ status }) => {
  const config = {
    synced: { label: 'Synced', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    not_synced: { label: 'Not Synced', cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: XCircle },
    conflict: { label: 'Conflict', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: AlertTriangle },
  };
  const c = config[status] || config.not_synced;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${c.cls}`}>
      <Icon className="w-3 h-3" />{c.label}
    </span>
  );
};

export default function WooCommerceSync() {
  const { products, markSynced, importProducts } = useProducts();
  const [wooProducts, setWooProducts] = useState([]);
  const [syncStatus, setSyncStatus] = useState([]);
  const [syncLog, setSyncLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const woo = await wooCommerceService.getWooProducts();
      setWooProducts(woo);
      const status = await wooCommerceService.getSyncStatus(products);
      setSyncStatus(status);
      setSyncLog(wooCommerceService.getSyncLog());
    } catch (err) {
      console.error('Failed to load WooCommerce data:', err);
    }
    setLoading(false);
  };

  const handlePush = async () => {
    const unsynced = products.filter(p => !p.wooSynced && p.status === 'published');
    if (unsynced.length === 0) {
      setActionMsg({ type: 'info', text: 'All published products are already synced!' });
      setTimeout(() => setActionMsg(null), 3000);
      return;
    }
    setLoading(true);
    try {
      const result = await wooCommerceService.pushToWoo(unsynced);
      markSynced(unsynced.map(p => p.id));
      setActionMsg({ type: 'success', text: `✅ Successfully pushed ${result.synced} products to WooCommerce!` });
      setSyncLog(wooCommerceService.getSyncLog());
      const status = await wooCommerceService.getSyncStatus(products);
      setSyncStatus(status);
    } catch (err) {
      setActionMsg({ type: 'error', text: '❌ Push failed: ' + err.message });
    }
    setLoading(false);
    setTimeout(() => setActionMsg(null), 4000);
  };

  const handlePull = async () => {
    setLoading(true);
    try {
      const result = await wooCommerceService.pullFromWoo();
      if (result.imported.length > 0) {
        importProducts(result.imported);
        setActionMsg({ type: 'success', text: `✅ Pulled ${result.imported.length} new products from WooCommerce!` });
      } else {
        setActionMsg({ type: 'info', text: 'No new products to pull from WooCommerce.' });
      }
      setSyncLog(wooCommerceService.getSyncLog());
    } catch (err) {
      setActionMsg({ type: 'error', text: '❌ Pull failed: ' + err.message });
    }
    setLoading(false);
    setTimeout(() => setActionMsg(null), 4000);
  };

  const syncedCount = products.filter(p => p.wooSynced).length;
  const unsyncedCount = products.filter(p => !p.wooSynced).length;
  const publishedUnsynced = products.filter(p => !p.wooSynced && p.status === 'published').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-purple-500" />
            WooCommerce Sync
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Synchronize product data between PIM and WooCommerce</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePull} disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Pull from WooCommerce
          </button>
          <button onClick={handlePush} disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-500/25">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Push to WooCommerce
          </button>
        </div>
      </div>

      {/* Action message toast */}
      {actionMsg && (
        <div className={`p-4 rounded-xl text-sm font-medium ${
          actionMsg.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
          actionMsg.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        }`}>{actionMsg.text}</div>
      )}

      {/* Note about simulation */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-sm text-purple-700 dark:text-purple-300">
        <strong>ℹ️ Note:</strong> WooCommerce integration is simulated with mock data. The system is designed to be easily extendable to real WooCommerce REST APIs.
      </div>

      {/* Sync Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{syncedCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Synced Products</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{publishedUnsynced}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ready to Push</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{wooProducts.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">WooCommerce Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex">
        {['overview', 'sync-log'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}>{tab === 'overview' ? 'Product Overview' : 'Sync Log'}</button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">PIM Product</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Sync</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">WooCommerce</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.slice(0, 10).map(product => {
                  const woo = wooProducts.find(w => w.sku === product.sku);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku} · ${product.price}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {product.wooSynced ? (
                          <ArrowRight className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {woo ? (
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{woo.name}</p>
                            <p className="text-xs text-gray-500">${woo.price} · Stock: {woo.stockQuantity}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not in WooCommerce</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <SyncStatusBadge status={product.wooSynced ? 'synced' : 'not_synced'} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sync-log' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-3">
            {syncLog.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No sync activity yet</p>
            ) : (
              syncLog.map(log => (
                <div key={log.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    log.action === 'push' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {log.action === 'push' ? <Upload className="w-4 h-4 text-purple-600" /> : <Download className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{log.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    log.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>{log.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
