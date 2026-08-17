/**
 * Report Exporter Utility for CSV and Printable Downloads
 * Enables exporting all system modules & financial reports to CSV / Excel format.
 */

import { Sale, Product, JournalEntry, Warranty, Purchase, AuditLog, Account, SupplyItem, SupplyPurchase } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import kalpaLogo from '../assets/kalpa_logo.jpg';

// Generic CSV Exporter
export const exportToCSV = (
  filenameOrData: string | any[],
  headersOrFilename?: string[] | string,
  maybeRows?: (string | number)[][]
) => {
  const sanitize = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  let filename = 'Export';
  let csvContent = '';

  if (Array.isArray(filenameOrData)) {
    const data = filenameOrData;
    filename = (typeof headersOrFilename === 'string' ? headersOrFilename : 'Report') || 'Report';
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    csvContent = [
      headers.map(sanitize).join(','),
      ...data.map(item => headers.map(h => sanitize(item[h] !== undefined && item[h] !== null ? item[h] : '')).join(','))
    ].join('\n');
  } else {
    filename = filenameOrData;
    const headers = (headersOrFilename as string[]) || [];
    const rows = maybeRows || [];
    csvContent = [
      headers.map(sanitize).join(','),
      ...rows.map(row => row.map(sanitize).join(','))
    ].join('\n');
  }

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generic PDF Exporter with header, summary cards, and autoTable layout
export const exportToPDF = (
  filename: string,
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number)[][],
  summaryCards?: { label: string; value: string }[],
  orientation: 'portrait' | 'landscape' = 'landscape'
) => {
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Company Header Bar
  doc.setFillColor(24, 24, 27); // Zinc 900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Gold accent bar
  doc.setFillColor(245, 158, 11); // Amber 500
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('KALPA LUXURY WATCHES (कल्प)', 14, 12);

  doc.setFontSize(11);
  doc.setTextColor(245, 158, 11);
  doc.text(title.toUpperCase(), 14, 20);

  // Subtitle / Date
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(161, 161, 170);
  doc.text(subtitle || `Generated on: ${new Date().toLocaleString()} | Currency: NPR`, pageWidth - 14, 18, { align: 'right' });

  let currentY = 36;

  // Render Summary Cards if present
  if (summaryCards && summaryCards.length > 0) {
    const cardWidth = (pageWidth - 28 - (summaryCards.length - 1) * 6) / summaryCards.length;
    summaryCards.forEach((card, idx) => {
      const xPos = 14 + idx * (cardWidth + 6);
      doc.setFillColor(244, 244, 245); // Zinc 100
      doc.setDrawColor(228, 228, 231); // Zinc 200
      doc.roundedRect(xPos, currentY, cardWidth, 16, 2, 2, 'FD');

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(113, 113, 122);
      doc.text(card.label.toUpperCase(), xPos + 4, currentY + 5);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(24, 24, 27);
      doc.text(card.value, xPos + 4, currentY + 12);
    });
    currentY += 22;
  }

  // Generate Table
  autoTable(doc, {
    startY: currentY,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [24, 24, 27],
      textColor: [245, 158, 11],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [39, 39, 42],
      cellPadding: 2.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    styles: {
      overflow: 'linebreak',
      font: 'helvetica'
    },
    didDrawPage: (data) => {
      // Footer page numbering
      const totalPages = doc.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(161, 161, 170);
      doc.text(
        `Page ${data.pageNumber} of ${totalPages}  •  Kalpa Luxury Timepiece Store ERP  •  Confidential Financial Document`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' }
      );
    }
  });

  doc.save(`${filename}_${new Date().toISOString().substring(0, 10)}.pdf`);
};

// 1. Sales Report Export
export const exportSalesReport = (sales: Sale[]) => {
  const headers = [
    'Invoice Number',
    'Order Date',
    'Customer Name',
    'Customer Mobile',
    'Watch Brand',
    'Watch Model',
    'Serial Number',
    'Selling Price (NPR)',
    'Discount (NPR)',
    'Final Total (NPR)',
    'Payment Method',
    'Sales Channel',
    'Sales Representative',
    'Warranty ID'
  ];

  const rows = sales.map(s => [
    s.invoiceNumber,
    s.orderDate,
    s.customerName,
    s.customerMobile,
    s.productBrand,
    s.productModel,
    s.serialNumber || 'N/A',
    s.sellingPrice,
    s.discount,
    s.finalTotal,
    s.paymentMethod,
    s.orderSource,
    s.salesPerson,
    s.warrantyId
  ]);

  exportToCSV('Sales_Report_Kalpa_Watch', headers, rows);
};

export const exportSalesReportPDF = (sales: Sale[]) => {
  const headers = [
    'Invoice #',
    'Date',
    'Customer',
    'Mobile',
    'Brand & Model',
    'Serial #',
    'Price (NPR)',
    'Discount',
    'Total (NPR)',
    'Method',
    'Channel',
    'Staff'
  ];

  const rows = sales.map(s => [
    s.invoiceNumber,
    s.orderDate,
    s.customerName,
    s.customerMobile,
    `${s.productBrand} ${s.productModel}`,
    s.serialNumber || 'N/A',
    s.sellingPrice.toLocaleString(),
    s.discount.toLocaleString(),
    s.finalTotal.toLocaleString(),
    s.paymentMethod,
    s.orderSource,
    s.salesPerson
  ]);

  const totalRevenue = sales.reduce((acc, curr) => acc + curr.finalTotal, 0);
  const totalInvoices = sales.length;
  const avgOrder = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

  exportToPDF(
    'Sales_Report_Kalpa_Watch',
    'Executive Sales Analytics & Invoice Ledger',
    `Total Transactions: ${totalInvoices} | Generated: ${new Date().toLocaleDateString()}`,
    headers,
    rows,
    [
      { label: 'Total Invoices', value: `${totalInvoices}` },
      { label: 'Gross Revenue', value: `NPR ${totalRevenue.toLocaleString()}` },
      { label: 'Avg Invoice Value', value: `NPR ${Math.round(avgOrder).toLocaleString()}` }
    ],
    'landscape'
  );
};

// 2. Inventory & Stock Valuation Report Export
export const exportInventoryReport = (products: Product[]) => {
  const headers = [
    'SKU Code',
    'Brand',
    'Model',
    'Movement Type',
    'Dial Color',
    'Gender',
    'Purchase Price (NPR)',
    'Selling Price (NPR)',
    'Current Stock Quantity',
    'Sold Quantity',
    'Total Inventory Value at Cost (NPR)',
    'Stock Status',
    'Warranty (Months)'
  ];

  const rows = products.map(p => [
    p.sku,
    p.brand,
    p.model,
    p.movement,
    p.dialColor,
    p.gender,
    p.purchasePrice,
    p.sellingPrice,
    p.stock,
    p.soldQuantity,
    p.purchasePrice * p.stock,
    p.status,
    p.warrantyMonths
  ]);

  exportToCSV('Inventory_Stock_Report_Kalpa_Watch', headers, rows);
};

