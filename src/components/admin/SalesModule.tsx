import React, { useState } from 'react';
import { Plus, Search, FileText, CheckCircle, ShieldCheck, Printer, ArrowRight, UserPlus, DollarSign, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderSource, PaymentMethod, Sale } from '../../types';
import { exportSalesReport, exportSalesReportPDF } from '../../utils/reportExporter';

export const SalesModule: React.FC = () => {
  const { products, customers, sales, createSale, currentUser } = useApp();
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedSaleForInvoice, setSelectedSaleForInvoice] = useState<Sale | null>(null);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('Kathmandu, Nepal');
  const [serialNumber, setSerialNumber] = useState('');
  const [imei, setImei] = useState('');
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [orderSource, setOrderSource] = useState<OrderSource>('Instagram');
  const [courierName, setCourierName] = useState('Pathao Courier');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle product selection to prefill price & serial suggestion
  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const p = products.find(prod => prod.id === prodId);
    if (p) {
      setSellingPrice(p.sellingPrice);
      setSerialNumber(`${p.brand.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedProductId) {
      setErrorMsg('Please select a watch product.');
      return;
    }
    if (!customerName || !customerMobile) {
      setErrorMsg('Customer Name and Mobile Number are required.');
      return;
    }
    if (!serialNumber) {
      setErrorMsg('Serial Number is required for warranty tracking.');
      return;
    }

    const result = createSale({
      customerName,
      customerMobile,
      customerAddress,
      productId: selectedProductId,
      serialNumber,
      imei,
      sellingPrice,
      discount,
      paymentMethod,
      orderSource,
      courierName,
      trackingNumber
    });

    if ('error' in result) {
      setErrorMsg(result.error);
    } else {
      setShowNewModal(false);
      setSelectedSaleForInvoice(result.sale);
      // Reset form
      setSelectedProductId('');
      setCustomerName('');
      setCustomerMobile('');
      setSerialNumber('');
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const netTotal = Math.max(0, sellingPrice - discount);
  const vat = 0; // VAT removed as requested
  const finalTotal = netTotal;

  return (
    <div className="space-y-6 text-white">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <span>Sales Orders & Automated Invoice ERP</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Creating an invoice automatically decrements inventory, posts double-entry journal entries, and issues an active QR Warranty.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportSalesReportPDF(sales)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>

          <button
            onClick={() => exportSalesReport(sales)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Sales Order</span>
          </button>
        </div>
      </div>

      {/* Sales Orders Table */}
      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-amber-400 font-bold">
            Recent Finalized Sales Invoices ({sales.length})
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            Automated Warranty ID & QR Code Linked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Customer & Mobile</th>
                <th className="p-3">Watch Model</th>
                <th className="p-3">Serial No</th>
                <th className="p-3">Order Source</th>
                <th className="p-3">Final Total</th>
                <th className="p-3">Warranty ID</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {sales.map(sale => (
                <tr key={sale.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3 font-bold text-amber-200">{sale.invoiceNumber}</td>
                  <td className="p-3">
                    <div className="font-sans font-semibold text-zinc-100">{sale.customerName}</div>
                    <div className="text-[11px] text-zinc-500">{sale.customerMobile}</div>
                  </td>
                  <td className="p-3 font-sans text-zinc-200">{sale.watchModel}</td>
                  <td className="p-3 text-amber-300">{sale.serialNumber}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {sale.orderSource}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-amber-300">
                    NPR {sale.finalTotal.toLocaleString()}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {sale.warrantyId}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedSaleForInvoice(sale)}
                      className="px-3 py-1.5 rounded bg-zinc-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[11px] font-sans font-bold cursor-pointer"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW SALE ORDER MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-2xl w-full text-white shadow-2xl p-6 relative my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-100">Create New Sales Order</h3>
                <p className="text-xs text-zinc-400">Generates Invoice, Journal Entry & QR Warranty automatically.</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-zinc-400 hover:text-white text-xs">✕ Close</button>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/80 border border-rose-500/50 p-3 rounded-lg text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSale} className="space-y-4">
              
              {/* Product Selection */}
              <div>
                <label className="text-xs font-mono uppercase text-amber-400 block mb-1">Select Timepiece (In Stock):</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Watch from Inventory --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock < 1}>
                      {p.brand} {p.model} (Stock: {p.stock}) - NPR {p.sellingPrice.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sujan Karki"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Mobile Number (10 Digits) *</label>
                  <input
                    type="text"
                    required
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    placeholder="e.g. 9851234567"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Serial & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono text-amber-400 block mb-1">Watch Serial Number *</label>
                  <input
                    type="text"
                    required
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. RLX-988310-Z8"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Selling Price (NPR)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Discount (NPR)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Source & Payment & Courier */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Order Source *</label>
                  <select
                    value={orderSource}
                    onChange={(e) => setOrderSource(e.target.value as OrderSource)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                  >
                    <option value="Instagram">Instagram DM</option>
                    <option value="TikTok">TikTok Order</option>
                    <option value="Facebook">Facebook Messenger</option>
                    <option value="WhatsApp">WhatsApp Inquiry</option>
                    <option value="Walk-in">Walk-in Showroom</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer (Nabil)</option>
                    <option value="eSewa">eSewa Wallet</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Cash">Cash in Hand</option>
                    <option value="Khalti">Khalti Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Courier Logistics</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. Pathao / Aramex"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Calculations Summary */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-amber-500/30 flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="text-zinc-400 block">Selling Price: NPR {sellingPrice.toLocaleString()}</span>
                  {discount > 0 && <span className="text-rose-400 block">Discount: - NPR {discount.toLocaleString()}</span>}
                </div>
                <div className="text-right">
                  <span className="text-amber-400 uppercase block font-bold">Total Billable Amount</span>
                  <span className="text-lg font-serif font-bold text-amber-200">NPR {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-amber-500/50 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:scale-105 transition-all cursor-pointer"
                >
                  Finalize & Post ERP Order
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW INVOICE MODAL */}
      {selectedSaleForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative print:p-0 my-8">
            <button
              onClick={() => setSelectedSaleForInvoice(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-black text-xs font-bold print:hidden cursor-pointer"
            >
              ✕ Close
            </button>

            {/* Sales Estimate Bill Header */}
            <div className="border-b-2 border-amber-600 pb-4 flex justify-between items-start">
              <div>
                <h1 className="font-serif text-2xl font-bold uppercase tracking-widest text-zinc-900">
                  समय- The Watch Store
                </h1>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase px-3 py-1 bg-amber-100 text-amber-900 rounded border border-amber-300">
                  SALES ESTIMATE BILL
                </span>
                <p className="text-xs font-mono font-bold text-zinc-800 mt-2">Bill #: {selectedSaleForInvoice.invoiceNumber}</p>
                <p className="text-xs font-mono text-zinc-600">Date: {selectedSaleForInvoice.orderDate}</p>
              </div>
            </div>

            {/* Customer & Order details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                <span className="font-bold text-zinc-700 block uppercase mb-1">Billed To:</span>
                <p className="font-bold text-sm text-zinc-900">{selectedSaleForInvoice.customerName}</p>
                <p className="font-mono text-zinc-600">Mobile: {selectedSaleForInvoice.customerMobile}</p>
                <p className="text-zinc-600">Source: {selectedSaleForInvoice.orderSource}</p>
              </div>
              <div className="bg-zinc-50 p-3 rounded border border-zinc-200">
                <span className="font-bold text-zinc-700 block uppercase mb-1">Warranty Details:</span>
                <p className="font-bold font-mono text-amber-700">Warranty ID: {selectedSaleForInvoice.warrantyId}</p>
                <p className="font-mono text-zinc-600">Serial No: {selectedSaleForInvoice.serialNumber}</p>
                <p className="text-zinc-600">Payment: {selectedSaleForInvoice.paymentMethod}</p>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left text-xs border border-zinc-300">
              <thead className="bg-zinc-100 font-mono text-zinc-800 border-b border-zinc-300">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">Serial No</th>
                  <th className="p-2.5 text-right">Selling Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                <tr>
                  <td className="p-2.5 font-bold">{selectedSaleForInvoice.watchModel}</td>
                  <td className="p-2.5 font-mono">{selectedSaleForInvoice.serialNumber}</td>
                  <td className="p-2.5 font-mono text-right">NPR {selectedSaleForInvoice.sellingPrice.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Total calculation */}
            <div className="flex justify-end pt-2 text-xs font-mono space-y-1">
              <div className="w-64 space-y-1 border-t border-zinc-300 pt-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal:</span>
                  <span>NPR {selectedSaleForInvoice.sellingPrice.toLocaleString()}</span>
                </div>
                {selectedSaleForInvoice.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>- NPR {selectedSaleForInvoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-zinc-900 border-t border-zinc-900 pt-1">
                  <span>Total Amount:</span>
                  <span>NPR {selectedSaleForInvoice.sellingPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 pt-4 border-t border-zinc-200 text-center">
              Thank you for choosing समय- The Watch Store. Your Digital QR Warranty is active and verified at <strong>https://samaya-watch-store-nepal.ai.studio/warranty?code={selectedSaleForInvoice.warrantyId}</strong>
            </div>

            <div className="pt-2 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-zinc-900 text-amber-300 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer hover:bg-zinc-800"
              >
                <Printer className="w-4 h-4" />
                <span>Print Sales Estimate Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
