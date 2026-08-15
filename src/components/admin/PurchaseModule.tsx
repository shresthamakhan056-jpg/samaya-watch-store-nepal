import React, { useState } from 'react';
import {
  Plus,
  Package,
  Truck,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Edit3,
  CheckCircle2,
  Search,
  ArrowUpDown,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Purchase, Product } from '../../types';
import { DeleteVerificationModal } from './DeleteVerificationModal';
import { exportPurchaseReport, exportPurchaseReportPDF } from '../../utils/reportExporter';

export const PurchaseModule: React.FC = () => {
  const {
    suppliers,
    products,
    purchases,
    accounts,
    createPurchase,
    updatePurchase,
    deletePurchase,
    currentUser
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedPurId, setExpandedPurId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Purchase | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Form State
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().substring(0, 10));
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number>(50000);
  const [paymentAccountCode, setPaymentAccountCode] = useState<string>('1010');

  // Edit Form State
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [editSupplierId, setEditSupplierId] = useState('');
  const [editInvoiceNumber, setEditInvoiceNumber] = useState('');
  const [editPurchaseDate, setEditPurchaseDate] = useState('');
  const [editProductId, setEditProductId] = useState('');
  const [editQuantity, setEditQuantity] = useState<number>(1);
  const [editUnitCost, setEditUnitCost] = useState<number>(0);
  const [editPaymentAccountCode, setEditPaymentAccountCode] = useState<string>('1010');

  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber || !supplierId || !productId) return;

    const prod = products.find(p => p.id === productId);
    const totalCost = quantity * unitCost;

    const matchedAcc = accounts.find(a => a.code === paymentAccountCode);
    const payAccName = matchedAcc ? matchedAcc.name : (paymentAccountCode === '2010' ? 'On Credit (Accounts Payable)' : 'Payment Account');

    createPurchase({
      supplierId,
      invoiceNumber: invoiceNumber.trim(),
      purchaseDate,
      cost: totalCost,
      quantity,
      paymentMethod: payAccName,
      paymentAccountCode,
      items: [
        {
          productId,
          productName: prod ? `${prod.brand} ${prod.model}` : 'Watch',
          quantity,
          unitCost
        }
      ]
    });

    setShowModal(false);
    setInvoiceNumber('');
    setNotification(`✓ Stock Import #${invoiceNumber} recorded successfully. Added +${quantity} watch(es) to inventory stock.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenEdit = (pur: Purchase) => {
    setEditingPurchase(pur);
    setEditSupplierId(pur.supplierId);
    setEditInvoiceNumber(pur.invoiceNumber);
    setEditPurchaseDate(pur.purchaseDate);
    const firstItem = pur.items && pur.items.length > 0 ? pur.items[0] : null;
    setEditProductId(firstItem?.productId || products[0]?.id || '');
    setEditQuantity(pur.quantity || 1);
    setEditUnitCost(firstItem?.unitCost || Math.round(pur.cost / (pur.quantity || 1)));
    setEditPaymentAccountCode(pur.paymentAccountCode || '1010');
    setShowEditModal(true);
  };

  const handleUpdatePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPurchase || !editInvoiceNumber || !editSupplierId || !editProductId) return;

    const prod = products.find(p => p.id === editProductId);
    const sup = suppliers.find(s => s.id === editSupplierId);
    const totalCost = editQuantity * editUnitCost;

    const matchedAcc = accounts.find(a => a.code === editPaymentAccountCode);
    const payAccName = matchedAcc ? matchedAcc.name : (editPaymentAccountCode === '2010' ? 'On Credit (Accounts Payable)' : 'Payment Account');

    updatePurchase(editingPurchase.id, {
      supplierId: editSupplierId,
      supplierName: sup?.name || editingPurchase.supplierName,
      invoiceNumber: editInvoiceNumber.trim(),
      purchaseDate: editPurchaseDate,
      cost: totalCost,
      quantity: editQuantity,
      paymentMethod: payAccName,
      paymentAccountCode: editPaymentAccountCode,
      items: [
        {
          productId: editProductId,
          productName: prod ? `${prod.brand} ${prod.model}` : 'Watch',
          quantity: editQuantity,
          unitCost: editUnitCost
        }
      ]
    });

    setShowEditModal(false);
    setEditingPurchase(null);
    setNotification(`✓ Modified Stock Procurement #${editInvoiceNumber}. Watch inventory and ledger balances synchronized.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const invNo = deleteTarget.invoiceNumber;
    const qty = deleteTarget.quantity;

    deletePurchase(deleteTarget.id);
    setDeleteTarget(null);
    setNotification(`✓ Deleted Stock Procurement #${invNo}. Deducted -${qty} watch(es) from inventory stock and reversed financial postings.`);
    setTimeout(() => setNotification(null), 6000);
  };

  const filteredPurchases = purchases.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.invoiceNumber.toLowerCase().includes(q) ||
      p.supplierName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.items && p.items.some(it => it.productName.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-6 text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            <span>Stock Procurement & Purchase Orders</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time stock synchronization: Recording purchases increases inventory; modifying or deleting purchases automatically adjusts watch stock levels and ledger postings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportPurchaseReportPDF(purchases)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={() => exportPurchaseReport(purchases)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Stock Import Order</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by invoice number, supplier name, watch model, purchase ID..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-xs text-white placeholder-zinc-500 focus:outline-none w-full font-mono"
        />
      </div>

      {/* Purchases Table */}
      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-amber-400 font-bold">
            Purchase Orders History ({filteredPurchases.length})
          </span>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Auto Watch Inventory Sync Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">Purchase ID</th>
                <th className="p-3">Supplier Invoice #</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Date</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Total Cost (NPR)</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500 font-mono">
                    No supplier purchase orders found. Click "New Stock Import Order" above.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(pur => (
                  <React.Fragment key={pur.id}>
                    <tr className="hover:bg-zinc-800/40 transition">
                      <td className="p-3 font-bold text-amber-300">{pur.id}</td>
                      <td className="p-3 font-bold text-zinc-200">{pur.invoiceNumber}</td>
                      <td className="p-3 font-sans text-zinc-200">{pur.supplierName}</td>
                      <td className="p-3">{pur.purchaseDate}</td>
                      <td className="p-3 text-emerald-400 font-bold">+{pur.quantity} Units</td>
                      <td className="p-3 text-amber-300 font-bold">NPR {pur.cost.toLocaleString()}</td>
                      <td className="p-3 text-zinc-400">{pur.paymentMethod || 'Cash in Hand'}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {pur.items && pur.items.length > 0 && (
                            <button
                              onClick={() => setExpandedPurId(expandedPurId === pur.id ? null : pur.id)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                              title="Toggle Items Breakdown"
                            >
                              {expandedPurId === pur.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(pur)}
                            className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-zinc-950 transition-colors cursor-pointer"
                            title="Edit Stock Procurement Order"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {currentUser.role === 'Super Admin' && (
                            <button
                              onClick={() => setDeleteTarget(pur)}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                              title="Delete Stock Procurement Record (3-Step Security Verified)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedPurId === pur.id && pur.items && pur.items.length > 0 && (
                      <tr className="bg-zinc-950/80">
                        <td colSpan={8} className="p-4">
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2">
                            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                              Procurement Items Breakdown for #{pur.invoiceNumber}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {pur.items.map((item, idx) => (
                                <div key={idx} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 flex justify-between items-center text-xs">
                                  <div>
                                    <span className="font-bold text-zinc-200 block">{item.productName}</span>
                                    <span className="text-[10px] text-zinc-400">Unit Cost: NPR {item.unitCost.toLocaleString()}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-emerald-400 font-bold block">Qty: {item.quantity}</span>
                                    <span className="text-amber-300 font-bold text-[11px]">NPR {(item.quantity * item.unitCost).toLocaleString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PURCHASE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span>Import New Watch Stock</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white text-xs cursor-pointer">✕ Close</button>
            </div>

            <form onSubmit={handleCreatePurchase} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Select Supplier *</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 focus:outline-none"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Supplier Invoice # *</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="e.g. SWISS-GENEVA-9981"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Purchase Date *</label>
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Watch Model (Adds to Inventory) *</label>
                <select
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) setUnitCost(prod.purchasePrice);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.brand} {p.model} (Current Stock: {p.stock})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono font-bold">Payment Method / Account Paid From *</label>
                <select
                  value={paymentAccountCode}
                  onChange={(e) => setPaymentAccountCode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                >
                  {accounts.filter(a => a.type === 'Cash' || a.type === 'Bank' || a.code === '2010').map(a => (
                    <option key={a.id} value={a.code}>[{a.code}] {a.name}</option>
                  ))}
                  {!accounts.some(a => a.code === '2010') && (
                    <option value="2010">[2010] On Credit (Accounts Payable Due)</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Quantity (Units) *</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Unit Cost (NPR) *</label>
                  <input
                    type="number"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-amber-300 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] font-mono flex justify-between">
                <span className="text-zinc-400">Total Purchase Cost:</span>
                <span className="text-emerald-400 font-bold">NPR {(quantity * unitCost).toLocaleString()}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase cursor-pointer transition-colors"
                >
                  Submit Stock Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PURCHASE MODAL */}
      {showEditModal && editingPurchase && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Modify Procurement Record</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-zinc-400 hover:text-white text-xs cursor-pointer">✕ Close</button>
            </div>

            <form onSubmit={handleUpdatePurchaseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Select Supplier *</label>
                <select
                  value={editSupplierId}
                  onChange={(e) => setEditSupplierId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 focus:outline-none"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Supplier Invoice # *</label>
                  <input
                    type="text"
                    required
                    value={editInvoiceNumber}
                    onChange={(e) => setEditInvoiceNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Purchase Date *</label>
                  <input
                    type="date"
                    required
                    value={editPurchaseDate}
                    onChange={(e) => setEditPurchaseDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Watch Model *</label>
                <select
                  value={editProductId}
                  onChange={(e) => {
                    setEditProductId(e.target.value);
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) setEditUnitCost(prod.purchasePrice);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-amber-500 focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.brand} {p.model} (Current Stock: {p.stock})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono font-bold">Payment Method / Account Paid From *</label>
                <select
                  value={editPaymentAccountCode}
                  onChange={(e) => setEditPaymentAccountCode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                >
                  {accounts.filter(a => a.type === 'Cash' || a.type === 'Bank' || a.code === '2010').map(a => (
                    <option key={a.id} value={a.code}>[{a.code}] {a.name}</option>
                  ))}
                  {!accounts.some(a => a.code === '2010') && (
                    <option value="2010">[2010] On Credit (Accounts Payable Due)</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Quantity (Units) *</label>
                  <input
                    type="number"
                    min={1}
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Unit Cost (NPR) *</label>
                  <input
                    type="number"
                    value={editUnitCost}
                    onChange={(e) => setEditUnitCost(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-amber-300 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] font-mono flex justify-between">
                <span className="text-zinc-400">Recalculated Purchase Cost:</span>
                <span className="text-emerald-400 font-bold">NPR {(editQuantity * editUnitCost).toLocaleString()}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase cursor-pointer transition-colors"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-STEP SECURITY VERIFIED DELETE MODAL (WITH TIMED LOCK COUNTDOWN) */}
      {deleteTarget && (
        <DeleteVerificationModal
          isOpen={!!deleteTarget}
          title="Delete Stock Procurement Record"
          itemName={`Invoice #${deleteTarget.invoiceNumber} (${deleteTarget.id})`}
          itemType="Stock Procurement Transaction"
          detailsText={`Supplier: ${deleteTarget.supplierName} • Quantity: +${deleteTarget.quantity} Units • Total Cost: NPR ${deleteTarget.cost.toLocaleString()}. Deleting this purchase transaction will permanently deduct -${deleteTarget.quantity} unit(s) from the watch inventory stock and reverse the corresponding accounting asset entries.`}
          requiredTimes={3}
          lockDurationSeconds={3}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};