export const exportInventoryReportPDF = (products: Product[]) => {
  const headers = [
    'SKU Code',
    'Brand & Model',
    'Movement',
    'Color',
    'Cost (NPR)',
    'Retail (NPR)',
    'In Stock',
    'Sold',
    'Valuation at Cost (NPR)',
    'Status'
  ];

  const rows = products.map(p => [
    p.sku,
    `${p.brand} ${p.model}`,
    p.movement,
    p.dialColor,
    p.purchasePrice.toLocaleString(),
    p.sellingPrice.toLocaleString(),
    p.stock,
    p.soldQuantity,
    (p.purchasePrice * p.stock).toLocaleString(),
    p.status
  ]);

  const totalStockQty = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValuation = products.reduce((sum, p) => sum + (p.purchasePrice * p.stock), 0);

  exportToPDF(
    'Inventory_Stock_Report_Kalpa_Watch',
    'Watch Inventory Valuation & Stock Audit Report',
    `Total Watch SKUs: ${products.length} | Generated: ${new Date().toLocaleDateString()}`,
    headers,
    rows,
    [
      { label: 'Total Catalog SKUs', value: `${products.length}` },
      { label: 'Units in Stock', value: `${totalStockQty} Watches` },
      { label: 'Asset Valuation at Cost', value: `NPR ${totalValuation.toLocaleString()}` }
    ],
    'landscape'
  );
};

// 3. Journal Entries Ledger Report Export
export const exportJournalEntriesReport = (journalEntries: JournalEntry[]) => {
  const headers = [
    'Journal Entry Number',
    'Date',
    'Reference',
    'Description',
    'Account Code',
    'Account Name',
    'Debit (NPR)',
    'Credit (NPR)',
    'Created By'
  ];

  const rows: (string | number)[][] = [];
  journalEntries.forEach(je => {
    je.lines.forEach(line => {
      rows.push([
        je.entryNumber,
        je.date,
        je.reference || 'General Ledger',
        je.description,
        line.accountCode,
        line.accountName,
        line.debit,
        line.credit,
        je.createdBy
      ]);
    });
  });

  exportToCSV('Journal_Entries_Ledger_Kalpa_Watch', headers, rows);
};

export const exportJournalEntriesReportPDF = (journalEntries: JournalEntry[]) => {
  const headers = [
    'Voucher / Entry #',
    'Date',
    'Reference',
    'Description',
    'Code',
    'Account Name',
    'Debit (NPR)',
    'Credit (NPR)',
    'Posted By'
  ];

  const rows: (string | number)[][] = [];
  let totalDebit = 0;
  let totalCredit = 0;

  journalEntries.forEach(je => {
    je.lines.forEach(line => {
      totalDebit += line.debit;
      totalCredit += line.credit;
      rows.push([
        je.entryNumber,
        je.date,
        je.reference || 'GL',
        je.description,
        line.accountCode,
        line.accountName,
        line.debit ? line.debit.toLocaleString() : '0',
        line.credit ? line.credit.toLocaleString() : '0',
        je.createdBy
      ]);
    });
  });

  exportToPDF(
    'Journal_Entries_Ledger_Kalpa_Watch',
    'Double-Entry Accounting General Ledger Audit',
    `Total Journal Vouchers: ${journalEntries.length}`,
    headers,
    rows,
    [
      { label: 'Total Vouchers', value: `${journalEntries.length}` },
      { label: 'Total Debit Posted', value: `NPR ${totalDebit.toLocaleString()}` },
      { label: 'Total Credit Posted', value: `NPR ${totalCredit.toLocaleString()}` }
    ],
    'landscape'
  );
};

// 4. Profit & Loss Statement Export
export const exportProfitAndLossReport = (
  salesRevenue: number,
  cogs: number,
  grossProfit: number,
  expenses: { name: string; amount: number }[],
  totalExpenses: number,
  netProfit: number
) => {
  const headers = ['Financial Metric / Line Item', 'Amount (NPR)'];
  const rows: (string | number)[][] = [
    ['OPERATING REVENUE', ''],
    ['Watch Sales Revenue (Gross)', salesRevenue],
    ['COST OF SALES', ''],
    ['Cost of Goods Sold (COGS)', -cogs],
    ['GROSS OPERATING PROFIT', grossProfit],
    ['OPERATING EXPENSES', ''],
    ...expenses.map(e => [e.name, -e.amount]),
    ['TOTAL OPERATING EXPENSES', -totalExpenses],
    ['NET BOTTOM LINE PROFIT', netProfit]
  ];

  exportToCSV('Profit_and_Loss_Statement', headers, rows);
};

export const exportProfitAndLossReportPDF = (
  salesRevenue: number,
  cogs: number,
  grossProfit: number,
  expenses: { name: string; amount: number }[],
  totalExpenses: number,
  netProfit: number
) => {
  const headers = ['Line Item / Account Category', 'Amount (NPR)'];
  const rows: (string | number)[][] = [
    ['1. OPERATING REVENUE', ''],
    ['   • Watch Sales Revenue (Gross)', `NPR ${salesRevenue.toLocaleString()}`],
    ['2. COST OF GOODS SOLD (COGS)', ''],
    ['   • Direct Purchase & Import Costs', `(NPR ${cogs.toLocaleString()})`],
    ['GROSS OPERATING PROFIT', `NPR ${grossProfit.toLocaleString()}`],
    ['3. OPERATING EXPENSES', ''],
    ...expenses.map(e => [`   • ${e.name}`, `(NPR ${e.amount.toLocaleString()})`]),
    ['TOTAL OPERATING EXPENSES', `(NPR ${totalExpenses.toLocaleString()})`],
    ['NET BOTTOM-LINE PROFIT / LOSS', `NPR ${netProfit.toLocaleString()}`]
  ];

  exportToPDF(
    'Profit_And_Loss_Statement',
    'Official Profit & Loss Statement (Financial Summary)',
    `Reporting Period: Year to Date | Currency: NPR`,
    headers,
    rows,
    [
      { label: 'Gross Revenue', value: `NPR ${salesRevenue.toLocaleString()}` },
      { label: 'Gross Profit', value: `NPR ${grossProfit.toLocaleString()}` },
      { label: 'Net Profit', value: `NPR ${netProfit.toLocaleString()}` }
    ],
    'portrait'
  );
};

// 5. Balance Sheet Export
export const exportBalanceSheetReport = (
  assets: { name: string; amount: number }[],
  totalAssets: number,
  liabilities: { name: string; amount: number }[],
  totalLiabilities: number,
  equity: { name: string; amount: number }[],
  totalEquity: number
) => {
  const headers = ['Category', 'Account Line Item', 'Amount (NPR)'];
  const rows: (string | number)[][] = [
    ...assets.map(a => ['Asset', a.name, a.amount]),
    ['Asset', 'TOTAL ASSETS', totalAssets],
    ...liabilities.map(l => ['Liability', l.name, l.amount]),
    ['Liability', 'TOTAL LIABILITIES', totalLiabilities],
    ...equity.map(e => ['Equity', e.name, e.amount]),
    ['Equity', 'TOTAL EQUITY', totalEquity],
    ['Summary', 'TOTAL LIABILITIES & EQUITY', totalLiabilities + totalEquity]
  ];

  exportToCSV('Balance_Sheet_Report', headers, rows);
};

