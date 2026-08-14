import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { FixedAsset } from '../../../types';
import { exportToCSV } from '../../../utils/reportExporter';

export const FixedAssetsView: React.FC = () => {
  const {
    fixedAssets,
    addFixedAsset,
    runAssetDepreciation,
    accounts
  } = useApp();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [assetCode, setAssetCode] = useState<string>(`AST-${Date.now().toString().slice(-4)}`);
  const [assetName, setAssetName] = useState<string>('');
  const [category, setCategory] = useState<string>('Fixtures & Showroom');
  const [cost, setCost] = useState<string>('');
  const [salvageValue, setSalvageValue] = useState<string>('0');
  const [usefulLifeYears, setUsefulLifeYears] = useState<string>('5');
  const [depreciationRate, setDepreciationRate] = useState<string>('20');
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [accountId, setAccountId] = useState<string>('acc-1510');

  const totalCost = fixedAssets.reduce((s, a) => s + (a.cost || 0), 0);
  const totalAccum = fixedAssets.reduce((s, a) => s + (a.accumulatedDepreciation || 0), 0);
  const totalNBV = fixedAssets.reduce((s, a) => s + (a.netBookValue || a.cost), 0);

  const handleRunDepreciation = (assetId: string, name: string) => {
    const res = runAssetDepreciation(assetId);
    if ('error' in res) {
      alert(res.error);
      return;
    }

    setNotification(`✓ Posted Depreciation write-off for ${name} (Voucher #${res.entryNumber})! General Ledger updated.`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = parseFloat(cost) || 0;
    const s = parseFloat(salvageValue) || 0;
    const rate = parseFloat(depreciationRate) || 20;

    addFixedAsset({
      code: assetCode.trim() || `AST-${Date.now().toString().slice(-4)}`,
      name: assetName.trim(),
      category,
      purchaseDate,
      cost: c,
      salvageValue: s,
      usefulLifeYears: parseInt(usefulLifeYears) || 5,
      depreciationRate: rate,
      depreciationMethod: 'Straight Line',
      accumulatedDepreciation: 0,
      netBookValue: c,
      accountId,
      depreciationAccountId: 'acc-5080'
    });

    setShowAddModal(false);
    setNotification(`✓ Registered Fixed Asset ${assetName} (NPR ${c.toLocaleString()}) and posted purchase acquisition voucher.`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleExportCSV = () => {
    const rows = fixedAssets.map(a => ({
      Asset_Code: a.code,
      Asset_Name: a.name,
      Category: a.category,
      Purchase_Date: a.purchaseDate,
      Historical_Cost: a.cost,
      Salvage_Value: a.salvageValue,
      Useful_Life_Years: a.usefulLifeYears,
      Depreciation_Rate: `${a.depreciationRate}%`,
      Accumulated_Depreciation: a.accumulatedDepreciation,
      Net_Book_Value: a.netBookValue
    }));
    exportToCSV(rows, `Fixed_Assets_Register_${new Date().toISOString().substring(0, 10)}`);
  };

  return (
    <div id="fixed-assets-view" className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Fixed Assets & Capital Equipment Register</span>
          </h2>
          <p className="text-xs text-slate-400">Track capital assets, historical cost basis, accumulated depreciation, and Net Book Value (NBV)</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Register</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Fixed Asset</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-semibold">Total Capitalized Asset Cost</span>
          <p className="text-2xl font-bold font-mono text-white mt-1">NPR {totalCost.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">{fixedAssets.length} registered items</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-semibold">Accumulated Depreciation</span>
          <p className="text-2xl font-bold font-mono text-rose-400 mt-1">NPR {totalAccum.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Contra-Asset written off</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-semibold">Net Book Value (NBV) on Balance Sheet</span>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">NPR {totalNBV.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500">Current carrying capacity</span>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold w-28">Asset Code</th>
                <th className="py-3 px-3 font-semibold">Asset Description</th>
                <th className="py-3 px-3 font-semibold w-36">Category</th>
                <th className="py-3 px-3 font-semibold w-24">Acquired</th>
                <th className="py-3 px-3 font-semibold w-32 text-right">Cost (NPR)</th>
                <th className="py-3 px-3 font-semibold w-28 text-right">Depr. Rate</th>
                <th className="py-3 px-3 font-semibold w-32 text-right">Accum. Depr.</th>
                <th className="py-3 px-3 font-semibold w-32 text-right">Net Book Value</th>
                <th className="py-3 px-4 font-semibold w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {fixedAssets.map(asset => {
                const canDepreciate = asset.netBookValue > asset.salvageValue;

                return (
                  <tr key={asset.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{asset.code}</td>
                    <td className="py-3 px-3 font-medium text-white">{asset.name}</td>
                    <td className="py-3 px-3 text-slate-300">{asset.category}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{asset.purchaseDate}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-right text-white">
                      NPR {asset.cost.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-400">
                      {asset.depreciationRate}% / yr
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-rose-400">
                      NPR {asset.accumulatedDepreciation.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-right text-emerald-400">
                      NPR {asset.netBookValue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {canDepreciate ? (
                        <button
                          onClick={() => handleRunDepreciation(asset.id, asset.name)}
                          className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition flex items-center space-x-1 mx-auto"
                        >
                          <Play className="w-3 h-3" />
                          <span>Run Depr.</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Fully Depreciated</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {fixedAssets.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No fixed assets registered in system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-slate-100">
            <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Capitalize Fixed Asset</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Add asset to balance sheet register with automatic double-entry acquisition voucher</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Asset Code</label>
                  <input
                    type="text"
                    value={assetCode}
                    onChange={e => setAssetCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Fixtures & Showroom">Fixtures & Showroom</option>
                    <option value="Watchmaking Diagnostic Tools">Watchmaking Diagnostic Tools</option>
                    <option value="IT Equipment & POS">IT Equipment & POS</option>
                    <option value="Vehicles & Logistics">Vehicles & Logistics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Swiss Watch Timing Diagnostic Machine"
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Historical Cost (NPR)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Salvage Value (NPR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={salvageValue}
                    onChange={e => setSalvageValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Useful Life (Years)</label>
                  <input
                    type="number"
                    value={usefulLifeYears}
                    onChange={e => {
                      setUsefulLifeYears(e.target.value);
                      const yr = parseInt(e.target.value) || 5;
                      setDepreciationRate(String(Math.round(100 / yr)));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Annual Depr. Rate (%)</label>
                  <input
                    type="number"
                    value={depreciationRate}
                    onChange={e => setDepreciationRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
                >
                  Capitalize Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
