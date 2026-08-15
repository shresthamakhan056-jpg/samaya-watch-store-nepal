import React, { useState } from 'react';
import {
  Calendar,
  Lock,
  Unlock,
  Building,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { FiscalYear, CostCenter } from '../../../types';
import { DeleteVerificationModal } from '../DeleteVerificationModal';

export const FiscalPeriodView: React.FC = () => {
  const {
    fiscalYears,
    costCenters,
    addFiscalYear,
    updateFiscalYear,
    deleteFiscalYear,
    closeFiscalYear,
    addCostCenter,
    updateCostCenter,
    deleteCostCenter,
    accounts,
    journalEntries,
    currentUser
  } = useApp();

  const [showAddYearModal, setShowAddYearModal] = useState<boolean>(false);
  const [editingYear, setEditingYear] = useState<FiscalYear | null>(null);
  const [deletingYear, setDeletingYear] = useState<FiscalYear | null>(null);

  const [showAddCostCenterModal, setShowAddCostCenterModal] = useState<boolean>(false);
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | null>(null);
  const [deletingCostCenter, setDeletingCostCenter] = useState<CostCenter | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    title: string;
    itemName: string;
    itemType: string;
    detailsText: string;
    onConfirm: () => void;
  } | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  // New Year Form State
  const [fyName, setFyName] = useState<string>('FY 2082/83');
  const [fyCode, setFyCode] = useState<string>('2082-83');
  const [startDate, setStartDate] = useState<string>('2025-07-16');
  const [endDate, setEndDate] = useState<string>('2026-07-15');
  const [fyStatus, setFyStatus] = useState<FiscalYear['status']>('Open');

  // New Cost Center Form State
  const [ccCode, setCcCode] = useState<string>('CC-');
  const [ccName, setCcName] = useState<string>('');
  const [ccManager, setCcManager] = useState<string>('');

  const handleCloseYear = (fyId: string, name: string) => {
    if (!confirm(`Are you sure you want to perform Year-End Closing for ${name}? This will generate a closing journal entry transferring all Net Revenue & Expense balances into Retained Earnings and lock the period.`)) {
      return;
    }

    const res = closeFiscalYear(fyId);
    if ('error' in res) {
      alert(res.error);
      return;
    }

    setNotification(`✓ Completed Year-End Closing for ${name}! Generated Closing Voucher #${res.entryNumber} into Retained Earnings.`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    addFiscalYear({
      code: fyCode.trim(),
      name: fyName.trim(),
      startDate,
      endDate,
      status: fyStatus
    });
    setShowAddYearModal(false);
    setNotification(`✓ Fiscal Year ${fyName} created successfully.`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleOpenEditYear = (fy: FiscalYear) => {
    setEditingYear(fy);
    setFyName(fy.name);
    setFyCode(fy.code);
    setStartDate(fy.startDate);
    setEndDate(fy.endDate);
    setFyStatus(fy.status);
  };

  const handleUpdateYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingYear) return;
    updateFiscalYear({
      ...editingYear,
      name: fyName.trim(),
      code: fyCode.trim(),
      startDate,
      endDate,
      status: fyStatus
    });
    setEditingYear(null);
    setNotification(`✓ Fiscal Year ${fyName} modified successfully.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenDeleteYear = (fy: FiscalYear) => {
    setDeletingYear(fy);
    setDeleteModalConfig({
      title: 'Delete Fiscal Year Period',
      itemName: `${fy.name} (${fy.code})`,
      itemType: 'Fiscal Period',
      detailsText: `Dates: ${fy.startDate} to ${fy.endDate} • Status: ${fy.status}. Deleting this accounting period will remove the fiscal calendar entry.`,
      onConfirm: () => {
        deleteFiscalYear(fy.id);
        setNotification(`✓ Deleted Fiscal Period ${fy.name}`);
        setDeletingYear(null);
        setIsDeleteModalOpen(false);
        setTimeout(() => setNotification(null), 5000);
      }
    });
    setIsDeleteModalOpen(true);
  };

  const handleCreateCostCenter = (e: React.FormEvent) => {
    e.preventDefault();
    addCostCenter({
      code: ccCode.trim(),
      name: ccName.trim(),
      manager: ccManager.trim() || undefined,
      isActive: true
    });
    setShowAddCostCenterModal(false);
    setNotification(`✓ Cost Center ${ccName} created.`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleOpenEditCostCenter = (cc: CostCenter) => {
    setEditingCostCenter(cc);
    setCcCode(cc.code);
    setCcName(cc.name);
    setCcManager(cc.manager || '');
  };

  const handleUpdateCostCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCostCenter) return;
    updateCostCenter({
      ...editingCostCenter,
      code: ccCode.trim(),
      name: ccName.trim(),
      manager: ccManager.trim() || undefined
    });
    setEditingCostCenter(null);
    setNotification(`✓ Cost Center ${ccName.trim()} modified successfully.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenDeleteCostCenter = (cc: CostCenter) => {
    setDeletingCostCenter(cc);
    setDeleteModalConfig({
      title: 'Delete Cost Center / Branch',
      itemName: `[${cc.code}] ${cc.name}`,
      itemType: 'Cost Center',
      detailsText: `Manager: ${cc.manager || 'Unassigned'}. Deleting will remove this branch dimension from voucher allocation.`,
      onConfirm: () => {
        deleteCostCenter(cc.id);
        setNotification(`✓ Deleted Cost Center ${cc.name}`);
        setDeletingCostCenter(null);
        setIsDeleteModalOpen(false);
        setTimeout(() => setNotification(null), 5000);
      }
    });
    setIsDeleteModalOpen(true);
  };

  return (
    <div id="fiscal-period-view" className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Fiscal Years Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Fiscal Years & Accounting Periods (Bikram Sambat / Gregorian)</span>
            </h2>
            <p className="text-xs text-slate-400">Manage annual accounting cycles, period locks, and automatic year-end P&L closing</p>
          </div>

          <button
            onClick={() => {
              setFyName('FY 2082/83');
              setFyCode('2082-83');
              setStartDate('2025-07-16');
              setEndDate('2026-07-15');
              setFyStatus('Open');
              setShowAddYearModal(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-1.5 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Fiscal Year</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {fiscalYears.map(fy => (
            <div key={fy.id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{fy.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                      fy.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {fy.status === 'Open' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{fy.status}</span>
                    </span>
                    <button
                      onClick={() => handleOpenEditYear(fy)}
                      className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition cursor-pointer"
                      title="Edit Fiscal Year Period"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteYear(fy)}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition cursor-pointer"
                      title="Delete Fiscal Year Period (3-Times Verified)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-400 space-y-1">
                  <p><strong>Period:</strong> {fy.startDate} to {fy.endDate}</p>
                  <p><strong>Code:</strong> <span className="font-mono text-slate-300">{fy.code}</span></p>
                  {fy.lockDate && <p><strong>Locked on:</strong> {fy.lockDate}</p>}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {fy.status === 'Open' ? 'Transactions can be posted' : 'Period sealed against edits'}
                </span>
                {fy.status === 'Open' && (
                  <button
                    onClick={() => handleCloseYear(fy.id, fy.name)}
                    className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Year-End Closing</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Centers & Branches */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Building className="w-5 h-5 text-cyan-400" />
              <span>Cost Centers, Showroom Branches & Business Units</span>
            </h2>
            <p className="text-xs text-slate-400">Segment revenues, overheads, and journal vouchers by departmental cost centers</p>
          </div>

          <button
            onClick={() => {
              setCcCode(`CC-${Date.now().toString().slice(-3)}`);
              setCcName('');
              setCcManager('');
              setShowAddCostCenterModal(true);
            }}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition flex items-center space-x-1.5 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cost Center</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {costCenters.map(cc => (
            <div key={cc.id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20">
                    {cc.code}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditCostCenter(cc)}
                      className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition cursor-pointer"
                      title="Edit Cost Center"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteCostCenter(cc)}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition cursor-pointer"
                      title="Delete Cost Center (3-Times Verified)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-white text-sm mt-2">{cc.name}</h4>
                <p className="text-xs text-slate-400 mt-1">Manager: {cc.manager || 'Unassigned'}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center space-x-1 text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>Active Operating Unit</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Fiscal Year Modal */}
      {showAddYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white mb-3">Create Accounting Fiscal Year</h3>
            <form onSubmit={handleCreateYear} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Fiscal Year Label</label>
                <input
                  type="text"
                  value={fyName}
                  onChange={e => setFyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Code</label>
                <input
                  type="text"
                  value={fyCode}
                  onChange={e => setFyCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddYearModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Create Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fiscal Year Modal */}
      {editingYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-amber-400" />
              <span>Modify Fiscal Period</span>
            </h3>
            <form onSubmit={handleUpdateYear} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Fiscal Year Label</label>
                <input
                  type="text"
                  value={fyName}
                  onChange={e => setFyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Code</label>
                  <input
                    type="text"
                    value={fyCode}
                    onChange={e => setFyCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                  <select
                    value={fyStatus}
                    onChange={e => setFyStatus(e.target.value as 'Open' | 'Closed')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Open">Open (Active)</option>
                    <option value="Closed">Closed (Sealed)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingYear(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cost Center Modal */}
      {showAddCostCenterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white mb-3">Add Department Cost Center</h3>
            <form onSubmit={handleCreateCostCenter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Code</label>
                <input
                  type="text"
                  value={ccCode}
                  onChange={e => setCcCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Branch / Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kathmandu Showroom"
                  value={ccName}
                  onChange={e => setCcName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Manager In-Charge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Shrestha"
                  value={ccManager}
                  onChange={e => setCcManager(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCostCenterModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Create Cost Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Cost Center Modal */}
      {editingCostCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-cyan-400" />
              <span>Modify Cost Center</span>
            </h3>
            <form onSubmit={handleUpdateCostCenter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Code</label>
                <input
                  type="text"
                  value={ccCode}
                  onChange={e => setCcCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Branch / Department Name</label>
                <input
                  type="text"
                  value={ccName}
                  onChange={e => setCcName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Manager In-Charge (Optional)</label>
                <input
                  type="text"
                  value={ccManager}
                  onChange={e => setCcManager(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCostCenter(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Verification Modal (3-Times Verified Timed Security Protocol) */}
      {deleteModalConfig && (
        <DeleteVerificationModal
          isOpen={isDeleteModalOpen}
          title={deleteModalConfig.title}
          itemName={deleteModalConfig.itemName}
          itemType={deleteModalConfig.itemType}
          detailsText={deleteModalConfig.detailsText}
          requiredTimes={3}
          lockDurationSeconds={3}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteModalConfig(null);
          }}
          onConfirm={deleteModalConfig.onConfirm}
        />
      )}
    </div>
  );
};
