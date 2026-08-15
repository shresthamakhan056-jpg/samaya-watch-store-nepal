import {
  Account,
  AccountCategory,
  AccountGroup,
  CostCenter,
  Customer,
  FiscalYear,
  FixedAsset,
  JournalEntry,
  JournalEntryLine,
  Product,
  Purchase,
  Sale,
  Supplier,
  VoucherType
} from '../types';

export const DEFAULT_CHART_OF_ACCOUNTS: Account[] = [
  // 1000 - ASSETS (Current Assets)
  {
    id: 'acc-1010',
    code: '1010',
    name: 'Cash in Hand (Showroom Till)',
    category: 'Assets',
    group: 'Current Assets',
    type: 'Cash',
    openingBalance: 0,
    balance: 0,
    description: 'Physical cash held in showroom cash drawer and safe.',
    isSystem: true
  },
  {
    id: 'acc-1020',
    code: '1020',
    name: 'Nabil Bank Corporate Account',
    category: 'Assets',
    group: 'Current Assets',
    type: 'Bank',
    openingBalance: 0,
    balance: 0,
    description: 'Primary corporate checking account for vendor transfers and POS settlements.',
    isSystem: true
  },
  {
    id: 'acc-1030',
    code: '1030',
    name: 'eSewa Merchant Wallet',
    category: 'Assets',
    group: 'Current Assets',
    type: 'Bank',
    openingBalance: 0,
    balance: 0,
    description: 'Digital wallet merchant gateway for customer QR code payments.',
    isSystem: true
  },
  {
    id: 'acc-1040',
    code: '1040',
    name: 'Khalti & ConnectIPS Gateway',
    category: 'Assets',
    group: 'Current Assets',
    type: 'Bank',
    openingBalance: 0,
    balance: 0,
    description: 'Secondary online digital payment gateway account.',
    isSystem: true
  },
  {
    id: 'acc-1100',
    code: '1100',
    name: 'Accounts Receivable (Trade Debtors)',
    category: 'Assets',
    group: 'Current Assets',
    type: 'A/R',
    openingBalance: 0,
    balance: 0,
    description: 'Amounts due from customers for credit purchases and delivery-on-approval.',
    isSystem: true
  },
  {
    id: 'acc-1200',
    code: '1200',
    name: 'Watch Inventory Asset (Merchandise)',
    category: 'Assets',
    group: 'Current Assets',
    type: 'Inventory',
    openingBalance: 0,
    balance: 0,
    description: 'Carrying value of imported Swiss & luxury timepieces in stock.',
    isSystem: true
  },
  {
    id: 'acc-1300',
    code: '1300',
    name: 'Input VAT (Tax Paid on Purchases)',
    category: 'Assets',
    group: 'Current Assets',
    type: 'VAT',
    openingBalance: 0,
    balance: 0,
    description: '13% VAT paid on customs import and local purchases, claimable against output VAT.',
    isSystem: true
  },
  {
    id: 'acc-1400',
    code: '1400',
    name: 'Advance & Security Deposits',
    category: 'Assets',
    group: 'Current Assets',
    type: 'Expenses',
    openingBalance: 0,
    balance: 0,
    description: 'Showroom lease deposit and customs clearance advance.',
    isSystem: false
  },

  // 1500 - FIXED ASSETS
  {
    id: 'acc-1510',
    code: '1510',
    name: 'Showroom Fixtures & Display Vitrines',
    category: 'Assets',
    group: 'Fixed Assets',
    type: 'Fixed Asset',
    openingBalance: 0,
    balance: 0,
    description: 'Custom luxury velvet watch display cases, glass counters and showroom lighting.',
    isSystem: false
  },
  {
    id: 'acc-1520',
    code: '1520',
    name: 'Watchmaker Diagnostic & Repair Tools',
    category: 'Assets',
    group: 'Fixed Assets',
    type: 'Fixed Asset',
    openingBalance: 0,
    balance: 0,
    description: 'Timegrapher, case opening presses, ultrasonic cleaner, and demagnetizer tools.',
    isSystem: false
  },
  {
    id: 'acc-1530',
    code: '1530',
    name: 'IT Equipment & POS Terminals',
    category: 'Assets',
    group: 'Fixed Assets',
    type: 'Fixed Asset',
    openingBalance: 0,
    balance: 0,
    description: 'Thermal receipt printers, barcode scanners, security DVR and server hardware.',
    isSystem: false
  },
  {
    id: 'acc-1590',
    code: '1590',
    name: 'Accumulated Depreciation (Contra-Asset)',
    category: 'Assets',
    group: 'Fixed Assets',
    type: 'Fixed Asset',
    openingBalance: 0,
    balance: 0,
    description: 'Total cumulative depreciation written off on fixed assets.',
    isSystem: true
  },

  // 2000 - LIABILITIES
  {
    id: 'acc-2010',
    code: '2010',
    name: 'Accounts Payable (Trade Creditors)',
    category: 'Liabilities',
    group: 'Current Liabilities',
    type: 'A/P',
    openingBalance: 0,
    balance: 0,
    description: 'Amounts owed to watch distributors, overseas suppliers and logistics agents.',
    isSystem: true
  },
  {
    id: 'acc-2020',
    code: '2020',
    name: 'Output VAT Payable (13%)',
    category: 'Liabilities',
    group: 'Current Liabilities',
    type: 'VAT',
    openingBalance: 0,
    balance: 0,
    description: '13% VAT collected on taxable watch retail sales, payable to IRD Nepal.',
    isSystem: true
  },
  {
    id: 'acc-2030',
    code: '2030',
    name: 'Customer Advances & Booking Deposits',
    category: 'Liabilities',
    group: 'Current Liabilities',
    type: 'A/P',
    openingBalance: 0,
    balance: 0,
    description: 'Advance deposits received for limited edition watch pre-orders.',
    isSystem: false
  },
  {
    id: 'acc-2040',
    code: '2040',
    name: 'Accrued Expenses & Salaries Payable',
    category: 'Liabilities',
    group: 'Current Liabilities',
    type: 'Expenses',
    openingBalance: 0,
    balance: 0,
    description: 'Accrued staff wages, electricity and showroom lease bills pending disbursement.',
    isSystem: false
  },

  // 3000 - EQUITY
  {
    id: 'acc-3010',
    code: '3010',
    name: 'Owner Capital Equity',
    category: 'Equity',
    group: 'Capital & Equity',
    type: 'Equity',
    openingBalance: 0,
    balance: 0,
    description: 'Initial and contributed capital from founder.',
    isSystem: true
  },
  {
    id: 'acc-3020',
    code: '3020',
    name: 'Retained Earnings (Accumulated Profit)',
    category: 'Equity',
    group: 'Retained Earnings',
    type: 'Equity',
    openingBalance: 0,
    balance: 0,
    description: 'Cumulative retained net income carried forward from past periods.',
    isSystem: true
  },
  {
    id: 'acc-3030',
    code: '3030',
    name: 'Owner Drawings',
    category: 'Equity',
    group: 'Capital & Equity',
    type: 'Equity',
    openingBalance: 0,
    balance: 0,
    description: 'Capital withdrawals made by the proprietor.',
    isSystem: false
  },

  // 4000 - REVENUE
  {
    id: 'acc-4010',
    code: '4010',
    name: 'Watch Sales Revenue',
    category: 'Revenue',
    group: 'Operating Revenue',
    type: 'Sales',
    openingBalance: 0,
    balance: 0,
    description: 'Gross revenue generated from luxury, automatic, and quartz timepiece sales.',
    isSystem: true
  },
  {
    id: 'acc-4020',
    code: '4020',
    name: 'Watch Servicing & Repair Revenue',
    category: 'Revenue',
    group: 'Operating Revenue',
    type: 'Sales',
    openingBalance: 0,
    balance: 0,
    description: 'Revenue from battery replacement, mechanical overhaul, and polishing service.',
    isSystem: false
  },
  {
    id: 'acc-4030',
    code: '4030',
    name: 'Other Operating Income',
    category: 'Revenue',
    group: 'Operating Revenue',
    type: 'Revenue',
    openingBalance: 0,
    balance: 0,
    description: 'Watch box sales, strap customizations, and ancillary retail revenue.',
    isSystem: false
  },

  // 5000 - EXPENSES & COGS
  {
    id: 'acc-5010',
    code: '5010',
    name: 'Cost of Goods Sold (COGS)',
    category: 'Expenses',
    group: 'Direct Cost & COGS',
    type: 'Purchase',
    openingBalance: 0,
    balance: 0,
    description: 'Direct landed cost of watch inventory sold to customers during the period.',
    isSystem: true
  },
  {
    id: 'acc-5020',
    code: '5020',
    name: 'Courier & Secure Logistics Expense',
    category: 'Expenses',
    group: 'Selling & Distribution Expenses',
    type: 'Courier Charges',
    openingBalance: 0,
    balance: 0,
    description: 'Express armored & tracked delivery charges across Nepal (Nepal Post / Pathao / Shipway).',
    isSystem: false
  },
  {
    id: 'acc-5030',
    code: '5030',
    name: 'Sales Discounts Given',
    category: 'Expenses',
    group: 'Selling & Distribution Expenses',
    type: 'Discount',
    openingBalance: 0,
    balance: 0,
    description: 'Promotional and customer trade discounts deducted on retail invoices.',
    isSystem: true
  },
  {
    id: 'acc-5040',
    code: '5040',
    name: 'Social Media & Influencer Marketing',
    category: 'Expenses',
    group: 'Selling & Distribution Expenses',
    type: 'Expenses',
    openingBalance: 0,
    balance: 0,
    description: 'TikTok, Instagram, and Facebook sponsored ads and creator collaboration fees.',
    isSystem: false
  },
  {
    id: 'acc-5050',
    code: '5050',
    name: 'Showroom Rent & Store Lease',
    category: 'Expenses',
    group: 'Administrative & General Expenses',
    type: 'Expenses',
    openingBalance: 0,
    balance: 0,
    description: 'Monthly lease for Durbar Marg flagship showroom.',
    isSystem: false
  },
  {
    id: 'acc-5060',
    code: '5060',
    name: 'Staff Salary, Allowances & Commissions',
    category: 'Expenses',
    group: 'Administrative & General Expenses',
    type: 'Expenses',
    openingBalance: 0,
    balance: 0,
    description: 'Wages for sales associates, horologists, warranty technicians and store manager.',
    isSystem: false
  },
  {
    id: 'acc-5070',
    code: '5070',
    name: 'Showroom Utilities, Power & Internet',
    category: 'Expenses',
    group: 'Administrative & General Expenses',
    type: 'Expenses',
    openingBalance: 0,
    balance: 0,
    description: 'Electricity backup (NEA), Wi-Fi, air conditioning, and showroom upkeep.',
    isSystem: false
  },
  {
    id: 'acc-5080',
    code: '5080',
    name: 'Depreciation Expense',
    category: 'Expenses',
    group: 'Administrative & General Expenses',
    type: 'Expenses',
    openingBalance: 0,
    balance: 0,
    description: 'Periodic depreciation write-off on showroom equipment and tools.',
    isSystem: true
  },
  {
    id: 'acc-5090',
    code: '5090',
    name: 'Bank Charges & Payment Gateway Fees',
    category: 'Expenses',
    group: 'Financial & Bank Charges',
    type: 'Expenses',
    openingBalance: 0,
    balance: 0,
    description: 'eSewa, Khalti, and POS merchant transaction processing commission fees.',
    isSystem: false
  }
];

