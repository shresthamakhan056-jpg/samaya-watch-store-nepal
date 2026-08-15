import React, { useState } from 'react';
import { BarChart3, Download, Printer, FileText, PieChart, ShieldCheck, RefreshCw, Layers, Watch, Truck, DollarSign, Box } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  exportSalesReport,
  exportSalesReportPDF,
  exportInventoryReport,
  exportInventoryReportPDF,
  exportPurchaseReport,
  exportPurchaseReportPDF,
  exportSupplyPurchasesReport,
  exportSupplyPurchasesReportPDF,
  exportVatTaxReport,
  exportVatTaxReportPDF,
  exportWarrantyReport,
  exportWarrantyReportPDF,
  exportAuditLogsReport,
  exportAuditLogsReportPDF,
  exportPaymentsReportPDF,
  exportBrandSalesReportPDF,
  exportPlatformSalesReportPDF,
  exportStaffSalesReportPDF,
  exportToCSV
} from '../../utils/reportExporter';

export const ReportsModule: React.FC = () => {
  const { sales, products, customers, accounts, purchases, supplyPurchases, warranties, auditLogs, journalEntries } = useApp();
  const [reportType, setReportType] = useState<
    'sales' | 'brand' | 'platform' | 'staff' | 'inventory' | 'purchases' | 'supplies' | 'payments' | 'tax' | 'warranty' | 'audit'
  >('sales');

  // Sales by Brand
  const brandSales: Record<string, { count: number; total: number }> = {};
  sales.forEach(s => {
    if (!brandSales[s.productBrand]) brandSales[s.productBrand] = { count: 0, total: 0 };
    brandSales[s.productBrand].count += 1;
    brandSales[s.productBrand].total += s.finalTotal;
  });

  // Sales by Platform
  const platformSales: Record<string, { count: number; total: number }> = {};
  sales.forEach(s => {
    if (!platformSales[s.orderSource]) platformSales[s.orderSource] = { count: 0, total: 0 };
    platformSales[s.orderSource].count += 1;
    platformSales[s.orderSource].total += s.finalTotal;
  });

  // Sales by Staff
  const staffSales: Record<string, { count: number; total: number }> = {};
  sales.forEach(s => {
    if (!staffSales[s.salesPerson]) staffSales[s.salesPerson] = { count: 0, total: 0 };
    staffSales[s.salesPerson].count += 1;
    staffSales[s.salesPerson].total += s.finalTotal;
  });

  const totalVatCollected = sales.reduce((sum, s) => sum + s.vatAmount, 0);

  const handleExportCurrentReport = () => {
    switch (reportType) {
      case 'sales':
        exportSalesReport(sales);
        break;
      case 'brand': {
        const headers = ['Watch Brand', 'Units Sold', 'Total Revenue (NPR)'];
        const rows = Object.keys(brandSales).map(b => [b, brandSales[b].count, brandSales[b].total]);
        exportToCSV('Sales_By_Watch_Brand_Report', headers, rows);
        break;
      }
      case 'platform': {
        const headers = ['Social Platform Channel', 'Orders Fulfilled', 'Total Revenue (NPR)'];
        const rows = Object.keys(platformSales).map(p => [p, platformSales[p].count, platformSales[p].total]);
        exportToCSV('Sales_By_Social_Platform_Report', headers, rows);
        break;
      }
      case 'staff': {
        const headers = ['Staff Member', 'Orders Processed', 'Total Revenue (NPR)'];
        const rows = Object.keys(staffSales).map(st => [st, staffSales[st].count, staffSales[st].total]);
        exportToCSV('Sales_By_Staff_Report', headers, rows);
        break;
      }
      case 'inventory':
        exportInventoryReport(products);
        break;
      case 'purchases':
        exportPurchaseReport(purchases);
        break;
      case 'supplies':
        exportSupplyPurchasesReport(supplyPurchases);
        break;
      case 'payments': {
        const headers = ['Voucher / Ref Number', 'Date', 'Description / Particulars', 'Account Code', 'Account Title', 'Debit (NPR)', 'Credit (NPR)', 'Posted By'];
        const rows: (string | number)[][] = [];
        journalEntries.forEach(je => {
          je.lines.forEach(l => {
            rows.push([
              je.reference || je.entryNumber,
              je.date,
              je.description,
              l.accountCode,
              l.accountName,
              l.debit,
              l.credit,
              je.createdBy
            ]);
          });
        });
        exportToCSV('Financial_Payments_And_Received_Ledger', headers, rows);
        break;
      }
      case 'tax':
        exportVatTaxReport(sales);
        break;
      case 'warranty':
        exportWarrantyReport(warranties);
        break;
      case 'audit':
        exportAuditLogsReport(auditLogs);
        break;
    }
  };

  const handleExportCurrentReportPDF = () => {
    switch (reportType) {
      case 'sales':
        exportSalesReportPDF(sales);
        break;
      case 'brand': {
        const brandData = Object.keys(brandSales).map(b => ({ brand: b, count: brandSales[b].count, revenue: brandSales[b].total }));
        exportBrandSalesReportPDF(brandData);
        break;
      }
      case 'platform': {
        const platformData = Object.keys(platformSales).map(p => ({ channel: p, count: platformSales[p].count, revenue: platformSales[p].total }));
        exportPlatformSalesReportPDF(platformData);
        break;
      }
      case 'staff': {
        const staffData = Object.keys(staffSales).map(st => ({ staff: st, count: staffSales[st].count, revenue: staffSales[st].total }));
        exportStaffSalesReportPDF(staffData);
        break;
      }
      case 'inventory':
        exportInventoryReportPDF(products);
        break;
      case 'purchases':
        exportPurchaseReportPDF(purchases);
        break;
      case 'supplies':
        exportSupplyPurchasesReportPDF(supplyPurchases);
        break;
      case 'payments':
        exportPaymentsReportPDF(journalEntries);
        break;
      case 'tax':
        exportVatTaxReportPDF(sales);
        break;
      case 'warranty':
        exportWarrantyReportPDF(warranties);
        break;
      case 'audit':
        exportAuditLogsReportPDF(auditLogs);
        break;
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-amber-400" />
              <span>Analytical & Downloadable System Reports</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Audit Verified Data</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Exportable performance analytics by brand, sales channels, inventory stock, tax compliance, warranties, purchase orders, and audit history in both PDF & CSV formats.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCurrentReportPDF}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={handleExportCurrentReport}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
        <button
          onClick={() => setReportType('sales')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'sales' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Sales Ledger ({sales.length})
        </button>
        <button
          onClick={() => setReportType('brand')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'brand' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Sales by Brand
        </button>
        <button
          onClick={() => setReportType('platform')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'platform' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Social Channels
        </button>
        <button
          onClick={() => setReportType('staff')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'staff' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Staff Performance
        </button>
        <button
          onClick={() => setReportType('inventory')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'inventory' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Inventory Valuation ({products.length})
        </button>
        <button
          onClick={() => setReportType('purchases')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'purchases' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Watch Purchases ({purchases.length})
        </button>
        <button
          onClick={() => setReportType('supplies')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'supplies' ? 'bg-amber-500 text-zinc-950' : 'text-amber-400 hover:text-amber-200'
          }`}
        >
          Boxes & Supplies ({supplyPurchases.length})
        </button>
        <button
          onClick={() => setReportType('payments')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'payments' ? 'bg-amber-500 text-zinc-950' : 'text-amber-400 hover:text-amber-200'
          }`}
        >
          Payments & Receipts ({journalEntries.length})
        </button>
        <button
          onClick={() => setReportType('warranty')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'warranty' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Warranty Register ({warranties.length})
        </button>
        <button
          onClick={() => setReportType('tax')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'tax' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
          }`}
        >
          VAT Tax (13%)
        </button>
        <button
          onClick={() => setReportType('audit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'audit' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* REPORT CONTENT VIEW */}
      <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 shadow-xl space-y-4">
        
        {/* Sales Master Report */}
        {reportType === 'sales' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-200">Sales Transactions & Revenue Ledger</h3>
              <span className="text-xs font-mono text-zinc-400">Total Revenue: NPR {sales.reduce((a, b) => a + b.finalTotal, 0).toLocaleString()}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Watch Model</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Channel</th>
                    <th className="p-3 text-right">Amount (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-amber-300">{s.invoiceNumber}</td>
                      <td className="p-3 text-zinc-400">{s.orderDate}</td>
                      <td className="p-3 text-zinc-100 font-sans font-semibold">{s.customerName}</td>
                      <td className="p-3 text-zinc-200 font-sans">{s.productBrand} {s.productModel}</td>
                      <td className="p-3 text-emerald-400 font-bold">{s.paymentMethod}</td>
                      <td className="p-3 text-amber-200">{s.orderSource}</td>
                      <td className="p-3 text-right font-bold text-amber-300">NPR {s.finalTotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Brand Sales */}
        {reportType === 'brand' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-zinc-800 pb-3">Revenue Analysis by Luxury Watch Brand</h3>
            <table className="w-full text-left text-xs font-mono text-zinc-300">
              <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Watch Brand</th>
                  <th className="p-3">Units Sold</th>
                  <th className="p-3 text-right">Total Generated Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {Object.keys(brandSales).map(b => (
                  <tr key={b} className="hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-zinc-100 font-sans">{b}</td>
                    <td className="p-3">{brandSales[b].count} Watches</td>
                    <td className="p-3 text-right font-bold text-amber-300">NPR {brandSales[b].total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Social Platforms */}
        {reportType === 'platform' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-zinc-800 pb-3">Order Channel Performance (Social Conversion)</h3>
            <table className="w-full text-left text-xs font-mono text-zinc-300">
              <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Social Platform Channel</th>
                  <th className="p-3">Orders Fulfilled</th>
                  <th className="p-3 text-right">Revenue Contributed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {Object.keys(platformSales).map(p => (
                  <tr key={p} className="hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-amber-200 font-sans">{p}</td>
                    <td className="p-3">{platformSales[p].count} Orders</td>
                    <td className="p-3 text-right font-bold text-emerald-400">NPR {platformSales[p].total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Staff Performance */}
        {reportType === 'staff' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-zinc-800 pb-3">Staff Sales Performance Breakdown</h3>
            <table className="w-full text-left text-xs font-mono text-zinc-300">
              <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Staff Representative</th>
                  <th className="p-3">Orders Closed</th>
                  <th className="p-3 text-right">Total Sales Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {Object.keys(staffSales).map(st => (
                  <tr key={st} className="hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-zinc-100 font-sans">{st}</td>
                    <td className="p-3">{staffSales[st].count} Orders</td>
                    <td className="p-3 text-right font-bold text-emerald-400">NPR {staffSales[st].total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inventory Report */}
        {reportType === 'inventory' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-200">Inventory Stock & Valuation Report</h3>
              <span className="text-xs font-mono text-amber-400 font-bold">
                Total Valuation: NPR {products.reduce((acc, p) => acc + (p.purchasePrice * p.stock), 0).toLocaleString()}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Watch Name</th>
                    <th className="p-3">Movement</th>
                    <th className="p-3 text-right">Cost (NPR)</th>
                    <th className="p-3 text-right">Retail (NPR)</th>
                    <th className="p-3 text-center">In Stock</th>
                    <th className="p-3 text-right">Asset Value (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-amber-300">{p.sku}</td>
                      <td className="p-3 font-sans text-zinc-100">{p.brand} {p.model}</td>
                      <td className="p-3 text-zinc-400">{p.movement}</td>
                      <td className="p-3 text-right text-zinc-300">NPR {p.purchasePrice.toLocaleString()}</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">NPR {p.sellingPrice.toLocaleString()}</td>
                      <td className="p-3 text-center font-bold text-amber-300">{p.stock}</td>
                      <td className="p-3 text-right font-bold text-amber-200">NPR {(p.purchasePrice * p.stock).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Purchases Report */}
        {reportType === 'purchases' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-zinc-800 pb-3">Stock Procurement & Purchase Orders Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Purchase Date</th>
                    <th className="p-3">Supplier ID</th>
                    <th className="p-3 text-center">Total Quantity</th>
                    <th className="p-3 text-right">Total Procurement Cost</th>
                    <th className="p-3">Created By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {purchases.map(pur => (
                    <tr key={pur.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-amber-300">{pur.invoiceNumber}</td>
                      <td className="p-3 text-zinc-400">{pur.purchaseDate}</td>
                      <td className="p-3 text-zinc-200">{pur.supplierId}</td>
                      <td className="p-3 text-center font-bold text-amber-300">{pur.quantity} Watches</td>
                      <td className="p-3 text-right font-bold text-emerald-400">NPR {pur.cost.toLocaleString()}</td>
                      <td className="p-3 text-zinc-400">{pur.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Supplies & Packaging Report */}
        {reportType === 'supplies' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-200 flex items-center gap-2">
                <Box className="w-5 h-5 text-amber-400" />
                <span>Non-Watch Supplies, Boxes & Packaging Procurement Report</span>
              </h3>
              <span className="text-xs font-mono text-amber-300 font-bold">
                Total Spend: NPR {supplyPurchases.reduce((acc, p) => acc + p.cost, 0).toLocaleString()}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Supplier</th>
                    <th className="p-3">Items Summary</th>
                    <th className="p-3 text-center">Total Units</th>
                    <th className="p-3 text-right">Cost (NPR)</th>
                    <th className="p-3">Ledger Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {supplyPurchases.map(pur => (
                    <tr key={pur.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-amber-300">{pur.invoiceNumber}</td>
                      <td className="p-3 text-zinc-400">{pur.purchaseDate}</td>
                      <td className="p-3 text-zinc-300 font-sans">{pur.purchaseType}</td>
                      <td className="p-3 text-zinc-200 font-sans">{pur.supplierName}</td>
                      <td className="p-3 text-zinc-400 font-sans text-[11px]">
                        {pur.items.map(it => `${it.supplyItemName} (${it.quantity})`).join(', ')}
                      </td>
                      <td className="p-3 text-center font-bold text-amber-300">{pur.quantity}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        NPR {pur.cost.toLocaleString()}
                      </td>
                      <td className="p-3 text-cyan-400 font-mono text-[11px]">
                        {pur.accountType === '5020' ? 'Acc #5020 (Exp)' : 'Acc #1210 (Asset)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financial Payments & Receipts Report */}
        {reportType === 'payments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-3 gap-2">
              <h3 className="font-serif text-lg font-bold text-amber-200">Payment & Received Entry Transaction Report</h3>
              <span className="text-xs font-mono text-zinc-400">Total Recorded Entries: <strong className="text-amber-300">{journalEntries.length}</strong></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Voucher # / Ref</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Description / Particulars</th>
                    <th className="p-3">Accounts Impacted</th>
                    <th className="p-3 text-right">Amount (NPR)</th>
                    <th className="p-3 text-right">Posted By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {journalEntries.map(je => {
                    const isPayment = je.description.toUpperCase().includes('PAYMENT') || je.reference?.startsWith('PAY') || je.lines.some(l => l.credit > 0 && l.accountCode.startsWith('10'));
                    const totalAmt = je.lines.reduce((sum, l) => sum + Math.max(l.debit, l.credit), 0) / 2 || je.lines[0]?.debit || je.lines[0]?.credit || 0;

                    return (
                      <tr key={je.id} className="hover:bg-zinc-800/40">
                        <td className="p-3 font-bold text-amber-300">{je.reference || je.entryNumber}</td>
                        <td className="p-3 text-zinc-400">{je.date}</td>
                        <td className="p-3 font-sans text-zinc-100 max-w-xs truncate">{je.description}</td>
                        <td className="p-3 text-zinc-400">
                          {je.lines.map(l => `${l.accountName} (${l.debit > 0 ? 'Dr' : 'Cr'})`).join(', ')}
                        </td>
                        <td className={`p-3 text-right font-bold ${isPayment ? 'text-rose-400' : 'text-emerald-400'}`}>
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

        {/* Warranty Report */}
        {reportType === 'warranty' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-zinc-800 pb-3">Digital Warranty Register & Claims History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Warranty ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Watch Model</th>
                    <th className="p-3">Serial #</th>
                    <th className="p-3">Valid Until</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {warranties.map(w => (
                    <tr key={w.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-amber-300">{w.id}</td>
                      <td className="p-3 font-sans text-zinc-100">{w.customerName}</td>
                      <td className="p-3 font-sans text-zinc-200">{w.productBrand} {w.productModel}</td>
                      <td className="p-3 text-zinc-400">{w.serialNumber}</td>
                      <td className="p-3 text-zinc-300">{w.warrantyEnd}</td>
                      <td className="p-3 font-bold text-emerald-400">{w.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VAT Report */}
        {reportType === 'tax' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-zinc-800 pb-3">Nepalese Inland Revenue Department VAT Report (13%)</h3>
            <div className="bg-zinc-950 p-6 rounded-xl border border-amber-500/30 font-mono text-xs space-y-3">
              <div className="flex justify-between">
                <span>Total Taxable Sales Invoices:</span>
                <span className="font-bold text-zinc-200">{sales.length} Invoices</span>
              </div>
              <div className="flex justify-between">
                <span>Total Gross Sales Amount:</span>
                <span className="font-bold text-zinc-200">NPR {sales.reduce((sum, s) => sum + s.sellingPrice, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-amber-300 font-bold text-sm pt-3 border-t border-zinc-800">
                <span>13% VAT Collected & Payable to Inland Revenue:</span>
                <span>NPR {totalVatCollected.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Audit Trail */}
        {reportType === 'audit' && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-zinc-800 pb-3">Audit Trail & Security System Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Module</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {auditLogs.map(a => (
                    <tr key={a.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 text-amber-400">{a.timestamp}</td>
                      <td className="p-3 font-bold text-zinc-100 font-sans">{a.userName}</td>
                      <td className="p-3 text-zinc-400">{a.userRole}</td>
                      <td className="p-3 text-emerald-400 font-bold">{a.action}</td>
                      <td className="p-3 text-amber-200">{a.module}</td>
                      <td className="p-3 text-zinc-300 font-sans">{a.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
