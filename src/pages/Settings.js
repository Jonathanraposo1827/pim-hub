import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Settings as SettingsIcon, Moon, Sun, Info, Database, Globe, Zap, Upload, Loader2, RefreshCw } from 'lucide-react';

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const { useDB, backendStatus, seedDatabase, loadProducts, products } = useProducts();
  const [seedMsg, setSeedMsg] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark');
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg(null);
    try {
      const res = await seedDatabase();
      setSeedMsg({ type: 'success', text: res.message || `✅ Seeded ${res.seeded} products into database!` });
    } catch (err) {
      setSeedMsg({ type: 'error', text: '❌ Seed failed: ' + (err.response?.data?.detail || err.message) });
    }
    setSeeding(false);
    setTimeout(() => setSeedMsg(null), 5000);
  };

  const handleReconnect = async () => {
    setSeedMsg(null);
    await loadProducts();
    setSeedMsg({ type: 'info', text: useDB ? '✅ Connected to database!' : 'ℹ️ Still using mock data.' });
    setTimeout(() => setSeedMsg(null), 3000);
  };

  const dbStatusText = backendStatus === 'online'
    ? (useDB ? '✅ Connected to Neon PostgreSQL' : '⚠️ Backend online, but DB not serving products yet')
    : '❌ Backend not reachable (using mock data)';

  const dbBadge = backendStatus === 'online'
    ? (useDB ? { text: 'Connected', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
             : { text: 'Backend Up', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' })
    : { text: 'Offline', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-gray-500" />
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">PIM Hub configuration</p>
      </div>

      {/* Theme Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
            </div>
          </div>
          <button onClick={toggleTheme}
            className="relative w-12 h-6 rounded-full transition-colors bg-gray-300 dark:bg-indigo-600">
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Database */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Database</h3>

        {/* Connection Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className={`w-5 h-5 ${useDB ? 'text-green-500' : backendStatus === 'online' ? 'text-blue-500' : 'text-red-400'}`} />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Connection Status</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{dbStatusText}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${dbBadge.cls}`}>{dbBadge.text}</span>
            <button onClick={handleReconnect} title="Retry connection"
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Seed Database — always show if backend is online */}
        {backendStatus === 'online' && (
          <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Seed Database</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Load 15 sample products into Neon DB ({products.length} products shown)
                </p>
              </div>
              <button onClick={handleSeed} disabled={seeding}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Seed DB
              </button>
            </div>
          </div>
        )}

        {/* Feedback message */}
        {seedMsg && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            seedMsg.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            seedMsg.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>{seedMsg.text}</div>
        )}

        {backendStatus === 'offline' && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-700 dark:text-amber-400">
            <strong>Tip:</strong> Start the backend with <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">python main.py</code> in the <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">backend/</code> folder, then click the refresh button above.
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>
        <div className="space-y-3">
          {[
            { icon: Zap, label: 'AI Engine', value: 'Gemini 2.5 Flash' },
            { icon: Database, label: 'Data Storage', value: useDB ? 'Neon PostgreSQL' : 'Local State (Mock)' },
            { icon: Globe, label: 'WooCommerce', value: 'Mock Integration (Simulated)' },
            { icon: Info, label: 'Version', value: 'PIM Hub v2.1.0' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
