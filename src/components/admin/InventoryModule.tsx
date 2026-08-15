import React, { useState } from 'react';
import { Plus, Search, AlertTriangle, Layers, Edit, Trash2, Watch, ArrowUpDown, ShieldCheck, Download, FileText, Upload, Sparkles, Copy, X, Check, BarChart2, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, MovementType, Gender, ProductStatus } from '../../types';
import { DeleteVerificationModal } from './DeleteVerificationModal';
import { exportInventoryReport, exportInventoryReportPDF } from '../../utils/reportExporter';
import { BrandStockVisualization } from './BrandStockVisualization';
import { compressImageFile } from '../../utils/imageCompressor';

export const InventoryModule: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, adjustStock, restoreAllStocksExcept, suppliers, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState<string | null>(null);
  const [showStockAnalytics, setShowStockAnalytics] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Adjustment state
  const [adjustQty, setAdjustQty] = useState<number>(1);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [adjustReason, setAdjustReason] = useState('Routine Stock Audit');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editBrand, setEditBrand] = useState('');
  const [editCollection, setEditCollection] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editBarcode, setEditBarcode] = useState('');
  const [editMovement, setEditMovement] = useState<MovementType>('Automatic');
  const [editDialColor, setEditDialColor] = useState('');
  const [editStrap, setEditStrap] = useState('');
  const [editCaseMaterial, setEditCaseMaterial] = useState('');
  const [editCaseSize, setEditCaseSize] = useState('');
  const [editGender, setEditGender] = useState<Gender>('Unisex');
  const [editStock, setEditStock] = useState<number>(0);
  const [editReorderLevel, setEditReorderLevel] = useState<number>(2);
  const [editPurchasePrice, setEditPurchasePrice] = useState<number>(0);
  const [editSellingPrice, setEditSellingPrice] = useState<number>(0);
  const [editWarrantyMonths, setEditWarrantyMonths] = useState<number>(60);
  const [editStatus, setEditStatus] = useState<ProductStatus>('In Stock');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState<boolean>(false);
  const [editIsLimitedEdition, setEditIsLimitedEdition] = useState<boolean>(false);
  const [editSupplierId, setEditSupplierId] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // New product form state
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
  const [description, setDescription] = useState('Luxury Swiss certified timepiece.');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLimitedEdition, setIsLimitedEdition] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  // Open Edit Modal with selected watch details
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditBrand(p.brand);
    setEditCollection(p.collection);
    setEditModel(p.model);
    setEditSku(p.sku);
    setEditBarcode(p.barcode);
    setEditMovement(p.movement);
    setEditDialColor(p.dialColor);
    setEditStrap(p.strap);
    setEditCaseMaterial(p.caseMaterial);
    setEditCaseSize(p.caseSize);
    setEditGender(p.gender);
    setEditStock(p.stock);
    setEditReorderLevel(p.reorderLevel || 2);
    setEditPurchasePrice(p.purchasePrice);
    setEditSellingPrice(p.sellingPrice);
    setEditWarrantyMonths(p.warrantyMonths);
    setEditStatus(p.status);
    setEditImageUrl(p.images && p.images.length > 0 ? p.images[0] : '');
    setEditDescription(p.description || `Luxury ${p.brand} ${p.model} timepiece.`);
    setEditIsFeatured(!!p.isFeatured);
    setEditIsLimitedEdition(!!p.isLimitedEdition);
    setEditSupplierId(p.supplierId || 'sup-1');
  };

  // High-Resolution Image File Upload Handler for Edit Modal
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      // Create crystal clear, high-resolution optimized data URL (1400x1400, 0.88 quality)
      const compressedDataUrl = await compressImageFile(file, 1400, 1400, 0.88);
      if (compressedDataUrl) {
        setEditImageUrl(compressedDataUrl);
      }

      // Try server upload as well
      fetch('/api/upload-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: compressedDataUrl,
          fileName: file.name,
          mimeType: file.type
        })
      }).then(res => res.json()).then(result => {
        if (result?.url) {
          // If server hosted successfully, keep the clean URL or the base64
          console.log('Image uploaded to server:', result.url);
        }
      }).catch(() => {});
    } catch (err) {
      console.error('Error uploading edit image:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // High-Resolution Image File Upload Handler for Add Modal
  const handleAddImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1400, 1400, 0.88);
      if (compressedDataUrl) {
        setImageUrl(compressedDataUrl);
      }

      fetch('/api/upload-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: compressedDataUrl,
          fileName: file.name,
          mimeType: file.type
        })
      }).then(res => res.json()).then(result => {
        if (result?.url) {
          console.log('Image uploaded to server:', result.url);
        }
      }).catch(() => {});
    } catch (err) {
      console.error('Error uploading new image:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save Edit Form
  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const selectedSup = suppliers.find(s => s.id === editSupplierId);

    // Calculate status automatically if stock changed
    let computedStatus = editStatus;
    if (editStatus !== 'Discontinued') {
      if (editStock === 0) computedStatus = 'Out of Stock';
      else if (editStock <= editReorderLevel) computedStatus = 'Low Stock';
      else computedStatus = 'In Stock';
    }

    const updatedProduct: Product = {
      ...editingProduct,
      brand: editBrand,
      collection: editCollection,
      model: editModel,
      sku: editSku,
      barcode: editBarcode,
      movement: editMovement,
      dialColor: editDialColor,
      strap: editStrap,
      caseMaterial: editCaseMaterial,
      caseSize: editCaseSize,
      gender: editGender,
      stock: editStock,
      reorderLevel: editReorderLevel,
      purchasePrice: editPurchasePrice,
      sellingPrice: editSellingPrice,
      warrantyMonths: editWarrantyMonths,
      status: computedStatus,
      images: [editImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'],
      description: editDescription,
      isFeatured: editIsFeatured,
      isLimitedEdition: editIsLimitedEdition,
      supplierId: editSupplierId,
      supplierName: selectedSup ? selectedSup.name : editingProduct.supplierName
    };

    updateProduct(updatedProduct);
    setEditingProduct(null);
    setSaveSuccessMsg(`Updated watch details for ${editBrand} ${editModel}!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Duplicate watch variant helper
  const handleDuplicateProduct = () => {
    if (!editingProduct) return;
    const newSku = `${editBrand.substring(0, 3).toUpperCase()}-${editModel.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newBarcode = `8719324${Math.floor(100 + Math.random() * 900)}`;

    const selectedSup = suppliers.find(s => s.id === editSupplierId);

    addProduct({
      sku: newSku,
      barcode: newBarcode,
      brand: editBrand,
      collection: editCollection,
      model: `${editModel} (Copy)`,
      movement: editMovement,
      dialColor: editDialColor,
      strap: editStrap,
      caseMaterial: editCaseMaterial,
      caseSize: editCaseSize,
      gender: editGender,
      stock: editStock,
      reorderLevel: editReorderLevel,
      purchasePrice: editPurchasePrice,
      sellingPrice: editSellingPrice,
      supplierId: editSupplierId || 'sup-1',
      supplierName: selectedSup ? selectedSup.name : 'Swiss Luxury Timepieces Ltd',
      warrantyMonths: editWarrantyMonths,
      status: editStock > 2 ? 'In Stock' : editStock > 0 ? 'Low Stock' : 'Out of Stock',
      images: [editImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'],
      description: editDescription,
      isFeatured: editIsFeatured,
      isLimitedEdition: editIsLimitedEdition
    });

    setEditingProduct(null);
    setSaveSuccessMsg(`Duplicated watch model "${editBrand} ${editModel}" as new variant SKU: ${newSku}!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Add Product Form Handler
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
      description: description || `Luxury ${brand} ${model} timepiece.`,
      isFeatured,
      isLimitedEdition
    });

    setShowAddModal(false);
    setSaveSuccessMsg(`Added new watch ${brand} ${model} to inventory!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
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
      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Watch Inventory & Warehouse Stock</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time stock quantities, specifications editing, barcode tracking, and FIFO inventory valuation. Total Valuation: <strong className="text-amber-300 font-mono">NPR {totalValuationCost.toLocaleString()}</strong> ({totalStockCount} Units)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowStockAnalytics(!showStockAnalytics)}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            title="Toggle Recharts Brand Stock & Replenishment Analytics"
          >
            <BarChart2 className="w-4 h-4 text-amber-400" />
            <span>{showStockAnalytics ? 'Hide Brand Analytics' : 'Show Brand Stock Analytics'}</span>
          </button>
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
            onClick={() => {
              restoreAllStocksExcept('SIK-SLV-01');
              setSaveSuccessMsg('Restored stock levels for all products except SIK-SLV-01 (Seiko Silver)!');
              setTimeout(() => setSaveSuccessMsg(''), 4000);
            }}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
            title="Restore stock quantities for all items while preserving SIK-SLV-01 sold state"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Restore Other Items Stock</span>
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

      {/* BRAND STOCK LEVELS & REPLENISHMENT VISUALIZATION */}
      {showStockAnalytics && (
        <BrandStockVisualization />
      )}

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
                <th className="p-3">Watch Photo & Title</th>
                <th className="p-3">SKU & Barcode</th>
                <th className="p-3">Specifications</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Cost Price</th>
                <th className="p-3">Selling Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
                        alt={p.model}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'; }}
                        className="w-12 h-12 rounded-lg object-cover border border-amber-500/30 bg-black shrink-0"
                      />
                      <div>
                        <div className="font-bold text-zinc-100 font-sans text-sm flex items-center gap-1.5">
                          <span>{p.brand} {p.model}</span>
                          {p.isFeatured && <span title="Featured on Homepage"><Sparkles className="w-3.5 h-3.5 text-amber-400 inline" /></span>}
                        </div>
                        <div className="text-[10px] text-amber-400/80 font-sans">{p.collection} • {p.gender}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-amber-200">{p.sku}</div>
                    <div className="text-[10px] text-zinc-500">BC: {p.barcode}</div>
                  </td>

                  <td className="p-3 font-sans">
                    <div className="text-zinc-200 font-semibold">{p.movement}</div>
                    <div className="text-[11px] text-zinc-400">{p.dialColor} • {p.caseSize} • {p.caseMaterial}</div>
                  </td>

                  <td className="p-3">
                    <span className={`font-bold text-sm ${p.stock <= p.reorderLevel ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {p.stock} Units
                    </span>
                    <div className="text-[10px] text-zinc-500">Sold: {p.soldQuantity}</div>
                  </td>

                  <td className="p-3 text-zinc-300">
                    NPR {p.purchasePrice.toLocaleString()}
                  </td>

                  <td className="p-3 font-bold text-amber-300">
                    NPR {p.sellingPrice.toLocaleString()}
                    <div className="text-[9px] text-emerald-400 font-normal">
                      Margin: {(((p.sellingPrice - p.purchasePrice) / (p.purchasePrice || 1)) * 100).toFixed(0)}%
                    </div>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      p.status === 'Low Stock' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      p.status === 'Out of Stock' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* EDIT WATCH BUTTON */}
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-[11px] font-sans font-bold cursor-pointer flex items-center gap-1 transition-all shadow-sm"
                        title="Edit Watch Details & Specifications"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit</span>
                      </button>

                      {/* ADJUST STOCK BUTTON */}
                      <button
                        onClick={() => setShowAdjustModal(p.id)}
                        className="px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-[11px] font-sans font-bold cursor-pointer"
                        title="Adjust Warehouse Stock Qty"
                      >
                        Adjust Stock
                      </button>

                      {/* DELETE BUTTON */}
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

      {/* EDIT WATCH DETAILS MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F0F12] border border-amber-500/50 rounded-2xl max-w-3xl w-full text-white p-6 space-y-5 my-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif text-xl font-bold text-amber-100">
                    Edit Watch Specifications & Inventory
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Editing: <span className="text-amber-300 font-bold">{editingProduct.brand} {editingProduct.model}</span> (SKU: {editingProduct.sku})
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Watch Form */}
            <form onSubmit={handleSaveEditedProduct} className="space-y-4 text-xs">
              
              {/* SECTION 1: WATCH IDENTIFICATION & SPECS */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-amber-400 text-sm border-b border-zinc-800/80 pb-2 flex items-center justify-between">
                  <span>1. Brand, Model & Specs</span>
                  <span className="text-[10px] font-mono font-normal text-zinc-500">Core Watch Identifiers</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={editBrand}
                      onChange={(e) => setEditBrand(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Collection / Series *</label>
                    <input
                      type="text"
                      required
                      value={editCollection}
                      onChange={(e) => setEditCollection(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Model Title *</label>
                    <input
                      type="text"
                      required
                      value={editModel}
                      onChange={(e) => setEditModel(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">SKU Code *</label>
                    <input
                      type="text"
                      required
                      value={editSku}
                      onChange={(e) => setEditSku(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-amber-200 font-mono focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Barcode Number *</label>
                    <input
                      type="text"
                      required
                      value={editBarcode}
                      onChange={(e) => setEditBarcode(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 font-mono focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Movement Type</label>
                    <select
                      value={editMovement}
                      onChange={(e) => setEditMovement(e.target.value as MovementType)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Co-Axial Automatic">Co-Axial Automatic</option>
                      <option value="Quartz">Quartz</option>
                      <option value="Manual Wind">Manual Wind</option>
                      <option value="Smartwatch">Smartwatch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Dial Color</label>
                    <input
                      type="text"
                      value={editDialColor}
                      onChange={(e) => setEditDialColor(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Case Material</label>
                    <input
                      type="text"
                      value={editCaseMaterial}
                      onChange={(e) => setEditCaseMaterial(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Case Size</label>
                    <input
                      type="text"
                      value={editCaseSize}
                      onChange={(e) => setEditCaseSize(e.target.value)}
                      placeholder="e.g. 40mm"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Strap / Bracelet</label>
                    <input
                      type="text"
                      value={editStrap}
                      onChange={(e) => setEditStrap(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: STOCK, PRICING & WARRANTY */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h4 className="font-serif font-bold text-amber-400 text-sm">
                    2. Inventory Stock, Pricing & Warranty
                  </h4>
                  {editSellingPrice > 0 && editPurchasePrice > 0 && (
                    <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Profit: NPR {(editSellingPrice - editPurchasePrice).toLocaleString()} ({(((editSellingPrice - editPurchasePrice) / editPurchasePrice) * 100).toFixed(1)}% margin)
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Cost Price (NPR) *</label>
                    <input
                      type="number"
                      required
                      value={editPurchasePrice}
                      onChange={(e) => setEditPurchasePrice(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Selling Price (NPR) *</label>
                    <input
                      type="number"
                      required
                      value={editSellingPrice}
                      onChange={(e) => setEditSellingPrice(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-amber-300 font-mono font-bold focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Stock Quantity *</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={editStock}
                      onChange={(e) => setEditStock(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Low Stock Threshold</label>
                    <input
                      type="number"
                      min={1}
                      value={editReorderLevel}
                      onChange={(e) => setEditReorderLevel(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Status Override</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ProductStatus)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="Discontinued">Discontinued</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Warranty Period (Months)</label>
                    <input
                      type="number"
                      value={editWarrantyMonths}
                      onChange={(e) => setEditWarrantyMonths(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono focus:border-amber-500/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-semibold">Target Audience</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value as Gender)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Supplier / Importer</label>
                  <select
                    value={editSupplierId}
                    onChange={(e) => setEditSupplierId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.contactPerson})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION 3: MEDIA, DESCRIPTION & BADGES */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-amber-400 text-sm border-b border-zinc-800/80 pb-2">
                  3. Watch Image, Badges & Description
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-zinc-400 block font-semibold">Image URL or Upload Photo</label>
                    <input
                      type="text"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono text-[11px] focus:border-amber-500/60 focus:outline-none"
                    />

                    <label className={`inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold rounded-lg transition-colors text-xs ${isUploadingImage ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:bg-amber-500/30'}`}>
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingImage}
                        onChange={handleEditImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-500 mb-1">Image Preview</span>
                    <img
                      src={editImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
                      alt="Watch Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-amber-500/30 bg-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Watch Overview & Description</label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-amber-500/60 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={editIsFeatured}
                      onChange={(e) => setEditIsFeatured(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span>Featured in Homepage Showcase</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={editIsLimitedEdition}
                      onChange={(e) => setEditIsLimitedEdition(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span>Limited Edition Badge</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleDuplicateProduct}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-500/50 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  title="Clone this watch into a new product entry (e.g. for color variants)"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate as New Variant</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 font-bold uppercase tracking-wider text-xs shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Watch Alterations</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MANUAL STOCK ADJUSTMENT MODAL */}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-zinc-400 block font-semibold text-xs">Image URL or Upload Watch Photo</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono text-[11px] focus:border-amber-500/60 focus:outline-none"
                  />

                  <label className={`inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold rounded-lg transition-colors text-xs ${isUploadingImage ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:bg-amber-500/30'}`}>
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isUploadingImage ? 'Uploading Image...' : 'Upload Watch Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImage}
                      onChange={handleAddImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-col items-center justify-center p-2 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <span className="text-[10px] text-zinc-500 mb-1">Image Preview</span>
                  <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
                    alt="Watch Preview"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'; }}
                    className="w-20 h-20 object-cover rounded-lg border border-amber-500/30 bg-black"
                  />
                </div>
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
