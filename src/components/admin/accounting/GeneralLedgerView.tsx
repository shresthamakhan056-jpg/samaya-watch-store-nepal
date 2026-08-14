import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Filter,
  Search,
  Download,
  Printer,
  FileSpreadsheet,
  ArrowUpDown,
  Calendar,
  Building2,
  Users,
  ChevronRight,
  Eye,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AccountingEngine } from '../../../utils/accountingEngine';
import { exportGeneralLedgerPDF, exportToCSV } from '../../../utils/reportExporter';

export const GeneralLedgerView: React.FC = () => {
  const {
    journalEntries,
    accounts,
    customers,
    suppliers
  } = useApp();

  const [subView, setSubView] = useState<'general' | 'customers' | 'suppliers' | 'cashbank'>('general');
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. General Ledger Data
  const ledgerAccounts = useMemo(() => {
    const computed = AccountingEngine.computeGeneralLedger(journalEntries, accounts, {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      accountCode: selectedAccountCode === 'ALL' ? undefined : selectedAccountCode
    });

    if (!searchQuery.trim()) return computed;

    const q = searchQuery.toLowerCase();
    return computed.filter(acc =>
      acc.accountCode.toLowerCase().includes(q) ||
      acc.accountName.toLowerCase().includes(q) ||
      acc.transactions.some(t => t.description.toLowerCase().includes(q) || t.entryNumber.toLowerCase().includes(q))
    );
  }, [journalEntries, accounts, startDate, endDate, selectedAccountCode, searchQuery]);

  // 2. Customer Sub-Ledger Data
  const customerSubLedger = useMemo(() => {
    return AccountingEngine.computeCustomerSubLedger(journalEntries, customers);
  }, [journalEntries, customers]);

  // 3. Supplier Sub-Ledger Data
  const supplierSubLedger = useMemo(() => {
    return AccountingEngine.computeSupplierSubLedger(journalEntries, suppliers);
  }, [journalEntries, suppliers]);

  // Export General Ledger PDF
  const handleExportPDF = () => {
    exportGeneralLedgerPDF(ledgerAccounts);
  };

  // Export General Ledger CSV
  const handleExportCSV = () => {
    const rows: any[] = [];
    ledgerAccounts.forEach(acc => {
      acc.transactions.forEach(t => {
        rows.push({
          Account_Code: acc.accountCode,
          Account_Name: acc.accountName,
          Date: t.date,
          Entry_Number: t.entryNumber,
          Description: t.description,
          Reference: t.reference || '',
          Debit: t.debit,
          Credit: t.credit,
          Running_Balance: t.runningBalance
        });
      });
    });
    exportToCSV(rows, `General_Ledger_${new Date().toISOString().substring(0, 10)}`);
  };

  return (
    <div id="general-ledger-view" className="space-y-6">
      {/* Sub-view Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubView('general')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              subView === 'general'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Master General Ledger</span>
          </button>

          <button
            onClick={() => setSubView('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              subView === 'customers'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Debtors Sub-Ledger (Customers)</span>
          </button>

          <button
            onClick={() => setSubView('suppliers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              subView === 'suppliers'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Creditors Sub-Ledger (Suppliers)</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR FOR GENERAL LEDGER */}
      {subView === 'general' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter by Account</label>
            <select
              value={selectedAccountCode}
              onChange={e => setSelectedAccountCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">-- All Accounts ({accounts.length}) --</option>
              {accounts.map(a => (
                <option key={a.id} value={a.code}>[{a.code}] {a.name} ({a.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Search Narration / Voucher</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      )}

      {/* MASTER GENERAL LEDGER VIEW */}
      {subView === 'general' && (
        <div className="space-y-6">
          {ledgerAccounts.map(acc => (
            <div key={acc.accountId} className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              {/* Account Header */}
              <div className="flex flex-wrap items-center justify-between p-4 bg-slate-950/70 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
                    {acc.accountCode}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{acc.accountName}</h3>
                    <p className="text-xs text-slate-400">{acc.category} • {acc.group || acc.category}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs">
                  <div className="text-right">
                    <span className="text-slate-400">Opening Balance:</span>
                    <span className="ml-2 font-mono font-semibold text-slate-200">
                      NPR {acc.openingBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Total Debit:</span>
                    <span className="ml-2 font-mono font-semibold text-emerald-400">
                      NPR {acc.totalDebit.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Total Credit:</span>
                    <span className="ml-2 font-mono font-semibold text-rose-400">
                      NPR {acc.totalCredit.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right pl-4 border-l border-slate-800">
                    <span className="text-slate-400">Closing Balance:</span>
                    <span className={`ml-2 font-mono font-bold text-sm ${acc.closingBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      NPR {acc.closingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-4 font-semibold w-24">Date</th>
                      <th className="py-2.5 px-3 font-semibold w-36">Voucher #</th>
                      <th className="py-2.5 px-3 font-semibold">Narration / Particulars</th>
                      <th className="py-2.5 px-3 font-semibold w-28">Reference</th>
                      <th className="py-2.5 px-3 font-semibold w-32 text-right">Debit (NPR)</th>
                      <th className="py-2.5 px-3 font-semibold w-32 text-right">Credit (NPR)</th>
                      <th className="py-2.5 px-4 font-semibold w-36 text-right">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {/* Opening balance row if > 0 */}
                    {acc.openingBalance !== 0 && (
                      <tr className="bg-slate-950/30 text-slate-400 italic">
                        <td className="py-2.5 px-4 font-mono">—</td>
                        <td className="py-2.5 px-3 font-mono">OPENING</td>
                        <td className="py-2.5 px-3">Opening Ledger Balance Brought Forward</td>
                        <td className="py-2.5 px-3 font-mono">—</td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {acc.openingBalance > 0 ? `NPR ${acc.openingBalance.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {acc.openingBalance < 0 ? `NPR ${Math.abs(acc.openingBalance).toLocaleString()}` : '—'}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-300">
                          NPR {acc.openingBalance.toLocaleString()}
                        </td>
                      </tr>
                    )}

                    {acc.transactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-2.5 px-4 font-mono text-slate-300">{tx.date}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{tx.entryNumber}</td>
                        <td className="py-2.5 px-3 text-white">
                          <div>{tx.description}</div>
                          {tx.particulars && tx.particulars !== tx.description && (
                            <div className="text-[10px] text-slate-400">{tx.particulars}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{tx.reference || '—'}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-400">
                          {tx.debit > 0 ? `NPR ${tx.debit.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-400">
                          {tx.credit > 0 ? `NPR ${tx.credit.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-200">
                          NPR {tx.runningBalance.toLocaleString()}
                        </td>
                      </tr>
                    ))}

                    {acc.transactions.length === 0 && acc.openingBalance === 0 && (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-slate-500">
                          No transaction postings found for this account.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CUSTOMER DEBTORS SUB-LEDGER */}
      {subView === 'customers' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Customer Accounts Receivable (Debtors) Sub-Ledger</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Individual customer invoice billing, receipts, and outstanding dues</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {customerSubLedger.map(cust => (
              <div key={cust.customerId} className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{cust.customerName}</h4>
                    <p className="text-xs text-slate-400">Mobile: {cust.mobile || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-xs">
                    <div>
                      <span className="text-slate-400">Total Invoiced:</span>
                      <span className="ml-2 font-mono font-semibold text-emerald-400">NPR {cust.totalInvoiced.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Total Received:</span>
                      <span className="ml-2 font-mono font-semibold text-cyan-400">NPR {cust.totalReceived.toLocaleString()}</span>
                    </div>
                    <div className="pl-4 border-l border-slate-800">
                      <span className="text-slate-400">Balance Due:</span>
                      <span className={`ml-2 font-mono font-bold text-sm ${cust.balanceDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        NPR {cust.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-3">Voucher #</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3">Reference</th>
                        <th className="py-2 px-3 text-right">Debit (Invoiced)</th>
                        <th className="py-2 px-3 text-right">Credit (Received)</th>
                        <th className="py-2 px-4 text-right">Outstanding Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {cust.transactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2 px-4 font-mono text-slate-300">{tx.date}</td>
                          <td className="py-2 px-3 font-mono font-bold text-cyan-400">{tx.entryNumber}</td>
                          <td className="py-2 px-3 text-white">{tx.description}</td>
                          <td className="py-2 px-3 font-mono text-slate-400">{tx.reference || '—'}</td>
                          <td className="py-2 px-3 text-right font-mono text-emerald-400">{tx.debit > 0 ? `NPR ${tx.debit.toLocaleString()}` : '—'}</td>
                          <td className="py-2 px-3 text-right font-mono text-cyan-400">{tx.credit > 0 ? `NPR ${tx.credit.toLocaleString()}` : '—'}</td>
                          <td className="py-2 px-4 text-right font-mono font-bold text-slate-200">NPR {tx.balance.toLocaleString()}</td>
                        </tr>
                      ))}
                      {cust.transactions.length === 0 && (
                        <tr><td colSpan={7} className="py-3 text-center text-slate-500">No transactions recorded for this customer.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUPPLIER CREDITORS SUB-LEDGER */}
      {subView === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>Supplier Accounts Payable (Creditors) Sub-Ledger</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Vendor purchase invoices, payment disbursements, and outstanding payables</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {supplierSubLedger.map(sup => (
              <div key={sup.supplierId} className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{sup.supplierName}</h4>
                    <p className="text-xs text-slate-400">Contact: {sup.contactPerson || 'N/A'}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-xs">
                    <div>
                      <span className="text-slate-400">Total Billed:</span>
                      <span className="ml-2 font-mono font-semibold text-rose-400">NPR {sup.totalPurchased.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Total Paid Out:</span>
                      <span className="ml-2 font-mono font-semibold text-emerald-400">NPR {sup.totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="pl-4 border-l border-slate-800">
                      <span className="text-slate-400">Balance Payable:</span>
                      <span className={`ml-2 font-mono font-bold text-sm ${sup.balancePayable > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        NPR {sup.balancePayable.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-3">Voucher #</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3">Reference</th>
                        <th className="py-2 px-3 text-right">Debit (Paid Out)</th>
                        <th className="py-2 px-3 text-right">Credit (Billed)</th>
                        <th className="py-2 px-4 text-right">Outstanding Payable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sup.transactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2 px-4 font-mono text-slate-300">{tx.date}</td>
                          <td className="py-2 px-3 font-mono font-bold text-purple-400">{tx.entryNumber}</td>
                          <td className="py-2 px-3 text-white">{tx.description}</td>
                          <td className="py-2 px-3 font-mono text-slate-400">{tx.reference || '—'}</td>
                          <td className="py-2 px-3 text-right font-mono text-emerald-400">{tx.debit > 0 ? `NPR ${tx.debit.toLocaleString()}` : '—'}</td>
                          <td className="py-2 px-3 text-right font-mono text-rose-400">{tx.credit > 0 ? `NPR ${tx.credit.toLocaleString()}` : '—'}</td>
                          <td className="py-2 px-4 text-right font-mono font-bold text-slate-200">NPR {tx.balance.toLocaleString()}</td>
                        </tr>
                      ))}
                      {sup.transactions.length === 0 && (
                        <tr><td colSpan={7} className="py-3 text-center text-slate-500">No transactions recorded for this supplier.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
