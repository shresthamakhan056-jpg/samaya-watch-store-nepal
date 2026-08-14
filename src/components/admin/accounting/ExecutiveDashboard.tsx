import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Scale,
  CreditCard,
  Building2,
  PieChart,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AccountingEngine } from '../../../utils/accountingEngine';

interface ExecutiveDashboardProps {
  onOpenNewVoucher: () => void;
  onNavigateTab: (tab: any) => void;
  onSync: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onOpenNewVoucher,
  onNavigateTab,
  onSync
}) => {
  const {
    journalEntries,
    accounts,
    sales,
    purchases,
    customers,
    suppliers,
    fixedAssets
  } = useApp();

  const pnl = AccountingEngine.generateProfitAndLoss(journalEntries, accounts);
  const bs = AccountingEngine.generateBalanceSheet(journalEntries, accounts);
  const tb = AccountingEngine.generateTrialBalance(journalEntries, accounts);

  // Cash & Bank balances
  const liquidAccounts = accounts.filter(a => a.type === 'Cash' || a.type === 'Bank');
  const totalLiquidCash = liquidAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  // A/R & A/P
  const arBalance = accounts.find(a => a.code === '1100')?.balance || 0;
  const apBalance = accounts.find(a => a.code === '2010')?.balance || 0;

  // Working Capital = Current Assets - Current Liabilities
  const currentAssets = bs.currentAssets.reduce((s, i) => s + i.amount, 0);
  const currentLiabilities = bs.currentLiabilities.reduce((s, i) => s + i.amount, 0);
  const workingCapital = currentAssets - currentLiabilities;
  const currentRatio = currentLiabilities > 0 ? (currentAssets / currentLiabilities).toFixed(2) : 'N/A';

  // Recent 5 Journal Entries
  const recentEntries = journalEntries.slice(0, 6);

  return (
    <div id="accounting-executive-dashboard" className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Double-Entry ERP Core
            </span>
            {tb.isBalanced ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>General Ledger Balanced</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Discrepancy Detected</span>
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Financial Accounting & General Ledger Control</h1>
          <p className="text-xs text-slate-400">Real-time financial statement computation with sub-ledger synchronization</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onSync}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Recalculate Ledger</span>
          </button>

          <button
            onClick={onOpenNewVoucher}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Double-Entry Voucher</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Operating Revenue</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-white">
              NPR {pnl.revenue.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1 mt-1 text-xs text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Gross Margin: {pnl.grossMarginPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Net Profit (P&L)</span>
            <div className={`p-2 rounded-xl ${pnl.netProfit >= 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-2xl font-bold font-mono ${pnl.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              NPR {pnl.netProfit.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1 mt-1 text-xs text-slate-400">
              <span>Net Margin: {pnl.netMarginPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Cash & Bank Position */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Liquid Cash & Bank Reserves</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              NPR {totalLiquidCash.toLocaleString()}
            </span>
            <div className="flex items-center space-x-2 mt-1 text-xs text-slate-400">
              <span>{liquidAccounts.length} Cash & Bank Accounts</span>
            </div>
          </div>
        </div>

        {/* Working Capital */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Net Working Capital</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-purple-300">
              NPR {workingCapital.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1 mt-1 text-xs text-slate-400">
              <span>Current Ratio: {currentRatio}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Sub-ledger snapshot & Balance Check */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash & Bank Accounts Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Treasury & Bank Books</span>
            </h3>
            <button
              onClick={() => onNavigateTab('ledger')}
              className="text-xs text-amber-400 hover:underline"
            >
              View Ledger
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {liquidAccounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                <div>
                  <p className="text-xs font-semibold text-white">[{acc.code}] {acc.name}</p>
                  <p className="text-[10px] text-slate-400">{acc.group || acc.category}</p>
                </div>
                <span className={`text-xs font-bold font-mono ${acc.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  NPR {acc.balance.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trade Receivables & Payables Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Sub-Ledger Balances</span>
            </h3>
            <button
              onClick={() => onNavigateTab('subledger')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Full Sub-Ledger
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Trade Debtors (Accounts Receivable)</span>
                <span className="font-bold font-mono text-emerald-400">NPR {arBalance.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{customers.length} registered customer accounts</p>
            </div>

            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Trade Creditors (Accounts Payable)</span>
                <span className="font-bold font-mono text-rose-400">NPR {apBalance.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{suppliers.length} active watch manufacturers & distributors</p>
            </div>

            <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Fixed Assets Register NBV</span>
                <span className="font-bold font-mono text-amber-400">
                  NPR {fixedAssets.reduce((s, a) => s + (a.netBookValue || a.cost), 0).toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{fixedAssets.length} capitalized assets on book</p>
            </div>
          </div>
        </div>

        {/* Balance Sheet Verification Equation Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Balance Sheet Equation</span>
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                bs.isBalanced ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {bs.isBalanced ? '✓ Equation Holds' : 'Unbalanced'}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Assets (A)</span>
                <span className="font-bold font-mono text-white">NPR {bs.totalAssets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Liabilities (L)</span>
                <span className="font-bold font-mono text-rose-300">NPR {bs.totalLiabilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Equity (E)</span>
                <span className="font-bold font-mono text-amber-300">NPR {bs.totalEquity.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold">
                <span className="text-emerald-400">Liabilities + Equity (L+E)</span>
                <span className="font-mono text-emerald-400">NPR {(bs.totalLiabilities + bs.totalEquity).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Difference: NPR {Math.abs(bs.totalAssets - (bs.totalLiabilities + bs.totalEquity)).toLocaleString()}</span>
            <button
              onClick={() => onNavigateTab('balance')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Open Balance Sheet →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Recently Posted General Journal Entries</h3>
            <p className="text-xs text-slate-400">Immutable double-entry transaction record with audit trail</p>
          </div>
          <button
            onClick={() => onNavigateTab('vouchers')}
            className="text-xs text-amber-400 hover:underline font-semibold"
          >
            View All Vouchers ({journalEntries.length}) →
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-2 font-semibold">Entry #</th>
                <th className="pb-2 font-semibold">Date</th>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 font-semibold">Description</th>
                <th className="pb-2 font-semibold">Reference</th>
                <th className="pb-2 font-semibold text-right">Debit Total</th>
                <th className="pb-2 font-semibold text-right">Credit Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentEntries.map(entry => {
                const drTotal = entry.lines.reduce((s, l) => s + (l.debit || 0), 0);
                const crTotal = entry.lines.reduce((s, l) => s + (l.credit || 0), 0);

                return (
                  <tr key={entry.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 font-mono font-bold text-amber-400">{entry.entryNumber}</td>
                    <td className="py-3 text-slate-300">{entry.date}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {entry.voucherType || 'Journal Voucher'}
                      </span>
                    </td>
                    <td className="py-3 text-white max-w-xs truncate">{entry.description}</td>
                    <td className="py-3 font-mono text-slate-400">{entry.reference || '—'}</td>
                    <td className="py-3 font-mono text-right text-emerald-400">NPR {drTotal.toLocaleString()}</td>
                    <td className="py-3 font-mono text-right text-rose-400">NPR {crTotal.toLocaleString()}</td>
                  </tr>
                );
              })}
              {recentEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">No journal entries posted yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
