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
  Sparkles
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { FiscalYear, CostCenter } from '../../../types';

export const FiscalPeriodView: React.FC = () => {
  const {
    fiscalYears,
    costCenters,
    addFiscalYear,
    closeFiscalYear,
    addCostCenter,
    accounts,
    journalEntries,
    currentUser
  } = useApp();

  const [showAddYearModal, setShowAddYearModal] = useState<boolean>(false);
  const [showAddCostCenterModal, setShowAddCostCenterModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Year Form
  const [fyName, setFyName] = useState<string>('FY 2082/83');
  const [fyCode, setFyCode] = useState<string>('2082-83');
  const [startDate, setStartDate] = useState<string>('2025-07-16');
  const [endDate, setEndDate] = useState<string>('2026-07-15');

  // New Cost Center Form
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
      status: 'Open'
    });
    setShowAddYearModal(false);
    setNotification(`✓ Fiscal Year ${fyName} created successfully.`);
    setTimeout(() => setNotification(null), 6000);
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
            onClick={() => setShowAddYearModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Create Fiscal Year</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {fiscalYears.map(fy => (
            <div key={fy.id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{fy.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                    fy.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {fy.status === 'Open' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    <span>{fy.status}</span>
                  </span>
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
                    className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
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
            onClick={() => setShowAddCostCenterModal(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition flex items-center space-x-1.5 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cost Center</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {costCenters.map(cc => (
            <div key={cc.id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800">
              <span className="font-mono text-[10px] text-cyan-400 font-bold px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20">
                {cc.code}
              </span>
              <h4 className="font-bold text-white text-sm mt-2">{cc.name}</h4>
              <p className="text-xs text-slate-400 mt-1">Manager: {cc.manager || 'Unassigned'}</p>
              <div className="mt-3 flex items-center space-x-1 text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Fiscal Year Modal */}
      {showAddYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-slate-100">
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
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Create Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cost Center Modal */}
      {showAddCostCenterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-slate-100">
            <h3 className="text-base font-bold text-white mb-3">Add Cost Center / Department</h3>
            <form onSubmit={handleCreateCostCenter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Cost Center Code</label>
                <input
                  type="text"
                  placeholder="e.g. CC-POKHARA"
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
                  placeholder="e.g. Pokhara Lakeside Boutique"
                  value={ccName}
                  onChange={e => setCcName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Manager / In-charge</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Thapa"
                  value={ccManager}
                  onChange={e => setCcManager(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCostCenterModal(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Save Cost Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
