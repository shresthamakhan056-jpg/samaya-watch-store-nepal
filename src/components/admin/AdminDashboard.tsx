import React, { useState } from 'react';
import { DollarSign, ShoppingBag, ShieldCheck, AlertTriangle, TrendingUp, Users, Watch, Clock, FileText, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { DeleteVerificationModal } from './DeleteVerificationModal';

export const AdminDashboard: React.FC = () => {
  const { sales, products, warranties, customers, auditLogs, resetToDefaultData, currentUser } = useApp();

  const [purgeSuccessMsg, setPurgeSuccessMsg] = useState('');
  const [showPurgeModal, setShowPurgeModal] = useState(false);

  const handlePurgeDummyData = () => {
    resetToDefaultData();
    setPurgeSuccessMsg('System reset to clean default state.');
    setTimeout(() => setPurgeSuccessMsg(''), 3000);
  };

  // Metrics calculations
  const totalRevenue = sales.reduce((sum, s) => sum + s.finalTotal, 0);
  const totalSalesCount = sales.length;
  const activeWarranties = warranties.filter(w => w.status === 'Active').length;
  const lowStockProducts = products.filter(p => p.stock <= p.reorderLevel);

  // Sales by Brand chart data
  const brandSalesMap: Record<string, number> = {};
  sales.forEach(s => {
    brandSalesMap[s.productBrand] = (brandSalesMap[s.productBrand] || 0) + s.finalTotal;
  });
  const brandChartData = Object.keys(brandSalesMap).map(b => ({
    name: b,
    revenue: brandSalesMap[b]
  }));

  // Order Sources pie chart
  const sourceMap: Record<string, number> = {};
  sales.forEach(s => {
    sourceMap[s.orderSource] = (sourceMap[s.orderSource] || 0) + 1;
  });
  const sourceChartData = Object.keys(sourceMap).map(s => ({
    name: s,
    value: sourceMap[s]
  }));

  const COLORS = ['#D4AF37', '#E5C158', '#9B7B12', '#F3E5AB', '#B8860B'];

  return (
    <div className="space-y-8 text-white">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            ERP Control Center Overview
          </h2>
          <p className="text-xs text-zinc-400">
            Live metrics synchronized with single-source-of-truth Sales, Inventory & Double-Entry Accounting.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'Super Admin' && (
            <button
              onClick={() => setShowPurgeModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Purge all dummy sample data for clean live deployment (Super Admin Only)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Dummy Data</span>
            </button>
          )}
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">System Time:</span>
          <span className="text-xs font-mono font-bold text-amber-300 bg-black px-3 py-1.5 rounded-xl border border-amber-500/30">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">Total Sales Revenue</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-amber-200">
            NPR {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Across {totalSalesCount} Completed Orders
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">Active Digital Warranties</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-emerald-300">
            {activeWarranties} Valid Cards
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            100% Linked to Mobile & Serial Nos
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">Total Unique Customers</span>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-zinc-100">
            {customers.length} Clients
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Tagged with TikTok / IG / FB handles
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">Stock Reorder Alerts</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-amber-300">
            {lowStockProducts.length} Items
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Stock at or below reorder threshold
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales by Brand */}
        <div className="lg:col-span-2 bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200">
            Sales Revenue by Luxury Watch Brand (NPR)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#d4af37', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`NPR ${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Channel Breakdown */}
        <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4 flex flex-col justify-between">
          <h3 className="font-serif text-lg font-bold text-amber-200">
            Order Channels Breakdown
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#d4af37', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-zinc-400 text-center font-mono border-t border-zinc-800 pt-3">
            Primary Social Order Sources: TikTok & Instagram
          </div>
        </div>

      </div>

      {/* Recent Activity Logs */}
      <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-serif text-lg font-bold text-amber-200">
            Recent System Audit Logs & Activity
          </h3>
          <span className="text-xs text-amber-400 font-mono">Real-time ERP Audit Trail</span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-amber-300">{log.action}</span>
                <p className="text-zinc-300">{log.details}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-zinc-400 block">{log.timestamp}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {log.userName} ({log.userRole})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-STEP DELETE VERIFICATION MODAL (SUPER ADMIN ONLY) */}
      <DeleteVerificationModal
        isOpen={showPurgeModal}
        title="Purge System Sample Data"
        itemName="All Dummy Sample Orders, Sales & Temporary Items"
        detailsText="This operation will purge all temporary sample records and reset the database to a clean live state."
        onClose={() => setShowPurgeModal(false)}
        onConfirm={() => {
          handlePurgeDummyData();
          setShowPurgeModal(false);
        }}
      />
    </div>
  );
};