export const exportBalanceSheetReportPDF = (
  assets: { name: string; amount: number }[],
  totalAssets: number,
  liabilities: { name: string; amount: number }[],
  totalLiabilities: number,
  equity: { name: string; amount: number }[],
  totalEquity: number
) => {
  const headers = ['Classification', 'Account Line Item', 'Balance (NPR)'];
  const rows: (string | number)[][] = [
    ...assets.map(a => ['ASSET', a.name, `NPR ${a.amount.toLocaleString()}`]),
    ['ASSET', 'TOTAL ASSETS', `NPR ${totalAssets.toLocaleString()}`],
    ...liabilities.map(l => ['LIABILITY', l.name, `NPR ${l.amount.toLocaleString()}`]),
    ['LIABILITY', 'TOTAL LIABILITIES', `NPR ${totalLiabilities.toLocaleString()}`],
    ...equity.map(e => ['EQUITY', e.name, `NPR ${e.amount.toLocaleString()}`]),
    ['EQUITY', 'TOTAL EQUITY', `NPR ${totalEquity.toLocaleString()}`],
    ['BALANCED SUMMARY', 'TOTAL LIABILITIES & EQUITY', `NPR ${(totalLiabilities + totalEquity).toLocaleString()}`]
  ];

  exportToPDF(
    'Balance_Sheet_Report',
    'Official Balance Sheet Statement (Financial Position)',
    `As of: ${new Date().toLocaleDateString()} | Currency: NPR`,
    headers,
    rows,
    [
      { label: 'Total Assets', value: `NPR ${totalAssets.toLocaleString()}` },
      { label: 'Total Liabilities', value: `NPR ${totalLiabilities.toLocaleString()}` },
      { label: 'Total Equity', value: `NPR ${totalEquity.toLocaleString()}` }
    ],
    'portrait'
  );
};

// 6. Trial Balance PDF Export
export const exportTrialBalanceReportPDF = (
  accounts: Account[],
  getBalance: (code: string, category: 'Assets' | 'Expenses' | 'Revenue' | 'Liabilities' | 'Equity') => number
) => {
  const headers = ['Account Code', 'Account Name', 'Category', 'Debit (NPR)', 'Credit (NPR)'];
  let totalDebit = 0;
  let totalCredit = 0;

  const rows = accounts.map(acc => {
    const bal = getBalance(acc.code, acc.category);
    let debit = 0;
    let credit = 0;
    if (acc.category === 'Assets' || acc.category === 'Expenses') {
      if (bal >= 0) debit = bal; else credit = Math.abs(bal);
    } else {
      if (bal >= 0) credit = bal; else debit = Math.abs(bal);
    }
    totalDebit += debit;
    totalCredit += credit;

    return [
      acc.code,
      acc.name,
      acc.category,
      debit ? debit.toLocaleString() : '0',
      credit ? credit.toLocaleString() : '0'
    ];
  });

  exportToPDF(
    'Trial_Balance_Report',
    'Trial Balance Statement (Accounting Verification)',
    `As of: ${new Date().toLocaleDateString()} | Currency: NPR`,
    headers,
    rows,
    [
      { label: 'Total Accounts', value: `${accounts.length}` },
      { label: 'Total Debits', value: `NPR ${totalDebit.toLocaleString()}` },
      { label: 'Total Credits', value: `NPR ${totalCredit.toLocaleString()}` }
    ],
    'portrait'
  );
};

// 7. VAT Tax Report Export
export const exportVatTaxReport = (sales: Sale[]) => {
  const headers = [
    'Invoice Number',
    'Invoice Date',
    'Customer Name',
    'Gross Sale Price (NPR)',
    'Discount (NPR)',
    'Net Taxable Amount (NPR)',
    '13% VAT Amount (NPR)',
    'Invoice Total (NPR)'
  ];

  const rows = sales.map(s => [
    s.invoiceNumber,
    s.orderDate,
    s.customerName,
    s.sellingPrice,
    s.discount,
    s.sellingPrice - s.discount,
    s.vatAmount,
    s.finalTotal
  ]);

  exportToCSV('VAT_Tax_Compliance_Report_13Percent', headers, rows);
};

export const exportVatTaxReportPDF = (sales: Sale[]) => {
  const headers = [
    'Invoice #',
    'Date',
    'Customer Name',
    'Gross Price (NPR)',
    'Discount',
    'Taxable Amount',
    '13% VAT (NPR)',
    'Invoice Total'
  ];

  const rows = sales.map(s => {
    const taxable = s.sellingPrice - s.discount;
    return [
      s.invoiceNumber,
      s.orderDate,
      s.customerName,
      s.sellingPrice.toLocaleString(),
      s.discount.toLocaleString(),
      taxable.toLocaleString(),
      s.vatAmount.toLocaleString(),
      s.finalTotal.toLocaleString()
    ];
  });

  const totalVat = sales.reduce((acc, s) => acc + s.vatAmount, 0);
  const totalTaxable = sales.reduce((acc, s) => acc + (s.sellingPrice - s.discount), 0);

  exportToPDF(
    'VAT_Tax_Compliance_Report_13Percent',
    'IRD Nepal 13% VAT Tax Compliance Register',
    `Government Tax Compliance Register | Currency: NPR`,
    headers,
    rows,
    [
      { label: 'Total Tax Invoices', value: `${sales.length}` },
      { label: 'Total Taxable Sales', value: `NPR ${totalTaxable.toLocaleString()}` },
      { label: 'Total 13% VAT Collected', value: `NPR ${totalVat.toLocaleString()}` }
    ],
    'landscape'
  );
};

// 8. Warranty Register Report Export
export const exportWarrantyReport = (warranties: Warranty[]) => {
  const headers = [
    'Warranty Card ID',
    'Invoice Number',
    'Customer Name',
    'Customer Mobile',
    'Watch Brand',
    'Watch Model',
    'Serial Number',
    'Start Date',
    'End Date',
    'Warranty Status',
    'Service Claims Count'
  ];

  const rows = warranties.map(w => [
    w.id,
    w.invoiceNumber,
    w.customerName,
    w.customerMobile,
    w.productBrand,
    w.productModel,
    w.serialNumber,
    w.warrantyStart,
    w.warrantyEnd,
    w.status,
    w.serviceHistory.length
  ]);

  exportToCSV('Warranty_Register_Report', headers, rows);
};