export const DEFAULT_COST_CENTERS: CostCenter[] = [
  {
    id: 'cc-1',
    code: 'CC-FLAGSHIP',
    name: 'Durbar Marg Flagship Showroom',
    description: 'Walk-in retail sales, VIP lounge, and in-person consultations',
    active: true
  },
  {
    id: 'cc-2',
    code: 'CC-ONLINE',
    name: 'Online Commerce & Social Orders',
    description: 'TikTok, Instagram DM, Facebook Messenger, and phone delivery orders',
    active: true
  },
  {
    id: 'cc-3',
    code: 'CC-SERVICE',
    name: 'Service Center & Technical Workshop',
    description: 'Watch repairs, warranty servicing, parts replacements, and QC',
    active: true
  },
  {
    id: 'cc-4',
    code: 'CC-HQ',
    name: 'HQ Operations & Administration',
    description: 'Executive management, accounting, procurement, and legal',
    active: true
  }
];

export const DEFAULT_FISCAL_YEARS: FiscalYear[] = [
  {
    id: 'fy-2026-27',
    name: 'FY 2082/83 (2026/27)',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    isCurrent: true,
    status: 'Active'
  },
  {
    id: 'fy-2025-26',
    name: 'FY 2081/82 (2025/26)',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    isCurrent: false,
    status: 'Closed'
  }
];

export const DEFAULT_FIXED_ASSETS: FixedAsset[] = [];

// ==========================================
// 1. GENERAL LEDGER ROW & GROUP STRUCTURE
// ==========================================
export interface GeneralLedgerRow {
  id: string;
  entryId: string;
  entryNumber: string;
  date: string;
  voucherType: VoucherType | string;
  sourceModule: string;
  accountCode: string;
  accountName: string;
  accountCategory: AccountCategory;
  accountGroup?: AccountGroup;
  description: string;
  particulars?: string;
  debit: number;
  credit: number;
  balance: number; // Running balance computed per account
  runningBalance?: number;
  customerName?: string;
  customerId?: string;
  supplierName?: string;
  supplierId?: string;
  costCenterName?: string;
  reference?: string;
  createdBy: string;
  isReversed?: boolean;
}

export interface AccountLedgerTransaction {
  id: string;
  entryId: string;
  entryNumber: string;
  date: string;
  voucherType: string;
  sourceModule: string;
  particulars: string;
  description: string;
  reference?: string;
  debit: number;
  credit: number;
  runningBalance: number;
  balance: number;
  createdBy: string;
}

export interface AccountLedgerGroup {
  accountId: string;
  accountCode: string;
  accountName: string;
  category: AccountCategory;
  group?: AccountGroup;
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
  transactions: AccountLedgerTransaction[];
}

export interface CustomerSubLedgerRecord {
  customerId: string;
  customerName: string;
  mobile: string;
  email?: string;
  openingBalance: number;
  totalInvoiced: number;
  totalReceived: number;
  balanceDue: number;
  currentBalanceDue: number;
  transactions: {
    id: string;
    date: string;
    entryNumber: string;
    voucherType: string;
    description: string;
    particulars: string;
    reference: string;
    debit: number;
    credit: number;
    balance: number;
    runningBalance: number;
  }[];
}

