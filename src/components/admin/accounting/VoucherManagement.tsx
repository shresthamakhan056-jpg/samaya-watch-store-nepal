import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  RotateCcw,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { JournalEntry, VoucherType } from '../../../types';
import { exportJournalEntriesReportPDF, exportVoucherReceiptPDF, exportToCSV } from '../../../utils/reportExporter';
import { UniversalVoucherModal } from './UniversalVoucherModal';
import { DeleteVerificationModal } from '../DeleteVerificationModal';

interface VoucherManagementProps {
  onOpenNewVoucher: (type?: VoucherType) => void;
}

export const VoucherManagement: React.FC<VoucherManagementProps> = ({ onOpenNewVoucher }) => {
  const {
    journalEntries,
    reverseJournalEntry,
    deleteJournalEntry,
    currentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showReversalModal, setShowReversalModal] = useState<boolean>(false);
  const [reversalTarget, setReversalTarget] = useState<JournalEntry | null>(null);
  const [reversalReason, setReversalReason] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Edit State
  const [editingVoucher, setEditingVoucher] = useState<JournalEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Delete State (Multi-step verification with timed delay)
  const [deletingVoucher, setDeletingVoucher] = useState<JournalEntry | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Filter entries
  const filteredEntries = journalEntries.filter(entry => {
    if (selectedType !== 'ALL' && (entry.voucherType || 'Journal Voucher') !== selectedType) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      entry.entryNumber.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      (entry.reference && entry.reference.toLowerCase().includes(q)) ||
      (entry.createdBy && entry.createdBy.toLowerCase().includes(q)) ||
      entry.lines.some(l => l.accountCode.includes(q) || l.accountName.toLowerCase().includes(q))
    );
  });

  const handlePrintVoucher = (entry: JournalEntry) => {
    exportVoucherReceiptPDF(entry);
  };

  const handleOpenEdit = (entry: JournalEntry) => {
    setEditingVoucher(entry);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (entry: JournalEntry) => {
    setDeletingVoucher(entry);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingVoucher) return;
    const res = deleteJournalEntry(deletingVoucher.id);
    if (res.error) {
      alert(res.error);
      return;
    }
    setNotification(`✓ Permanently deleted Voucher #${deletingVoucher.entryNumber} and balanced ledger accounts.`);
    setDeletingVoucher(null);
    setIsDeleteModalOpen(false);
    if (selectedEntry?.id === deletingVoucher.id) {
      setSelectedEntry(null);
    }
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenReversal = (entry: JournalEntry) => {
    setReversalTarget(entry);
    setReversalReason(`Correction / Cancellation of #${entry.entryNumber}`);
    setShowReversalModal(true);
  };

  const handleConfirmReversal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalTarget) return;

    const res = reverseJournalEntry(reversalTarget.id, reversalReason);
    if ('error' in res) {
      alert(res.error);
      return;
    }

    setShowReversalModal(false);
    setReversalTarget(null);
    setNotification(`✓ Successfully reversed #${reversalTarget.entryNumber} with Reversal Voucher #${res.entryNumber}`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleExportAllPDF = () => {
    exportJournalEntriesReportPDF(filteredEntries);
  };

  const handleExportAllCSV = () => {
    const rows: any[] = [];
    filteredEntries.forEach(je => {
      je.lines.forEach(line => {
        rows.push({
          Entry_Number: je.entryNumber,
          Date: je.date,
          Voucher_Type: je.voucherType || 'Journal Voucher',
          Description: je.description,
          Reference: je.reference || '',
          Account_Code: line.accountCode,
          Account_Name: line.accountName,
          Debit: line.debit,
          Credit: line.credit,
          Particulars: line.particulars || '',
          Created_By: je.createdBy || ''
        });
      });
    });
    exportToCSV(rows, `Vouchers_${new Date().toISOString().substring(0, 10)}`);
  };

  return (
    <div id="voucher-management" className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header & Quick Creation Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Double-Entry Vouchers & Financial Transactions</span>
          </h2>
          <p className="text-xs text-slate-400">Manage, edit, modify, and delete transactions with multi-step verification</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenNewVoucher('Customer Receipt')}
            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            + Receipt
          </button>
          <button
            onClick={() => onOpenNewVoucher('Supplier Payment')}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            + Payment
          </button>
          <button
            onClick={() => onOpenNewVoucher('Expense Voucher')}
            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            + Expense
          </button>
          <button
            onClick={() => onOpenNewVoucher('Contra / Transfer')}
            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            + Contra
          </button>
          <button
            onClick={() => onOpenNewVoucher('Journal Voucher')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Voucher</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search voucher #, account, remarks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Voucher Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Voucher Types ({journalEntries.length})</option>
              <option value="Journal Voucher">Journal Voucher (JV)</option>
              <option value="Customer Receipt">Customer Receipt (CR)</option>
              <option value="Supplier Payment">Supplier Payment (PV)</option>
              <option value="Expense Voucher">Expense Voucher (EV)</option>
              <option value="Contra / Transfer">Contra / Transfer (CV)</option>
              <option value="Sales Return">Sales Return (SR)</option>
              <option value="Purchase Return">Purchase Return (PR)</option>
              <option value="Asset Depreciation">Asset Depreciation</option>
              <option value="Year-End Closing">Year-End Closing</option>
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <button
            onClick={handleExportAllCSV}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportAllPDF}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            title="Export PDF Report"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>PDF Register</span>
          </button>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-3">Posting Date</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Description & Account Breakdown</th>
                <th className="py-3 px-3">Reference</th>
                <th className="py-3 px-3 text-right">Debit (NPR)</th>
                <th className="py-3 px-3 text-right">Credit (NPR)</th>
                <th className="py-3 px-4 text-center">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEntries.map(entry => {
                const totalDebit = entry.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
                const totalCredit = entry.lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);

                return (
                  <tr key={entry.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      <div className="flex items-center space-x-1.5">
                        <span>{entry.entryNumber}</span>
                        {entry.isReversed && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            REVERSED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{entry.date}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {entry.voucherType || 'Journal Voucher'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white">
                      <div className="font-medium">{entry.description}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {entry.lines.length} lines: {entry.lines.map(l => `[${l.accountCode}]`).join(' / ')}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">{entry.reference || '—'}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-400">
                      NPR {totalDebit.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-rose-400">
                      NPR {totalCredit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Drill down into voucher breakdown"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(entry)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Edit & Modify Voucher Lines"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrintVoucher(entry)}
                          className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Download Printable Voucher Receipt PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {!entry.isReversed && (
                          <button
                            onClick={() => handleOpenReversal(entry)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition cursor-pointer"
                            title="Reverse Voucher (Audit Correction)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDelete(entry)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Verify & Delete Voucher (3-Step Timed Protocol)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Detail Drill-Down Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  {selectedEntry.entryNumber} — {selectedEntry.voucherType || 'Journal Voucher'}
                </h3>
                <p className="text-xs text-slate-400">Posting Date: {selectedEntry.date} • Created By: {selectedEntry.createdBy || 'System'}</p>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                <p><strong className="text-slate-400">Description:</strong> <span className="text-white">{selectedEntry.description}</span></p>
                {selectedEntry.reference && (
                  <p><strong className="text-slate-400">Reference:</strong> <span className="text-amber-400 font-mono">{selectedEntry.reference}</span></p>
                )}
                {selectedEntry.costCenterName && (
                  <p><strong className="text-slate-400">Cost Center:</strong> <span className="text-slate-200">{selectedEntry.costCenterName}</span></p>
                )}
              </div>

              {/* Lines Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                      <th className="py-2.5 px-3">Account Head</th>
                      <th className="py-2.5 px-3">Particulars</th>
                      <th className="py-2.5 px-3 text-right">Debit (NPR)</th>
                      <th className="py-2.5 px-3 text-right">Credit (NPR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedEntry.lines.map((l, i) => (
                      <tr key={i} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-amber-400 font-semibold">[{l.accountCode}]</span> {l.accountName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{l.particulars || '—'}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-400">
                          {l.debit > 0 ? `NPR ${l.debit.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-400">
                          {l.credit > 0 ? `NPR ${l.credit.toLocaleString()}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-950 font-bold text-slate-200 border-t border-slate-800">
                      <td colSpan={2} className="py-2.5 px-3 text-right uppercase text-xs">Equilibrium Totals:</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400">
                        NPR {selectedEntry.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-400">
                        NPR {selectedEntry.lines.reduce((s, l) => s + (Number(l.credit) || 0), 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePrintVoucher(selectedEntry)}
                  className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Download Voucher PDF</span>
                </button>
                <button
                  onClick={() => {
                    const entryToEdit = selectedEntry;
                    setSelectedEntry(null);
                    handleOpenEdit(entryToEdit);
                  }}
                  className="flex items-center space-x-2 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Modify Voucher</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const entryToDelete = selectedEntry;
                    setSelectedEntry(null);
                    handleOpenDelete(entryToDelete);
                  }}
                  className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Voucher</span>
                </button>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reversal Confirmation Modal */}
      {showReversalModal && reversalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-slate-100">
            <div className="flex items-center space-x-3 text-rose-400 mb-4">
              <div className="p-2.5 bg-rose-500/10 rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Reverse Accounting Voucher</h3>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              You are creating an inverted reversal entry for <strong className="text-amber-400">#{reversalTarget.entryNumber}</strong> ({reversalTarget.description}). This will automatically balance out ledger accounts.
            </p>

            <form onSubmit={handleConfirmReversal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Reversal Audit Reason</label>
                <input
                  type="text"
                  value={reversalReason}
                  onChange={e => setReversalReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReversalModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/20 cursor-pointer"
                >
                  Confirm Reversal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Voucher Edit Modal */}
      {isEditModalOpen && editingVoucher && (
        <UniversalVoucherModal
          isOpen={isEditModalOpen}
          editingEntry={editingVoucher}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingVoucher(null);
          }}
          onVoucherPosted={(num) => {
            setNotification(`✓ Successfully updated Voucher #${num}`);
            setTimeout(() => setNotification(null), 5000);
          }}
        />
      )}

      {/* Delete Verification Modal (Verified 3 times with timed lock countdown) */}
      <DeleteVerificationModal
        isOpen={isDeleteModalOpen}
        title="Delete Accounting Voucher"
        itemType="Journal Entry / Voucher"
        itemName={deletingVoucher ? `${deletingVoucher.entryNumber} — ${deletingVoucher.description}` : ''}
        detailsText={deletingVoucher ? `Total Amount: NPR ${deletingVoucher.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0).toLocaleString()} across ${deletingVoucher.lines.length} ledger lines. Deleting will reverse the account balance impact immediately.` : ''}
        requiredTimes={3}
        lockDurationSeconds={3}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingVoucher(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