export const exportWarrantyReportPDF = (warranties: Warranty[]) => {
  const headers = [
    'Warranty ID',
    'Invoice #',
    'Customer',
    'Mobile',
    'Watch Brand & Model',
    'Serial #',
    'Start Date',
    'End Date',
    'Status',
    'Claims'
  ];

  const rows = warranties.map(w => [
    w.id,
    w.invoiceNumber,
    w.customerName,
    w.customerMobile,
    `${w.productBrand} ${w.productModel}`,
    w.serialNumber,
    w.warrantyStart,
    w.warrantyEnd,
    w.status,
    w.serviceHistory.length
  ]);

  const activeCount = warranties.filter(w => w.status === 'Active').length;

  exportToPDF(
    'Warranty_Register_Report',
    'Official Customer Warranty & Service Card Register',
    `Total Cards: ${warranties.length} | Active Warranties: ${activeCount}`,
    headers,
    rows,
    [
      { label: 'Total Warranties', value: `${warranties.length}` },
      { label: 'Active Warranties', value: `${activeCount}` },
      { label: 'Expired / Service', value: `${warranties.length - activeCount}` }
    ],
    'landscape'
  );
};

// 9. Purchase Orders Report Export
export const exportPurchaseReport = (purchases: Purchase[]) => {
  const headers = [
    'Purchase Order ID',
    'Invoice Number',
    'Supplier ID',
    'Purchase Date',
    'Total Cost (NPR)',
    'Total Watch Quantity',
    'Created By'
  ];

  const rows = purchases.map(p => [
    p.id,
    p.invoiceNumber,
    p.supplierId,
    p.purchaseDate,
    p.cost,
    p.quantity,
    p.createdBy
  ]);

  exportToCSV('Purchase_Orders_Procurement_Report', headers, rows);
};

export const exportPurchaseReportPDF = (purchases: Purchase[]) => {
  const headers = [
    'PO ID',
    'Invoice #',
    'Supplier ID',
    'Purchase Date',
    'Total Cost (NPR)',
    'Watch Quantity',
    'Created By'
  ];

  const rows = purchases.map(p => [
    p.id,
    p.invoiceNumber,
    p.supplierId,
    p.purchaseDate,
    p.cost.toLocaleString(),
    p.quantity,
    p.createdBy
  ]);

  const totalCost = purchases.reduce((acc, p) => acc + p.cost, 0);
  const totalQty = purchases.reduce((acc, p) => acc + p.quantity, 0);

  exportToPDF(
    'Purchase_Orders_Procurement_Report',
    'Procurement & Inventory Purchase Orders Ledger',
    `Total Orders: ${purchases.length}`,
    headers,
    rows,
    [
      { label: 'Purchase Orders', value: `${purchases.length}` },
      { label: 'Watches Procured', value: `${totalQty} Units` },
      { label: 'Total Purchase Spend', value: `NPR ${totalCost.toLocaleString()}` }
    ],
    'landscape'
  );
};

// 9b. Supplies & Packaging Purchase Orders Report Export
export const exportSupplyPurchasesReport = (supplyPurchases: SupplyPurchase[]) => {
  const headers = [
    'Supply Order ID',
    'Invoice Number',
    'Purchase Category',
    'Supplier Name',
    'Purchase Date',
    'Total Cost (NPR)',
    'Total Units',
    'Account Linked',
    'Items Breakdown',
    'Notes',
    'Created By'
  ];

  const rows = supplyPurchases.map(p => [
    p.id,
    p.invoiceNumber,
    p.purchaseType,
    p.supplierName,
    p.purchaseDate,
    p.cost,
    p.quantity,
    p.accountType === '1210' ? 'Acc #1210 (Inventory Asset)' : 'Acc #5020 (Operational Expense)',
    p.items.map(it => `${it.supplyItemName} (${it.quantity} ${it.unit})`).join('; '),
    p.notes || '',
    p.createdBy
  ]);

  exportToCSV('Supplies_And_Packaging_Procurement_Report', headers, rows);
};

export const exportSupplyPurchasesReportPDF = (supplyPurchases: SupplyPurchase[]) => {
  const headers = [
    'Invoice #',
    'Date',
    'Category',
    'Supplier',
    'Cost (NPR)',
    'Units',
    'Account Code',
    'Items Summary'
  ];

  const rows = supplyPurchases.map(p => [
    p.invoiceNumber,
    p.purchaseDate,
    p.purchaseType,
    p.supplierName,
    p.cost.toLocaleString(),
    p.quantity,
    p.accountType || '1210',
    p.items.map(it => `${it.supplyItemName} (${it.quantity})`).join(', ')
  ]);

  const totalCost = supplyPurchases.reduce((acc, p) => acc + p.cost, 0);
  const totalUnits = supplyPurchases.reduce((acc, p) => acc + p.quantity, 0);

  exportToPDF(
    'Supplies_Packaging_Procurement_Report',
    'Packaging & Operational Supplies Procurement Ledger',
    `Total Supply Orders: ${supplyPurchases.length} | Generated: ${new Date().toLocaleDateString()}`,
    headers,
    rows,
    [
      { label: 'Supply Orders', value: `${supplyPurchases.length}` },
      { label: 'Units Procured', value: `${totalUnits} Items` },
      { label: 'Total Supply Spend', value: `NPR ${totalCost.toLocaleString()}` }
    ],
    'landscape'
  );
};

// 10. Audit Trail Report Export
export const exportAuditLogsReport = (auditLogs: AuditLog[]) => {
  const headers = [
    'Log ID',
    'Timestamp',
    'User Name',
    'User Role',
    'Action',
    'Module',
    'Details'
  ];

  const rows = auditLogs.map(a => [
    a.id,
    a.timestamp,
    a.userName,
    a.userRole,
    a.action,
    a.module,
    a.details
  ]);

  exportToCSV('Audit_Trail_Security_Logs', headers, rows);
};

export const exportAuditLogsReportPDF = (auditLogs: AuditLog[]) => {
  const headers = [
    'Log ID',
    'Timestamp',
    'User Name',
    'Role',
    'Action',
    'Module',
    'Details'
  ];

  const rows = auditLogs.map(a => [
    a.id,
    a.timestamp,
    a.userName,
    a.userRole,
    a.action,
    a.module,
    a.details
  ]);

  exportToPDF(
    'Audit_Trail_Security_Logs',
    'System Audit Trail & Operations Security Log',
    `Total Event Logs: ${auditLogs.length}`,
    headers,
    rows,
    [
      { label: 'Total Audit Entries', value: `${auditLogs.length}` },
      { label: 'Log Security Status', value: 'VERIFIED OK' }
    ],
    'landscape'
  );
};

