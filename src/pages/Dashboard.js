import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, ShoppingCart, AlertTriangle, CheckCircle, TrendingUp, Cloud, FileWarning, DollarSign } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#14b8a6', '#f59e0b', '#ef4444'];

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend && (
      <div className="mt-3 flex items-center gap-1">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-600 dark:text-green-400 font-medium">{trend}</span>
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const { products, getStats } = useProducts();
  const stats = getStats();

  const categoryData = Object.entries(stats.categoryCount || {}).map(([name, count]) => ({
    name, count
  }));

  const statusData = [
    { name: 'Published', value: stats.published || 0, color: '#22c55e' },
    { name: 'Draft', value: stats.draft || 0, color: '#f59e0b' },
    { name: 'Archived', value: products.filter(p => p.status === 'archived').length, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PIM Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Product Information Management Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.total} subtitle={`${stats.published} published`} icon={Package} color="bg-indigo-500" trend="+3 this week" />
        <StatCard title="Attribute Completeness" value={`${stats.attributeCompleteness || 0}%`} subtitle={`${stats.missingDesc} missing descriptions`} icon={stats.attributeCompleteness > 80 ? CheckCircle : FileWarning} color={stats.attributeCompleteness > 80 ? 'bg-green-500' : 'bg-amber-500'} />
        <StatCard title="WooCommerce Synced" value={stats.synced} subtitle={`${stats.unsynced} unsynced`} icon={Cloud} color="bg-purple-500" />
        <StatCard title="Inventory Value" value={`$${(stats.inventoryValue || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} subtitle={`${stats.outOfStock} out of stock`} icon={DollarSign} color="bg-teal-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Status</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recently Updated Products</h3>
        <div className="space-y-3">
          {recentProducts.map(product => (
            <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{product.sku} · {product.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  product.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                }`}>{product.status}</span>
                {product.wooSynced && <Cloud className="w-4 h-4 text-purple-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
