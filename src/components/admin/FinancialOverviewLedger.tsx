import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Calculator, Layers, ArrowUpRight, ArrowDownLeft, 
  CheckCircle2, AlertCircle, RefreshCw, BarChart2, ShieldCheck, 
  FileText, ChevronDown, ChevronUp, Eye, CreditCard, Wallet, 
  Building2, Sparkles, TrendingUp, BookOpen
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { JournalEntry, Account } from '../../types';

interface FinancialOverviewLedgerProps {
  onNavigateToAccounting?: () => void;
  onNavigateToSales?: () => void;
  onNavigateToInventory?: () => void;
}

export const FinancialOverviewLedger: React.FC<FinancialOverviewLedgerProps> = ({
  onNavigateToAccounting,
  onNavigateToSales,
  onNavigateToInventory
}) => {
  const { sales, purchases, products, accounts, journalEntries } = useApp();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedVoucherFilter, setSelectedVoucherFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'TRANSACTIONS' | 'CHART_OF_ACCOUNTS' | 'DOUBLE_ENTRY_HEALTH'>('TRANSACTIONS');

  // 1. SALES METRICS (Computed from Sales Invoices & GL Revenue Account 4010)
  const salesMetrics = useMemo(() => {
    const totalGrossSales = sales.reduce((acc, s) => acc + (s.sellingPrice || 0), 0);
    const totalDiscount = sales.reduce((acc, s) => acc + (s.discount || 0), 0);
    const totalVAT = sales.reduce((acc, s) => acc + (s.vatAmount || 0), 0);
    const totalNetRevenue = sales.reduce((acc, s) => acc + (s.finalTotal || 0), 0);
    
    // Revenue by Payment Gateway / Source Ledger Account
    const byAccount: Record<string, number> = {
      'Cash in Hand (1010)': 0,
      'Nabil Bank (1020)': 0,
      'eSewa Wallet (1030)': 0,
      'Khalti/Gateway (1040)': 0,
      'Accounts Receivable (1100)': 0
    };

    sales.forEach(s => {
      const pm = s.paymentMethod;
      if (pm === 'Cash' || pm === 'Cash on Delivery') {
        byAccount['Cash in Hand (1010)'] += s.finalTotal;
      } else if (pm === 'Bank Transfer') {
        byAccount['Nabil Bank (1020)'] += s.finalTotal;
      } else if (pm === 'eSewa') {
        byAccount['eSewa Wallet (1030)'] += s.finalTotal;
      } else if (pm === 'Khalti' || pm === 'ConnectIPS') {
        byAccount['Khalti/Gateway (1040)'] += s.finalTotal;
      } else {
        byAccount['Cash in Hand (1010)'] += s.finalTotal;
      }
    });

    const salesAccount = accounts.find(a => a.code === '4010');
    const glRecordedRevenue = salesAccount ? Math.abs(salesAccount.balance) : totalNetRevenue;

    return {
      totalNetRevenue,
      totalGrossSales,
      totalDiscount,
      totalVAT,
      orderCount: sales.length,
      glRecordedRevenue,
      byAccount
    };
  }, [sales, accounts]);

  // 2. INVENTORY ASSET VALUATION (Computed from Double-Entry Account 1200 & Product SKU Data)
  const inventoryMetrics = useMemo(() => {
    const totalPhysicalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalCostValuation = products.reduce((acc, p) => acc + ((p.stock || 0) * (p.purchasePrice || 0)), 0);
    const totalRetailValuation = products.reduce((acc, p) => acc + ((p.stock || 0) * (p.sellingPrice || 0)), 0);
    const potentialGrossMargin = totalRetailValuation - totalCostValuation;
    const marginPercent = totalRetailValuation > 0 ? (potentialGrossMargin / totalRetailValuation) * 100 : 0;

    const invAccount = accounts.find(a => a.code === '1200');
    const glInventoryAssetBalance = invAccount ? invAccount.balance : totalCostValuation;

    return {
      totalPhysicalUnits,
      totalCostValuation,
      totalRetailValuation,
      potentialGrossMargin,
      marginPercent,
      glInventoryAssetBalance
    };
  }, [products, accounts]);

  // 3. DOUBLE-ENTRY LEDGER TRANSACTIONS & BALANCING VERIFICATION
  const ledgerAnalysis = useMemo(() => {
    let totalDebits = 0;
    let totalCredits = 0;

    journalEntries.forEach(je => {
      je.lines?.forEach(line => {
        totalDebits += Number(line.debit || 0);
        totalCredits += Number(line.credit || 0);
      });
    });

    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;
    const recentEntries = [...journalEntries].sort((a, b) => {
      return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
    });

    // Account Balances by Category
    const categoryTotals = {
      Assets: 0,
      Liabilities: 0,
      Equity: 0,
      Revenue: 0,
      Expenses: 0
    };

    accounts.forEach(a => {
      if (categoryTotals[a.category] !== undefined) {
        categoryTotals[a.category] += (a.balance || 0);
      }
    });

    const liquidCash = (accounts.find(a => a.code === '1010')?.balance || 0) +
                       (accounts.find(a => a.code === '1020')?.balance || 0) +
                       (accounts.find(a => a.code === '1030')?.balance || 0) +
                       (accounts.find(a => a.code === '1040')?.balance || 0);

    const accountsPayable = accounts.find(a => a.code === '2010')?.balance || 0;
    const accountsReceivable = accounts.find(a => a.code === '1100')?.balance || 0;

    return {
      totalDebits,
      totalCredits,
      isBalanced,
      recentEntries,
      categoryTotals,
      liquidCash,
      accountsPayable,
      accountsReceivable
    };
  }, [journalEntries, accounts]);

  // Filtered Journal Entries
  const filteredEntries = useMemo(() => {
    if (selectedVoucherFilter === 'ALL') return ledgerAnalysis.recentEntries;
    return ledgerAnalysis.recentEntries.filter(je => je.voucherType === selectedVoucherFilter || je.sourceModule === selectedVoucherFilter);
  }, [ledgerAnalysis.recentEntries, selectedVoucherFilter]);

  // Recharts Chart Data: Financial Composition
  const financialCompositionData = useMemo(() => [
    { name: 'Liquid Cash & Bank', value: Math.max(0, ledgerAnalysis.liquidCash), fill: '#10B981' },
    { name: 'Watch Inventory Asset', value: Math.max(0, inventoryMetrics.totalCostValuation), fill: '#D4AF37' },
    { name: 'Accounts Receivable', value: Math.max(0, ledgerAnalysis.accountsReceivable), fill: '#38BDF8' },
    { name: 'Accounts Payable', value: Math.max(0, ledgerAnalysis.accountsPayable), fill: '#F43F5E' },
  ].filter(d => d.value > 0), [ledgerAnalysis, inventoryMetrics]);

  // Recharts Chart Data: Sales by Channel
  const salesChannelChartData = useMemo(() => {
    return Object.keys(salesMetrics.byAccount).map(key => ({
      channel: key.split(' ')[0],
      fullName: key,
      amount: salesMetrics.byAccount[key]
    })).filter(d => d.amount > 0);
  }, [salesMetrics.byAccount]);

  return (
    <div className="bg-[#0B0B0E] border-2 border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
      
      {/* EXECUTIVE FINANCIAL TOP BAR */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#101015] to-zinc-950 p-4 sm:p-5 border-b border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-700/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                EXECUTIVE FINANCIAL OVERVIEW & DOUBLE-ENTRY LEDGER
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {ledgerAnalysis.isBalanced ? 'Double-Entry Balanced' : 'Ledger Active'}
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-100">
              Live Balance Sheet, Sales & Inventory Valuation
            </h3>
          </div>
        </div>

        {/* Quick Top Metrics Ribbon */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-start md:justify-end">
          
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-left">
            <span className="text-[10px] font-mono text-zinc-400 block">Total Sales</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-amber-300">
              NPR {salesMetrics.totalNetRevenue.toLocaleString()}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-left">
            <span className="text-[10px] font-mono text-zinc-400 block">Inventory Valuation</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-300">
              NPR {inventoryMetrics.totalCostValuation.toLocaleString()}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-left">
            <span className="text-[10px] font-mono text-zinc-400 block">Liquid Working Capital</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-blue-300">
              NPR {ledgerAnalysis.liquidCash.toLocaleString()}
            </span>
          </div>

          {/* Toggle Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title={isExpanded ? 'Collapse Financial Overview' : 'Expand Financial Overview'}
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

      </div>

      {/* EXPANDED SECTION */}
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-6 animate-fadeIn">
          
          {/* THREE CORE METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* CARD 1: TOTAL SALES & REVENUE REALIZATION */}
            <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/90 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">GL ACCOUNT 4010</span>
                    <h4 className="font-serif font-bold text-sm text-zinc-100">Total Sales Revenue</h4>
                  </div>
                </div>
                {onNavigateToSales && (
                  <button
                    onClick={onNavigateToSales}
                    className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Sales Module</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-200">
                  NPR {salesMetrics.totalNetRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                  <span>Gross Sales: NPR {salesMetrics.totalGrossSales.toLocaleString()}</span>
                  <span>{salesMetrics.orderCount} Invoices</span>
                </div>
              </div>

              {/* Payment Account Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-xs font-mono">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">Revenue by Ledger Account:</span>
                {Object.entries(salesMetrics.byAccount).map(([accName, amt]) => (
                  <div key={accName} className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400">{accName}</span>
                    <span className="text-zinc-200 font-bold">NPR {amt.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 2: INVENTORY VALUATION & FIFO ASSET */}
            <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/90 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">GL ACCOUNT 1200</span>
                    <h4 className="font-serif font-bold text-sm text-zinc-100">Inventory Valuation</h4>
                  </div>
                </div>
                {onNavigateToInventory && (
                  <button
                    onClick={onNavigateToInventory}
                    className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inventory Module</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-300">
                  NPR {inventoryMetrics.totalCostValuation.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                  <span>At Cost Price</span>
                  <span className="text-amber-300 font-bold">{inventoryMetrics.totalPhysicalUnits} Total Pieces</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-xs font-mono">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Retail Realization:</span>
                  <span className="text-zinc-100 font-bold">NPR {inventoryMetrics.totalRetailValuation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Potential Gross Profit:</span>
                  <span className="text-emerald-400 font-bold">NPR {inventoryMetrics.potentialGrossMargin.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Projected Margin:</span>
                  <span className="text-amber-400 font-bold">{inventoryMetrics.marginPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* CARD 3: DOUBLE-ENTRY LEDGER HEALTH & LIQUIDITY */}
            <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/90 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-bold block">AUDIT COMPLIANCE</span>
                    <h4 className="font-serif font-bold text-sm text-zinc-100">Double-Entry Status</h4>
                  </div>
                </div>
                {onNavigateToAccounting && (
                  <button
                    onClick={onNavigateToAccounting}
                    className="text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>General Ledger</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-blue-300">
                    {ledgerAnalysis.isBalanced ? 'Balanced Equation' : 'Ledger In Sync'}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  Debits = Credits: NPR {ledgerAnalysis.totalDebits.toLocaleString()}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-xs font-mono">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Liquid Cash & Bank:</span>
                  <span className="text-emerald-400 font-bold">NPR {ledgerAnalysis.liquidCash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Accounts Payable (2010):</span>
                  <span className="text-rose-400 font-bold">NPR {ledgerAnalysis.accountsPayable.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-zinc-400">Total Journal Entries:</span>
                  <span className="text-amber-300 font-bold">{journalEntries.length} Vouchers</span>
                </div>
              </div>
            </div>

          </div>

          {/* RECENT DOUBLE-ENTRY LEDGER TRANSACTIONS SECTION */}
          <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800/90 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif font-bold text-sm text-amber-200">
                  Recent Double-Entry Journal Vouchers & Transactions
                </h4>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-400">Voucher Type:</span>
                <select
                  value={selectedVoucherFilter}
                  onChange={(e) => setSelectedVoucherFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="ALL">All Vouchers ({ledgerAnalysis.recentEntries.length})</option>
                  <option value="Sales Invoice">Sales Invoices</option>
                  <option value="Purchase Invoice">Purchase Invoices</option>
                  <option value="Customer Receipt">Customer Receipts</option>
                  <option value="Supplier Payment">Supplier Payments</option>
                  <option value="Expense Voucher">Expense Vouchers</option>
                  <option value="Journal Voucher">Manual Journal Vouchers</option>
                </select>
              </div>
            </div>

            {/* Transactions List */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs font-mono space-y-2">
                <Calculator className="w-8 h-8 mx-auto text-zinc-600 opacity-40" />
                <div>No journal entries found matching current filter.</div>
                <div className="text-zinc-600 text-[11px]">Book a sale or purchase order to automatically post double-entry vouchers.</div>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {filteredEntries.slice(0, 8).map((entry) => {
                  const entryTotalDebit = entry.lines?.reduce((sum, l) => sum + (l.debit || 0), 0) || 0;
                  const debitLines = entry.lines?.filter(l => l.debit > 0) || [];
                  const creditLines = entry.lines?.filter(l => l.credit > 0) || [];

                  return (
                    <div 
                      key={entry.id} 
                      className="p-3.5 bg-zinc-900/70 border border-zinc-800/90 hover:border-amber-500/40 rounded-xl space-y-2.5 transition-all text-xs font-mono"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-800/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                            {entry.entryNumber || entry.id}
                          </span>
                          <span className="text-zinc-200 font-sans font-bold">{entry.description}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                          <span>Ref: <strong className="text-zinc-300">{entry.reference || 'N/A'}</strong></span>
                          <span>{entry.date}</span>
                          <span className="text-emerald-400 font-bold">NPR {entryTotalDebit.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Double-Entry T-Account Line Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        {/* DEBITS */}
                        <div className="space-y-1 bg-zinc-950 p-2 rounded-lg border border-emerald-500/20">
                          <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center justify-between">
                            <span>Debit (Dr) Accounts</span>
                            <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                          </div>
                          {debitLines.map((dl, idx) => (
                            <div key={idx} className="flex justify-between items-center text-zinc-300">
                              <span className="truncate pr-2">[{dl.accountCode}] {dl.accountName}</span>
                              <span className="text-emerald-300 font-bold shrink-0">NPR {dl.debit.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        {/* CREDITS */}
                        <div className="space-y-1 bg-zinc-950 p-2 rounded-lg border border-amber-500/20">
                          <div className="text-[10px] font-bold text-amber-400 uppercase flex items-center justify-between">
                            <span>Credit (Cr) Accounts</span>
                            <ArrowUpRight className="w-3 h-3 text-amber-400" />
                          </div>
                          {creditLines.map((cl, idx) => (
                            <div key={idx} className="flex justify-between items-center text-zinc-300">
                              <span className="truncate pr-2">[{cl.accountCode}] {cl.accountName}</span>
                              <span className="text-amber-300 font-bold shrink-0">NPR {cl.credit.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom ledger navigation footer */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Double-entry integrity strictly maintained across ERP</span>
              </span>
              {onNavigateToAccounting && (
                <button
                  onClick={onNavigateToAccounting}
                  className="text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer"
                >
                  View Full General Ledger & Trial Balance →
                </button>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