export interface SupplierSubLedgerRecord {
  supplierId: string;
  supplierName: string;
  contactPerson?: string;
  mobile?: string;
  openingBalance: number;
  totalPurchased: number;
  totalPaid: number;
  balancePayable: number;
  currentBalancePayable: number;
  transactions: {
    id: string;
    date: string;
    entryNumber: string;
    voucherType: string;
    description: string;
    particulars: string;
    reference: string;
    debit: number;
    credit: number;
    balance: number;
    runningBalance: number;
  }[];
}

// ==========================================
// 2. TRIAL BALANCE ROW STRUCTURE
// ==========================================
export interface TrialBalanceRow {
  accountCode: string;
  accountName: string;
  category: AccountCategory;
  group?: AccountGroup;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
  netBalance: number;
}

export interface TrialBalanceResult {
  rows: TrialBalanceRow[];
  accounts: {
    accountId: string;
    accountCode: string;
    accountName: string;
    category: AccountCategory;
    debitBalance: number;
    creditBalance: number;
  }[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  difference: number;
}

// ==========================================
// 3. FINANCIAL STATEMENTS MODELS
// ==========================================
export interface ProfitAndLossReport {
  revenue: number;
  grossRevenue: number;
  discountsGiven: number;
  netRevenue: number;
  costOfGoodsSold: number;
  cogs: number;
  grossProfit: number;
  grossMarginPercentage: number;
  grossMarginPct: number;
  revenueBreakdown: { code: string; name: string; amount: number }[];
  cogsBreakdown: { code: string; name: string; amount: number }[];
  operatingExpenses: { code: string; name: string; amount: number }[];
  expensesByGroup: {
    group: AccountGroup | string;
    accounts: { code: string; name: string; amount: number }[];
    total: number;
  }[];
  totalOperatingExpenses: number;
  operatingProfit: number; // EBIT
  operatingMarginPct: number;
  taxExpense: number;
  netProfit: number; // Net Income
  netMarginPercentage: number;
  netMarginPct: number;
}

export interface BalanceSheetReport {
  currentAssets: { code: string; name: string; amount: number }[];
  totalCurrentAssets: number;
  fixedAssets: { code: string; name: string; amount: number }[];
  lessAccumulatedDepreciation: number;
  netFixedAssets: number;
  totalAssets: number;

  currentLiabilities: { code: string; name: string; amount: number }[];
  totalCurrentLiabilities: number;
  longTermLiabilities: { code: string; name: string; amount: number }[];
  totalLiabilities: number;

  equity: { code: string; name: string; amount: number }[];
  equityItems: { code: string; name: string; amount: number }[];
  retainedEarningsPrior: number;
  currentPeriodNetIncome: number;
  totalEquity: number;

  totalLiabilitiesAndEquity: number;
  difference: number;
  balanceDifference: number; // MUST BE 0.00
  isBalanced: boolean;
}

export interface CashFlowActivityItem {
  particulars: string;
  amount: number;
}

export interface CashFlowReport {
  operatingActivities: CashFlowActivityItem[];
  investingActivities: CashFlowActivityItem[];
  financingActivities: CashFlowActivityItem[];
  netCashFromOperations: number;
  netCashFromInvesting: number;
  netCashFromFinancing: number;
  beginningCash: number;
  beginningCashAndBank: number;
  netChangeInCash: number;
  netCashFlow: number;
  endingCash: number;
  endingCashAndBank: number;
  details: {
    operatingActivities: {
      netIncome: number;
      depreciationAddBack: number;
      workingCapitalChanges: {
        arChange: number;
        inventoryChange: number;
        apChange: number;
        vatPayableChange: number;
      };
      netOperatingCash: number;
    };
    investingActivities: {
      fixedAssetPurchases: number;
      netInvestingCash: number;
    };
    financingActivities: {
      capitalInjections: number;
      drawings: number;
      netFinancingCash: number;
    };
    netCashFlow: number;
    beginningCashAndBank: number;
    endingCashAndBank: number;
  };
}

export interface AgingBucket {
  id: string;
  name: string;
  mobile: string;
  totalOutstanding: number;
  current: number; // 0-30 days
  days31_60: number;
  days61_90: number;
  days90Plus: number;
  lastTransactionDate?: string;
  invoiceCount: number;
}

// ==========================================
// 4. CORE COMPUTATION ENGINE
// ==========================================

export class AccountingEngine {
  /**
   * Central General Ledger Processor
   * Groups by account and calculates running balances per account
   */
  public static computeGeneralLedger(
    journalEntries: JournalEntry[],
    accounts: Account[],
    filters?: { startDate?: string; endDate?: string; accountCode?: string }
  ): AccountLedgerGroup[] {
    const sortedEntries = [...journalEntries].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.entryNumber.localeCompare(b.entryNumber);
    });

    const targetAccounts = filters?.accountCode
      ? accounts.filter(a => a.code === filters.accountCode)
      : accounts;

