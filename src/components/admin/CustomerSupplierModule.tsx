import React, { useState } from 'react';
import { Users, Truck, Plus, Search, Phone, Mail, DollarSign, Package, Eye, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Supplier, Purchase } from '../../types';

export const CustomerSupplierModule: React.FC = () => {
  const { customers, suppliers, purchases, addCustomer, addSupplier } = useApp();
  const [activeTab, setActiveTab] = useState<'customers' | 'suppliers'>('customers');
  const [selectedSupplierForDetails, setSelectedSupplierForDetails] = useState<Supplier | null>(null);
  
  // Add Modal state
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  // Supplier form fields
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supMobile, setSupMobile] = useState('');
  const [supAddress, setSupAddress] = useState('');

  // Customer form fields
  const [custName, setCustName] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custAddress, setCustAddress] = useState('Kathmandu, Nepal');
  const [custTikTok, setCustTikTok] = useState('');
  const [custIG, setCustIG] = useState('');
  const [custFB, setCustFB] = useState('');

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supMobile) return;

    addSupplier({
      name: supName,
      contactPerson: supContact || supName,
      email: supEmail || `${supName.toLowerCase().replace(/\s+/g, '')}@supplier.com`,
      mobile: supMobile,
      address: supAddress || 'Geneva, Switzerland'
    });

    setShowAddSupplierModal(false);
    setSupName('');
    setSupContact('');
    setSupEmail('');
    setSupMobile('');
    setSupAddress('');
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custMobile) return;

    addCustomer({
      name: custName,
      mobile: custMobile,
      address: custAddress,
      tikTokUsername: custTikTok,
      instagramId: custIG,
      facebookName: custFB
    });

    setShowAddCustomerModal(false);
    setCustName('');
    setCustMobile('');
    setCustAddress('Kathmandu, Nepal');
    setCustTikTok('');
    setCustIG('');
    setCustFB('');
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Customer CRM & Supplier Ledgers</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Track customer social handles (TikTok, Instagram, Facebook), purchasing history, and supplier balances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'suppliers' ? (
            <button
              onClick={() => setShowAddSupplierModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddCustomerModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          )}

          <div className="flex gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'customers' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Customers ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'suppliers' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Suppliers ({suppliers.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'customers' ? (
        <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Mobile Number</th>
                  <th className="p-3">Social Handles (TikTok / IG / FB)</th>
                  <th className="p-3">Address</th>
                  <th className="p-3 text-right">Lifetime Purchases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500 italic">
                      No customers registered yet. Click "Add Customer" to create one.
                    </td>
                  </tr>
                ) : (
                  customers.map(c => (
                    <tr key={c.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-sans font-bold text-zinc-100">{c.name}</td>
                      <td className="p-3 text-amber-300">{c.mobile}</td>
                      <td className="p-3 font-sans">
                        <div className="text-[11px] text-zinc-300 flex items-center gap-2">
                          {c.tikTokUsername && <span>🎵 {c.tikTokUsername}</span>}
                          {c.instagramId && <span>📸 {c.instagramId}</span>}
                          {c.facebookName && <span>💬 {c.facebookName}</span>}
                          {!c.tikTokUsername && !c.instagramId && !c.facebookName && <span className="text-zinc-600">-</span>}
                        </div>
                      </td>
                      <td className="p-3 font-sans text-zinc-400">{c.address}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        NPR {c.totalPurchases.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-3">Supplier Name</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">Location Address</th>
                  <th className="p-3 text-center">Procurements / POs</th>
                  <th className="p-3 text-right">PO Total Cost (NPR)</th>
                  <th className="p-3 text-right">Accounts Payable Due</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-zinc-500 italic">
                      No suppliers registered yet. Click "Add Supplier" to create one.
                    </td>
                  </tr>
                ) : (
                  suppliers.map(s => {
                    const supPOs = purchases.filter(
                      p => p.supplierId === s.id || p.supplierName.toLowerCase().trim() === s.name.toLowerCase().trim()
                    );
                    const poTotalCost = supPOs.reduce((sum, p) => sum + p.cost, 0);
                    // Accounts payable due pulled from PO total cost if present, or balanceDue
                    const apDue = poTotalCost > 0 ? poTotalCost : s.balanceDue;

                    return (
                      <tr key={s.id} className="hover:bg-zinc-800/40">
                        <td className="p-3 font-sans font-bold text-zinc-100">{s.name}</td>
                        <td className="p-3 font-sans text-zinc-300">{s.contactPerson}</td>
                        <td className="p-3">
                          <div>{s.email}</div>
                          <div className="text-amber-300">{s.mobile}</div>
                        </td>
                        <td className="p-3 font-sans text-zinc-400">{s.address}</td>
                        <td className="p-3 text-center font-bold text-amber-300">
                          {supPOs.length} Order(s)
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-400">
                          NPR {poTotalCost.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-bold text-rose-400">
                          NPR {apDue.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedSupplierForDetails(s)}
                            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 rounded-lg border border-amber-500/30 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 mx-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View POs</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD SUPPLIER MODAL */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span>Add New Watch Supplier</span>
              </h3>
              <button onClick={() => setShowAddSupplierModal(false)} className="text-zinc-400 hover:text-white text-xs">✕ Close</button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Supplier / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geneva Timepiece Trading SA"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Henri Laurent"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Mobile / Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +41 22 819 1000"
                  value={supMobile}
                  onChange={(e) => setSupMobile(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Email Address</label>
                <input
                  type="email"
                  placeholder="orders@genevawatches.ch"
                  value={supEmail}
                  onChange={(e) => setSupEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Address / Country</label>
                <input
                  type="text"
                  placeholder="e.g. Rue du Rhône 42, Geneva, Switzerland"
                  value={supAddress}
                  onChange={(e) => setSupAddress(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-4 py-2 bg-zinc-900 rounded-lg text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 font-bold text-zinc-950 rounded-lg uppercase cursor-pointer hover:bg-amber-400 transition-colors"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Add Customer Record</span>
              </h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-zinc-400 hover:text-white text-xs">✕ Close</button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Thapa"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Mobile Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9851098765"
                  value={custMobile}
                  onChange={(e) => setCustMobile(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Delivery Address</label>
                <input
                  type="text"
                  placeholder="Kathmandu, Nepal"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">TikTok</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={custTikTok}
                    onChange={(e) => setCustTikTok(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Instagram</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={custIG}
                    onChange={(e) => setCustIG(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Facebook</label>
                  <input
                    type="text"
                    placeholder="Profile Name"
                    value={custFB}
                    onChange={(e) => setCustFB(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 bg-zinc-900 rounded-lg text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 font-bold text-zinc-950 rounded-lg uppercase cursor-pointer hover:bg-amber-400 transition-colors"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPPLIER PURCHASE ORDERS BREAKDOWN MODAL */}
      {selectedSupplierForDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-2xl w-full text-white p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedSupplierForDetails(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>

            <div>
              <h3 className="font-serif text-xl font-bold text-amber-200 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <span>Stock Procurements & PO Ledger</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Supplier: <strong className="text-zinc-100">{selectedSupplierForDetails.name}</strong> ({selectedSupplierForDetails.mobile})
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {purchases.filter(
                p => p.supplierId === selectedSupplierForDetails.id || p.supplierName.toLowerCase().trim() === selectedSupplierForDetails.name.toLowerCase().trim()
              ).length === 0 ? (
                <div className="p-8 text-center text-zinc-500 italic bg-zinc-950 rounded-xl border border-zinc-800">
                  No stock procurement purchase orders recorded for this supplier yet.
                </div>
              ) : (
                purchases
                  .filter(p => p.supplierId === selectedSupplierForDetails.id || p.supplierName.toLowerCase().trim() === selectedSupplierForDetails.name.toLowerCase().trim())
                  .map(p => (
                    <div key={p.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-amber-300 border-b border-zinc-800 pb-2">
                        <span className="font-bold text-sm">Invoice #{p.invoiceNumber}</span>
                        <span className="text-zinc-400">Date: {p.purchaseDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-300">
                        <span>Items Purchased: <strong>{p.quantity} Watch(es)</strong></span>
                        <span>Total Cost: <strong className="text-emerald-400 text-sm">NPR {p.cost.toLocaleString()}</strong></span>
                      </div>
                      {p.items && p.items.length > 0 && (
                        <div className="pt-2 border-t border-zinc-800/80 space-y-1">
                          <span className="text-[10px] text-zinc-500 uppercase block font-bold">Line Items:</span>
                          {p.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-zinc-400 text-[11px]">
                              <span>• {it.productName} (Qty: {it.quantity})</span>
                              <span>NPR {(it.quantity * it.unitCost).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <span className="text-xs font-mono text-zinc-400">
                Total Accounts Payable Due: <strong className="text-rose-400 font-bold text-sm">NPR {(
                  purchases.filter(p => p.supplierId === selectedSupplierForDetails.id || p.supplierName.toLowerCase().trim() === selectedSupplierForDetails.name.toLowerCase().trim()).reduce((s, p) => s + p.cost, 0) || selectedSupplierForDetails.balanceDue
                ).toLocaleString()}</strong>
              </span>
              <button
                onClick={() => setSelectedSupplierForDetails(null)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
