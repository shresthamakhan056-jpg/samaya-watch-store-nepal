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
  Layers,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { FixedAsset } from '../../../types';
import { exportToCSV } from '../../../utils/reportExporter';
import { DeleteVerificationModal } from '../DeleteVerificationModal';

export const FixedAssetsView: React.FC = () => {
  const {
    fixedAssets,
    addFixedAsset,
    updateFixedAsset,
    deleteFixedAsset,
    runAssetDepreciation,
    accounts
  } = useApp();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingAsset, setEditingAsset] = useState<FixedAsset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<FixedAsset | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
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
  const [accumulatedDepreciation, setAccumulatedDepreciation] = useState<string>('0');
  const [accountId, setAccountId] = useState<string>('acc-1510');

  const totalCost = fixedAssets.reduce((s, a) => s + (a.cost || 0), 0);
  const totalAccum = fixedAssets.reduce((s, a) => s + (a.accumulatedDepreciation || 0), 0);
  const totalNBV = fixedAssets.reduce((s, a) => s + (a.netBookValue || a.cost), 0);

  const handleOpenAdd = () => {
    setAssetCode(`AST-${Date.now().toString().slice(-4)}`);
    setAssetName('');
    setCategory('Fixtures & Showroom');
    setCost('');
    setSalvageValue('0');
    setUsefulLifeYears('5');
    setDepreciationRate('20');
    setPurchaseDate(new Date().toISOString().substring(0, 10));
    setAccumulatedDepreciation('0');
    setAccountId('acc-1510');
    setShowAddModal(true);
  };

  const handleOpenEdit = (asset: FixedAsset) => {
    setEditingAsset(asset);
    setAssetCode(asset.code);
    setAssetName(asset.name);
    setCategory(asset.category);
    setCost(String(asset.cost));
    setSalvageValue(String(asset.salvageValue || 0));
    setUsefulLifeYears(String(asset.usefulLifeYears));
    setDepreciationRate(String(asset.depreciationRate));
    setPurchaseDate(asset.purchaseDate);
    setAccumulatedDepreciation(String(asset.accumulatedDepreciation || 0));
    setAccountId(asset.accountId || 'acc-1510');
  };

  const handleOpenDelete = (asset: FixedAsset) => {
    setDeletingAsset(asset);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingAsset) return;
    deleteFixedAsset(deletingAsset.id);
    setNotification(`✓ Permanently deleted Fixed Asset ${deletingAsset.name} [${deletingAsset.code}]`);
    setDeletingAsset(null);
    setIsDeleteModalOpen(false);
    setTimeout(() => setNotification(null), 5000);
  };

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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    const c = parseFloat(cost) || 0;
    const s = parseFloat(salvageValue) || 0;
    const accum = parseFloat(accumulatedDepreciation) || 0;
    const rate = parseFloat(depreciationRate) || 20;
    const nbv = Math.max(0, c - accum);

    updateFixedAsset({
      ...editingAsset,
      code: assetCode.trim(),
      name: assetName.trim(),
      category,
      purchaseDate,
      cost: c,
      salvageValue: s,
      usefulLifeYears: parseInt(usefulLifeYears) || 5,
      depreciationRate: rate,
      accumulatedDepreciation: accum,
      netBookValue: nbv,
      accountId
    });

    setEditingAsset(null);
    setNotification(`✓ Updated Fixed Asset ${assetName.trim()} [${assetCode.trim()}] records successfully.`);
    setTimeout(() => setNotification(null), 5000);
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
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Capitalize Asset</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Historical Cost Basis</span>
          <div className="text-xl font-mono font-bold text-white">NPR {totalCost.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Gross acquisition investment</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Total Accumulated Depreciation</span>
          <div className="text-xl font-mono font-bold text-rose-400">NPR {totalAccum.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Total written off as expense</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Total Net Book Value (NBV)</span>
          <div className="text-xl font-mono font-bold text-emerald-400">NPR {totalNBV.toLocaleString()}</div>
          <p className="text-[10px] text-slate-500">Current Balance Sheet Asset Valuation</p>
        </div>
      </div>

      {/* Assets Register Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Asset Code</th>
                <th className="py-3 px-3">Asset Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Purchase Date</th>
                <th className="py-3 px-3 text-right">Cost Basis (NPR)</th>
                <th className="py-3 px-3 text-right">Depr. Rate</th>
                <th className="py-3 px-3 text-right">Accumulated Depr.</th>
                <th className="py-3 px-3 text-right">Net Book Value</th>
                <th className="py-3 px-4 text-center">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {fixedAssets.map(asset => {
                const canDepreciate = asset.netBookValue > (asset.salvageValue || 0);

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
                      <div className="flex items-center justify-center space-x-1.5">
                        {canDepreciate ? (
                          <button
                            onClick={() => handleRunDepreciation(asset.id, asset.name)}
                            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-semibold transition flex items-center space-x-1 cursor-pointer"
                            title="Post Depreciation Write-off Voucher"
                          >
                            <Play className="w-3 h-3" />
                            <span>Depr.</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic px-2 py-1">Fully Depr.</span>
                        )}
                        <button
                          onClick={() => handleOpenEdit(asset)}
                          className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Edit Fixed Asset Properties"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(asset)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Delete Fixed Asset (3-Times Verified)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
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
                    <option value="Horology & Watchmaking Tools">Horology & Watchmaking Tools</option>
                    <option value="IT Equipment & POS">IT Equipment & POS</option>
                    <option value="Vehicles & Logistics">Vehicles & Logistics</option>
                    <option value="Building & Leasehold">Building & Leasehold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Swiss Diagnostic Timing Machine"
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Purchase Cost (NPR)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Useful Life (Years)</label>
                  <input
                    type="number"
                    value={usefulLifeYears}
                    onChange={e => setUsefulLifeYears(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Depr. Rate (%)</label>
                  <input
                    type="number"
                    value={depreciationRate}
                    onChange={e => setDepreciationRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Salvage Value (NPR)</label>
                  <input
                    type="number"
                    value={salvageValue}
                    onChange={e => setSalvageValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={e => setPurchaseDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Capitalize & Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-amber-400" />
              <span>Modify Fixed Asset Record</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Edit asset valuation, life cycle parameters, and accumulated write-offs</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
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
                    <option value="Horology & Watchmaking Tools">Horology & Watchmaking Tools</option>
                    <option value="IT Equipment & POS">IT Equipment & POS</option>
                    <option value="Vehicles & Logistics">Vehicles & Logistics</option>
                    <option value="Building & Leasehold">Building & Leasehold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Asset Name</label>
                <input
                  type="text"
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Cost Basis (NPR)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Accum. Depr (NPR)</label>
                  <input
                    type="number"
                    value={accumulatedDepreciation}
                    onChange={e => setAccumulatedDepreciation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-rose-400 font-mono focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Depr. Rate (%)</label>
                  <input
                    type="number"
                    value={depreciationRate}
                    onChange={e => setDepreciationRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Useful Life (Years)</label>
                  <input
                    type="number"
                    value={usefulLifeYears}
                    onChange={e => setUsefulLifeYears(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={e => setPurchaseDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Verification Modal (3-Times Verified Timed Security Protocol) */}
      <DeleteVerificationModal
        isOpen={isDeleteModalOpen}
        title="Delete Fixed Asset Record"
        itemType="Fixed Asset"
        itemName={deletingAsset ? `[${deletingAsset.code}] ${deletingAsset.name}` : ''}
        detailsText={deletingAsset ? `Historical Cost: NPR ${deletingAsset.cost.toLocaleString()} • Net Book Value: NPR ${deletingAsset.netBookValue.toLocaleString()}. Deleting will remove this asset from the Balance Sheet register permanently.` : ''}
        requiredTimes={3}
        lockDurationSeconds={3}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingAsset(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
