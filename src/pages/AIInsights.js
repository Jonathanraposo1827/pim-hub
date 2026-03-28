import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { pimAIService } from '../services/aiInsightsService';
import {
  Brain, Play, CheckCircle, Loader2, AlertTriangle, TrendingUp, TrendingDown,
  FileWarning, Lightbulb, BarChart3, Zap, RefreshCw
} from 'lucide-react';

// Agent Step Visualization
const AgentStep = ({ step, isActive }) => {
  const icons = { running: Loader2, done: CheckCircle, pending: BarChart3 };
  const Icon = icons[step.status] || BarChart3;
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ${
      step.status === 'done' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
      step.status === 'running' ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 animate-pulse' :
      'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-50'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        step.status === 'done' ? 'bg-green-500' :
        step.status === 'running' ? 'bg-indigo-500' : 'bg-gray-400'
      }`}>
        <Icon className={`w-5 h-5 text-white ${step.status === 'running' ? 'animate-spin' : ''}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">STEP {step.step}</span>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{step.detail}</p>
      </div>
    </div>
  );
};

// Insight Card
const InsightCard = ({ icon: Icon, title, items, color, emptyText }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className={`px-5 py-3 flex items-center gap-2 ${color}`}>
      <Icon className="w-5 h-5 text-white" />
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <span className="ml-auto text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full">{items?.length || 0}</span>
    </div>
    <div className="p-4">
      {items && items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span className="text-xs font-mono text-gray-400 mt-0.5">{item.sku || `#${i + 1}`}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name || item}</p>
                {item.reason && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.reason}</p>}
                {item.missingFields && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.missingFields.map(f => (
                      <span key={f} className="text-xs px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">{f}</span>
                    ))}
                  </div>
                )}
                {item.stock !== undefined && <span className="text-xs text-gray-400">Stock: {item.stock}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">{emptyText || 'No items'}</p>
      )}
    </div>
  </div>
);

export default function AIInsights() {
  const { products } = useProducts();
  const [insights, setInsights] = useState(null);
  const [agentSteps, setAgentSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('agent'); // 'agent' or 'quick'

  const handleRunAgent = async () => {
    setLoading(true);
    setInsights(null);
    setAgentSteps([
      { step: 1, title: 'Fetching Product Data', status: 'pending', detail: 'Waiting...' },
      { step: 2, title: 'Analyzing Attributes', status: 'pending', detail: 'Waiting...' },
      { step: 3, title: 'Generating AI Insights', status: 'pending', detail: 'Waiting...' },
      { step: 4, title: 'Structuring Results', status: 'pending', detail: 'Waiting...' },
    ]);

    try {
      const result = await pimAIService.runAgentFlow(products, (stepUpdate) => {
        setAgentSteps(prev => prev.map(s =>
          s.step === stepUpdate.step ? { ...s, ...stepUpdate } : s
        ));
      });
      setInsights(result);
    } catch (error) {
      console.error('Agent flow failed:', error);
    }
    setLoading(false);
  };

  const handleQuickAnalyze = async () => {
    setLoading(true);
    setAgentSteps([]);
    try {
      const result = await pimAIService.analyzeProducts(products);
      setInsights(result);
    } catch (error) {
      console.error('Quick analysis failed:', error);
    }
    setLoading(false);
  };

  const completeness = insights?.attributeCompleteness;
  const completePct = completeness ? Math.round((completeness.filled / completeness.total) * 100) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-indigo-500" />
            AI Product Insights
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">AI-powered analysis of your product catalog using Gemini</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleQuickAnalyze} disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50">
            <Zap className="w-4 h-4" />Quick Analysis
          </button>
          <button onClick={handleRunAgent} disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-500/25">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run AI Agent
          </button>
        </div>
      </div>

      {/* AI Usage Explanation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">🤖 How AI is Used (3 Layers)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="text-sm text-indigo-700 dark:text-indigo-400">
            <strong>1. Insight Generation</strong> — Gemini analyzes the full product catalog to identify top/low performers and optimization opportunities.
          </div>
          <div className="text-sm text-indigo-700 dark:text-indigo-400">
            <strong>2. Attribute Intelligence</strong> — Detects missing, incomplete, or inconsistent product attributes automatically.
          </div>
          <div className="text-sm text-indigo-700 dark:text-indigo-400">
            <strong>3. Agent Workflow</strong> — Multi-step reasoning: Fetch → Analyze → Generate → Structure, with real-time step visualization.
          </div>
        </div>
      </div>

      {/* Agent Steps Visualization */}
      {agentSteps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <RefreshCw className={`w-5 h-5 text-indigo-500 ${loading ? 'animate-spin' : ''}`} />
            Agent Flow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {agentSteps.map(step => (
              <AgentStep key={step.step} step={step} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {insights && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">📊 Analysis Summary</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{insights.summary}</p>
            {completePct !== null && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Attribute Completeness:</span>
                <div className="flex-1 max-w-xs h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${completePct > 80 ? 'bg-green-500' : completePct > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${completePct}%` }} />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{completePct}%</span>
              </div>
            )}
          </div>

          {/* Insight Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InsightCard icon={TrendingUp} title="Top Performing Products" items={insights.topProducts} color="bg-green-600" emptyText="No high-performing products found" />
            <InsightCard icon={TrendingDown} title="Low Performing Products" items={insights.lowPerforming} color="bg-red-600" emptyText="All products performing well" />
            <InsightCard icon={FileWarning} title="Missing Attributes" items={insights.missingAttributes} color="bg-amber-600" emptyText="All attributes complete!" />
            <InsightCard icon={Lightbulb} title="Optimization Suggestions" items={insights.optimizations?.map(o => ({ name: o }))} color="bg-indigo-600" emptyText="No suggestions" />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!insights && !loading && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Brain className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ready to Analyze</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            Click "Run AI Agent" to start a multi-step intelligent analysis of your {products.length} products, or use "Quick Analysis" for instant results.
          </p>
        </div>
      )}
    </div>
  );
}
