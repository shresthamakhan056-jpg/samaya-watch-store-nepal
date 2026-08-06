import React, { useState } from 'react';
import { Plus, Package, Truck, Trash2, Eye, ChevronDown, ChevronUp, Download, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeleteVerificationModal } from './DeleteVerificationModal';
import { exportPurchaseReport, exportPurchaseReportPDF } from '../../utils/reportExporter';

export const PurchaseModule: React.FC = () => {
  const { suppliers, products, purchases, createPurchase, deletePurchase, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [expandedPurId, setExpandedPurId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().substring(0, 10));
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number>(50000);
  const [paymentAccountCode, setPaymentAccountCode] = useState<string>('1010');

  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber || !supplierId || !productId) return;

    const prod = products.find(p => p.id === productId);
    const totalCost = quantity * unitCost;

    const payAccName = paymentAccountCode === '1010' ? 'Cash in Hand' : paymentAccountCode === '1020' ? 'Nabil Bank Account' : paymentAccountCode === '1030' ? 'eSewa Merchant Wallet' : 'On Credit (Accounts Payable)';

    createPurchase({
      supplierId,
      invoiceNumber,
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
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            <span>Stock Procurement & Purchase Orders</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Recording supplier imports automatically increases inventory stock and posts inventory asset journal entries.
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

      {/* Purchases Table */}
      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-amber-400 font-bold">
            Purchase Orders History ({purchases.length})
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            Auto Stock Increase Active
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
                <th className="p-3">Warehouse</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500 font-mono">
                    No supplier purchase orders created yet. Click "New Stock Import Order" above.
                  </td>
                </tr>
              ) : (
                purchases.map(pur => (
                  <React.Fragment key={pur.id}>
                    <tr className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-amber-300">{pur.id}</td>
                      <td className="p-3 font-bold text-zinc-200">{pur.invoiceNumber}</td>
                      <td className="p-3 font-sans text-zinc-200">{pur.supplierName}</td>
                      <td className="p-3">{pur.purchaseDate}</td>
                      <td className="p-3 text-emerald-400 font-bold">+{pur.quantity} Units</td>
                      <td className="p-3 text-amber-300 font-bold">NPR {pur.cost.toLocaleString()}</td>
                      <td className="p-3 text-zinc-400">{pur.warehouse}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {pur.items && pur.items.length > 0 && (
                            <button
                              onClick={() => setExpandedPurId(expandedPurId === pur.id ? null : pur.id)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                              title="Toggle Items Detail"
                            >
                              {expandedPurId === pur.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          {currentUser.role === 'Super Admin' && (
                            <button
                              onClick={() => setDeleteTarget({ id: pur.id, name: `Invoice #${pur.invoiceNumber} (${pur.id})` })}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                              title="Delete Stock Procurement Record (Super Admin Only)"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-100">Import New Stock</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleCreatePurchase} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Select Supplier:</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Supplier Invoice # *</label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. SWISS-GENEVA-9981"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Watch Model *</label>
                <select
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) setUnitCost(prod.purchasePrice);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.brand} {p.model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-bold">Payment Method / Account Paid From *</label>
                <select
                  value={paymentAccountCode}
                  onChange={(e) => setPaymentAccountCode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                >
                  <option value="1010">[1010] Cash in Hand (Cash Purchase)</option>
                  <option value="1020">[1020] Nabil Bank Main Account (Bank Transfer)</option>
                  <option value="1030">[1030] eSewa Merchant Wallet (Wallet Transfer)</option>
                  <option value="2010">[2010] On Credit (Accounts Payable Due)</option>
                </select>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Nepal Accounting Standard (NAS): Cash purchases credit Cash/Bank (decreasing cash). Credit purchases credit Accounts Payable.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Quantity *</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Unit Cost (NPR) *</label>
                  <input
                    type="number"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-amber-500 text-zinc-950 font-bold uppercase"
                >
                  Submit Stock Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2-STEP DELETE VERIFICATION MODAL (SUPER ADMIN ONLY) */}
      <DeleteVerificationModal
        isOpen={!!deleteTarget}
        title="Delete Stock Procurement Record"
        itemName={deleteTarget?.name || ''}
        detailsText="Deleting this purchase order will permanently remove the record and adjust inventory and financial statements."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deletePurchase(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
};