// 11. Payments & Receipts Report PDF
export const exportPaymentsReportPDF = (journalEntries: JournalEntry[]) => {
  const headers = [
    'Voucher / Ref #',
    'Date',
    'Transaction Type',
    'Party Name / Description',
    'Accounts Impacted',
    'Amount (NPR)',
    'Posted By'
  ];

  let totalDisbursements = 0;
  let totalReceipts = 0;

  const rows = journalEntries.map(je => {
    const isPayment = je.description.toUpperCase().includes('PAYMENT') || je.reference?.startsWith('PAY') || je.lines.some(l => l.credit > 0 && ['1010', '1020', '1030'].includes(l.accountCode));
    const totalAmt = je.lines.reduce((sum, l) => sum + Math.max(l.debit, l.credit), 0) / 2 || je.lines[0]?.debit || je.lines[0]?.credit || 0;

    if (isPayment) {
      totalDisbursements += totalAmt;
    } else {
      totalReceipts += totalAmt;
    }

    return [
      je.reference || je.entryNumber,
      je.date,
      isPayment ? 'PAYMENT OUT' : 'RECEIPT IN',
      je.description,
      je.lines.map(l => `${l.accountName} (${l.debit > 0 ? 'Dr' : 'Cr'})`).join(', '),
      (isPayment ? '-' : '+') + ` NPR ${totalAmt.toLocaleString()}`,
      je.createdBy
    ];
  });

  exportToPDF(
    'Payments_And_Receipts_Ledger',
    'Payment Disbursement & Receipts Cashbook Register',
    `Total Transactions: ${journalEntries.length}`,
    headers,
    rows,
    [
      { label: 'Total Entries', value: `${journalEntries.length}` },
      { label: 'Total Cash Receipts', value: `NPR ${totalReceipts.toLocaleString()}` },
      { label: 'Total Disbursements', value: `NPR ${totalDisbursements.toLocaleString()}` }
    ],
    'landscape'
  );
};

// 12. Chart of Accounts PDF
export const exportChartOfAccountsPDF = (accounts: Account[]) => {
  const headers = ['Account Code', 'Account Name', 'Category', 'Account Type', 'Status'];
  const rows = accounts.map(a => [
    a.code,
    a.name,
    a.category,
    a.type || 'General Account',
    'ACTIVE'
  ]);

  exportToPDF(
    'Chart_Of_Accounts_Kalpa',
    'Official Chart of Accounts Framework',
    `Total Accounts: ${accounts.length}`,
    headers,
    rows,
    [
      { label: 'Total Ledger Accounts', value: `${accounts.length}` }
    ],
    'portrait'
  );
};

// 13. Brand Sales PDF
export const exportBrandSalesReportPDF = (brandData: { brand: string; count: number; revenue: number }[]) => {
  const headers = ['Watch Brand', 'Units Sold', 'Total Sales Revenue (NPR)'];
  const rows = brandData.map(b => [
    b.brand,
    b.count,
    `NPR ${b.revenue.toLocaleString()}`
  ]);

  const totalRev = brandData.reduce((acc, b) => acc + b.revenue, 0);

  exportToPDF(
    'Brand_Performance_Sales_Report',
    'Sales Breakdown by Watch Brand',
    `Brand Performance Analytics`,
    headers,
    rows,
    [
      { label: 'Total Brands', value: `${brandData.length}` },
      { label: 'Combined Revenue', value: `NPR ${totalRev.toLocaleString()}` }
    ],
    'portrait'
  );
};

// 14. Platform Sales PDF
export const exportPlatformSalesReportPDF = (platformData: { channel: string; count: number; revenue: number }[]) => {
  const headers = ['Sales Channel / Platform', 'Orders Processed', 'Total Revenue (NPR)'];
  const rows = platformData.map(p => [
    p.channel,
    p.count,
    `NPR ${p.revenue.toLocaleString()}`
  ]);

  const totalRev = platformData.reduce((acc, p) => acc + p.revenue, 0);

  exportToPDF(
    'Platform_Channel_Sales_Report',
    'Sales Breakdown by Sales Channel & Platform',
    `Channel Distribution Analytics`,
    headers,
    rows,
    [
      { label: 'Sales Channels', value: `${platformData.length}` },
      { label: 'Combined Revenue', value: `NPR ${totalRev.toLocaleString()}` }
    ],
    'portrait'
  );
};

// 15. Staff Sales PDF
export const exportStaffSalesReportPDF = (staffData: { staff: string; count: number; revenue: number }[]) => {
  const headers = ['Sales Representative', 'Invoices Closed', 'Total Sales Volume (NPR)'];
  const rows = staffData.map(s => [
    s.staff,
    s.count,
    `NPR ${s.revenue.toLocaleString()}`
  ]);

  const totalRev = staffData.reduce((acc, s) => acc + s.revenue, 0);

  exportToPDF(
    'Staff_Performance_Sales_Report',
    'Sales Representative Performance & Commission Ledger',
    `Sales Staff Analytics`,
    headers,
    rows,
    [
      { label: 'Sales Representatives', value: `${staffData.length}` },
      { label: 'Total Sales Volume', value: `NPR ${totalRev.toLocaleString()}` }
    ],
    'portrait'
  );
};