    return targetAccounts.map(acc => {
      let runningBal = acc.openingBalance || 0;
      let totalDebit = 0;
      let totalCredit = 0;
      const transactions: AccountLedgerTransaction[] = [];
      const isAssetOrExpense = acc.category === 'Assets' || acc.category === 'Expenses';

      sortedEntries.forEach(entry => {
        if (entry.isReversed) return;
        if (filters?.startDate && entry.date < filters.startDate) return;
        if (filters?.endDate && entry.date > filters.endDate) return;

        entry.lines.forEach((line, lineIdx) => {
          if (line.accountCode === acc.code || line.accountId === acc.id) {
            const dr = Number(line.debit) || 0;
            const cr = Number(line.credit) || 0;

            if (dr > 0 || cr > 0) {
              totalDebit += dr;
              totalCredit += cr;

              const delta = isAssetOrExpense ? (dr - cr) : (cr - dr);
              runningBal += delta;

              transactions.push({
                id: `${entry.id}-${lineIdx}`,
                entryId: entry.id,
                entryNumber: entry.entryNumber,
                date: entry.date,
                voucherType: entry.voucherType || 'Journal Voucher',
                sourceModule: entry.sourceModule || 'Accounting',
                particulars: line.particulars || entry.description,
                description: entry.description,
                reference: entry.reference,
                debit: dr,
                credit: cr,
                runningBalance: runningBal,
                balance: runningBal,
                createdBy: entry.createdBy
              });
            }
          }
        });
      });

      return {
        accountId: acc.id,
        accountCode: acc.code,
        accountName: acc.name,
        category: acc.category,
        group: acc.group,
        openingBalance: acc.openingBalance || 0,
        totalDebit,
        totalCredit,
        closingBalance: runningBal,
        transactions
      };
    });
  }

  /**
   * Generates Customer Debtors Subledger
   */
  public static computeCustomerSubLedger(
    journalEntries: JournalEntry[],
    customers: Customer[]
  ): CustomerSubLedgerRecord[] {
    const sorted = [...journalEntries].filter(e => !e.isReversed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return customers.map(cust => {
      let running = 0;
      let totalInvoiced = 0;
      let totalReceived = 0;
      const txs: CustomerSubLedgerRecord['transactions'] = [];

      sorted.forEach(entry => {
        entry.lines.forEach((line, lineIdx) => {
          const isMatch = line.customerId === cust.id ||
            line.customerName?.toLowerCase() === cust.name.toLowerCase() ||
            entry.description.toLowerCase().includes(cust.name.toLowerCase()) ||
            (entry.reference && entry.reference.includes(cust.id));

          if (isMatch && (line.accountCode === '1100' || line.accountCode.startsWith('4') || line.accountCode.startsWith('10'))) {
            const dr = Number(line.debit) || 0;
            const cr = Number(line.credit) || 0;

            if (dr > 0 || cr > 0) {
              running += (dr - cr);
              if (dr > 0) totalInvoiced += dr;
              if (cr > 0) totalReceived += cr;

              txs.push({
                id: `${entry.id}-${lineIdx}`,
                date: entry.date,
                entryNumber: entry.entryNumber,
                voucherType: entry.voucherType || (dr > 0 ? 'Sales Invoice' : 'Customer Receipt'),
                description: entry.description,
                particulars: line.particulars || entry.description,
                reference: entry.reference || '',
                debit: dr,
                credit: cr,
                balance: running,
                runningBalance: running
              });
            }
          }
        });
      });

      return {
        customerId: cust.id,
        customerName: cust.name,
        mobile: cust.mobile || '',
        email: cust.email,
        openingBalance: 0,
        totalInvoiced,
        totalReceived,
        balanceDue: running,
        currentBalanceDue: running,
        transactions: txs
      };
    });
  }

  /**
   * Generates Supplier Creditors Subledger
   */
  public static computeSupplierSubLedger(
    journalEntries: JournalEntry[],
    suppliers: Supplier[]
  ): SupplierSubLedgerRecord[] {
    const sorted = [...journalEntries].filter(e => !e.isReversed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return suppliers.map(sup => {
      let running = sup.balanceDue || 0;
      let totalPurchased = 0;
      let totalPaid = 0;
      const txs: SupplierSubLedgerRecord['transactions'] = [];

      sorted.forEach(entry => {
        entry.lines.forEach((line, lineIdx) => {
          const isMatch = line.supplierId === sup.id ||
            line.supplierName?.toLowerCase() === sup.name.toLowerCase() ||
            entry.description.toLowerCase().includes(sup.name.toLowerCase()) ||
            (entry.reference && entry.reference.includes(sup.id));

          if (isMatch && (line.accountCode === '2010' || line.accountCode.startsWith('5') || line.accountCode.startsWith('10'))) {
            const dr = Number(line.debit) || 0; // Payment to supplier
            const cr = Number(line.credit) || 0; // Purchase bill from supplier

            if (dr > 0 || cr > 0) {
              running += (cr - dr);
              if (cr > 0) totalPurchased += cr;
              if (dr > 0) totalPaid += dr;

              txs.push({
                id: `${entry.id}-${lineIdx}`,
                date: entry.date,
                entryNumber: entry.entryNumber,
                voucherType: entry.voucherType || (cr > 0 ? 'Purchase Invoice' : 'Supplier Payment'),
                description: entry.description,
                particulars: line.particulars || entry.description,
                reference: entry.reference || '',
                debit: dr,
                credit: cr,
                balance: running,
                runningBalance: running
              });
            }
          }
        });
      });

      return {
        supplierId: sup.id,
        supplierName: sup.name,
        contactPerson: sup.contactPerson,
        mobile: sup.mobile,
        openingBalance: sup.balanceDue || 0,
        totalPurchased,
        totalPaid,
        balancePayable: running,
        currentBalancePayable: running,
        transactions: txs
      };
    });
  }

  /**
   * Generates Complete Trial Balance
   * Validates sum(Debit) === sum(Credit)
   */
  public static generateTrialBalance(
    journalEntries: JournalEntry[],
    accounts: Account[]
  ): TrialBalanceResult {
    const accActivityMap: Record<string, { dr: number; cr: number; openingDr: number; openingCr: number }> = {};

    accounts.forEach(acc => {
      const openBal = acc.openingBalance || 0;
      const isDrNormal = acc.category === 'Assets' || acc.category === 'Expenses';
      accActivityMap[acc.code] = {
        dr: 0,
        cr: 0,
        openingDr: isDrNormal && openBal > 0 ? openBal : 0,
        openingCr: !isDrNormal && openBal > 0 ? openBal : 0
      };
    });

    journalEntries.forEach(entry => {
      if (entry.isReversed) return;
      entry.lines.forEach(line => {
        if (!accActivityMap[line.accountCode]) {
          accActivityMap[line.accountCode] = { dr: 0, cr: 0, openingDr: 0, openingCr: 0 };
        }
        accActivityMap[line.accountCode].dr += Number(line.debit) || 0;
        accActivityMap[line.accountCode].cr += Number(line.credit) || 0;
      });
    });

    const rows: TrialBalanceRow[] = [];
    const accountsResultList: TrialBalanceResult['accounts'] = [];
    let totalDebit = 0;
    let totalCredit = 0;

    const allCodes = Array.from(new Set([...accounts.map(a => a.code), ...Object.keys(accActivityMap)]));

    allCodes.sort().forEach(code => {
      const acc = accounts.find(a => a.code === code) || {
        id: `acc-${code}`,
        code,
        name: `Account ${code}`,
        category: (code.startsWith('1') ? 'Assets' : code.startsWith('2') ? 'Liabilities' : code.startsWith('3') ? 'Equity' : code.startsWith('4') ? 'Revenue' : 'Expenses') as AccountCategory,
        group: undefined
      };

      const act = accActivityMap[code] || { dr: 0, cr: 0, openingDr: 0, openingCr: 0 };
      const isDrCategory = acc.category === 'Assets' || acc.category === 'Expenses';

      const totalDrSide = act.openingDr + act.dr;
      const totalCrSide = act.openingCr + act.cr;
      const net = totalDrSide - totalCrSide;

      let closingDebit = 0;
      let closingCredit = 0;

      if (isDrCategory) {
        if (net >= 0) closingDebit = net;
        else closingCredit = Math.abs(net);
      } else {
        if (net <= 0) closingCredit = Math.abs(net);
        else closingDebit = net;
      }

      const accOpening = (acc as any).openingBalance || 0;
      if (act.dr > 0 || act.cr > 0 || act.openingDr > 0 || act.openingCr > 0 || accOpening !== 0) {
        rows.push({
          accountCode: code,
          accountName: acc.name,
          category: acc.category,
          group: acc.group,
          openingDebit: act.openingDr,
          openingCredit: act.openingCr,
          periodDebit: act.dr,
          periodCredit: act.cr,
          closingDebit,
          closingCredit,
          netBalance: isDrCategory ? (closingDebit - closingCredit) : (closingCredit - closingDebit)
        });

        accountsResultList.push({
          accountId: acc.id || `acc-${code}`,
          accountCode: code,
          accountName: acc.name,
          category: acc.category,
          debitBalance: closingDebit,
          creditBalance: closingCredit
        });

        totalDebit += closingDebit;
        totalCredit += closingCredit;
      }
    });

    const difference = Math.round(Math.abs(totalDebit - totalCredit) * 100) / 100;
    const isBalanced = difference === 0;

    return {
      rows,
      accounts: accountsResultList,
      totalDebit: Math.round(totalDebit * 100) / 100,
      totalCredit: Math.round(totalCredit * 100) / 100,
      isBalanced,
      difference
    };
  }

  /**
   * Generates Multi-Step Profit & Loss Statement (Income Statement)
   */
  public static generateProfitAndLoss(
    journalEntries: JournalEntry[],
    accounts: Account[]
  ): ProfitAndLossReport {
    const balances: Record<string, number> = {};
    accounts.forEach(a => { balances[a.code] = 0; });

    journalEntries.forEach(entry => {
      if (entry.isReversed) return;
      entry.lines.forEach(l => {
        if (!balances[l.accountCode]) balances[l.accountCode] = 0;
        const isExpense = l.accountCode.startsWith('5');
        const isRevenue = l.accountCode.startsWith('4');
        if (isRevenue) {
          balances[l.accountCode] += (Number(l.credit) || 0) - (Number(l.debit) || 0);
        } else if (isExpense) {
          balances[l.accountCode] += (Number(l.debit) || 0) - (Number(l.credit) || 0);
        }
      });
    });

    const grossRevenue = balances['4010'] || 0;
    const otherRevenue = Object.keys(balances)
      .filter(k => k.startsWith('4') && k !== '4010')
      .reduce((sum, k) => sum + (balances[k] || 0), 0);
    const totalGrossRevenue = grossRevenue + otherRevenue;

    const discountsGiven = balances['5030'] || 0;
    const netRevenue = Math.max(0, totalGrossRevenue - discountsGiven);

    const cogs = balances['5010'] || 0;
    const grossProfit = netRevenue - cogs;
    const grossMarginPct = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;

    const revenueBreakdown = Object.keys(balances)
      .filter(k => k.startsWith('4') && (balances[k] || 0) !== 0)
      .map(code => {
        const acc = accounts.find(a => a.code === code);
        return { code, name: acc?.name || `Revenue ${code}`, amount: balances[code] || 0 };
      });

    const cogsBreakdown = Object.keys(balances)
      .filter(k => (k === '5010' || k === '5030') && (balances[k] || 0) !== 0)
      .map(code => {
        const acc = accounts.find(a => a.code === code);
        return { code, name: acc?.name || `COGS ${code}`, amount: balances[code] || 0 };
      });

    const flatOperatingExpenses: { code: string; name: string; amount: number }[] = [];
    const expGroupsMap: Record<string, { code: string; name: string; amount: number }[]> = {
      'Selling & Distribution': [],
      'Administrative & General': [],
      'Financial & Bank Charges': [],
      'Other Operating Expenses': []
    };

    let totalOperatingExpenses = 0;

    Object.keys(balances).forEach(code => {
      if (code.startsWith('5') && code !== '5010' && code !== '5030') {
        const amt = balances[code] || 0;
        if (amt !== 0) {
          const acc = accounts.find(a => a.code === code) || { name: `Expense ${code}`, group: undefined };
          totalOperatingExpenses += amt;
          flatOperatingExpenses.push({ code, name: acc.name, amount: amt });

          if (code === '5020' || code === '5040') {
            expGroupsMap['Selling & Distribution'].push({ code, name: acc.name, amount: amt });
          } else if (code === '5050' || code === '5060' || code === '5070' || code === '5080') {
            expGroupsMap['Administrative & General'].push({ code, name: acc.name, amount: amt });
          } else if (code === '5090') {
            expGroupsMap['Financial & Bank Charges'].push({ code, name: acc.name, amount: amt });
          } else {
            expGroupsMap['Other Operating Expenses'].push({ code, name: acc.name, amount: amt });
          }
        }
      }
    });

    const expensesByGroup = Object.keys(expGroupsMap)
      .filter(grp => expGroupsMap[grp].length > 0)
      .map(grp => ({
        group: grp,
        accounts: expGroupsMap[grp],
        total: expGroupsMap[grp].reduce((s, a) => s + a.amount, 0)
      }));

    const operatingProfit = grossProfit - totalOperatingExpenses;
    const operatingMarginPct = netRevenue > 0 ? (operatingProfit / netRevenue) * 100 : 0;

    const taxExpense = 0;
    const netProfit = operatingProfit - taxExpense;
    const netMarginPct = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

    return {
      revenue: netRevenue,
      grossRevenue: totalGrossRevenue,
      discountsGiven,
      netRevenue,
      costOfGoodsSold: cogs,
      cogs,
      grossProfit,
      grossMarginPercentage: Math.round(grossMarginPct * 10) / 10,
      grossMarginPct: Math.round(grossMarginPct * 10) / 10,
      revenueBreakdown,
      cogsBreakdown,
      operatingExpenses: flatOperatingExpenses,
      expensesByGroup,
      totalOperatingExpenses,
      operatingProfit,
      operatingMarginPct: Math.round(operatingMarginPct * 10) / 10,
      taxExpense,
      netProfit,
      netMarginPercentage: Math.round(netMarginPct * 10) / 10,
      netMarginPct: Math.round(netMarginPct * 10) / 10
    };
  }

  /**
   * Generates Balance Sheet
   * Strict validation: Assets === Liabilities + Equity
   */
  public static generateBalanceSheet(
    journalEntries: JournalEntry[],
    accounts: Account[],
    pnlParam?: ProfitAndLossReport
  ): BalanceSheetReport {
    const pnl = pnlParam || AccountingEngine.generateProfitAndLoss(journalEntries, accounts);
    const accBalances: Record<string, number> = {};

    accounts.forEach(acc => {
      accBalances[acc.code] = (acc as any).openingBalance || 0;
    });

    journalEntries.forEach(entry => {
      if (entry.isReversed) return;
      entry.lines.forEach(line => {
        if (!accBalances[line.accountCode]) accBalances[line.accountCode] = 0;
        const isAsset = line.accountCode.startsWith('1');
        if (isAsset) {
          accBalances[line.accountCode] += (Number(line.debit) || 0) - (Number(line.credit) || 0);
        } else if (line.accountCode.startsWith('2') || line.accountCode.startsWith('3')) {
          accBalances[line.accountCode] += (Number(line.credit) || 0) - (Number(line.debit) || 0);
        }
      });
    });

    // 1. Current Assets (1000 - 1499)
    const currentAssets: { code: string; name: string; amount: number }[] = [];
    let totalCurrentAssets = 0;

    // 2. Fixed Assets (1500 - 1589)
    const fixedAssets: { code: string; name: string; amount: number }[] = [];
    let grossFixedAssets = 0;
    const accumulatedDepr = Math.abs(accBalances['1590'] || 0);

    // 3. Liabilities (2000s)
    const currentLiabilities: { code: string; name: string; amount: number }[] = [];
    let totalCurrentLiabilities = 0;

    // 4. Equity (3000s)
    const equityItems: { code: string; name: string; amount: number }[] = [];
    let totalBaseEquity = 0;

    Object.keys(accBalances).sort().forEach(code => {
      const amt = accBalances[code];
      const acc = accounts.find(a => a.code === code) || { name: `Account ${code}` };

      if (code.startsWith('1')) {
        const num = parseInt(code, 10);
        if (num >= 1000 && num < 1500) {
          currentAssets.push({ code, name: acc.name, amount: amt });
          totalCurrentAssets += amt;
        } else if (num >= 1500 && num < 1590) {
          fixedAssets.push({ code, name: acc.name, amount: amt });
          grossFixedAssets += amt;
        }
      } else if (code.startsWith('2')) {
        currentLiabilities.push({ code, name: acc.name, amount: amt });
        totalCurrentLiabilities += amt;
      } else if (code.startsWith('3')) {
        if (code !== '3020') {
          equityItems.push({ code, name: acc.name, amount: amt });
          totalBaseEquity += amt;
        }
      }
    });

    const netFixedAssets = Math.max(0, grossFixedAssets - accumulatedDepr);
    const totalAssets = totalCurrentAssets + netFixedAssets;

    const totalLiabilities = totalCurrentLiabilities;
    const retainedEarningsPrior = accBalances['3020'] || 0;
    const currentPeriodNetIncome = pnl.netProfit;

    const totalEquity = totalBaseEquity + retainedEarningsPrior + currentPeriodNetIncome;
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    const diff = Math.round((totalAssets - totalLiabilitiesAndEquity) * 100) / 100;
    const isBalanced = Math.abs(diff) <= 0.05;

    const combinedEquityList: { code: string; name: string; amount: number }[] = [
      ...equityItems,
      { code: '3020', name: 'Retained Earnings (Prior)', amount: retainedEarningsPrior },
      { code: 'PNL-CUR', name: 'Net Income (Current Period)', amount: currentPeriodNetIncome }
    ].filter(e => e.amount !== 0);

    return {
      currentAssets,
      totalCurrentAssets: Math.round(totalCurrentAssets * 100) / 100,
      fixedAssets,
      lessAccumulatedDepreciation: accumulatedDepr,
      netFixedAssets: Math.round(netFixedAssets * 100) / 100,
      totalAssets: Math.round(totalAssets * 100) / 100,
      currentLiabilities,
      totalCurrentLiabilities: Math.round(totalCurrentLiabilities * 100) / 100,
      longTermLiabilities: [],
      totalLiabilities: Math.round(totalLiabilities * 100) / 100,
      equity: combinedEquityList,
      equityItems,
      retainedEarningsPrior,
      currentPeriodNetIncome,
      totalEquity: Math.round(totalEquity * 100) / 100,
      totalLiabilitiesAndEquity: Math.round(totalLiabilitiesAndEquity * 100) / 100,
      difference: diff,
      balanceDifference: diff,
      isBalanced
    };
  }

  /**
   * Generates Statement of Cash Flows
   * Supports calling with (journalEntries, accounts) or (pnl, accounts, journalEntries)
   */
  public static generateCashFlow(
    arg1: any,
    arg2: any,
    arg3?: any
  ): CashFlowReport {
    let journalEntries: JournalEntry[] = [];
    let accounts: Account[] = [];
    let pnl: ProfitAndLossReport;

    if (Array.isArray(arg1) && Array.isArray(arg2)) {
      journalEntries = arg1;
      accounts = arg2;
      pnl = arg3 || AccountingEngine.generateProfitAndLoss(journalEntries, accounts);
    } else {
      pnl = arg1;
      accounts = arg2;
      journalEntries = arg3 || [];
    }

    let arChange = 0;
    let inventoryChange = 0;
    let apChange = 0;
    let vatChange = 0;
    let fixedAssetPurchases = 0;
    let capitalInjections = 0;
    let drawings = 0;

    journalEntries.forEach(entry => {
      if (entry.isReversed) return;
      entry.lines.forEach(l => {
        const dr = Number(l.debit) || 0;
        const cr = Number(l.credit) || 0;
        if (l.accountCode === '1100') arChange += (dr - cr);
        if (l.accountCode === '1200') inventoryChange += (dr - cr);
        if (l.accountCode === '2010') apChange += (cr - dr);
        if (l.accountCode === '2020') vatChange += (cr - dr);
        if (l.accountCode.startsWith('15') && l.accountCode !== '1590') {
          fixedAssetPurchases += (dr - cr);
        }
        if (l.accountCode === '3010') capitalInjections += (cr - dr);
        if (l.accountCode === '3030') drawings += (dr - cr);
      });
    });

    const netOperatingCash = pnl.netProfit - arChange - inventoryChange + apChange + vatChange;
    const netInvestingCash = -Math.max(0, fixedAssetPurchases);
    const netFinancingCash = capitalInjections - drawings;
    const netCashFlow = netOperatingCash + netInvestingCash + netFinancingCash;

    let beginningCashAndBank = 0;
    ['1010', '1020', '1030', '1040'].forEach(c => {
      const acc = accounts.find(a => a.code === c);
      beginningCashAndBank += (acc as any)?.openingBalance || 0;
    });

    let currentCashAndBank = beginningCashAndBank;
    journalEntries.forEach(entry => {
      if (entry.isReversed) return;
      entry.lines.forEach(l => {
        if (['1010', '1020', '1030', '1040'].includes(l.accountCode)) {
          currentCashAndBank += (Number(l.debit) || 0) - (Number(l.credit) || 0);
        }
      });
    });

    const operatingActivities: CashFlowActivityItem[] = [
      { particulars: 'Net Profit for Period (P&L)', amount: pnl.netProfit },
      { particulars: 'Change in Accounts Receivable (Debtors)', amount: -arChange },
      { particulars: 'Change in Inventory Holdings', amount: -inventoryChange },
      { particulars: 'Change in Accounts Payable (Creditors)', amount: apChange },
      { particulars: 'Change in VAT / Tax Liabilities', amount: vatChange }
    ];

    const investingActivities: CashFlowActivityItem[] = [
      { particulars: 'Capital Outlay on Fixed Assets & Machinery', amount: -Math.max(0, fixedAssetPurchases) }
    ];

    const financingActivities: CashFlowActivityItem[] = [
      { particulars: 'Owner Equity Injections', amount: capitalInjections },
      { particulars: 'Owner Drawings / Capital Withdrawals', amount: -drawings }
    ];

    return {
      operatingActivities,
      investingActivities,
      financingActivities,
      netCashFromOperations: Math.round(netOperatingCash * 100) / 100,
      netCashFromInvesting: Math.round(netInvestingCash * 100) / 100,
      netCashFromFinancing: Math.round(netFinancingCash * 100) / 100,
      beginningCash: Math.round(beginningCashAndBank * 100) / 100,
      beginningCashAndBank: Math.round(beginningCashAndBank * 100) / 100,
      netChangeInCash: Math.round(netCashFlow * 100) / 100,
      netCashFlow: Math.round(netCashFlow * 100) / 100,
      endingCash: Math.round(currentCashAndBank * 100) / 100,
      endingCashAndBank: Math.round(currentCashAndBank * 100) / 100,
      details: {
        operatingActivities: {
          netIncome: pnl.netProfit,
          depreciationAddBack: 0,
          workingCapitalChanges: {
            arChange,
            inventoryChange,
            apChange,
            vatPayableChange: vatChange
          },
          netOperatingCash: Math.round(netOperatingCash * 100) / 100
        },
        investingActivities: {
          fixedAssetPurchases: Math.max(0, fixedAssetPurchases),
          netInvestingCash: Math.round(netInvestingCash * 100) / 100
        },
        financingActivities: {
          capitalInjections,
          drawings,
          netFinancingCash: Math.round(netFinancingCash * 100) / 100
        },
        netCashFlow: Math.round(netCashFlow * 100) / 100,
        beginningCashAndBank: Math.round(beginningCashAndBank * 100) / 100,
        endingCashAndBank: Math.round(currentCashAndBank * 100) / 100
      }
    };
  }

  /**
   * Generates Customer Subledger with Invoices, Receipts & Running Balance
   */
  public static generateCustomerSubledger(
    customerId: string,
    journalEntries: JournalEntry[],
    sales: Sale[]
  ): {
    transactions: {
      date: string;
      voucherNo: string;
      type: string;
      particulars: string;
      debit: number;
      credit: number;
      balance: number;
    }[];
    totalBilled: number;
    totalReceived: number;
    currentBalanceDue: number;
  } {
    const custSales = sales.filter(s => s.customerId === customerId);
    const rows: {
      date: string;
      voucherNo: string;
      type: string;
      particulars: string;
      debit: number;
      credit: number;
      balance: number;
    }[] = [];

    let runningBal = 0;
    let totalBilled = 0;
    let totalReceived = 0;

    // Look for journal entry lines tagged with this customer or invoice numbers
    const relevantEntries = journalEntries.filter(je =>
      !je.isReversed && (
        je.lines.some(l => l.customerId === customerId) ||
        custSales.some(s => s.invoiceNumber === je.reference)
      )
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    relevantEntries.forEach(entry => {
      entry.lines.forEach(line => {
        if (line.accountCode === '1100' || line.customerId === customerId || (entry.reference && custSales.some(s => s.invoiceNumber === entry.reference && line.accountCode.startsWith('4')))) {
          const dr = line.debit || 0;
          const cr = line.credit || 0;
          if (dr > 0 || cr > 0) {
            runningBal += (dr - cr);
            if (dr > 0) totalBilled += dr;
            if (cr > 0) totalReceived += cr;

            rows.push({
              date: entry.date,
              voucherNo: entry.entryNumber,
              type: entry.voucherType || (dr > 0 ? 'Sales Invoice' : 'Customer Receipt'),
              particulars: line.particulars || entry.description,
              debit: dr,
              credit: cr,
              balance: runningBal
            });
          }
        }
      });
    });

    return {
      transactions: rows,
      totalBilled,
      totalReceived,
      currentBalanceDue: runningBal
    };
  }

  /**
   * Generates Customer Aging Report (Current, 1-30, 31-60, 61-90, 90+ days)
   */
  public static calculateCustomerAging(
    customers: Customer[],
    sales: Sale[],
    journalEntries: JournalEntry[]
  ): AgingBucket[] {
    const today = new Date().getTime();

    return customers.map(cust => {
      const custSales = sales.filter(s => s.customerId === cust.id || s.customerMobile === cust.mobile);
      let totalDue = 0;
      let current = 0;
      let d31_60 = 0;
      let d61_90 = 0;
      let d90Plus = 0;
      let lastDate: string | undefined = undefined;

      custSales.forEach(s => {
        // Check if invoice was paid
        const isPaid = s.paymentMethod !== 'Cash on Delivery' || s.deliveryStatus === 'Delivered';
        const saleDate = new Date(s.orderDate).getTime();
        const diffDays = Math.floor((today - saleDate) / (1000 * 60 * 60 * 24));
        if (!lastDate || s.orderDate > lastDate) lastDate = s.orderDate;

        // If unpaid or on credit
        if (!isPaid) {
          const due = s.finalTotal;
          totalDue += due;
          if (diffDays <= 30) current += due;
          else if (diffDays <= 60) d31_60 += due;
          else if (diffDays <= 90) d61_90 += due;
          else d90Plus += due;
        }
      });

      return {
        id: cust.id,
        name: cust.name,
        mobile: cust.mobile,
        totalOutstanding: totalDue,
        current,
        days31_60: d31_60,
        days61_90: d61_90,
        days90Plus: d90Plus,
        lastTransactionDate: lastDate,
        invoiceCount: custSales.length
      };
    });
  }

  /**
   * Generates Supplier Aging Report (Current, 1-30, 31-60, 61-90, 90+ days)
   */
  public static calculateSupplierAging(
    suppliers: Supplier[],
    purchases: Purchase[],
    journalEntries: JournalEntry[]
  ): AgingBucket[] {
    const today = new Date().getTime();

    return suppliers.map(sup => {
      const supPurchases = purchases.filter(p => p.supplierId === sup.id);
      let totalDue = sup.balanceDue || 0;
      let current = 0;
      let d31_60 = 0;
      let d61_90 = 0;
      let d90Plus = 0;
      let lastDate: string | undefined = undefined;

      supPurchases.forEach(p => {
        const purDate = new Date(p.purchaseDate).getTime();
        const diffDays = Math.floor((today - purDate) / (1000 * 60 * 60 * 24));
        if (!lastDate || p.purchaseDate > lastDate) lastDate = p.purchaseDate;

        if (p.paymentAccountCode === '2010' || p.paymentMethod?.toLowerCase().includes('credit')) {
          const due = p.cost;
          if (diffDays <= 30) current += due;
          else if (diffDays <= 60) d31_60 += due;
          else if (diffDays <= 90) d61_90 += due;
          else d90Plus += due;
        }
      });

      return {
        id: sup.id,
        name: sup.name,
        mobile: sup.mobile,
        totalOutstanding: totalDue,
        current: current || totalDue,
        days31_60: d31_60,
        days61_90: d61_90,
        days90Plus: d90Plus,
        lastTransactionDate: lastDate,
        invoiceCount: supPurchases.length
      };
    });
  }

  /**
   * Generates Inventory Stock Valuation Ledger & Perpetual Movement
   */
  public static generateInventoryLedger(
    products: Product[],
    purchases: Purchase[],
    sales: Sale[]
  ): {
    rows: {
      productId: string;
      sku: string;
      brand: string;
      model: string;
      openingStock: number;
      purchasedQty: number;
      soldQty: number;
      currentStock: number;
      unitCost: number;
      sellingPrice: number;
      totalValuation: number;
      potentialRevenue: number;
      grossProfitMargin: number;
    }[];
    totalStockUnits: number;
    totalInventoryValuation: number;
    totalPotentialRevenue: number;
  } {
    let totalStockUnits = 0;
    let totalInventoryValuation = 0;
    let totalPotentialRevenue = 0;

    const rows = products.map(prod => {
      const purQty = purchases.reduce((sum, pur) => {
        const item = pur.items?.find(i => i.productId === prod.id);
        return sum + (item ? item.quantity : 0);
      }, 0);

      const soldQty = sales.filter(s => s.productId === prod.id).length;
      const currentStock = prod.stock;
      const unitCost = prod.purchasePrice || 0;
      const totalVal = currentStock * unitCost;
      const potentialRev = currentStock * prod.sellingPrice;
      const margin = prod.sellingPrice > 0 ? ((prod.sellingPrice - unitCost) / prod.sellingPrice) * 100 : 0;

      totalStockUnits += currentStock;
      totalInventoryValuation += totalVal;
      totalPotentialRevenue += potentialRev;

      return {
        productId: prod.id,
        sku: prod.sku,
        brand: prod.brand,
        model: prod.model,
        openingStock: Math.max(0, currentStock + soldQty - purQty),
        purchasedQty: purQty,
        soldQty,
        currentStock,
        unitCost,
        sellingPrice: prod.sellingPrice,
        totalValuation: totalVal,
        potentialRevenue: potentialRev,
        grossProfitMargin: Math.round(margin * 10) / 10
      };
    });

    return {
      rows,
      totalStockUnits,
      totalInventoryValuation,
      totalPotentialRevenue
    };
  }

  /**
   * Generates VAT / Tax Ledger
   * Input VAT (from Purchases) vs Output VAT (from Sales) vs Net Liability
   */
  public static generateVatTaxLedger(
    journalEntries: JournalEntry[],
    sales: Sale[],
    purchases: Purchase[]
  ): {
    inputVatEntries: { date: string; invoiceNo: string; supplier: string; amount: number; vat: number }[];
    outputVatEntries: { date: string; invoiceNo: string; customer: string; amount: number; vat: number }[];
    totalInputVat: number;
    totalOutputVat: number;
    netVatPayable: number;
  } {
    const inputVatEntries: { date: string; invoiceNo: string; supplier: string; amount: number; vat: number }[] = [];
    const outputVatEntries: { date: string; invoiceNo: string; customer: string; amount: number; vat: number }[] = [];

    let totalInputVat = 0;
    let totalOutputVat = 0;

    purchases.forEach(p => {
      const vat = p.tax || 0;
      if (vat > 0) {
        totalInputVat += vat;
        inputVatEntries.push({
          date: p.purchaseDate,
          invoiceNo: p.invoiceNumber,
          supplier: p.supplierName,
          amount: p.cost,
          vat
        });
      }
    });

    sales.forEach(s => {
      const vat = s.vatAmount || 0;
      if (vat > 0) {
        totalOutputVat += vat;
        outputVatEntries.push({
          date: s.orderDate,
          invoiceNo: s.invoiceNumber,
          customer: s.customerName,
          amount: s.finalTotal,
          vat
        });
      }
    });

    return {
      inputVatEntries,
      outputVatEntries,
      totalInputVat,
      totalOutputVat,
      netVatPayable: Math.max(0, totalOutputVat - totalInputVat)
    };
  }

  /**
   * Computes Executive Financial Ratios & Health Metrics
   */
  public static calculateFinancialRatios(
    balanceSheet: BalanceSheetReport,
    pnl: ProfitAndLossReport,
    inventoryValuation: number
  ) {
    const currentAssets = balanceSheet.totalCurrentAssets;
    const currentLiabilities = Math.max(1, balanceSheet.totalCurrentLiabilities);
    const totalAssets = Math.max(1, balanceSheet.totalAssets);
    const totalEquity = Math.max(1, balanceSheet.totalEquity);

    // Liquid quick assets: Cash, Bank, AR
    const quickAssets = balanceSheet.currentAssets
      .filter(a => ['1010', '1020', '1030', '1040', '1100'].includes(a.code))
      .reduce((sum, a) => sum + a.amount, 0);

    const currentRatio = Math.round((currentAssets / currentLiabilities) * 100) / 100;
    const quickRatio = Math.round((quickAssets / currentLiabilities) * 100) / 100;
    const workingCapital = Math.round((currentAssets - balanceSheet.totalCurrentLiabilities) * 100) / 100;
    const debtToEquity = Math.round((balanceSheet.totalLiabilities / totalEquity) * 100) / 100;
    const returnOnAssets = Math.round((pnl.netProfit / totalAssets) * 1000) / 10;
    const returnOnEquity = Math.round((pnl.netProfit / totalEquity) * 1000) / 10;

    return {
      currentRatio,
      quickRatio,
      workingCapital,
      debtToEquity,
      grossMarginPct: pnl.grossMarginPct,
      netMarginPct: pnl.netMarginPct,
      returnOnAssets,
      returnOnEquity
    };
  }

  /**
   * Helper to create a Reversal Journal Entry for error correction
   */
  public static createReversalJournalEntry(
    originalEntry: JournalEntry,
    reversalReason: string,
    userName: string
  ): JournalEntry {
    const reversedLines: JournalEntryLine[] = originalEntry.lines.map(l => ({
      ...l,
      debit: l.credit, // Invert Dr to Cr
      credit: l.debit, // Invert Cr to Dr
      particulars: `REVERSAL: ${l.particulars || originalEntry.description}`
    }));

    return {
      id: `je-rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      entryNumber: `JV-REV-${originalEntry.entryNumber}`,
      date: new Date().toISOString().substring(0, 10),
      voucherType: 'Journal Voucher',
      sourceModule: 'Manual JV',
      description: `Reversal of ${originalEntry.entryNumber}: ${reversalReason}`,
      reference: `REV-${originalEntry.reference || originalEntry.entryNumber}`,
      costCenterId: originalEntry.costCenterId,
      costCenterName: originalEntry.costCenterName,
      lines: reversedLines,
      createdBy: userName,
      isPosted: true,
      reversalOfId: originalEntry.id,
      reversalReason
    };
  }

  /**
   * Year-End Closing Entry Generator
   * Transfers all Revenue (4000s) and Expenses (5000s) into Retained Earnings (3020)
   */
  public static createYearEndClosingEntry(
    pnl: ProfitAndLossReport,
    accounts: Account[],
    journalEntries: JournalEntry[],
    fiscalYearName: string,
    userName: string
  ): JournalEntry {
    const balances: Record<string, number> = {};
    accounts.forEach(a => { balances[a.code] = 0; });

    journalEntries.forEach(entry => {
      if (entry.isReversed) return;
      entry.lines.forEach(l => {
        if (!balances[l.accountCode]) balances[l.accountCode] = 0;
        if (l.accountCode.startsWith('4')) {
          balances[l.accountCode] += (l.credit - l.debit);
        } else if (l.accountCode.startsWith('5')) {
          balances[l.accountCode] += (l.debit - l.credit);
        }
      });
    });

    const lines: JournalEntryLine[] = [];

    // 1. Debit all revenue accounts with balance
    Object.keys(balances).forEach(code => {
      if (code.startsWith('4')) {
        const amt = balances[code];
        if (amt > 0) {
          const acc = accounts.find(a => a.code === code) || { name: `Revenue ${code}` };
          lines.push({
            accountId: `acc-${code}`,
            accountCode: code,
            accountName: acc.name,
            debit: amt,
            credit: 0,
            particulars: `Close Revenue to Retained Earnings for ${fiscalYearName}`
          });
        }
      }
    });

    // 2. Credit all expense accounts with balance
    Object.keys(balances).forEach(code => {
      if (code.startsWith('5')) {
        const amt = balances[code];
        if (amt > 0) {
          const acc = accounts.find(a => a.code === code) || { name: `Expense ${code}` };
          lines.push({
            accountId: `acc-${code}`,
            accountCode: code,
            accountName: acc.name,
            debit: 0,
            credit: amt,
            particulars: `Close Expense to Retained Earnings for ${fiscalYearName}`
          });
        }
      }
    });

    // 3. Balance to Retained Earnings (3020)
    const netIncome = pnl.netProfit;
    if (netIncome >= 0) {
      lines.push({
        accountId: 'acc-3020',
        accountCode: '3020',
        accountName: 'Retained Earnings (Accumulated Profit)',
        debit: 0,
        credit: netIncome,
        particulars: `Net Profit Transfer to Retained Earnings for ${fiscalYearName}`
      });
    } else {
      lines.push({
        accountId: 'acc-3020',
        accountCode: '3020',
        accountName: 'Retained Earnings (Accumulated Profit)',
        debit: Math.abs(netIncome),
        credit: 0,
        particulars: `Net Loss Transfer from Retained Earnings for ${fiscalYearName}`
      });
    }

    return {
      id: `je-closing-${Date.now()}`,
      entryNumber: `JV-CLOSE-${fiscalYearName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`,
      date: new Date().toISOString().substring(0, 10),
      voucherType: 'Year-End Adjustment',
      sourceModule: 'Year-End',
      description: `Annual Financial Closing Entry for ${fiscalYearName}. Net Profit NPR ${pnl.netProfit.toLocaleString()} transferred to Retained Earnings.`,
      reference: `CLOSE-${fiscalYearName}`,
      lines,
      createdBy: userName,
      isPosted: true
    };
  }
}
