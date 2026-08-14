import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  Legend, Cell, ComposedChart, Line, AreaChart, Area, PieChart, Pie 
} from 'recharts';
import { 
  Package, AlertTriangle, CheckCircle2, XCircle, TrendingUp, 
  ArrowRight, ShoppingCart, RefreshCw, Filter, Layers, DollarSign, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface BrandStockVisualizationProps {
  onNavigateToPurchases?: () => void;
  compact?: boolean;
}

export const BrandStockVisualization: React.FC<BrandStockVisualizationProps> = ({ 
  onNavigateToPurchases,
  compact = false
}) => {
  const { products, suppliers } = useApp();
  const [filterUrgency, setFilterUrgency] = useState<'ALL' | 'CRITICAL' | 'LOW' | 'HEALTHY'>('ALL');
  const [selectedBrandDetail, setSelectedBrandDetail] = useState<string | null>(null);
  const [chartView, setChartView] = useState<'STOCK_VS_THRESHOLD' | 'HEALTH_BREAKDOWN' | 'VALUATION'>('STOCK_VS_THRESHOLD');

  // Group and compute metrics per brand
  const brandAnalytics = useMemo(() => {
    const map: Record<string, {
      brand: string;
      totalStock: number;
      reorderThreshold: number;
      inStockCount: number;
      lowStockCount: number;
      outOfStockCount: number;
      totalModels: number;
      totalCostValuation: number;
      totalRetailValuation: number;
      suggestedReorderUnits: number;
      urgency: 'CRITICAL' | 'LOW' | 'HEALTHY';
      models: Product[];
      primarySupplier?: string;
    }> = {};

    products.forEach(p => {
      const b = p.brand || 'Other';
      if (!map[b]) {
        map[b] = {
          brand: b,
          totalStock: 0,
          reorderThreshold: 0,
          inStockCount: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
          totalModels: 0,
          totalCostValuation: 0,
          totalRetailValuation: 0,
          suggestedReorderUnits: 0,
          urgency: 'HEALTHY',
          models: [],
          primarySupplier: p.supplierName || 'Primary Distributor'
        };
      }

      const item = map[b];
      item.totalStock += p.stock;
      item.reorderThreshold += (p.reorderLevel || 1);
      item.totalModels += 1;
      item.totalCostValuation += (p.stock * p.purchasePrice);
      item.totalRetailValuation += (p.stock * p.sellingPrice);
      item.models.push(p);

      if (p.stock === 0) {
        item.outOfStockCount += 1;
        // Recommended reorder buffer: at least reorderLevel * 2 or min 3 units
        item.suggestedReorderUnits += Math.max(3, (p.reorderLevel || 2) * 2);
      } else if (p.stock <= (p.reorderLevel || 1)) {
        item.lowStockCount += 1;
        item.suggestedReorderUnits += Math.max(2, (p.reorderLevel || 2) * 2 - p.stock);
      } else {
        item.inStockCount += 1;
      }
    });

    // Compute urgency rating
    Object.values(map).forEach(item => {
      if (item.outOfStockCount > 0 || item.totalStock === 0) {
        item.urgency = 'CRITICAL';
      } else if (item.lowStockCount > 0 || item.totalStock <= item.reorderThreshold) {
        item.urgency = 'LOW';
      } else {
        item.urgency = 'HEALTHY';
      }
    });

    return Object.values(map).sort((a, b) => {
      // Prioritize Critical first, then low stock, then higher reorder urgency
      const score = (urg: string) => urg === 'CRITICAL' ? 3 : urg === 'LOW' ? 2 : 1;
      if (score(b.urgency) !== score(a.urgency)) {
        return score(b.urgency) - score(a.urgency);
      }
      return b.suggestedReorderUnits - a.suggestedReorderUnits;
    });
  }, [products]);

  // Filtered dataset for decision matrix
  const filteredBrands = useMemo(() => {
    if (filterUrgency === 'ALL') return brandAnalytics;
    return brandAnalytics.filter(b => b.urgency === filterUrgency);
  }, [brandAnalytics, filterUrgency]);

  // Overall summary metrics
  const totalReplenishmentUnits = useMemo(() => {
    return brandAnalytics.reduce((acc, b) => acc + b.suggestedReorderUnits, 0);
  }, [brandAnalytics]);

  const criticalBrandCount = useMemo(() => {
    return brandAnalytics.filter(b => b.urgency === 'CRITICAL').length;
  }, [brandAnalytics]);

  const lowBrandCount = useMemo(() => {
    return brandAnalytics.filter(b => b.urgency === 'LOW').length;
  }, [brandAnalytics]);

  // Recharts Chart Data
  const chartData = useMemo(() => {
    return brandAnalytics.map(b => ({
      brand: b.brand,
      currentStock: b.totalStock,
      safeThreshold: b.reorderThreshold,
      suggestedReorder: b.suggestedReorderUnits,
      inStock: b.inStockCount,
      lowStock: b.lowStockCount,
      outOfStock: b.outOfStockCount,
      costValuation: b.totalCostValuation,
      retailValuation: b.totalRetailValuation,
      urgency: b.urgency
    }));
  }, [brandAnalytics]);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0A0A0E] border-2 border-amber-500/50 p-4 rounded-xl shadow-2xl text-xs font-mono space-y-2 z-50 min-w-[220px]">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-serif font-bold text-amber-300 text-sm uppercase">{label}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              data.urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
              data.urgency === 'LOW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {data.urgency === 'CRITICAL' ? 'Critical Action' : data.urgency === 'LOW' ? 'Low Stock' : 'Optimal'}
            </span>
          </div>

          <div className="space-y-1 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-400">Current Warehouse Stock:</span>
              <strong className="text-amber-200 font-bold">{data.currentStock} Units</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Min Safety Reorder Level:</span>
              <strong className="text-zinc-300">{data.safeThreshold} Units</strong>
            </div>
            <div className="flex justify-between border-t border-zinc-800/80 pt-1">
              <span className="text-rose-400 font-bold">Suggested Reorder:</span>
              <strong className="text-rose-300 font-bold">+{data.suggestedReorder} Units</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Stock Valuation (Cost):</span>
              <span className="text-emerald-400 font-bold">NPR {data.costValuation.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900/95 via-[#0C0C10] to-zinc-950 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      
      {/* Header & Reorder Alert Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                REAL-TIME INVENTORY INTELLIGENCE
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100">
                Premium Brand Stock Levels & Replenishment Matrix
              </h3>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Dynamic Recharts inventory tracking across luxury watch collections to inform proactive purchasing and prevent stockouts.
          </p>
        </div>

        {/* Quick Summary Pill Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Critical Reorders</div>
              <div className="text-xs font-bold text-rose-300 font-mono">{criticalBrandCount} Brands Out/Zero</div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Low Stock Warnings</div>
              <div className="text-xs font-bold text-amber-300 font-mono">{lowBrandCount} Brands Near Limit</div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Suggested Intake</div>
              <div className="text-xs font-bold text-emerald-300 font-mono">+{totalReplenishmentUnits} Units Rec.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls & Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => setChartView('STOCK_VS_THRESHOLD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              chartView === 'STOCK_VS_THRESHOLD' 
                ? 'bg-amber-500 text-zinc-950 shadow-md' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Stock vs Safety Reorder Level
          </button>
          <button
            onClick={() => setChartView('HEALTH_BREAKDOWN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              chartView === 'HEALTH_BREAKDOWN' 
                ? 'bg-amber-500 text-zinc-950 shadow-md' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Model Health Breakdown
          </button>
          <button
            onClick={() => setChartView('VALUATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
              chartView === 'VALUATION' 
                ? 'bg-amber-500 text-zinc-950 shadow-md' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Inventory Capital (NPR)
          </button>
        </div>

        {/* Urgency Filter */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Filter:
          </span>
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Brands ({brandAnalytics.length})</option>
            <option value="CRITICAL">🔴 Critical Reorder ({criticalBrandCount})</option>
            <option value="LOW">🟡 Low Stock ({lowBrandCount})</option>
            <option value="HEALTHY">🟢 Optimal Stock ({brandAnalytics.length - criticalBrandCount - lowBrandCount})</option>
          </select>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 relative">
        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'STOCK_VS_THRESHOLD' ? (
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis 
                  dataKey="brand" 
                  stroke="#71717a" 
                  fontSize={11} 
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip content={customTooltip} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Bar 
                  dataKey="currentStock" 
                  name="Current Stock (Units)" 
                  fill="#D4AF37" 
                  radius={[6, 6, 0, 0]}
                  barSize={26}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.urgency === 'CRITICAL' ? '#f43f5e' : 
                        entry.urgency === 'LOW' ? '#f59e0b' : '#10b981'
                      } 
                    />
                  ))}
                </Bar>
                <Line 
                  type="monotone" 
                  dataKey="safeThreshold" 
                  name="Min Safety Level" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#38bdf8' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="suggestedReorder" 
                  name="Suggested Intake" 
                  stroke="#e11d48" 
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#e11d48' }} 
                />
              </ComposedChart>
            ) : chartView === 'HEALTH_BREAKDOWN' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis 
                  dataKey="brand" 
                  stroke="#71717a" 
                  fontSize={11} 
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip content={customTooltip} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Bar dataKey="inStock" name="Healthy Models" stackId="a" fill="#10b981" />
                <Bar dataKey="lowStock" name="Low Stock Models" stackId="a" fill="#f59e0b" />
                <Bar dataKey="outOfStock" name="Out of Stock Models" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorValuation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis 
                  dataKey="brand" 
                  stroke="#71717a" 
                  fontSize={11} 
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(v) => `NPR ${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [`NPR ${Number(value).toLocaleString()}`, name === 'costValuation' ? 'Cost Value' : 'Retail Value']}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#d4af37', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="costValuation" name="Stock Value at Cost" stroke="#d4af37" fillOpacity={1} fill="url(#colorValuation)" />
                <Area type="monotone" dataKey="retailValuation" name="Potential Retail Realization" stroke="#10b981" fillOpacity={0.5} fill="url(#colorRetail)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend color key */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Critical Reorder Needed (0 Stock / Stockouts)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Low Stock Warning (≤ Min Threshold)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Healthy Buffer Level
          </span>
        </div>
      </div>

      {/* Replenishment Action & Procurement Decision Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-amber-200 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Procurement Recommendations & Brand Reorder Priority Matrix</span>
          </h4>
          <span className="text-xs font-mono text-zinc-400">
            Showing {filteredBrands.length} of {brandAnalytics.length} Brands
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBrands.map((b) => (
            <div 
              key={b.brand}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                b.urgency === 'CRITICAL' 
                  ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/70 shadow-lg shadow-rose-950/20' 
                  : b.urgency === 'LOW' 
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/70 shadow-lg shadow-amber-950/20' 
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <div>
                  <h5 className="font-serif font-bold text-base text-zinc-100">{b.brand}</h5>
                  <span className="text-[10px] font-mono text-zinc-400">{b.totalModels} Catalog Watch Models</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  b.urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  b.urgency === 'LOW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {b.urgency === 'CRITICAL' ? '🔴 Critical' : b.urgency === 'LOW' ? '🟡 Low' : '🟢 Healthy'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2.5">
                <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 block">Stock / Safe Min:</span>
                  <span className="font-bold text-amber-200 text-sm">
                    {b.totalStock} <span className="text-zinc-500 text-xs font-normal">/ {b.reorderThreshold} pcs</span>
                  </span>
                </div>

                <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 block">Recommended Order:</span>
                  <span className={`font-bold text-sm ${b.suggestedReorderUnits > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {b.suggestedReorderUnits > 0 ? `+${b.suggestedReorderUnits} Units` : 'Adequate'}
                  </span>
                </div>
              </div>

              {/* Models Breakdown Drawer or Expand */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Stockout Risk:</span>
                  <span className="text-rose-400 font-bold">{b.outOfStockCount} zero-stock items</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Current Valuation (Cost):</span>
                  <span className="text-emerald-400 font-bold">NPR {b.totalCostValuation.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => setSelectedBrandDetail(selectedBrandDetail === b.brand ? null : b.brand)}
                  className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  {selectedBrandDetail === b.brand ? 'Hide Models' : 'View Watch Models'}
                </button>

                {onNavigateToPurchases && b.suggestedReorderUnits > 0 && (
                  <button
                    onClick={onNavigateToPurchases}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-mono text-[10px] uppercase flex items-center gap-1 shadow cursor-pointer transition-transform hover:scale-105"
                  >
                    <span>Book Purchase</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Expanded models list */}
              {selectedBrandDetail === b.brand && (
                <div className="mt-3 p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] font-mono space-y-1.5 animate-fadeIn">
                  <div className="font-bold text-amber-300 pb-1 border-b border-zinc-800 text-[10px] uppercase">
                    {b.brand} Stock Details:
                  </div>
                  {b.models.map(m => (
                    <div key={m.id} className="flex items-center justify-between py-1 border-b border-zinc-900 last:border-0">
                      <span className="text-zinc-300 truncate max-w-[140px]" title={m.model}>
                        {m.model}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-1.5 py-0.2 rounded font-bold ${
                          m.stock === 0 ? 'bg-rose-500/20 text-rose-300' :
                          m.stock <= (m.reorderLevel || 1) ? 'bg-amber-500/20 text-amber-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {m.stock} in stock
                        </span>
                        <span className="text-zinc-500">Min: {m.reorderLevel || 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