// 16. Single Sales Estimate Bill PDF (A4 Format)
export const exportSingleEstimateBillPDF = async (sale: Sale) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Draw Background Logo Watermark
  try {
    const img = new Image();
    img.src = kalpaLogo;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    if (img.complete && img.naturalWidth > 0) {
      const watermarkSize = 110; // mm
      const wmX = (pageWidth - watermarkSize) / 2;
      const wmY = (pageHeight - watermarkSize) / 2;
      doc.saveGraphicsState();
      if ((doc as any).GState) {
        doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
      }
      doc.addImage(img, 'JPEG', wmX, wmY, watermarkSize, watermarkSize);
      doc.restoreGraphicsState();
    }
  } catch (err) {
    console.error('PDF watermark error:', err);
  }

  // Top Dark Header Bar
  doc.setFillColor(24, 24, 27); // Zinc 900
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Gold accent rule
  doc.setFillColor(217, 119, 6); // Amber 600
  doc.rect(0, 32, pageWidth, 2, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('KALPA LUXURY TIMEPIECES', 15, 17);

  // Sales Estimate Badge
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(245, 158, 11); // Amber 500
  doc.roundedRect(pageWidth - 68, 7, 53, 18, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14); // Amber 900
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SALES ESTIMATE BILL', pageWidth - 41.5, 15, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('OFFICIAL ERP RECEIPT', pageWidth - 41.5, 21, { align: 'center' });

  // Bill Metadata Section
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(228, 228, 231);
  doc.roundedRect(15, 40, 180, 28, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(39, 39, 42);
  doc.text('BILL DETAILS:', 20, 47);
  doc.text('CUSTOMER INFORMATION:', 105, 47);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  doc.text(`Bill / Invoice #: ${sale.invoiceNumber}`, 20, 54);
  doc.text(`Sales Date: ${sale.orderDate}`, 20, 60);
  doc.text(`Payment Method: ${sale.paymentMethod}`, 20, 65);

  doc.text(`Name: ${sale.customerName}`, 105, 54);
  doc.text(`Mobile: ${sale.customerMobile}`, 105, 60);
  doc.text(`Address / Source: ${sale.orderSource}`, 105, 65);

  // Items Table
  autoTable(doc, {
    startY: 74,
    head: [['#', 'Item Description', 'Serial / Warranty No', 'Order Source', 'Price (NPR)']],
    body: [
      [
        '1',
        sale.watchModel || `${sale.productBrand} ${sale.productModel}`,
        `${sale.serialNumber || 'N/A'} (${sale.warrantyId})`,
        sale.orderSource || 'Direct Store',
        sale.sellingPrice.toLocaleString()
      ]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [24, 24, 27],
      textColor: [245, 158, 11],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [39, 39, 42],
      cellPadding: 4
    },
    margin: { left: 15, right: 15 }
  });

  let finalY = (doc as any).lastAutoTable.finalY + 8;

  // Calculation Summary Box
  const summaryX = 115;
  const summaryWidth = 80;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX, finalY, summaryWidth, 32, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text('Subtotal Price:', summaryX + 5, finalY + 8);
  doc.text(`NPR ${sale.sellingPrice.toLocaleString()}`, summaryX + summaryWidth - 5, finalY + 8, { align: 'right' });

  doc.text('Discount Applied:', summaryX + 5, finalY + 15);
  doc.text(`- NPR ${sale.discount.toLocaleString()}`, summaryX + summaryWidth - 5, finalY + 15, { align: 'right' });

  doc.setDrawColor(203, 213, 225);
  doc.line(summaryX + 5, finalY + 19, summaryX + summaryWidth - 5, finalY + 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Net Total Billable:', summaryX + 5, finalY + 26);
  doc.text(`NPR ${sale.finalTotal.toLocaleString()}`, summaryX + summaryWidth - 5, finalY + 26, { align: 'right' });

  finalY += 40;

  // Warranty Box
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(250, 204, 21);
  doc.roundedRect(15, finalY, 180, 22, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(133, 77, 14);
  doc.text('DIGITAL WARRANTY CERTIFICATE ATTACHED', 20, finalY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 63, 18);
  doc.text(`Warranty ID: ${sale.warrantyId}  |  Serial No: ${sale.serialNumber}  |  Valid From: ${sale.orderDate} (12 Months Warranty)`, 20, finalY + 14);

  finalY += 30;

  // QR Verification Code (QR ONLY)
  const targetUrl = 'https://ais-pre-elkztr5oggtrem57ql7bfr-12678260771.asia-east1.run.app/';
  try {
    const qrDataUrl = await QRCode.toDataURL(targetUrl, { margin: 1, width: 200 });
    const qrSize = 34;
    const qrX = 15;
    const qrY = finalY;

    // Draw QR image
    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    doc.link(qrX, qrY, qrSize, qrSize, { url: targetUrl });

    // Link Title Text
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text('SCAN OR CLICK QR CODE TO VERIFY OFFICIAL WARRANTY', qrX + qrSize + 8, qrY + 14);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Verified Kalpa ERP digital authenticity record.', qrX + qrSize + 8, qrY + 20);
  } catch (err) {
    console.error('Failed to generate PDF QR Code:', err);
  }

  // Footer terms
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text('Thank you for choosing Kalpa. This estimate bill serves as proof of purchase and warranty certificate.', pageWidth / 2, pageHeight - 10, { align: 'center' });

  doc.save(`Sales_Estimate_Bill_${sale.invoiceNumber}.pdf`);
};

// ============================================================================
// FINANCIAL & ACCOUNTING ENGINE PDF EXPORTERS
// ============================================================================

export const exportTrialBalancePDF = (
  rows: any[],
  totalDebit: number,
  totalCredit: number,
  isBalanced: boolean,
  fiscalYear: string
) => {
  const tableRows = rows.map(r => [
    r.accountCode,
    r.accountName,
    r.category,
    r.openingDebit > 0 ? r.openingDebit.toLocaleString() : (r.openingCredit > 0 ? `(${r.openingCredit.toLocaleString()})` : '-'),
    r.periodDebit > 0 ? r.periodDebit.toLocaleString() : '-',
    r.periodCredit > 0 ? r.periodCredit.toLocaleString() : '-',
    r.closingDebit > 0 ? r.closingDebit.toLocaleString() : '-',
    r.closingCredit > 0 ? r.closingCredit.toLocaleString() : '-'
  ]);

  tableRows.push([
    'TOTAL',
    'GRAND TOTAL OF ALL LEDGERS',
    isBalanced ? 'BALANCED (DR=CR)' : 'UNBALANCED',
    '',
    '',
    '',
    totalDebit.toLocaleString(),
    totalCredit.toLocaleString()
  ]);

  exportToPDF(
    `Trial_Balance_${fiscalYear.replace(/\s+/g, '_')}`,
    'TRIAL BALANCE STATEMENT',
    `Fiscal Period: ${fiscalYear} | Accounting Standard: Double-Entry GL | Status: ${isBalanced ? 'Balanced' : 'Difference Detected'}`,
    ['Code', 'Account Title', 'Category', 'Opening', 'Period Dr', 'Period Cr', 'Closing Dr (NPR)', 'Closing Cr (NPR)'],
    tableRows,
    [
      { label: 'Total Debits', value: `NPR ${totalDebit.toLocaleString()}` },
      { label: 'Total Credits', value: `NPR ${totalCredit.toLocaleString()}` },
      { label: 'GL Equilibrium', value: isBalanced ? 'PERFECT (0.00 Diff)' : 'OUT OF BALANCE' }
    ],
    'landscape'
  );
};

export const exportProfitAndLossPDF = (pnl: any, fiscalYear: string) => {
  const rows: (string | number)[][] = [
    ['4000', 'Gross Sales Revenue', pnl.grossRevenue.toLocaleString()],
    ['5030', 'Less: Sales Discounts Given', `(${pnl.discountsGiven.toLocaleString()})`],
    ['', 'NET OPERATING REVENUE', pnl.netRevenue.toLocaleString()],
    ['5010', 'Less: Cost of Goods Sold (COGS)', `(${pnl.cogs.toLocaleString()})`],
    ['', `GROSS PROFIT (Gross Margin: ${pnl.grossMarginPct}%)`, pnl.grossProfit.toLocaleString()],
    ['', '--- OPERATING EXPENSES ---', '']
  ];

  pnl.operatingExpenses.forEach((grp: any) => {
    rows.push(['', `[${grp.group.toUpperCase()}]`, grp.total.toLocaleString()]);
    grp.accounts.forEach((acc: any) => {
      rows.push([acc.code, `  ${acc.name}`, acc.amount.toLocaleString()]);
    });
  });

  rows.push(
    ['', 'TOTAL OPERATING EXPENSES', `(${pnl.totalOperatingExpenses.toLocaleString()})`],
    ['', `OPERATING PROFIT / EBIT (${pnl.operatingMarginPct}%)`, pnl.operatingProfit.toLocaleString()],
    ['', 'Income Tax Expense', pnl.taxExpense > 0 ? `(${pnl.taxExpense.toLocaleString()})` : '-'],
    ['', `NET PROFIT / (LOSS) FOR THE PERIOD (${pnl.netMarginPct}%)`, pnl.netProfit.toLocaleString()]
  );

  exportToPDF(
    `Profit_And_Loss_${fiscalYear.replace(/\s+/g, '_')}`,
    'PROFIT & LOSS STATEMENT (INCOME STATEMENT)',
    `Fiscal Period: ${fiscalYear} | Method: Accrual Basis | Currency: NPR`,
    ['Account Code', 'Particulars / Line Item', 'Amount (NPR)'],
    rows,
    [
      { label: 'Net Revenue', value: `NPR ${pnl.netRevenue.toLocaleString()}` },
      { label: 'Cost of Goods Sold', value: `NPR ${pnl.cogs.toLocaleString()}` },
      { label: 'Gross Profit', value: `NPR ${pnl.grossProfit.toLocaleString()} (${pnl.grossMarginPct}%)` },
      { label: 'Net Income', value: `NPR ${pnl.netProfit.toLocaleString()} (${pnl.netMarginPct}%)` }
    ],
    'portrait'
  );
};

export const exportBalanceSheetPDF = (bs: any, fiscalYear: string) => {
  const rows: (string | number)[][] = [
    ['--- I. ASSETS (सम्पत्ति) ---', '', ''],
    ['Current Assets', '', '']
  ];

  bs.currentAssets.forEach((a: any) => {
    rows.push([`  ${a.code}`, a.name, `NPR ${a.amount.toLocaleString()}`]);
  });
  rows.push(['', 'TOTAL CURRENT ASSETS', `NPR ${bs.totalCurrentAssets.toLocaleString()}`]);

  rows.push(['Fixed Assets (Property, Plant & Equipment)', '', '']);
  bs.fixedAssets.forEach((a: any) => {
    rows.push([`  ${a.code}`, a.name, `NPR ${a.amount.toLocaleString()}`]);
  });
  rows.push(['  1590', 'Less: Accumulated Depreciation', `(NPR ${bs.lessAccumulatedDepreciation.toLocaleString()})`]);
  rows.push(['', 'NET FIXED ASSETS (BOOK VALUE)', `NPR ${bs.netFixedAssets.toLocaleString()}`]);

  if (bs.otherAssets && bs.otherAssets.length > 0) {
    rows.push(['Other Non-Current Assets', '', '']);
    bs.otherAssets.forEach((a: any) => {
      rows.push([`  ${a.code}`, a.name, `NPR ${a.amount.toLocaleString()}`]);
    });
  }

  rows.push(['', 'TOTAL ASSETS (A)', `NPR ${bs.totalAssets.toLocaleString()}`]);

  rows.push(['--- II. LIABILITIES (चालु तथा दीर्घकालीन दायित्व) ---', '', '']);
  rows.push(['Current Liabilities', '', '']);
  bs.currentLiabilities.forEach((l: any) => {
    rows.push([`  ${l.code}`, l.name, `NPR ${l.amount.toLocaleString()}`]);
  });
  if (bs.longTermLiabilities && bs.longTermLiabilities.length > 0) {
    rows.push(['Long-Term Liabilities', '', '']);
    bs.longTermLiabilities.forEach((l: any) => {
      rows.push([`  ${l.code}`, l.name, `NPR ${l.amount.toLocaleString()}`]);
    });
  }
  rows.push(['', 'TOTAL LIABILITIES (L)', `NPR ${bs.totalLiabilities.toLocaleString()}`]);

  rows.push(['--- II. HEAD: OWNER\'S EQUITY & CAPITAL (मालिकको पुँजी) ---', '', '']);
  if (bs.ownersCapitalItems && bs.ownersCapitalItems.length > 0) {
    bs.ownersCapitalItems.forEach((c: any) => {
      const isDrawings = c.code === '3030';
      rows.push([`  ${c.code}`, c.name, isDrawings && c.amount < 0 ? `(NPR ${Math.abs(c.amount).toLocaleString()})` : `NPR ${c.amount.toLocaleString()}`]);
    });
  } else {
    rows.push(['  3010', 'Owner Capital Equity', `NPR ${(bs.ownerCapital || 0).toLocaleString()}`]);
  }
  rows.push(['', 'SUBTOTAL OWNER\'S CAPITAL', `NPR ${(bs.totalOwnersCapital || 0).toLocaleString()}`]);

  rows.push(['--- IV. HEAD: RETAINED EARNINGS & ACCUMULATED PROFIT (सञ्चित नाफा) ---', '', '']);
  rows.push(['  3020', 'Retained Earnings (Beginning / Prior Period)', `NPR ${(bs.retainedEarningsPrior || 0).toLocaleString()}`]);
  rows.push(['  P&L', 'Net Profit / (Loss) for Current Period (Income Statement)', `NPR ${(bs.currentPeriodNetIncome || 0).toLocaleString()}`]);
  if (bs.otherReserves && bs.otherReserves.length > 0) {
    bs.otherReserves.forEach((r: any) => {
      rows.push([`  ${r.code}`, r.name, `NPR ${r.amount.toLocaleString()}`]);
    });
  }
  rows.push(['', 'SUBTOTAL RETAINED EARNINGS & SURPLUS', `NPR ${(bs.totalRetainedEarnings || 0).toLocaleString()}`]);

  rows.push(['', 'TOTAL OWNER\'S EQUITY (E)', `NPR ${bs.totalEquity.toLocaleString()}`]);
  rows.push(['', 'TOTAL LIABILITIES & EQUITY (L + E)', `NPR ${bs.totalLiabilitiesAndEquity.toLocaleString()}`]);
  rows.push(['', 'EQUATION BALANCE CHECK (A - L - E)', `NPR ${Math.abs(bs.balanceDifference || 0).toLocaleString()} [${bs.isBalanced ? 'BALANCED' : 'UNBALANCED'}]`]);

  exportToPDF(
    `Balance_Sheet_${fiscalYear.replace(/\s+/g, '_')}`,
    'BALANCE SHEET (STATEMENT OF FINANCIAL POSITION)',
    `Fiscal Period: ${fiscalYear} | Accounting Equation: Assets = Liabilities + Equity | Currency: NPR`,
    ['Code', 'Financial Line Item', 'Amount (NPR)'],
    rows,
    [
      { label: 'Total Assets', value: `NPR ${bs.totalAssets.toLocaleString()}` },
      { label: 'Total Liabilities', value: `NPR ${bs.totalLiabilities.toLocaleString()}` },
      { label: 'Owner\'s Capital', value: `NPR ${(bs.totalOwnersCapital || bs.ownerCapital || 0).toLocaleString()}` },
      { label: 'Retained Earnings', value: `NPR ${(bs.totalRetainedEarnings || 0).toLocaleString()}` },
      { label: 'Total Equity', value: `NPR ${bs.totalEquity.toLocaleString()}` },
      { label: 'Balance Equilibrium', value: bs.isBalanced ? 'PERFECT (0.00 Diff)' : 'MISMATCH' }
    ],
    'portrait'
  );
};

export const exportCashFlowPDF = (cf: any, fiscalYear: string) => {
  const rows: (string | number)[][] = [
    ['--- CASH FLOW FROM OPERATING ACTIVITIES ---', ''],
    ['Net Profit / Income for the Period', cf.operatingActivities.netIncome.toLocaleString()],
    ['Adjustments for Working Capital Changes:', ''],
    ['  (Increase) / Decrease in Accounts Receivable', `(${cf.operatingActivities.workingCapitalChanges.arChange.toLocaleString()})`],
    ['  (Increase) / Decrease in Merchandise Inventory', `(${cf.operatingActivities.workingCapitalChanges.inventoryChange.toLocaleString()})`],
    ['  Increase / (Decrease) in Accounts Payable', cf.operatingActivities.workingCapitalChanges.apChange.toLocaleString()],
    ['  Increase / (Decrease) in VAT Payable', cf.operatingActivities.workingCapitalChanges.vatPayableChange.toLocaleString()],
    ['NET CASH FLOW FROM OPERATING ACTIVITIES', cf.operatingActivities.netOperatingCash.toLocaleString()],
    ['--- CASH FLOW FROM INVESTING ACTIVITIES ---', ''],
    ['Purchase of Fixed Assets & Equipment', `(${cf.investingActivities.fixedAssetPurchases.toLocaleString()})`],
    ['NET CASH FLOW FROM INVESTING ACTIVITIES', cf.investingActivities.netInvestingCash.toLocaleString()],
    ['--- CASH FLOW FROM FINANCING ACTIVITIES ---', ''],
    ['Owner Capital Injections', cf.financingActivities.capitalInjections.toLocaleString()],
    ['Less: Owner Drawings / Withdrawals', `(${cf.financingActivities.drawings.toLocaleString()})`],
    ['NET CASH FLOW FROM FINANCING ACTIVITIES', cf.financingActivities.netFinancingCash.toLocaleString()],
    ['NET INCREASE / (DECREASE) IN CASH & BANK', cf.netCashFlow.toLocaleString()],
    ['Cash & Cash Equivalents at Beginning of Period', cf.beginningCashAndBank.toLocaleString()],
    ['CASH & CASH EQUIVALENTS AT END OF PERIOD', cf.endingCashAndBank.toLocaleString()]
  ];

  exportToPDF(
    `Cash_Flow_Statement_${fiscalYear.replace(/\s+/g, '_')}`,
    'STATEMENT OF CASH FLOWS',
    `Fiscal Period: ${fiscalYear} | Method: Indirect Operating Cash Flow | Currency: NPR`,
    ['Particulars', 'Amount (NPR)'],
    rows,
    [
      { label: 'Operating Cash Flow', value: `NPR ${cf.operatingActivities.netOperatingCash.toLocaleString()}` },
      { label: 'Net Cash Movement', value: `NPR ${cf.netCashFlow.toLocaleString()}` },
      { label: 'Ending Cash & Bank', value: `NPR ${cf.endingCashAndBank.toLocaleString()}` }
    ],
    'portrait'
  );
};

export const exportCashFlowReportPDF = exportCashFlowPDF;

export const exportGeneralLedgerPDF = (rowsOrAccounts: any[], title = 'GENERAL LEDGER') => {
  let tableRows: (string | number)[][] = [];

  if (rowsOrAccounts.length > 0 && rowsOrAccounts[0].transactions) {
    rowsOrAccounts.forEach((acc: any) => {
      acc.transactions.forEach((r: any) => {
        tableRows.push([
          r.date || '',
          r.entryNumber || '',
          r.voucherType || 'JV',
          `${acc.accountCode} - ${acc.accountName}`,
          r.particulars || r.description || '',
          r.debit > 0 ? r.debit.toLocaleString() : '-',
          r.credit > 0 ? r.credit.toLocaleString() : '-',
          (r.runningBalance !== undefined ? r.runningBalance : (r.balance || 0)).toLocaleString()
        ]);
      });
    });
  } else {
    tableRows = rowsOrAccounts.map(r => [
      r.date || '',
      r.entryNumber || '',
      r.voucherType || 'JV',
      `${r.accountCode || ''} - ${r.accountName || ''}`,
      r.particulars || r.description || '',
      r.debit > 0 ? r.debit.toLocaleString() : '-',
      r.credit > 0 ? r.credit.toLocaleString() : '-',
      (r.balance !== undefined ? r.balance : (r.runningBalance || 0)).toLocaleString()
    ]);
  }

  exportToPDF(
    'General_Ledger_Complete',
    title,
    `Export Date: ${new Date().toLocaleDateString()} | Full Audited Double-Entry General Ledger`,
    ['Date', 'Voucher #', 'Type', 'Account', 'Particulars', 'Debit (NPR)', 'Credit (NPR)', 'Running Bal (NPR)'],
    tableRows,
    undefined,
    'landscape'
  );
};

export const exportVoucherReceiptPDF = (entry: any) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(24, 24, 27);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(245, 158, 11);
  doc.rect(0, 28, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('KALPA LUXURY TIMEPIECES', 14, 12);

  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11);
  doc.text(`OFFICIAL ACCOUNTING VOUCHER: ${entry.voucherType || 'JOURNAL ENTRY'}`, 14, 20);

  doc.setFillColor(245, 245, 247);
  doc.roundedRect(14, 35, pageWidth - 28, 24, 2, 2, 'F');

  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`Voucher Number: ${entry.entryNumber}`, 18, 42);
  doc.text(`Transaction Date: ${entry.date}`, 18, 48);
  doc.text(`Reference / Ref Inv: ${entry.reference || 'N/A'}`, 18, 54);

  doc.text(`Created By: ${entry.createdBy}`, 110, 42);
  doc.text(`Module Source: ${entry.sourceModule || 'Accounting'}`, 110, 48);
  doc.text(`Cost Center: ${entry.costCenterName || 'Headquarters'}`, 110, 54);

  const tableRows = entry.lines.map((l: any) => [
    l.accountCode,
    l.accountName,
    l.particulars || entry.description,
    l.debit > 0 ? l.debit.toLocaleString() : '-',
    l.credit > 0 ? l.credit.toLocaleString() : '-'
  ]);

  const totalDr = entry.lines.reduce((s: number, l: any) => s + (Number(l.debit) || 0), 0);
  const totalCr = entry.lines.reduce((s: number, l: any) => s + (Number(l.credit) || 0), 0);

  tableRows.push(['TOTAL', '', 'TOTAL BALANCED ENTRY', totalDr.toLocaleString(), totalCr.toLocaleString()]);

  autoTable(doc, {
    startY: 64,
    head: [['Code', 'Account Title', 'Particulars / Memo', 'Debit (NPR)', 'Credit (NPR)']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [24, 24, 27], textColor: [245, 158, 11], fontStyle: 'bold' }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Description / Narration: ${entry.description}`, 14, finalY);

  doc.line(14, finalY + 25, 60, finalY + 25);
  doc.text('Prepared By (Accountant)', 14, finalY + 30);

  doc.line(pageWidth - 64, finalY + 25, pageWidth - 14, finalY + 25);
  doc.text('Authorized Signatory', pageWidth - 64, finalY + 30);

  doc.save(`Voucher_${entry.entryNumber}.pdf`);
};


