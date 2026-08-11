import React, { useState } from 'react';
import { Plus, Search, FileText, CheckCircle, ShieldCheck, Printer, ArrowRight, UserPlus, DollarSign, Download, Edit3, Save, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { OrderSource, PaymentMethod, Sale } from '../../types';
import { exportSalesReport, exportSalesReportPDF, exportSingleEstimateBillPDF } from '../../utils/reportExporter';
import kalpaLogo from '../../assets/kalpa_logo.jpg';

export const SalesModule: React.FC = () => {
  const { products, customers, sales, createSale, updateSale, currentUser } = useApp();
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedSaleForInvoice, setSelectedSaleForInvoice] = useState<Sale | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  // Form states for NEW Sale
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

  // Form states for EDIT Sale
  const [editOrderDate, setEditOrderDate] = useState('');
  const [editInvoiceNumber, setEditInvoiceNumber] = useState('');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerMobile, setEditCustomerMobile] = useState('');
  const [editWatchModel, setEditWatchModel] = useState('');
  const [editSerialNumber, setEditSerialNumber] = useState('');
  const [editSellingPrice, setEditSellingPrice] = useState<number>(0);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [editOrderSource, setEditOrderSource] = useState<OrderSource>('Instagram');
  const [editWarrantyId, setEditWarrantyId] = useState('');

  // Open Edit Modal
  const handleStartEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setEditOrderDate(sale.orderDate || new Date().toISOString().substring(0, 10));
    setEditInvoiceNumber(sale.invoiceNumber);
    setEditCustomerName(sale.customerName);
    setEditCustomerMobile(sale.customerMobile);
    setEditWatchModel(sale.watchModel || `${sale.productBrand} ${sale.productModel}`);
    setEditSerialNumber(sale.serialNumber);
    setEditSellingPrice(sale.sellingPrice);
    setEditDiscount(sale.discount || 0);
    setEditPaymentMethod(sale.paymentMethod);
    setEditOrderSource(sale.orderSource);
    setEditWarrantyId(sale.warrantyId);
  };

  const handleSaveEditSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale) return;

    const netTotal = Math.max(0, editSellingPrice - editDiscount);

    const updatedData: Partial<Sale> = {
      orderDate: editOrderDate,
      invoiceNumber: editInvoiceNumber,
      customerName: editCustomerName,
      customerMobile: editCustomerMobile,
      watchModel: editWatchModel,
      serialNumber: editSerialNumber,
      sellingPrice: editSellingPrice,
      discount: editDiscount,
      netTotal: netTotal,
      finalTotal: netTotal,
      paymentMethod: editPaymentMethod,
      orderSource: editOrderSource,
      warrantyId: editWarrantyId
    };

    updateSale(editingSale.id, updatedData);

    // If invoice preview is currently open for this sale, update it
    if (selectedSaleForInvoice && selectedSaleForInvoice.id === editingSale.id) {
      setSelectedSaleForInvoice({
        ...selectedSaleForInvoice,
        ...updatedData,
        netTotal,
        finalTotal: netTotal
      });
    }

    setEditingSale(null);
  };

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
            Create, manage, alter, and download A4 Sales Estimate Bills with active QR warranty verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportSalesReportPDF(sales)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download Sales PDF</span>
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
            Editable Sales Date & A4 Downloadable Bills
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Sales Date</th>
                <th className="p-3">Customer & Mobile</th>
                <th className="p-3">Watch Model</th>
                <th className="p-3">Serial No</th>
                <th className="p-3">Final Total</th>
                <th className="p-3">Warranty ID</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {sales.map(sale => (
                <tr key={sale.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3 font-bold text-amber-200">{sale.invoiceNumber}</td>
                  <td className="p-3 text-zinc-400">{sale.orderDate}</td>
                  <td className="p-3">
                    <div className="font-sans font-semibold text-zinc-100">{sale.customerName}</div>
                    <div className="text-[11px] text-zinc-500">{sale.customerMobile}</div>
                  </td>
                  <td className="p-3 font-sans text-zinc-200">{sale.watchModel}</td>
                  <td className="p-3 text-amber-300">{sale.serialNumber}</td>
                  <td className="p-3 font-bold text-amber-300">
                    NPR {sale.finalTotal.toLocaleString()}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">
                    {sale.warrantyId}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleStartEditSale(sale)}
                      className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 text-[11px] font-sans font-bold cursor-pointer inline-flex items-center gap-1"
                      title="Alter Sales Date & Details"
                    >
                      <Edit3 className="w-3 h-3 text-amber-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setSelectedSaleForInvoice(sale)}
                      className="px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[11px] font-sans font-bold cursor-pointer inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>A4 Bill</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT SALE MODAL */}
      {editingSale && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F0F12] border border-amber-500/50 rounded-2xl max-w-2xl w-full text-white shadow-2xl p-6 relative my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-100 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  <span>Alter Sales Estimate & Bill Info</span>
                </h3>
                <p className="text-xs text-zinc-400">Modify sales date, customer information, watch serial, or pricing.</p>
              </div>
              <button onClick={() => setEditingSale(null)} className="text-zinc-400 hover:text-white text-xs">✕ Close</button>
            </div>

            <form onSubmit={handleSaveEditSale} className="space-y-4">
              
              {/* Date & Invoice Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-amber-400 block mb-1">Sales Date *</label>
                  <input
                    type="date"
                    required
                    value={editOrderDate}
                    onChange={(e) => setEditOrderDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Invoice / Bill Number *</label>
                  <input
                    type="text"
                    required
                    value={editInvoiceNumber}
                    onChange={(e) => setEditInvoiceNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editCustomerName}
                    onChange={(e) => setEditCustomerName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Customer Mobile *</label>
                  <input
                    type="text"
                    required
                    value={editCustomerMobile}
                    onChange={(e) => setEditCustomerMobile(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Watch Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Watch Model / Item Description *</label>
                  <input
                    type="text"
                    required
                    value={editWatchModel}
                    onChange={(e) => setEditWatchModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-amber-400 block mb-1">Serial Number *</label>
                  <input
                    type="text"
                    required
                    value={editSerialNumber}
                    onChange={(e) => setEditSerialNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Pricing & Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Selling Price (NPR) *</label>
                  <input
                    type="number"
                    required
                    value={editSellingPrice}
                    onChange={(e) => setEditSellingPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Discount (NPR)</label>
                  <input
                    type="number"
                    value={editDiscount}
                    onChange={(e) => setEditDiscount(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-emerald-400 block mb-1">Warranty ID</label>
                  <input
                    type="text"
                    value={editWarrantyId}
                    onChange={(e) => setEditWarrantyId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Source & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Payment Method</label>
                  <select
                    value={editPaymentMethod}
                    onChange={(e) => setEditPaymentMethod(e.target.value as PaymentMethod)}
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
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Order Source</label>
                  <select
                    value={editOrderSource}
                    onChange={(e) => setEditOrderSource(e.target.value as OrderSource)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                  >
                    <option value="Instagram">Instagram DM</option>
                    <option value="TikTok">TikTok Order</option>
                    <option value="Facebook">Facebook Messenger</option>
                    <option value="WhatsApp">WhatsApp Inquiry</option>
                    <option value="Walk-in">Walk-in Showroom</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-amber-500/50 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Alterations</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

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

      {/* VIEW A4 SALES ESTIMATE BILL MODAL */}
      {selectedSaleForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          {/* Outer Modal Container with A4 proportions */}
          <div className="bg-white text-zinc-900 rounded-none sm:rounded-2xl max-w-[210mm] w-full p-8 shadow-2xl space-y-6 relative print:p-0 my-8 border border-zinc-300 min-h-[280mm] flex flex-col justify-between overflow-hidden">
            
            {/* Background Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none opacity-10">
              <img
                src={kalpaLogo}
                alt=""
                className="w-[120mm] h-[120mm] max-w-[80%] rounded-full object-cover filter grayscale"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/kalpa_logo.jpg'; }}
              />
            </div>

            <div className="relative z-10">
              {/* Header Close & Admin Action Bar */}
              <div className="flex justify-between items-center print:hidden border-b border-zinc-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-500 font-bold">A4 Sales Estimate Bill Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEditSale(selectedSaleForInvoice)}
                    className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold flex items-center gap-1 cursor-pointer border border-zinc-300"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Alter Bill</span>
                  </button>
                  <button
                    onClick={() => setSelectedSaleForInvoice(null)}
                    className="text-zinc-500 hover:text-black text-xs font-bold px-2 py-1 cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>

              {/* Sales Estimate Bill Header */}
              <div className="border-b-2 border-amber-600 pb-4 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={kalpaLogo} alt="कल्प Logo" className="w-14 h-14 rounded-full border border-amber-600/40 object-cover" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/kalpa_logo.jpg'; }} />
                  <div>
                    <h1 className="font-serif text-2xl font-bold uppercase tracking-widest text-zinc-900">
                      कल्प • Kalpa Luxury Timepieces
                    </h1>
                  </div>
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
              <div className="grid grid-cols-2 gap-4 text-xs my-6">
                <div className="bg-zinc-50/90 backdrop-blur-xs p-4 rounded border border-zinc-200 space-y-1">
                  <span className="font-bold text-zinc-700 block uppercase mb-1">Billed To:</span>
                  <p className="font-bold text-sm text-zinc-900">{selectedSaleForInvoice.customerName}</p>
                  <p className="font-mono text-zinc-600">Mobile: {selectedSaleForInvoice.customerMobile}</p>
                  <p className="text-zinc-600">Address / Source: {selectedSaleForInvoice.orderSource}</p>
                </div>
                <div className="bg-zinc-50/90 backdrop-blur-xs p-4 rounded border border-zinc-200 space-y-1">
                  <span className="font-bold text-zinc-700 block uppercase mb-1">Warranty & Payment Details:</span>
                  <p className="font-bold font-mono text-amber-700">Warranty ID: {selectedSaleForInvoice.warrantyId}</p>
                  <p className="font-mono text-zinc-600">Serial No: {selectedSaleForInvoice.serialNumber}</p>
                  <p className="text-zinc-600">Payment Method: {selectedSaleForInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-zinc-300 my-4 bg-white/90 backdrop-blur-xs">
                <thead className="bg-zinc-900 text-amber-400 font-mono border-b border-zinc-300">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">Serial No</th>
                    <th className="p-3 text-right">Price (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-mono">
                  <tr>
                    <td className="p-3 text-zinc-500">1</td>
                    <td className="p-3 font-bold text-zinc-900 font-sans">{selectedSaleForInvoice.watchModel}</td>
                    <td className="p-3 text-amber-800">{selectedSaleForInvoice.serialNumber}</td>
                    <td className="p-3 text-right font-bold">NPR {selectedSaleForInvoice.sellingPrice.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              {/* Total calculation */}
              <div className="flex justify-end pt-2 text-xs font-mono">
                <div className="w-72 space-y-1.5 bg-zinc-50/90 backdrop-blur-xs p-4 rounded border border-zinc-200">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal:</span>
                    <span>NPR {selectedSaleForInvoice.sellingPrice.toLocaleString()}</span>
                  </div>
                  {selectedSaleForInvoice.discount > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>Discount:</span>
                      <span>- NPR {selectedSaleForInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-zinc-950 border-t border-zinc-300 pt-2">
                    <span>Total Amount:</span>
                    <span>NPR {selectedSaleForInvoice.finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Digital Warranty Notice */}
              <div className="bg-amber-50/90 backdrop-blur-xs border border-amber-200 p-3 rounded-lg text-xs my-4">
                <span className="font-bold text-amber-900 block">✓ Digital Warranty Certificate Included</span>
                <span className="text-amber-800 text-[11px]">
                  This bill serves as an official proof of purchase for 12 Months warranty service at Kalpa Luxury Timepieces.
                </span>
              </div>
            </div>

            {/* Bottom Footer: QR Code Only (Clickable) */}
            <div className="relative z-10 border-t border-zinc-200 pt-4 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left space-y-1 text-xs">
                  <p className="font-bold text-zinc-800 font-serif">कल्प • KALPA OFFICIAL DIGITAL GUARANTEE</p>
                  <p className="text-zinc-500 text-[11px] max-w-sm">
                    Scan or click the official QR code to verify authenticity and digital warranty status.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1 shrink-0">
                  <a
                    href="https://ais-pre-elkztr5oggtrem57ql7bfr-12678260771.asia-east1.run.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white border border-zinc-300 rounded-xl shadow-sm hover:border-amber-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center"
                    title="Click to open verified link"
                  >
                    <QRCodeSVG
                      value="https://ais-pre-elkztr5oggtrem57ql7bfr-12678260771.asia-east1.run.app/"
                      size={84}
                      level="H"
                      marginSize={1}
                    />
                  </a>
                </div>
              </div>

              {/* Action Buttons for Print & Download */}
              <div className="pt-2 flex justify-end gap-3 print:hidden border-t border-zinc-100">
                <button
                  onClick={() => exportSingleEstimateBillPDF(selectedSaleForInvoice)}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download A4 PDF Bill</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print A4 Bill</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

