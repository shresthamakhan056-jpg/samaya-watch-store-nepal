import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Scale,
  BookOpen,
  FileText,
  ListTree,
  Building2,
  Calendar,
  Layers,
  Plus,
  RefreshCw,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccountingEngine } from '../../utils/accountingEngine';
import {
  exportProfitAndLossPDF,
  exportBalanceSheetPDF,
  exportCashFlowPDF,
  exportTrialBalancePDF,
  exportToCSV
} from '../../utils/reportExporter';

// Subcomponents
import { ExecutiveDashboard } from './accounting/ExecutiveDashboard';
import { GeneralLedgerView } from './accounting/GeneralLedgerView';
import { VoucherManagement } from './accounting/VoucherManagement';
import { ChartOfAccountsView } from './accounting/ChartOfAccountsView';
import { FixedAssetsView } from './accounting/FixedAssetsView';
import { FiscalPeriodView } from './accounting/FiscalPeriodView';
import { UniversalVoucherModal } from './accounting/UniversalVoucherModal';
import { VoucherType } from '../../types';

export const AccountingModule: React.FC = () => {
  const {
    accounts,
    journalEntries,
    sales,
    purchases,
    fiscalYears,
    syncJournalEntriesAndAccounts,
    currentUser
  } = useApp();

  const currentFiscalYear = fiscalYears?.find(f => f.isCurrent || f.status === 'Open') || fiscalYears?.[0] || { name: 'FY 2081/82' };

  type TabType =
    | 'dashboard'
    | 'pnl'
    | 'balance'
    | 'cashflow'
    | 'trial'
    | 'ledger'
    | 'vouchers'
    | 'coa'
    | 'assets'
    | 'settings';

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showVoucherModal, setShowVoucherModal] = useState<boolean>(false);
  const [modalInitialType, setModalInitialType] = useState<VoucherType>('Journal Voucher');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Financial Engine Computations (Single Source of Truth: General Ledger)
  const pnl = useMemo(() => {
    return AccountingEngine.generateProfitAndLoss(journalEntries, accounts);
  }, [journalEntries, accounts]);

  const balanceSheet = useMemo(() => {
    return AccountingEngine.generateBalanceSheet(journalEntries, accounts);
  }, [journalEntries, accounts]);

  const cashFlow = useMemo(() => {
    return AccountingEngine.generateCashFlow(journalEntries, accounts);
  }, [journalEntries, accounts]);

  const trialBalance = useMemo(() => {
    return AccountingEngine.generateTrialBalance(journalEntries, accounts);
  }, [journalEntries, accounts]);

  // Open voucher modal helper
  const handleOpenVoucher = (type: VoucherType = 'Journal Voucher') => {
    setModalInitialType(type);
    setShowVoucherModal(true);
  };

  // Sync Ledger Helper
  const handleSyncLedger = () => {
    const res = syncJournalEntriesAndAccounts();
    setSyncToast(`✓ Recalculated General Ledger across ${res.entriesCount} journal entries and ${res.accountsCount} Chart of Accounts! All financial statements synchronized.`);
    setTimeout(() => setSyncToast(null), 6000);
  };

  // Export Reports Handlers
  const handleExportPnlPDF = () => {
    exportProfitAndLossPDF(pnl, currentFiscalYear.name);
  };

  const handleExportBalanceSheetPDF = () => {
    exportBalanceSheetPDF(balanceSheet, currentFiscalYear.name);
  };

  const handleExportCashFlowPDF = () => {
    exportCashFlowPDF(cashFlow, currentFiscalYear.name);
  };

  const handleExportTrialBalancePDF = () => {
    exportTrialBalancePDF(
      trialBalance.rows,
      trialBalance.totalDebit,
      trialBalance.totalCredit,
      trialBalance.isBalanced,
      currentFiscalYear.name
    );
  };

  return (
    <div id="accounting-and-finance-module" className="space-y-6">
      {/* Toast Notification */}
      {syncToast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md overflow-x-auto shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Finance Cockpit</span>
        </button>

        <button
          onClick={() => setActiveTab('pnl')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'pnl'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Profit & Loss (P&L)</span>
        </button>

        <button
          onClick={() => setActiveTab('balance')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'balance'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Balance Sheet</span>
        </button>

        <button
          onClick={() => setActiveTab('cashflow')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'cashflow'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Cash Flow</span>
        </button>

        <button
          onClick={() => setActiveTab('trial')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'trial'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Trial Balance</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>General Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'vouchers'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Voucher Register</span>
        </button>

        <button
          onClick={() => setActiveTab('coa')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'coa'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ListTree className="w-4 h-4" />
          <span>Chart of Accounts</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'assets'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Fixed Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Fiscal Periods</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. EXECUTIVE FINANCE DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <ExecutiveDashboard
          onOpenNewVoucher={() => handleOpenVoucher('Journal Voucher')}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSync={handleSyncLedger}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. PROFIT & LOSS STATEMENT (P&L) */}
      {/* ========================================================================= */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Statement of Profit or Loss (Income Statement)</span>
              </h2>
              <p className="text-xs text-slate-400">Multi-step income statement derived from General Ledger transaction movements</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportPnlPDF}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => {
                  const rows = [
                    { Particulars: 'Operating Revenue', Amount: pnl.revenue },
                    { Particulars: 'Cost of Goods Sold (COGS)', Amount: -pnl.costOfGoodsSold },
                    { Particulars: 'Gross Profit', Amount: pnl.grossProfit },
                    ...pnl.operatingExpenses.map(e => ({ Particulars: `[${e.code}] ${e.name}`, Amount: -e.amount })),
                    { Particulars: 'Total Operating Expenses', Amount: -pnl.totalOperatingExpenses },
                    { Particulars: 'Net Profit / (Loss)', Amount: pnl.netProfit }
                  ];
                  exportToCSV(rows, `Profit_And_Loss_${new Date().toISOString().substring(0, 10)}`);
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 font-semibold">Total Revenue</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">NPR {pnl.revenue.toLocaleString()}</p>
              <span className="text-xs text-emerald-400 mt-1 block">Sales & Watch Services</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 font-semibold">Gross Profit (Margin: {pnl.grossMarginPercentage}%)</span>
              <p className="text-2xl font-bold font-mono text-amber-400 mt-1">NPR {pnl.grossProfit.toLocaleString()}</p>
              <span className="text-xs text-slate-400 mt-1 block">After COGS: NPR {pnl.costOfGoodsSold.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-400 font-semibold">Net Income (Net Margin: {pnl.netMarginPercentage}%)</span>
              <p className={`text-2xl font-bold font-mono mt-1 ${pnl.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                NPR {pnl.netProfit.toLocaleString()}
              </p>
              <span className="text-xs text-slate-400 mt-1 block">Carried to Balance Sheet Equity</span>
            </div>
          </div>

          {/* Statement Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-6">
            {/* Revenue Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 pb-2 border-b border-slate-800">
                1. Operating Revenue & Turnovers
              </h3>
              <div className="space-y-2 text-xs">
                {pnl.revenueBreakdown.map((rev, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-300"><strong className="text-amber-400 font-mono">[{rev.code}]</strong> {rev.name}</span>
                    <span className="font-mono font-semibold text-emerald-400">NPR {rev.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 px-3 bg-slate-800/60 font-bold rounded-lg text-white">
                  <span>Total Operating Revenue:</span>
                  <span className="font-mono text-emerald-400">NPR {pnl.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Direct Cost / COGS Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 pb-2 border-b border-slate-800">
                2. Direct Cost of Goods Sold (COGS)
              </h3>
              <div className="space-y-2 text-xs">
                {pnl.cogsBreakdown.map((c, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-300"><strong className="text-amber-400 font-mono">[{c.code}]</strong> {c.name}</span>
                    <span className="font-mono font-semibold text-rose-400">(NPR {c.amount.toLocaleString()})</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 px-3 bg-slate-800/60 font-bold rounded-lg text-white">
                  <span>Total Cost of Sales:</span>
                  <span className="font-mono text-rose-400">(NPR {pnl.costOfGoodsSold.toLocaleString()})</span>
                </div>
              </div>
            </div>

            {/* Gross Profit Callout */}
            <div className="flex justify-between py-3 px-4 bg-amber-500/10 border border-amber-500/30 rounded-xl font-bold text-sm text-white">
              <span className="text-amber-300">GROSS PROFIT:</span>
              <span className="font-mono text-amber-400">NPR {pnl.grossProfit.toLocaleString()}</span>
            </div>

            {/* Operating Expenses Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 pb-2 border-b border-slate-800">
                3. Operating & Administrative Overhead Expenses
              </h3>
              <div className="space-y-2 text-xs">
                {pnl.operatingExpenses.map((exp, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-300"><strong className="text-amber-400 font-mono">[{exp.code}]</strong> {exp.name}</span>
                    <span className="font-mono font-semibold text-rose-300">NPR {exp.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 px-3 bg-slate-800/60 font-bold rounded-lg text-white">
                  <span>Total Operating Expenses:</span>
                  <span className="font-mono text-rose-300">NPR {pnl.totalOperatingExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Profit Final Bottom Line */}
            <div className={`flex justify-between py-4 px-5 rounded-xl font-bold text-base border ${
              pnl.netProfit >= 0
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            }`}>
              <span className="uppercase tracking-wider">NET PROFIT / (LOSS) FOR THE PERIOD:</span>
              <span className="font-mono text-lg font-extrabold">NPR {pnl.netProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BALANCE SHEET */}
      {/* ========================================================================= */}
      {activeTab === 'balance' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <span>Statement of Financial Position (Balance Sheet)</span>
              </h2>
              <p className="text-xs text-slate-400">Equation check: Total Assets (A) = Total Liabilities (L) + Total Equity (E)</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportBalanceSheetPDF}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Equation Status Bar */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            balanceSheet.isBalanced
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center space-x-3">
              {balanceSheet.isBalanced ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
              <div>
                <p className="font-semibold text-sm">
                  {balanceSheet.isBalanced ? 'Fundamental Accounting Equation Holds (A = L + E)' : 'Balance Sheet Discrepancy'}
                </p>
                <p className="text-xs opacity-80">
                  Total Assets: NPR {balanceSheet.totalAssets.toLocaleString()} | Liabilities + Equity: NPR {(balanceSheet.totalLiabilities + balanceSheet.totalEquity).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout (Assets vs Liabilities & Equity) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ASSETS COLUMN */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 pb-2 border-b border-slate-800">
                Assets
              </h3>

              {/* Current Assets */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Current Assets</h4>
                <div className="space-y-1.5 text-xs">
                  {balanceSheet.currentAssets.map((a, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                      <span className="text-slate-300">{a.name}</span>
                      <span className="font-mono font-semibold text-white">NPR {a.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1.5 px-3 bg-slate-800/40 rounded-lg font-semibold text-slate-200">
                    <span>Subtotal Current Assets:</span>
                    <span className="font-mono text-cyan-400">
                      NPR {balanceSheet.currentAssets.reduce((s, a) => s + a.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fixed & Non-Current Assets */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Fixed & Non-Current Assets</h4>
                <div className="space-y-1.5 text-xs">
                  {balanceSheet.fixedAssets.map((a, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                      <span className="text-slate-300">{a.name}</span>
                      <span className="font-mono font-semibold text-white">NPR {a.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1.5 px-3 bg-slate-800/40 rounded-lg font-semibold text-slate-200">
                    <span>Subtotal Fixed Assets:</span>
                    <span className="font-mono text-cyan-400">
                      NPR {balanceSheet.fixedAssets.reduce((s, a) => s + a.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Assets Footing */}
              <div className="flex justify-between py-3 px-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl font-bold text-sm text-white mt-4">
                <span className="text-cyan-300 uppercase">TOTAL ASSETS (A):</span>
                <span className="font-mono text-cyan-400">NPR {balanceSheet.totalAssets.toLocaleString()}</span>
              </div>
            </div>

            {/* LIABILITIES & EQUITY COLUMN */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 pb-2 border-b border-slate-800">
                Liabilities & Owner's Equity
              </h3>

              {/* Current Liabilities */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Current Liabilities</h4>
                <div className="space-y-1.5 text-xs">
                  {balanceSheet.currentLiabilities.map((l, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                      <span className="text-slate-300">{l.name}</span>
                      <span className="font-mono font-semibold text-white">NPR {l.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1.5 px-3 bg-slate-800/40 rounded-lg font-semibold text-slate-200">
                    <span>Subtotal Current Liabilities:</span>
                    <span className="font-mono text-rose-400">
                      NPR {balanceSheet.currentLiabilities.reduce((s, l) => s + l.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Long Term Liabilities */}
              {balanceSheet.longTermLiabilities.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-2">Long-term Liabilities</h4>
                  <div className="space-y-1.5 text-xs">
                    {balanceSheet.longTermLiabilities.map((l, idx) => (
                      <div key={idx} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                        <span className="text-slate-300">{l.name}</span>
                        <span className="font-mono font-semibold text-white">NPR {l.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equity Section */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Owner's Equity & Retained Earnings</h4>
                <div className="space-y-1.5 text-xs">
                  {balanceSheet.equity.map((e, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                      <span className="text-slate-300">{e.name}</span>
                      <span className="font-mono font-semibold text-amber-300">NPR {e.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1.5 px-3 bg-slate-800/40 rounded-lg font-semibold text-slate-200">
                    <span>Total Equity:</span>
                    <span className="font-mono text-amber-400">
                      NPR {balanceSheet.totalEquity.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Liabilities & Equity Footing */}
              <div className="flex justify-between py-3 px-4 bg-amber-500/10 border border-amber-500/30 rounded-xl font-bold text-sm text-white mt-4">
                <span className="text-amber-300 uppercase">TOTAL LIABILITIES & EQUITY (L + E):</span>
                <span className="font-mono text-amber-400">
                  NPR {(balanceSheet.totalLiabilities + balanceSheet.totalEquity).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. STATEMENT OF CASH FLOWS */}
      {/* ========================================================================= */}
      {activeTab === 'cashflow' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-cyan-400" />
                <span>Statement of Cash Flows (Operating, Investing & Financing)</span>
              </h2>
              <p className="text-xs text-slate-400">Reconciliation of liquid cash and bank reserves movement across fiscal cycles</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCashFlowPDF}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            {/* Operating Activities */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 pb-2 border-b border-slate-800">
                1. Cash Flows from Operating Activities
              </h3>
              <div className="space-y-2 text-xs">
                {cashFlow.operatingActivities.map((act, i) => (
                  <div key={i} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-300">{act.particulars}</span>
                    <span className={`font-mono font-semibold ${act.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      NPR {act.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between py-2 px-3 bg-slate-800/60 font-bold rounded-lg text-white">
                  <span>Net Cash from Operating Activities:</span>
                  <span className={`font-mono ${cashFlow.netCashFromOperations >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    NPR {cashFlow.netCashFromOperations.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Investing Activities */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 pb-2 border-b border-slate-800">
                2. Cash Flows from Investing Activities (CapEx & Asset Purchase)
              </h3>
              <div className="space-y-2 text-xs">
                {cashFlow.investingActivities.map((act, i) => (
                  <div key={i} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-300">{act.particulars}</span>
                    <span className={`font-mono font-semibold ${act.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      NPR {act.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between py-2 px-3 bg-slate-800/60 font-bold rounded-lg text-white">
                  <span>Net Cash from Investing Activities:</span>
                  <span className="font-mono text-cyan-400">
                    NPR {cashFlow.netCashFromInvesting.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Financing Activities */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 pb-2 border-b border-slate-800">
                3. Cash Flows from Financing Activities
              </h3>
              <div className="space-y-2 text-xs">
                {cashFlow.financingActivities.map((act, i) => (
                  <div key={i} className="flex justify-between py-1.5 px-3 bg-slate-950/40 rounded-lg">
                    <span className="text-slate-300">{act.particulars}</span>
                    <span className={`font-mono font-semibold ${act.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      NPR {act.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between py-2 px-3 bg-slate-800/60 font-bold rounded-lg text-white">
                  <span>Net Cash from Financing Activities:</span>
                  <span className="font-mono text-purple-400">
                    NPR {cashFlow.netCashFromFinancing.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Footing */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs font-semibold">
              <div className="flex justify-between py-2 px-3 bg-slate-950/40 rounded-lg">
                <span className="text-slate-400">Beginning Cash & Bank Balance:</span>
                <span className="font-mono text-white">NPR {cashFlow.beginningCash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 px-3 bg-slate-950/40 rounded-lg">
                <span className="text-slate-400">Net Increase / (Decrease) in Cash:</span>
                <span className={`font-mono ${cashFlow.netChangeInCash >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  NPR {cashFlow.netChangeInCash.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3 px-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-bold text-sm text-emerald-300">
                <span>ENDING CASH & BANK POSITION:</span>
                <span className="font-mono text-emerald-400 font-extrabold">NPR {cashFlow.endingCash.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TRIAL BALANCE */}
      {/* ========================================================================= */}
      {activeTab === 'trial' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Adjusted Trial Balance (Equilibrium Verification)</span>
              </h2>
              <p className="text-xs text-slate-400">Summary verification of all Ledger Debit and Credit balances</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportTrialBalancePDF}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Trial Balance Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4 font-semibold w-24">Code</th>
                    <th className="py-3 px-3 font-semibold">Account Title</th>
                    <th className="py-3 px-3 font-semibold w-32">Category</th>
                    <th className="py-3 px-3 font-semibold w-36 text-right">Debit Balance (NPR)</th>
                    <th className="py-3 px-4 font-semibold w-36 text-right">Credit Balance (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {trialBalance.accounts.map(acc => (
                    <tr key={acc.accountId} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 px-4 font-mono font-bold text-amber-400">{acc.accountCode}</td>
                      <td className="py-2.5 px-3 font-medium text-white">{acc.accountName}</td>
                      <td className="py-2.5 px-3 text-slate-400">{acc.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-400">
                        {acc.debitBalance > 0 ? `NPR ${acc.debitBalance.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-rose-400">
                        {acc.creditBalance > 0 ? `NPR ${acc.creditBalance.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-950 font-bold border-t border-slate-700 text-white">
                    <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-xs">
                      Total Trial Balance:
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400 text-sm">
                      NPR {trialBalance.totalDebit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-400 text-sm">
                      NPR {trialBalance.totalCredit.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. GENERAL LEDGER & SUB-LEDGERS */}
      {/* ========================================================================= */}
      {activeTab === 'ledger' && <GeneralLedgerView />}

      {/* ========================================================================= */}
      {/* 7. VOUCHER & JOURNAL REGISTER */}
      {/* ========================================================================= */}
      {activeTab === 'vouchers' && (
        <VoucherManagement onOpenNewVoucher={(type) => handleOpenVoucher(type)} />
      )}

      {/* ========================================================================= */}
      {/* 8. CHART OF ACCOUNTS MASTER */}
      {/* ========================================================================= */}
      {activeTab === 'coa' && <ChartOfAccountsView />}

      {/* ========================================================================= */}
      {/* 9. FIXED ASSETS REGISTER */}
      {/* ========================================================================= */}
      {activeTab === 'assets' && <FixedAssetsView />}

      {/* ========================================================================= */}
      {/* 10. FISCAL PERIODS & SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && <FiscalPeriodView />}

      {/* ========================================================================= */}
      {/* UNIVERSAL DOUBLE-ENTRY VOUCHER MODAL */}
      {/* ========================================================================= */}
      <UniversalVoucherModal
        isOpen={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        initialType={modalInitialType}
        onVoucherPosted={(vNum) => {
          setSyncToast(`✓ Posted Double-Entry Voucher #${vNum}! All financial statements, General Ledger, and trial balance updated.`);
          setTimeout(() => setSyncToast(null), 6000);
        }}
      />
    </div>
  );
};
