import React, { useState } from 'react';
import { DollarSign, BookOpen, Scale, FileText, Plus, Calculator, CheckCircle2, Download, RefreshCw, ShieldCheck, Printer, Trash2, UserCheck, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  exportJournalEntriesReport,
  exportJournalEntriesReportPDF,
  exportProfitAndLossReport,
  exportProfitAndLossReportPDF,
  exportBalanceSheetReport,
  exportBalanceSheetReportPDF,
  exportTrialBalanceReportPDF,
  exportChartOfAccountsPDF,
  exportPaymentsReportPDF,
  exportToCSV
} from '../../utils/reportExporter';

export const AccountingModule: React.FC = () => {
  const {
    accounts,
    addAccount,
    deleteAccount,
    journalEntries,
    sales,
    products,
    suppliers,
    customers,
    purchases,
    addJournalEntry,
    currentUser,
    syncJournalEntriesAndAccounts
  } = useApp();
  const [activeTab, setActiveTab] = useState<'pnl' | 'balance' | 'trial' | 'journal' | 'payments' | 'coa'>('pnl');
  const [pnlSubView, setPnlSubView] = useState<'statement' | 'audit'>('statement');
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [syncNotification, setSyncNotification] = useState<string | null>(null);

  // Payment & Received Entry Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [entryType, setEntryType] = useState<'Payment' | 'Received'>('Payment');
  const [methodCode, setMethodCode] = useState<string>('1020'); // Default Nabil Bank
  const [targetCode, setTargetCode] = useState<string>('5040'); // Default Marketing Expense
  const [partyName, setPartyName] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [voucherNo, setVoucherNo] = useState<string>('');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [entryDescription, setEntryDescription] = useState<string>('');
  const [paymentSearch, setPaymentSearch] = useState<string>('');

  // Dynamic Payment Account Modal State
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccCode, setNewAccCode] = useState('');
  const [newAccCategory, setNewAccCategory] = useState<'Assets' | 'Liabilities' | 'Equity' | 'Expenses' | 'Revenue'>('Assets');

  const handleCreateNewPaymentAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;
    const autoCode = newAccCode.trim() || String(1000 + Math.floor(Math.random() * 8999));
    const created = addAccount({
      code: autoCode,
      name: newAccName.trim(),
      category: newAccCategory,
      type: newAccCategory === 'Assets' ? 'Bank' : 'Expenses'
    });
    setMethodCode(created.code);
    setShowAddAccountModal(false);
    setNewAccName('');
    setNewAccCode('');
  };

  const handleSelectPartyFromCRM = (partyVal: string) => {
    setPartyName(partyVal);
    // Auto-detect supplier
    const sup = suppliers.find(s => s.name.toLowerCase().trim() === partyVal.toLowerCase().trim());
    if (sup) {
      if (entryType === 'Payment') {
        setTargetCode('2010'); // Accounts Payable (Suppliers)
      }
      const supPOs = purchases.filter(p => p.supplierId === sup.id || p.supplierName.toLowerCase().trim() === sup.name.toLowerCase().trim());
      const poTotalCost = supPOs.reduce((sum, p) => sum + p.cost, 0);
      const dueAmount = poTotalCost > 0 ? poTotalCost : sup.balanceDue;
      if (dueAmount > 0) {
        setAmountInput(String(dueAmount));
      }
    }
  };

  const handlePostPaymentReceivedEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountInput);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount in NPR.');
      return;
    }

    const methodAcc = accounts.find(a => a.code === methodCode) || accounts.find(a => a.code === '1010');
    const targetAcc = accounts.find(a => a.code === targetCode) || accounts.find(a => a.code === '5040');

    const vNum = voucherNo.trim() || `${entryType === 'Payment' ? 'PAY' : 'REC'}-${Date.now().toString().slice(-6)}`;
    const party = partyName.trim() || (entryType === 'Payment' ? 'Payee Vendor / Supplier' : 'Payer Client');
    const desc = entryDescription.trim() || `${entryType} Transaction (${party}): ${targetAcc?.name || 'Account'}`;

    let lines = [];
    if (entryType === 'Payment') {
      // Payment Out: DEBIT Target Account (Expense/Liability/Asset), CREDIT Method Account (Cash/Bank)
      lines = [
        {
          accountId: targetAcc?.id || 'acc-5040',
          accountCode: targetAcc?.code || '5040',
          accountName: targetAcc?.name || 'Operating Expense',
          debit: numAmount,
          credit: 0
        },
        {
          accountId: methodAcc?.id || 'acc-1020',
          accountCode: methodAcc?.code || '1020',
          accountName: methodAcc?.name || 'Nabil Bank Operating Account',
          debit: 0,
          credit: numAmount
        }
      ];
    } else {
      // Received In: DEBIT Method Account (Cash/Bank), CREDIT Target Account (Revenue/Capital)
      lines = [
        {
          accountId: methodAcc?.id || 'acc-1020',
          accountCode: methodAcc?.code || '1020',
          accountName: methodAcc?.name || 'Nabil Bank Operating Account',
          debit: numAmount,
          credit: 0
        },
        {
          accountId: targetAcc?.id || 'acc-4010',
          accountCode: targetAcc?.code || '4010',
          accountName: targetAcc?.name || 'Watch Sales Revenue',
          debit: 0,
          credit: numAmount
        }
      ];
    }

    // Post Double-Entry Journal
    addJournalEntry({
      date: entryDate || new Date().toISOString().substring(0, 10),
      description: `[${entryType.toUpperCase()} VOUCHER #${vNum}] Party: ${party}. ${desc}`,
      reference: vNum,
      createdBy: currentUser?.name || 'Staff Accountant',
      lines
    });

    // Automatically recalculate and sync all account balances and statements
    syncJournalEntriesAndAccounts();
    const now = new Date().toLocaleTimeString();
    setLastSyncTime(now);

    // Reset Form
    setShowPaymentModal(false);
    setAmountInput('');
    setPartyName('');
    setVoucherNo('');
    setEntryDescription('');

    setSyncNotification(`✓ ${entryType} Transaction Voucher #${vNum} of NPR ${numAmount.toLocaleString()} recorded! Data automatically pulled & updated on P&L, Balance Sheet, Trial Balance, Chart of Accounts, and Reports.`);
    setTimeout(() => setSyncNotification(null), 7000);
  };

  // Dynamically calculate balances by pulling data directly from Journal Entries
  const getAccountBalanceFromJournals = (code: string, category: 'Assets' | 'Expenses' | 'Revenue' | 'Liabilities' | 'Equity') => {
    let debitSum = 0;
    let creditSum = 0;

    journalEntries.forEach(je => {
      je.lines.forEach(line => {
        if (line.accountCode === code) {
          debitSum += Number(line.debit || 0);
          creditSum += Number(line.credit || 0);
        }
      });
    });

    if (category === 'Assets' || category === 'Expenses') {
      return debitSum - creditSum;
    } else {
      return creditSum - debitSum;
    }
  };

  // P&L Calculations pulled directly from Journal Entries, Master Accounts, & Real-time Transactions
  const rawSalesRevenue = getAccountBalanceFromJournals('4010', 'Revenue') || accounts.find(a => a.code === '4010')?.balance || 0;
  const liveSalesTotal = sales.reduce((sum, s) => sum + s.finalTotal, 0);
  // Total Revenue incorporates journal entries and live sales
  const salesRevenue = Math.max(rawSalesRevenue, liveSalesTotal);

  const rawCogs = getAccountBalanceFromJournals('5010', 'Expenses') || accounts.find(a => a.code === '5010')?.balance || 0;
  const liveSalesCOGS = sales.reduce((sum, s) => {
    const prod = products.find(p => p.id === s.productId);
    return sum + (prod ? prod.purchasePrice : Math.round(s.sellingPrice * 0.7));
  }, 0);
  const cogs = Math.max(rawCogs, liveSalesCOGS);
  const grossProfit = salesRevenue - cogs;

  // Operating Expenses - dynamically fetch ALL expense accounts except COGS (5010)
  const expenseAccounts = accounts.filter(a => a.category === 'Expenses' && a.code !== '5010');
  const operatingExpenseList = expenseAccounts.map(acc => {
    const bal = getAccountBalanceFromJournals(acc.code, 'Expenses') || acc.balance || 0;
    return {
      code: acc.code,
      name: acc.name,
      amount: Math.abs(bal)
    };
  });

  const courierExp = operatingExpenseList.find(e => e.code === '5020')?.amount || 0;
  const discountExp = operatingExpenseList.find(e => e.code === '5030')?.amount || 0;
  const marketingExp = operatingExpenseList.find(e => e.code === '5040')?.amount || 0;

  const totalExpenses = operatingExpenseList.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  // Balance Sheet Calculations pulled directly from Journal Entries / Master Accounts
  const cash = getAccountBalanceFromJournals('1010', 'Assets') || accounts.find(a => a.code === '1010')?.balance || 0;
  const bank = getAccountBalanceFromJournals('1020', 'Assets') || accounts.find(a => a.code === '1020')?.balance || 0;
  const esewa = getAccountBalanceFromJournals('1030', 'Assets') || accounts.find(a => a.code === '1030')?.balance || 0;
  const inventoryAsset = getAccountBalanceFromJournals('1200', 'Assets') || accounts.find(a => a.code === '1200')?.balance || 0;
  const totalAssets = cash + bank + esewa + inventoryAsset;

  const ap = getAccountBalanceFromJournals('2010', 'Liabilities') || accounts.find(a => a.code === '2010')?.balance || 0;
  const vatPayable = getAccountBalanceFromJournals('2020', 'Liabilities') || accounts.find(a => a.code === '2020')?.balance || 0;
  const totalLiabilities = ap + vatPayable;

  const capital = getAccountBalanceFromJournals('3010', 'Equity') || accounts.find(a => a.code === '3010')?.balance || 0;
  const totalEquity = capital + netProfit;

  const handleSyncData = () => {
    const result = syncJournalEntriesAndAccounts();
    const now = new Date().toLocaleTimeString();
    setLastSyncTime(now);
    setSyncNotification(`✓ Successfully pulled and synced data from ${result.entriesCount} Journal Entries across ${result.accountsCount} Chart of Accounts (${result.newEntriesCreated} journal entries processed). P&L and Balance Sheet updated!`);
    setTimeout(() => {
      setSyncNotification(null);
    }, 6000);
  };

  const handleDownloadPnl = () => {
    exportProfitAndLossReport(
      salesRevenue,
      cogs,
      grossProfit,
      operatingExpenseList,
      totalExpenses,
      netProfit
    );
  };

  const handleDownloadPnlPDF = () => {
    exportProfitAndLossReportPDF(
      salesRevenue,
      cogs,
      grossProfit,
      operatingExpenseList,
      totalExpenses,
      netProfit
    );
  };

  const handleDownloadBalanceSheet = () => {
    exportBalanceSheetReport(
      [
        { name: 'Cash in Hand', amount: cash },
        { name: 'Nabil Bank Operating Account', amount: bank },
        { name: 'eSewa Merchant Wallet', amount: esewa },
        { name: 'Watch Inventory Asset (At Cost)', amount: inventoryAsset }
      ],
      totalAssets,
      [
        { name: 'Accounts Payable (Swiss Suppliers)', amount: ap },
        { name: 'VAT Payable (13%)', amount: vatPayable }
      ],
      totalLiabilities,
      [
        { name: 'Owner Paid-in Capital', amount: capital },
        { name: 'Retained Earnings (Net Profit)', amount: netProfit }
      ],
      totalEquity
    );
  };

  const handleDownloadBalanceSheetPDF = () => {
    exportBalanceSheetReportPDF(
      [
        { name: 'Cash in Hand', amount: cash },
        { name: 'Nabil Bank Operating Account', amount: bank },
        { name: 'eSewa Merchant Wallet', amount: esewa },
        { name: 'Watch Inventory Asset (At Cost)', amount: inventoryAsset }
      ],
      totalAssets,
      [
        { name: 'Accounts Payable (Swiss Suppliers)', amount: ap },
        { name: 'VAT Payable (13%)', amount: vatPayable }
      ],
      totalLiabilities,
      [
        { name: 'Owner Paid-in Capital', amount: capital },
        { name: 'Retained Earnings (Net Profit)', amount: netProfit }
      ],
      totalEquity
    );
  };

  const handleDownloadTrialBalance = () => {
    const headers = ['Account Code', 'Account Title', 'Category', 'Debit Balance (NPR)', 'Credit Balance (NPR)'];
    const rows = accounts.map(acc => {
      const isDebit = acc.category === 'Assets' || acc.category === 'Expenses';
      const bal = getAccountBalanceFromJournals(acc.code, acc.category as any) || acc.balance;
      return [
        acc.code,
        acc.name,
        acc.category,
        isDebit ? bal : 0,
        !isDebit ? bal : 0
      ];
    });
    exportToCSV('Trial_Balance_Report', headers, rows);
  };

  const handleDownloadTrialBalancePDF = () => {
    exportTrialBalanceReportPDF(
      accounts,
      (code, cat) => getAccountBalanceFromJournals(code, cat)
    );
  };

  const handleDownloadCOA = () => {
    const headers = ['Account Code', 'Account Title', 'Category', 'Current Balance (NPR)'];
    const rows = accounts.map(acc => [
      acc.code,
      acc.name,
      acc.category,
      getAccountBalanceFromJournals(acc.code, acc.category as any) || acc.balance
    ]);
    exportToCSV('Chart_of_Accounts_Master', headers, rows);
  };

  const handleDownloadCOAPDF = () => {
    exportChartOfAccountsPDF(accounts);
  };

  return (
    <div className="space-y-6 text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-amber-400" />
              <span>Double-Entry Financial Accounting System</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Locked & Finalized Ledger</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time Chart of Accounts, Double-Entry Journal Postings, Trial Balance & Automated Financial Statements.
          </p>
        </div>

        {/* Action Buttons: Sync, Record Payment, & Print */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Payment / Received Entry</span>
          </button>

          <button
            onClick={handleSyncData}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Pull and sync live transaction data directly from Journal Entries"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Pull Data from Journal Entries ({lastSyncTime})</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Sync / Transaction Notification Banner */}
      {syncNotification && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-medium flex items-center justify-between gap-2 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncNotification}</span>
          </div>
          <button onClick={() => setSyncNotification(null)} className="text-emerald-400 hover:text-white font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Sub Navigation Tabs & Download Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab('pnl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pnl' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Profit & Loss
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'balance' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveTab('trial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'trial' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Trial Balance
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'payments' ? 'bg-amber-500 text-zinc-950' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Payments & Receipts</span>
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'journal' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Journal Entries ({journalEntries.length})
          </button>
          <button
            onClick={() => setActiveTab('coa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'coa' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Chart of Accounts
          </button>
        </div>

        {/* Tab-Specific PDF & CSV Export Controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'pnl' && (
            <>
              <button
                onClick={handleDownloadPnlPDF}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download P&L PDF</span>
              </button>
              <button
                onClick={handleDownloadPnl}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </>
          )}
          {activeTab === 'balance' && (
            <>
              <button
                onClick={handleDownloadBalanceSheetPDF}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Balance Sheet PDF</span>
              </button>
              <button
                onClick={handleDownloadBalanceSheet}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </>
          )}
          {activeTab === 'trial' && (
            <>
              <button
                onClick={handleDownloadTrialBalancePDF}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Trial Balance PDF</span>
              </button>
              <button
                onClick={handleDownloadTrialBalance}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </>
          )}
          {activeTab === 'payments' && (
            <>
              <button
                onClick={() => exportPaymentsReportPDF(journalEntries)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Cashbook PDF</span>
              </button>
            </>
          )}
          {activeTab === 'journal' && (
            <>
              <button
                onClick={() => exportJournalEntriesReportPDF(journalEntries)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Journal PDF</span>
              </button>
              <button
                onClick={() => exportJournalEntriesReport(journalEntries)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </>
          )}
          {activeTab === 'coa' && (
            <>
              <button
                onClick={handleDownloadCOAPDF}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download COA PDF</span>
              </button>
              <button
                onClick={handleDownloadCOA}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* PROFIT & LOSS STATEMENT */}
      {activeTab === 'pnl' && (
        <div className="bg-zinc-900/90 rounded-2xl border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-zinc-800 pb-4 text-center">
            <h3 className="font-serif text-2xl font-bold text-amber-100 uppercase tracking-widest">
              PREMIUM WATCH STORE NEPAL
            </h3>
            <p className="text-xs font-mono text-amber-400 uppercase font-bold mt-1">
              PROFIT & LOSS STATEMENT (INCOME STATEMENT)
            </p>
            <p className="text-[11px] text-zinc-500 font-mono">Currency: Nepalese Rupee (NPR)</p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto font-mono text-xs">
            
            {/* Revenue */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
              <span className="text-amber-400 font-bold block uppercase border-b border-zinc-800 pb-1">1. Operating Revenue</span>
              <div className="flex justify-between text-zinc-200">
                <span>Watch Sales Revenue (Gross)</span>
                <span className="font-bold text-emerald-400">NPR {salesRevenue.toLocaleString()}</span>
              </div>
            </div>

            {/* COGS */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
              <span className="text-amber-400 font-bold block uppercase border-b border-zinc-800 pb-1">2. Cost of Sales</span>
              <div className="flex justify-between text-zinc-200">
                <span>Cost of Goods Sold (COGS - Inventory)</span>
                <span className="text-rose-400">- NPR {cogs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-amber-300 pt-2 border-t border-zinc-800">
                <span>Gross Operating Profit</span>
                <span>NPR {grossProfit.toLocaleString()}</span>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
              <span className="text-amber-400 font-bold block uppercase border-b border-zinc-800 pb-1">3. Operating Expenses</span>
              {operatingExpenseList.map((exp) => (
                <div key={exp.code} className="flex justify-between text-zinc-300">
                  <span>[{exp.code}] {exp.name}</span>
                  <span>NPR {exp.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-rose-300 pt-2 border-t border-zinc-800">
                <span>Total Operating Expenses</span>
                <span>NPR {totalExpenses.toLocaleString()}</span>
              </div>
            </div>

            {/* Net Profit */}
            <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 p-5 rounded-2xl border-2 border-amber-500/50 flex items-center justify-between font-serif text-lg">
              <span className="font-bold text-amber-100">NET BOTTOM LINE PROFIT</span>
              <span className={`font-mono font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                NPR {netProfit.toLocaleString()}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* BALANCE SHEET */}
      {activeTab === 'balance' && (
        <div className="bg-zinc-900/90 rounded-2xl border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-zinc-800 pb-4 text-center">
            <h3 className="font-serif text-2xl font-bold text-amber-100 uppercase tracking-widest">
              BALANCE SHEET STATEMENT
            </h3>
            <p className="text-xs font-mono text-amber-400 font-bold mt-1">
              ASSETS = LIABILITIES + OWNER'S EQUITY
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* ASSETS */}
            <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
              <h4 className="text-amber-400 font-bold uppercase border-b border-zinc-800 pb-2 text-sm">
                ASSETS (Current & Inventory)
              </h4>
              <div className="flex justify-between">
                <span>Cash in Hand</span>
                <span className="font-bold text-zinc-200">NPR {cash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Nabil Bank Operating Account</span>
                <span className="font-bold text-zinc-200">NPR {bank.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>eSewa Merchant Wallet</span>
                <span className="font-bold text-zinc-200">NPR {esewa.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Watch Inventory Asset (At Cost)</span>
                <span className="font-bold text-amber-300">NPR {inventoryAsset.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-400 text-sm pt-3 border-t border-zinc-800">
                <span>TOTAL ASSETS</span>
                <span>NPR {totalAssets.toLocaleString()}</span>
              </div>
            </div>

            {/* LIABILITIES & EQUITY */}
            <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
              <h4 className="text-amber-400 font-bold uppercase border-b border-zinc-800 pb-2 text-sm">
                LIABILITIES & OWNER EQUITY
              </h4>
              <div className="flex justify-between">
                <span>Accounts Payable (Swiss Suppliers)</span>
                <span className="text-zinc-300">NPR {ap.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT Payable (13%)</span>
                <span className="text-zinc-300">NPR {vatPayable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800/80">
                <span>Total Liabilities</span>
                <span>NPR {totalLiabilities.toLocaleString()}</span>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-zinc-200">
                  <span>Owner Paid-in Capital</span>
                  <span>NPR {capital.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Retained Earnings (Net Profit)</span>
                  <span>NPR {netProfit.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-emerald-400 text-sm pt-3 border-t border-zinc-800">
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span>NPR {(totalLiabilities + totalEquity).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRIAL BALANCE */}
      {activeTab === 'trial' && (
        <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200">
            Trial Balance Sheet Verification
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-zinc-300">
              <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Account Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Debit Balance</th>
                  <th className="p-3 text-right">Credit Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {accounts.map(acc => {
                  const isDebit = acc.category === 'Assets' || acc.category === 'Expenses';
                  return (
                    <tr key={acc.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-amber-300">{acc.code}</td>
                      <td className="p-3 text-zinc-100 font-bold">{acc.name}</td>
                      <td className="p-3 text-zinc-400">{acc.category}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        {isDebit ? `NPR ${acc.balance.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-3 text-right font-bold text-amber-300">
                        {!isDebit ? `NPR ${acc.balance.toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JOURNAL ENTRIES LIST */}
      {activeTab === 'journal' && (
        <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200">
            Double-Entry Journal Postings Ledger
          </h3>
          <div className="space-y-4">
            {journalEntries.map(je => (
              <div key={je.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-amber-400 border-b border-zinc-800 pb-2">
                  <span className="font-bold">{je.entryNumber} • {je.date}</span>
                  <span className="text-zinc-400">Ref: {je.reference || 'General'}</span>
                </div>
                <p className="text-zinc-200 font-sans">{je.description}</p>
                <div className="space-y-1 pt-1">
                  {je.lines.map((line, idx) => (
                    <div key={idx} className="flex justify-between text-zinc-400">
                      <span>[{line.accountCode}] {line.accountName}</span>
                      <span>
                        {line.debit > 0 && <strong className="text-emerald-400">Dr NPR {line.debit.toLocaleString()}</strong>}
                        {line.credit > 0 && <strong className="text-amber-300"> Cr NPR {line.credit.toLocaleString()}</strong>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHART OF ACCOUNTS */}
      {activeTab === 'coa' && (
        <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200">
            Master Chart of Accounts (COA)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {accounts.map(acc => (
              <div key={acc.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1">
                <div className="flex justify-between font-bold text-amber-300">
                  <span>[{acc.code}]</span>
                  <span>{acc.category}</span>
                </div>
                <div className="font-bold text-zinc-100 text-sm">{acc.name}</div>
                <div className="text-emerald-400 font-bold pt-1">Balance: NPR {acc.balance.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAYMENTS & RECEIVED LEDGER VIEW */}
      {activeTab === 'payments' && (
        <div className="bg-zinc-900/90 rounded-2xl border border-amber-500/30 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-amber-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>Payment & Received Voucher Ledger</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Record of all incoming customer payments & outgoing expense/vendor disbursements automatically integrated into financial reports.
              </p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record New Payment / Receipt</span>
            </button>
          </div>

          {/* Quick Filter & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <input
              type="text"
              placeholder="Search by Voucher #, Party Name, or Description..."
              value={paymentSearch}
              onChange={(e) => setPaymentSearch(e.target.value)}
              className="w-full sm:w-80 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-4">
              <span>Total Entries: <strong className="text-amber-300">{journalEntries.length}</strong></span>
              <button
                onClick={handleSyncData}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-Sync Data</span>
              </button>
            </div>
          </div>

          {/* Table of Payments & Receipts */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-zinc-300">
              <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Voucher / Ref #</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Party / Particulars</th>
                  <th className="p-3">Account Lines</th>
                  <th className="p-3 text-right">Amount (NPR)</th>
                  <th className="p-3 text-right">Posted By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {journalEntries
                  .filter(je => {
                    if (!paymentSearch) return true;
                    const q = paymentSearch.toLowerCase();
                    return (
                      je.entryNumber.toLowerCase().includes(q) ||
                      (je.reference && je.reference.toLowerCase().includes(q)) ||
                      je.description.toLowerCase().includes(q)
                    );
                  })
                  .map(je => {
                    const isPayment = je.description.toUpperCase().includes('PAYMENT') || je.reference?.startsWith('PAY') || je.lines.some(l => l.credit > 0 && ['1010', '1020', '1030'].includes(l.accountCode));
                    const totalAmt = je.lines.reduce((sum, l) => sum + Math.max(l.debit, l.credit), 0) / 2 || je.lines[0]?.debit || je.lines[0]?.credit || 0;

                    return (
                      <tr key={je.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3 text-zinc-400">{je.date}</td>
                        <td className="p-3 font-bold text-amber-300">{je.reference || je.entryNumber}</td>
                        <td className="p-3">
                          {isPayment ? (
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                              PAYMENT (Out)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              RECEIVED (In)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-zinc-100 font-sans font-semibold max-w-xs truncate">
                          {je.description}
                        </td>
                        <td className="p-3 text-zinc-400">
                          {je.lines.map(l => `${l.accountName} (${l.debit > 0 ? 'Dr' : 'Cr'})`).join(', ')}
                        </td>
                        <td className={`p-3 text-right font-bold text-sm ${isPayment ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isPayment ? '-' : '+'} NPR {totalAmt.toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-zinc-400">{je.createdBy}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT / RECEIVED ENTRY MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>

            <div>
              <h3 className="font-serif text-xl font-bold text-amber-200 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>Record Payment / Received Transaction</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Posts a double-entry journal entry and automatically recalculates P&L, Balance Sheet, and Trial Balance reports.
              </p>
            </div>

            <form onSubmit={handlePostPaymentReceivedEntry} className="space-y-4 text-xs">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setEntryType('Payment');
                    setTargetCode('5040');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    entryType === 'Payment' ? 'bg-rose-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Payment Out (Expense/Vendor)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEntryType('Received');
                    setTargetCode('4010');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    entryType === 'Received' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Received In (Customer/Income)
                </button>
              </div>

              {/* Dynamic Payment / Receipt Method Account (Paid From / Received Into) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-bold block">
                    {entryType === 'Payment' ? 'Paid From Account (Credit)' : 'Received Into Account (Debit)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddAccountModal(true)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Payment Account</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={methodCode}
                    onChange={(e) => setMethodCode(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                  >
                    <optgroup label="Liquid Payment Accounts (Cash / Bank / Wallets)">
                      {accounts
                        .filter(a => a.category === 'Assets')
                        .map(acc => (
                          <option key={acc.id} value={acc.code}>
                            [{acc.code}] {acc.name} (NPR {acc.balance.toLocaleString()})
                          </option>
                        ))}
                    </optgroup>
                  </select>

                  {/* Remove Account Button for custom accounts */}
                  {accounts.some(a => a.code === methodCode && !['1010', '1020', '1030', '1200'].includes(a.code)) && (
                    <button
                      type="button"
                      title="Remove this account"
                      onClick={() => {
                        const target = accounts.find(a => a.code === methodCode);
                        if (target && confirm(`Delete payment account [${target.code}] ${target.name}?`)) {
                          deleteAccount(target.id);
                          setMethodCode('1020');
                        }
                      }}
                      className="p-3 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl border border-rose-500/30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category / Target Account (Pulled from BALANCE SHEET & PROFIT AND LOSS STATEMENT) */}
              <div className="space-y-1">
                <label className="text-zinc-300 font-bold block">
                  {entryType === 'Payment' ? 'Expense / Liability Account (Debit)' : 'Revenue / Category Account (Credit)'}
                </label>
                <select
                  value={targetCode}
                  onChange={(e) => setTargetCode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                >
                  <optgroup label="BALANCE SHEET STATEMENT - Liabilities & Equity">
                    {accounts
                      .filter(a => a.category === 'Liabilities' || a.category === 'Equity')
                      .map(acc => (
                        <option key={acc.id} value={acc.code}>
                          [{acc.code}] {acc.name} ({acc.category}) - NPR {acc.balance.toLocaleString()}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="PROFIT & LOSS STATEMENT - Operating Expenses">
                    {accounts
                      .filter(a => a.category === 'Expenses')
                      .map(acc => (
                        <option key={acc.id} value={acc.code}>
                          [{acc.code}] {acc.name} ({acc.category}) - NPR {acc.balance.toLocaleString()}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="BALANCE SHEET STATEMENT - Assets">
                    {accounts
                      .filter(a => a.category === 'Assets')
                      .map(acc => (
                        <option key={acc.id} value={acc.code}>
                          [{acc.code}] {acc.name} ({acc.category}) - NPR {acc.balance.toLocaleString()}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="PROFIT & LOSS STATEMENT - Operating Revenue">
                    {accounts
                      .filter(a => a.category === 'Revenue')
                      .map(acc => (
                        <option key={acc.id} value={acc.code}>
                          [{acc.code}] {acc.name} ({acc.category}) - NPR {acc.balance.toLocaleString()}
                        </option>
                      ))}
                  </optgroup>
                </select>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Pulled directly from Balance Sheet Statement and Profit & Loss Statement accounts ledger.
                </p>
              </div>

              {/* Payee / Vendor / Party Name (Pulled from Customer CRM & Supplier Ledgers) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-bold block">
                    {entryType === 'Payment' ? 'Payee / Vendor / Party Name' : 'Payer / Client Name'}
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">
                    Pulled from Customer CRM & Suppliers
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    list="crm-parties-list"
                    placeholder={entryType === 'Payment' ? "Select or type Supplier / Vendor Name (e.g., Gongabu Watch Store)" : "Select or type Customer / Client Name (e.g., Sujan Karki)"}
                    value={partyName}
                    onChange={(e) => handleSelectPartyFromCRM(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                  <datalist id="crm-parties-list">
                    {suppliers.map(s => {
                      const supPOs = purchases.filter(p => p.supplierId === s.id || p.supplierName.toLowerCase().trim() === s.name.toLowerCase().trim());
                      const poTotalCost = supPOs.reduce((sum, p) => sum + p.cost, 0);
                      const apDue = poTotalCost > 0 ? poTotalCost : s.balanceDue;
                      return (
                        <option key={`sup-${s.id}`} value={s.name}>
                          Supplier Ledger • AP Due: NPR {apDue.toLocaleString()} ({s.mobile})
                        </option>
                      );
                    })}
                    {customers.map(c => (
                      <option key={`cust-${c.id}`} value={c.name}>
                        Customer CRM • Purchases: NPR {c.totalPurchases.toLocaleString()} ({c.mobile})
                      </option>
                    ))}
                  </datalist>

                  {/* Quick Party Picker Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-zinc-500 block w-full">Quick Pick from Ledgers:</span>
                    {suppliers.map(s => {
                      const supPOs = purchases.filter(p => p.supplierId === s.id || p.supplierName.toLowerCase().trim() === s.name.toLowerCase().trim());
                      const poTotalCost = supPOs.reduce((sum, p) => sum + p.cost, 0);
                      const apDue = poTotalCost > 0 ? poTotalCost : s.balanceDue;
                      return (
                        <button
                          key={`btn-sup-${s.id}`}
                          type="button"
                          onClick={() => handleSelectPartyFromCRM(s.name)}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 text-[10px] font-bold border border-zinc-700 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Building2 className="w-3 h-3 text-amber-400" />
                          <span>{s.name} (Due: NPR {apDue.toLocaleString()})</span>
                        </button>
                      );
                    })}
                    {customers.slice(0, 3).map(c => (
                      <button
                        key={`btn-cust-${c.id}`}
                        type="button"
                        onClick={() => handleSelectPartyFromCRM(c.name)}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 text-[10px] font-bold border border-zinc-700 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3 h-3 text-emerald-400" />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amount & Voucher No */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-bold block">Amount (NPR)</label>
                  <input
                    type="number"
                    placeholder="e.g., 25000"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    required
                    min="1"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-amber-300 font-bold text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-300 font-bold block">Voucher / Ref #</label>
                  <input
                    type="text"
                    placeholder={`Auto e.g. ${entryType === 'Payment' ? 'PAY-0091' : 'REC-0042'}`}
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Date & Description */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-bold block">Transaction Date</label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-300 font-bold block">Remarks / Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Paid via Nabil online banking"
                    value={entryDescription}
                    onChange={(e) => setEntryDescription(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Post & Auto-Sync Financials</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC ADD PAYMENT ACCOUNT MODAL */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative text-white">
            <button
              onClick={() => setShowAddAccountModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>

            <div>
              <h3 className="font-serif text-lg font-bold text-amber-200 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add New Custom Payment Account</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Admin can dynamically create a new Bank, Cash, Wallet, or Asset account in the Chart of Accounts.
              </p>
            </div>

            <form onSubmit={handleCreateNewPaymentAccount} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-bold block mb-1">Account Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Global IME Bank Operating Account or Khalti Wallet"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Account Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1040"
                    value={newAccCode}
                    onChange={(e) => setNewAccCode(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Account Category</label>
                  <select
                    value={newAccCategory}
                    onChange={(e) => setNewAccCategory(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Assets">Assets (Bank / Wallet / Cash)</option>
                    <option value="Liabilities">Liabilities</option>
                    <option value="Expenses">Operating Expenses</option>
                    <option value="Revenue">Operating Revenue</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-2 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl cursor-pointer shadow-lg"
                >
                  Save & Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
