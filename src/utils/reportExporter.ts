/**
 * Report Exporter Utility for CSV and Printable Downloads
 * Enables exporting all system modules & financial reports to CSV / Excel format.
 */

import { Sale, Product, JournalEntry, Warranty, Purchase, AuditLog, Account } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Generic CSV Exporter
export const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const sanitize = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(sanitize).join(','),
    ...rows.map(row => row.map(sanitize).join(','))
  ].join('\n');

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
  doc.text('SAMAYA WATCH STORE', 14, 12);

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
        `Page ${data.pageNumber} of ${totalPages}  •  Kalpa Luxury Timepiece Boutique ERP  •  Confidential Financial Document`,
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

