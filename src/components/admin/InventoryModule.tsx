import React, { useState } from 'react';
import { Plus, Search, AlertTriangle, Layers, Edit, Trash2, Watch, ArrowUpDown, ShieldCheck, Download, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, MovementType, Gender } from '../../types';
import { DeleteVerificationModal } from './DeleteVerificationModal';
import { exportInventoryReport, exportInventoryReportPDF } from '../../utils/reportExporter';

export const InventoryModule: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, adjustStock, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Adjustment state
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [adjustReason, setAdjustReason] = useState('Routine Stock Audit');

  // New product form
  const [brand, setBrand] = useState('Rolex');
  const [collection, setCollection] = useState('Datejust');
  const [model, setModel] = useState('Datejust 36mm Palm Motif');
  const [movement, setMovement] = useState<MovementType>('Automatic');
  const [dialColor, setDialColor] = useState('Olive Green');
  const [strap, setStrap] = useState('Jubilee Bracelet');
  const [caseMaterial, setCaseMaterial] = useState('Oystersteel');
  const [caseSize, setCaseSize] = useState('36mm');
  const [gender, setGender] = useState<Gender>('Unisex');
  const [stock, setStock] = useState<number>(5);
  const [purchasePrice, setPurchasePrice] = useState<number>(1100000);
  const [sellingPrice, setSellingPrice] = useState<number>(1350000);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(60);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop');

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sku = `${brand.substring(0, 3).toUpperCase()}-${model.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const barcode = `8719324${Math.floor(100 + Math.random() * 900)}`;

    addProduct({
      sku,
      barcode,
      brand,
      collection,
      model,
      movement,
      dialColor,
      strap,
      caseMaterial,
      caseSize,
      gender,
      stock,
      reorderLevel: 2,
      purchasePrice,
      sellingPrice,
      supplierId: 'sup-1',
      supplierName: 'Swiss Luxury Timepieces Ltd',
      warrantyMonths,
      status: stock > 2 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock',
      images: [imageUrl],
      description: `Luxury ${brand} ${model} timepiece.`
    });

    setShowAddModal(false);
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAdjustModal) return;
    const qtyChange = adjustType === 'add' ? Math.abs(adjustQty) : -Math.abs(adjustQty);
    adjustStock(showAdjustModal, qtyChange, adjustReason);
    setShowAdjustModal(null);
  };

  // Stock valuation summary
  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValuationCost = products.reduce((sum, p) => sum + (p.stock * p.purchasePrice), 0);

  return (
    <div className="space-y-6 text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Watch Inventory & Warehouse Stock</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time stock quantities, barcode tracking, and FIFO inventory valuation. Total Valuation: <strong className="text-amber-300 font-mono">NPR {totalValuationCost.toLocaleString()}</strong> ({totalStockCount} Units)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportInventoryReportPDF(products)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={() => exportInventoryReport(products)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Watch Model</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search SKU, Barcode, Brand, Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Brand Filter:</span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200"
          >
            <option value="All">All Brands</option>
            {Array.from(new Set(products.map(p => p.brand))).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">SKU & Barcode</th>
                <th className="p-3">Watch Specs</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Sold / Reserved</th>
                <th className="p-3">Cost Price</th>
                <th className="p-3">Selling Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Stock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-zinc-800/40">
                  <td className="p-3">
                    <div className="font-bold text-amber-200">{p.sku}</div>
                    <div className="text-[10px] text-zinc-500">BC: {p.barcode}</div>
                  </td>
                  <td className="p-3 font-sans">
                    <div className="font-bold text-zinc-100">{p.brand} {p.model}</div>
                    <div className="text-[11px] text-zinc-400">{p.dialColor} • {p.caseSize} • {p.movement}</div>
                  </td>
                  <td className="p-3">
                    <span className={`font-bold text-sm ${p.stock <= p.reorderLevel ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400">
                    Sold: {p.soldQuantity} | Res: {p.reservedStock}
                  </td>
                  <td className="p-3 text-zinc-300">
                    NPR {p.purchasePrice.toLocaleString()}
                  </td>
                  <td className="p-3 font-bold text-amber-300">
                    NPR {p.sellingPrice.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      p.status === 'Low Stock' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowAdjustModal(p.id)}
                        className="px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[11px] font-sans font-bold cursor-pointer"
                      >
                        Adjust Stock
                      </button>
                      {currentUser.role === 'Super Admin' && (
                        <button
                          onClick={() => setDeleteTarget({ id: p.id, name: `${p.brand} ${p.model} (${p.sku})` })}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="Delete Watch (Super Admin Only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STOCK ADJUSTMENT MODAL */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-sm w-full text-white p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-100">Manual Stock Adjustment</h3>
            <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Adjustment Direction:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 rounded font-bold ${adjustType === 'add' ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}
                  >
                    + Stock In (Add)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('subtract')}
                    className={`py-2 rounded font-bold ${adjustType === 'subtract' ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}
                  >
                    - Stock Out (Damage/Return)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Quantity Units:</label>
                <input
                  type="number"
                  min={1}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Adjustment Reason / Notes:</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Physical inventory count correction"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAdjustModal(null)} className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded bg-amber-500 text-zinc-950 font-bold uppercase">Confirm Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-xl w-full text-white p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-amber-100">Add New Timepiece to Inventory</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Brand Name *</label>
                  <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100" />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Collection *</label>
                  <input type="text" required value={collection} onChange={(e) => setCollection(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100" />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Watch Model Title *</label>
                <input type="text" required value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Movement</label>
                  <select value={movement} onChange={(e) => setMovement(e.target.value as MovementType)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100">
                    <option value="Automatic">Automatic</option>
                    <option value="Co-Axial Automatic">Co-Axial Automatic</option>
                    <option value="Quartz">Quartz</option>
                    <option value="Manual Wind">Manual Wind</option>
                    <option value="Smartwatch">Smartwatch</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Dial Color</label>
                  <input type="text" value={dialColor} onChange={(e) => setDialColor(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100" />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Case Size</label>
                  <input type="text" value={caseSize} onChange={(e) => setCaseSize(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Initial Stock *</label>
                  <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono" />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Cost Price (NPR)</label>
                  <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono" />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Selling Price (NPR)</label>
                  <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono" />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Image URL</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-amber-500 font-bold text-zinc-950 rounded uppercase">Save Watch Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2-STEP DELETE VERIFICATION MODAL (SUPER ADMIN ONLY) */}
      <DeleteVerificationModal
        isOpen={!!deleteTarget}
        title="Delete Watch Product"
        itemName={deleteTarget?.name || ''}
        detailsText="Deleting this watch will permanently remove it from catalog, inventory lists, and website showcase."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteProduct(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />

    </div>
  );
};
