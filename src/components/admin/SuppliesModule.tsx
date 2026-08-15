import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Truck,
  Trash2,
  Edit3,
  CheckCircle2,
  Box,
  Layers,
  ArrowUpDown,
  FileText,
  AlertTriangle,
  FolderPlus,
  ShoppingBag,
  Clock,
  DollarSign,
  Tag,
  ArrowRight,
  TrendingDown,
  Info,
  Check,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupplyItem, SupplyPurchase, SupplyCategory, SupplyPurchaseItem, SupplyUsageLog } from '../../types';
import { DeleteVerificationModal } from './DeleteVerificationModal';

const SUPPLY_CATEGORIES: SupplyCategory[] = [
  'Packaging Box',
  'Shopping & Gift Bag',
  'Cushion & Pillow Insert',
  'Cleaning & Polishing Cloth',
  'Warranty Card & Sleeve',
  'Strap & Tool Accessories',
  'Showroom & Display',
  'Security Hologram Seal',
  'Shipping & Courier Box',
  'Other Operational Supplies'
];

export const SuppliesModule: React.FC = () => {
  const {
    suppliers,
    supplyItems,
    createSupplyItem,
    updateSupplyItem,
    deleteSupplyItem,
    supplyPurchases,
    createSupplyPurchase,
    updateSupplyPurchase,
    deleteSupplyPurchase,
    supplyUsageLogs,
    logSupplyUsage,
    accounts,
    currentUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'purchases' | 'catalog' | 'usage'>('purchases');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Modals
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [showEditPurchaseModal, setShowEditPurchaseModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [expandedPurchaseId, setExpandedPurchaseId] = useState<string | null>(null);

  // Deletion modal targets
  const [deletePurchaseTarget, setDeletePurchaseTarget] = useState<SupplyPurchase | null>(null);
  const [deleteItemTarget, setDeleteItemTarget] = useState<SupplyItem | null>(null);

  // New Supply Item Form State
  const [itemSku, setItemSku] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<SupplyCategory>('Packaging Box');
  const [itemUnit, setItemUnit] = useState('pcs');
  const [itemStock, setItemStock] = useState<number>(50);
  const [itemReorder, setItemReorder] = useState<number>(15);
  const [itemCost, setItemCost] = useState<number>(500);
  const [itemSupplierName, setItemSupplierName] = useState(suppliers[0]?.name || 'Kathmandu Packaging');
  const [itemDescription, setItemDescription] = useState('');

  // Editing Supply Item State
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);

  // New Purchase Form State
  const [purType, setPurType] = useState<SupplyPurchase['purchaseType']>('Packaging & Boxes');
  const [purSupplierId, setPurSupplierId] = useState(suppliers[0]?.id || '');
  const [purInvoiceNumber, setPurInvoiceNumber] = useState('');
  const [purDate, setPurDate] = useState(new Date().toISOString().substring(0, 10));
  const [purPaymentAccountCode, setPurPaymentAccountCode] = useState('1010');
  const [purAccountType, setPurAccountType] = useState<'1210' | '5020'>('1210');
  const [purNotes, setPurNotes] = useState('');
  const [purLines, setPurLines] = useState<
    { supplyItemId: string; quantity: number; unitCost: number }[]
  >([
    {
      supplyItemId: supplyItems[0]?.id || '',
      quantity: 50,
      unitCost: supplyItems[0]?.estimatedUnitCost || 500
    }
  ]);

  // Edit Purchase Form State
  const [editingPurchase, setEditingPurchase] = useState<SupplyPurchase | null>(null);
  const [editPurSupplierId, setEditPurSupplierId] = useState('');
  const [editPurInvoiceNumber, setEditPurInvoiceNumber] = useState('');
  const [editPurDate, setEditPurDate] = useState('');
  const [editPurPaymentAccountCode, setEditPurPaymentAccountCode] = useState('1010');
  const [editPurAccountType, setEditPurAccountType] = useState<'1210' | '5020'>('1210');
  const [editPurNotes, setEditPurNotes] = useState('');
  const [editPurLines, setEditPurLines] = useState<
    { supplyItemId: string; quantity: number; unitCost: number }[]
  >([]);

  // Log Usage Form State
  const [usageItemId, setUsageItemId] = useState(supplyItems[0]?.id || '');
  const [usageQty, setUsageQty] = useState<number>(1);
  const [usageFor, setUsageFor] = useState<SupplyUsageLog['usedFor']>('Sales Packaging');
  const [usageInvoice, setUsageInvoice] = useState('');
  const [usageNotes, setUsageNotes] = useState('');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  // --- Handlers for Supply Items Catalog ---
  const handleOpenCreateItem = () => {
    setItemSku(`SUP-${Date.now().toString().slice(-6)}`);
    setItemName('');
    setItemCategory('Packaging Box');
    setItemUnit('pcs');
    setItemStock(50);
    setItemReorder(15);
    setItemCost(450);
    setItemSupplierName(suppliers[0]?.name || 'Kathmandu Packaging & Craft');
    setItemDescription('');
    setShowItemModal(true);
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemSku.trim()) return;

    createSupplyItem({
      sku: itemSku.trim().toUpperCase(),
      name: itemName.trim(),
      category: itemCategory,
      unit: itemUnit,
      currentStock: itemStock,
      reorderLevel: itemReorder,
      estimatedUnitCost: itemCost,
      supplierName: itemSupplierName.trim(),
      description: itemDescription.trim()
    });

    setShowItemModal(false);
    showToast(`✓ Added "${itemName}" to supplies & packaging inventory catalog.`);
  };

  const handleOpenEditItem = (item: SupplyItem) => {
    setEditingItem(item);
    setShowEditItemModal(true);
  };

  const handleUpdateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateSupplyItem(editingItem.id, {
      sku: editingItem.sku,
      name: editingItem.name,
      category: editingItem.category,
      unit: editingItem.unit,
      currentStock: editingItem.currentStock,
      reorderLevel: editingItem.reorderLevel,
      estimatedUnitCost: editingItem.estimatedUnitCost,
      supplierName: editingItem.supplierName,
      description: editingItem.description
    });

    setShowEditItemModal(false);
    showToast(`✓ Supply item "${editingItem.name}" updated successfully.`);
  };

  const handleDeleteItemVerified = () => {
    if (!deleteItemTarget) return;
    const res = deleteSupplyItem(deleteItemTarget.id);
    if (!res.success) {
      alert(res.error);
    } else {
      showToast(`✓ Deleted supply item "${deleteItemTarget.name}".`);
    }
    setDeleteItemTarget(null);
  };

  // --- Handlers for Supply Purchases ---
  const handleAddPurLine = () => {
    if (supplyItems.length === 0) return;
    setPurLines(prev => [
      ...prev,
      {
        supplyItemId: supplyItems[0]?.id || '',
        quantity: 20,
        unitCost: supplyItems[0]?.estimatedUnitCost || 200
      }
    ]);
  };

  const handleRemovePurLine = (index: number) => {
    if (purLines.length <= 1) return;
    setPurLines(prev => prev.filter((_, idx) => idx !== index));
  };

  const handlePurLineChange = (index: number, field: string, value: any) => {
    setPurLines(prev => {
      const next = [...prev];
      const target = { ...next[index], [field]: value };
      if (field === 'supplyItemId') {
        const item = supplyItems.find(i => i.id === value);
        if (item) {
          target.unitCost = item.estimatedUnitCost;
        }
      }
      next[index] = target;
      return next;
    });
  };

  const handleCreatePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purInvoiceNumber.trim() || !purSupplierId || purLines.length === 0) return;

    const purchaseItems: SupplyPurchaseItem[] = purLines.map(line => {
      const it = supplyItems.find(i => i.id === line.supplyItemId);
      return {
        supplyItemId: line.supplyItemId,
        supplyItemName: it?.name || 'Supply Item',
        category: it?.category || 'Other Operational Supplies',
        quantity: Number(line.quantity),
        unitCost: Number(line.unitCost),
        totalCost: Number(line.quantity) * Number(line.unitCost),
        unit: it?.unit || 'pcs'
      };
    });

    const totalCost = purchaseItems.reduce((acc, curr) => acc + curr.totalCost, 0);
    const totalQty = purchaseItems.reduce((acc, curr) => acc + curr.quantity, 0);

    const matchedAcc = accounts.find(a => a.code === purPaymentAccountCode);
    const payAccName = matchedAcc ? matchedAcc.name : (purPaymentAccountCode === '2010' ? 'On Credit (Accounts Payable)' : 'Payment Account');

    createSupplyPurchase({
      purchaseType: purType,
      supplierId: purSupplierId,
      invoiceNumber: purInvoiceNumber.trim(),
      purchaseDate: purDate,
      cost: totalCost,
      quantity: totalQty,
      paymentMethod: payAccName,
      paymentAccountCode: purPaymentAccountCode,
      accountType: purAccountType,
      notes: purNotes.trim(),
      items: purchaseItems
    });

    setShowNewPurchaseModal(false);
    setPurInvoiceNumber('');
    setPurNotes('');
    showToast(
      `✓ Supply Order #${purInvoiceNumber} recorded! Total: NPR ${totalCost.toLocaleString()} (${totalQty} units added to stock).`
    );
  };

  const handleOpenEditPurchase = (pur: SupplyPurchase) => {
    setEditingPurchase(pur);
    setEditPurSupplierId(pur.supplierId);
    setEditPurInvoiceNumber(pur.invoiceNumber);
    setEditPurDate(pur.purchaseDate);
    setEditPurPaymentAccountCode(pur.paymentAccountCode || '1010');
    setEditPurAccountType(pur.accountType || '1210');
    setEditPurNotes(pur.notes || '');
    setEditPurLines(
      pur.items.map(it => ({
        supplyItemId: it.supplyItemId,
        quantity: it.quantity,
        unitCost: it.unitCost
      }))
    );
    setShowEditPurchaseModal(true);
  };

  const handleEditPurLineChange = (index: number, field: string, value: any) => {
    setEditPurLines(prev => {
      const next = [...prev];
      const target = { ...next[index], [field]: value };
      if (field === 'supplyItemId') {
        const item = supplyItems.find(i => i.id === value);
        if (item) {
          target.unitCost = item.estimatedUnitCost;
        }
      }
      next[index] = target;
      return next;
    });
  };

  const handleAddEditPurLine = () => {
    if (supplyItems.length === 0) return;
    setEditPurLines(prev => [
      ...prev,
      {
        supplyItemId: supplyItems[0]?.id || '',
        quantity: 20,
        unitCost: supplyItems[0]?.estimatedUnitCost || 200
      }
    ]);
  };

  const handleRemoveEditPurLine = (index: number) => {
    if (editPurLines.length <= 1) return;
    setEditPurLines(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdatePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPurchase || !editPurInvoiceNumber.trim()) return;

    const sup = suppliers.find(s => s.id === editPurSupplierId);
    const purchaseItems: SupplyPurchaseItem[] = editPurLines.map(line => {
      const it = supplyItems.find(i => i.id === line.supplyItemId);
      return {
        supplyItemId: line.supplyItemId,
        supplyItemName: it?.name || 'Supply Item',
        category: it?.category || 'Other Operational Supplies',
        quantity: Number(line.quantity),
        unitCost: Number(line.unitCost),
        totalCost: Number(line.quantity) * Number(line.unitCost),
        unit: it?.unit || 'pcs'
      };
    });

    const totalCost = purchaseItems.reduce((acc, curr) => acc + curr.totalCost, 0);
    const totalQty = purchaseItems.reduce((acc, curr) => acc + curr.quantity, 0);

    const matchedAcc = accounts.find(a => a.code === editPurPaymentAccountCode);
    const payAccName = matchedAcc ? matchedAcc.name : (editPurPaymentAccountCode === '2010' ? 'On Credit (Accounts Payable)' : 'Payment Account');

    updateSupplyPurchase(editingPurchase.id, {
      supplierId: editPurSupplierId,
      supplierName: sup?.name || editingPurchase.supplierName,
      invoiceNumber: editPurInvoiceNumber.trim(),
      purchaseDate: editPurDate,
      cost: totalCost,
      quantity: totalQty,
      paymentMethod: payAccName,
      paymentAccountCode: editPurPaymentAccountCode,
      accountType: editPurAccountType,
      notes: editPurNotes.trim(),
      items: purchaseItems
    });

    setShowEditPurchaseModal(false);
    showToast(`✓ Updated Supply Purchase Order #${editPurInvoiceNumber}.`);
  };

  const handleDeletePurchaseVerified = () => {
    if (!deletePurchaseTarget) return;
    deleteSupplyPurchase(deletePurchaseTarget.id);
    showToast(
      `✓ Deleted supply order #${deletePurchaseTarget.invoiceNumber} and deducted items from stock.`
    );
    setDeletePurchaseTarget(null);
  };

  // --- Handlers for Usage Logs ---
  const handleOpenUsageModal = () => {
    setUsageItemId(supplyItems[0]?.id || '');
    setUsageQty(1);
    setUsageFor('Sales Packaging');
    setUsageInvoice('');
    setUsageNotes('');
    setShowUsageModal(true);
  };

  const handleLogUsageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = supplyItems.find(i => i.id === usageItemId);
    if (!item) return;

    if (usageQty > item.currentStock) {
      alert(`Warning: Only ${item.currentStock} ${item.unit} available in stock!`);
      return;
    }

    logSupplyUsage({
      supplyItemId: item.id,
      supplyItemName: item.name,
      quantityUsed: Number(usageQty),
      unit: item.unit,
      usedFor: usageFor,
      relatedInvoice: usageInvoice.trim() || undefined,
      notes: usageNotes.trim() || undefined
    });

    setShowUsageModal(false);
    showToast(`✓ Logged usage of ${usageQty} ${item.unit} (${item.name}). Stock deducted.`);
  };

  // Filtered supply items
  const filteredItems = useMemo(() => {
    return supplyItems.filter(item => {
      const matchCat =
        selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [supplyItems, selectedCategoryFilter, searchQuery]);

  // Filtered purchases
  const filteredPurchases = useMemo(() => {
    return supplyPurchases.filter(pur => {
      const matchSearch =
        searchQuery === '' ||
        pur.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pur.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pur.purchaseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pur.items.some(it => it.supplyItemName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [supplyPurchases, searchQuery]);

  // Total Summary Stats
  const totalSupplyPurchasesValue = useMemo(() => {
    return supplyPurchases.reduce((sum, p) => sum + (p.cost || 0), 0);
  }, [supplyPurchases]);

  const totalCatalogInventoryValue = useMemo(() => {
    return supplyItems.reduce(
      (sum, item) => sum + item.currentStock * (item.estimatedUnitCost || 0),
      0
    );
  }, [supplyItems]);

  const lowStockCount = useMemo(() => {
    return supplyItems.filter(i => i.currentStock <= i.reorderLevel).length;
  }, [supplyItems]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl flex items-center justify-between text-xs font-mono animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* HEADER & SUMMARY METRICS */}
      <div className="bg-[#0A0A0B] border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Box className="w-4 h-4" />
              <span>Operational Supplies & Packaging Procurement</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-amber-100">
              Packaging Boxes, Gift Bags & Operational Items
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Procure non-watch items (luxury wooden boxes, shopping bags, cushion inserts, polishing cloths, warranty card sleeves, tamper seals) with dedicated stock tracking and automatic double-entry journal vouchers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenUsageModal}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-amber-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              Log Item Usage
            </button>
            <button
              onClick={handleOpenCreateItem}
              className="bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
              + New Catalog Item
            </button>
            <button
              onClick={() => {
                setPurDate(new Date().toISOString().substring(0, 10));
                setPurInvoiceNumber(`SPO-2026-${Date.now().toString().slice(-4)}`);
                setPurLines([
                  {
                    supplyItemId: supplyItems[0]?.id || '',
                    quantity: 50,
                    unitCost: supplyItems[0]?.estimatedUnitCost || 450
                  }
                ]);
                setShowNewPurchaseModal(true);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Procure Supplies / Boxes
            </button>
          </div>
        </div>

        {/* STATS TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
          <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Total Supply Orders</div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">
              {supplyPurchases.length} Orders
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              Spent: NPR {totalSupplyPurchasesValue.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Supply Catalog Items</div>
            <div className="text-lg font-bold text-zinc-100 font-mono mt-0.5">
              {supplyItems.length} Unique SKUs
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">
              Valued at: NPR {totalCatalogInventoryValue.toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Stock Alert</div>
            <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">
              {lowStockCount} Low / Out
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Needs reordering</div>
          </div>

          <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Asset Ledger Account</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
              Acc #1210
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Packaging Inventory Asset</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#0A0A0B] p-2 rounded-2xl border border-amber-500/20">
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveSubTab('purchases')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'purchases'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Supply Purchase Orders ({supplyPurchases.length})
          </button>
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'catalog'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Items Catalog & Stock ({supplyItems.length})
          </button>
          <button
            onClick={() => setActiveSubTab('usage')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'usage'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Consumption / Usage Log ({supplyUsageLogs.length})
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search SKU, invoice, item..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          {activeSubTab === 'catalog' && (
            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Categories</option>
              {SUPPLY_CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 1: SUPPLY PURCHASE ORDERS LIST */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'purchases' && (
        <div className="bg-[#0A0A0B] border border-amber-500/20 rounded-2xl overflow-hidden">
          <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Supply Procurement Invoices & Orders ({filteredPurchases.length})
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              Auto-links to COA #1210 / #5020 & Journal Vouchers
            </div>
          </div>

          {filteredPurchases.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 space-y-3">
              <Box className="w-12 h-12 mx-auto text-zinc-700 stroke-1" />
              <p className="text-sm">No supply purchase orders recorded matching search criteria.</p>
              <button
                onClick={() => setShowNewPurchaseModal(true)}
                className="bg-zinc-900 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-xl text-xs hover:bg-zinc-800 cursor-pointer"
              >
                + Record First Supply Purchase
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {filteredPurchases.map(pur => {
                const isExpanded = expandedPurchaseId === pur.id;
                return (
                  <div key={pur.id} className="p-4 hover:bg-zinc-900/40 transition-all">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3">
                      {/* Left: Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            #{pur.invoiceNumber}
                          </span>
                          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                            {pur.purchaseType}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {pur.purchaseDate}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Supplier: {pur.supplierName}</span>
                        </div>
                        <div className="text-xs text-zinc-400 flex flex-wrap gap-2">
                          <span>
                            Items: {pur.items?.map(it => `${it.supplyItemName} (${it.quantity} ${it.unit})`).join(', ')}
                          </span>
                          <span>• Payment: <span className="text-emerald-400 font-mono">{pur.paymentMethod || 'Cash in Hand'}</span></span>
                        </div>
                      </div>

                      {/* Right: Cost & Actions */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-2 lg:pt-0 border-zinc-800">
                        <div className="text-right">
                          <div className="text-xs font-mono text-zinc-400">Total Purchase</div>
                          <div className="text-base font-bold font-mono text-amber-400">
                            NPR {pur.cost.toLocaleString()}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            {pur.quantity} units total
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setExpandedPurchaseId(isExpanded ? null : pur.id)}
                            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 transition-all cursor-pointer"
                            title="View order item breakdown"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleOpenEditPurchase(pur)}
                            className="p-2 rounded-lg bg-zinc-900 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 transition-all cursor-pointer"
                            title="Edit supply purchase order"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletePurchaseTarget(pur)}
                            className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-all cursor-pointer"
                            title="Delete supply order (Reverts stock & ledger)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED BREAKDOWN */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-zinc-800/80 bg-zinc-950/60 p-4 rounded-xl space-y-3">
                        <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                          <span>Purchased Items Breakdown</span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Recorded by: {pur.createdBy}
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-mono">
                            <thead>
                              <tr className="text-zinc-500 border-b border-zinc-800">
                                <th className="pb-2">Supply Item SKU / Name</th>
                                <th className="pb-2">Category</th>
                                <th className="pb-2 text-right">Quantity</th>
                                <th className="pb-2 text-right">Unit Rate (NPR)</th>
                                <th className="pb-2 text-right">Total (NPR)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                              {pur.items.map((it, idx) => (
                                <tr key={idx}>
                                  <td className="py-2 text-zinc-100 font-sans font-medium">
                                    {it.supplyItemName}
                                  </td>
                                  <td className="py-2 text-zinc-400">{it.category}</td>
                                  <td className="py-2 text-right text-amber-300 font-bold">
                                    {it.quantity} {it.unit}
                                  </td>
                                  <td className="py-2 text-right">
                                    {it.unitCost.toLocaleString()}
                                  </td>
                                  <td className="py-2 text-right text-emerald-400 font-bold">
                                    {it.totalCost.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {pur.notes && (
                          <div className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                            <span className="font-bold text-amber-400">Order Notes: </span>
                            {pur.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 2: SUPPLY CATALOG & INVENTORY STOCK */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'catalog' && (
        <div className="bg-[#0A0A0B] border border-amber-500/20 rounded-2xl overflow-hidden">
          <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Packaging & Operational Items Inventory Catalog ({filteredItems.length})
              </span>
            </div>
            <button
              onClick={handleOpenCreateItem}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Supply SKU
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-mono text-[11px]">
                  <th className="p-3.5">SKU & Item Details</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Primary Supplier</th>
                  <th className="p-3.5 text-right">Est. Unit Cost</th>
                  <th className="p-3.5 text-right">Stock Level</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {filteredItems.map(item => {
                  const isLow = item.currentStock <= item.reorderLevel;
                  const isOut = item.currentStock === 0;

                  return (
                    <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono text-[11px] text-amber-400 font-bold">
                          {item.sku}
                        </div>
                        <div className="font-semibold text-zinc-100 text-sm">{item.name}</div>
                        {item.description && (
                          <div className="text-[11px] text-zinc-500 max-w-md truncate">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-zinc-400">
                        <span className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-[10px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-zinc-300">{item.supplierName}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-zinc-200">
                        NPR {item.estimatedUnitCost.toLocaleString()} / {item.unit}
                      </td>
                      <td className="p-3.5 text-right font-mono">
                        <span className="text-base font-bold text-zinc-100">
                          {item.currentStock}
                        </span>{' '}
                        <span className="text-zinc-400 text-[10px]">{item.unit}</span>
                        <div className="text-[10px] text-zinc-500">
                          Reorder at: {item.reorderLevel}
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`text-[10px] font-mono px-2 py-1 rounded-full font-bold inline-flex items-center gap-1 ${
                            isOut
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : isLow
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditItem(item)}
                            className="p-1.5 bg-zinc-900 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 rounded-lg transition-all cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteItemTarget(item)}
                            className="p-1.5 bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 3: CONSUMPTION & USAGE LOGS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'usage' && (
        <div className="bg-[#0A0A0B] border border-amber-500/20 rounded-2xl overflow-hidden">
          <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Packaging Boxes & Supplies Consumption Records ({supplyUsageLogs.length})
              </span>
            </div>
            <button
              onClick={handleOpenUsageModal}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Consumption
            </button>
          </div>

          {supplyUsageLogs.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 space-y-3">
              <Box className="w-12 h-12 mx-auto text-zinc-700 stroke-1" />
              <p className="text-sm">No operational usage or box consumption logged yet.</p>
              <button
                onClick={handleOpenUsageModal}
                className="bg-zinc-900 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-xl text-xs hover:bg-zinc-800 cursor-pointer"
              >
                + Log First Box / Supply Usage
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 text-[11px]">
                    <th className="p-3.5">Date & Logger</th>
                    <th className="p-3.5">Supply Item Name</th>
                    <th className="p-3.5 text-right">Quantity Consumed</th>
                    <th className="p-3.5">Purpose / Used For</th>
                    <th className="p-3.5">Related Invoice</th>
                    <th className="p-3.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300 font-sans">
                  {supplyUsageLogs.map(log => (
                    <tr key={log.id} className="hover:bg-zinc-900/40">
                      <td className="p-3.5 font-mono text-zinc-400">
                        <div>{log.date}</div>
                        <div className="text-[10px] text-zinc-500">By: {log.loggedBy}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-zinc-100">{log.supplyItemName}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-rose-400">
                        -{log.quantityUsed} {log.unit}
                      </td>
                      <td className="p-3.5">
                        <span className="bg-zinc-900 border border-zinc-800 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded">
                          {log.usedFor}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-zinc-400">
                        {log.relatedInvoice ? `#${log.relatedInvoice}` : '—'}
                      </td>
                      <td className="p-3.5 text-zinc-400 text-xs">{log.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: RECORD NEW SUPPLY PROCUREMENT ORDER */}
      {/* ------------------------------------------------------------- */}
      {showNewPurchaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-200">
                  Procure Non-Watch Supplies & Packaging
                </h3>
                <p className="text-xs text-zinc-400">
                  Record purchase invoice for packaging boxes, gift bags, polishing cloths, etc.
                </p>
              </div>
              <button
                onClick={() => setShowNewPurchaseModal(false)}
                className="text-zinc-500 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePurchaseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Purchase Type
                  </label>
                  <select
                    value={purType}
                    onChange={e => setPurType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500"
                  >
                    <option value="Packaging & Boxes">Packaging & Boxes</option>
                    <option value="Showroom Supplies">Showroom Supplies</option>
                    <option value="Tools & Accessories">Tools & Accessories</option>
                    <option value="Shipping Materials">Shipping Materials</option>
                    <option value="Marketing & Gift Items">Marketing & Gift Items</option>
                    <option value="General Store Supplies">General Store Supplies</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Supplier
                  </label>
                  <select
                    value={purSupplierId}
                    onChange={e => setPurSupplierId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500"
                    required
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.address || 'Nepal'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Invoice # / Bill No.
                  </label>
                  <input
                    type="text"
                    value={purInvoiceNumber}
                    onChange={e => setPurInvoiceNumber(e.target.value)}
                    placeholder="e.g. KPC-2026-9901"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={purDate}
                    onChange={e => setPurDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Payment Source
                  </label>
                  <select
                    value={purPaymentAccountCode}
                    onChange={e => setPurPaymentAccountCode(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500"
                  >
                    {accounts.filter(a => a.type === 'Cash' || a.type === 'Bank' || a.code === '2010').map(a => (
                      <option key={a.id} value={a.code}>[{a.code}] {a.name}</option>
                    ))}
                    {!accounts.some(a => a.code === '2010') && (
                      <option value="2010">[2010] On Credit (Accounts Payable Due)</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Debit Ledger Target
                  </label>
                  <select
                    value={purAccountType}
                    onChange={e => setPurAccountType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500"
                  >
                    <option value="1210">Acc 1210 - Packaging Inventory Asset</option>
                    <option value="5020">Acc 5020 - Supplies & Operational Expense</option>
                  </select>
                </div>
              </div>

              {/* DYNAMIC ITEM ROWS */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-amber-300 font-bold uppercase">
                    Procured Items & Quantities
                  </span>
                  <button
                    type="button"
                    onClick={handleAddPurLine}
                    className="text-xs text-amber-400 hover:text-amber-300 font-mono cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Add Item Line
                  </button>
                </div>

                {purLines.map((line, idx) => {
                  const lineTotal = Number(line.quantity || 0) * Number(line.unitCost || 0);
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-5">
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Supply Item</label>
                        <select
                          value={line.supplyItemId}
                          onChange={e => handlePurLineChange(idx, 'supplyItemId', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200"
                          required
                        >
                          {supplyItems.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={e => handlePurLineChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200 font-mono"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Unit Rate (NPR)</label>
                        <input
                          type="number"
                          min="1"
                          value={line.unitCost}
                          onChange={e => handlePurLineChange(idx, 'unitCost', Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200 font-mono"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2 text-right">
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Subtotal</label>
                        <div className="text-xs font-mono font-bold text-emerald-400 pt-1">
                          NPR {lineTotal.toLocaleString()}
                        </div>
                      </div>

                      <div className="sm:col-span-1 text-right">
                        {purLines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePurLine(idx)}
                            className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                  Notes / Purchase Description
                </label>
                <input
                  type="text"
                  value={purNotes}
                  onChange={e => setPurNotes(e.target.value)}
                  placeholder="e.g. Bulk batch of 100 piano lacquer boxes & ribbon gift bags for Dashain / Tihar festival season"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500"
                />
              </div>

              {/* Total Calculation Display */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-300">Total Purchase Value:</span>
                <span className="text-base font-bold text-amber-300">
                  NPR{' '}
                  {purLines
                    .reduce((sum, l) => sum + Number(l.quantity || 0) * Number(l.unitCost || 0), 0)
                    .toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowNewPurchaseModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-xl text-xs hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Record Procurement Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: EDIT SUPPLY PURCHASE ORDER */}
      {/* ------------------------------------------------------------- */}
      {showEditPurchaseModal && editingPurchase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-200">
                  Edit Supply Purchase Order #{editingPurchase.invoiceNumber}
                </h3>
                <p className="text-xs text-zinc-400">
                  Updates stock counts and adjusts linked journal vouchers.
                </p>
              </div>
              <button
                onClick={() => setShowEditPurchaseModal(false)}
                className="text-zinc-500 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePurchaseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Supplier
                  </label>
                  <select
                    value={editPurSupplierId}
                    onChange={e => setEditPurSupplierId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500"
                    required
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Invoice #
                  </label>
                  <input
                    type="text"
                    value={editPurInvoiceNumber}
                    onChange={e => setEditPurInvoiceNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={editPurDate}
                    onChange={e => setEditPurDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* DYNAMIC ITEM ROWS */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-amber-300 font-bold uppercase">
                    Procured Items Breakdown
                  </span>
                  <button
                    type="button"
                    onClick={handleAddEditPurLine}
                    className="text-xs text-amber-400 hover:text-amber-300 font-mono cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Add Item Line
                  </button>
                </div>

                {editPurLines.map((line, idx) => {
                  const lineTotal = Number(line.quantity || 0) * Number(line.unitCost || 0);
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-5">
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Supply Item</label>
                        <select
                          value={line.supplyItemId}
                          onChange={e => handleEditPurLineChange(idx, 'supplyItemId', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200"
                          required
                        >
                          {supplyItems.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={e => handleEditPurLineChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200 font-mono"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Unit Rate</label>
                        <input
                          type="number"
                          min="1"
                          value={line.unitCost}
                          onChange={e => handleEditPurLineChange(idx, 'unitCost', Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs text-zinc-200 font-mono"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2 text-right">
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Subtotal</label>
                        <div className="text-xs font-mono font-bold text-emerald-400 pt-1">
                          NPR {lineTotal.toLocaleString()}
                        </div>
                      </div>

                      <div className="sm:col-span-1 text-right">
                        {editPurLines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEditPurLine(idx)}
                            className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase block mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={editPurNotes}
                  onChange={e => setEditPurNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-300">Updated Total:</span>
                <span className="text-base font-bold text-amber-300">
                  NPR{' '}
                  {editPurLines
                    .reduce((sum, l) => sum + Number(l.quantity || 0) * Number(l.unitCost || 0), 0)
                    .toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditPurchaseModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-xl text-xs hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: CREATE NEW SUPPLY ITEM */}
      {/* ------------------------------------------------------------- */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-amber-200">
                Add New Supply Catalog SKU
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-zinc-500 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={itemSku}
                    onChange={e => setItemSku(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                  >
                    {SUPPLY_CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                  Item Description / Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  placeholder="e.g. Velvet Watch Cushion Insert (Cream White)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Unit Type
                  </label>
                  <select
                    value={itemUnit}
                    onChange={e => setItemUnit(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                  >
                    <option value="pcs">pcs (Pieces)</option>
                    <option value="boxes">boxes</option>
                    <option value="sets">sets</option>
                    <option value="rolls">rolls</option>
                    <option value="packs">packs</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={itemStock}
                    onChange={e => setItemStock(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Reorder Alert Level
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={itemReorder}
                    onChange={e => setItemReorder(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Est. Unit Cost (NPR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={itemCost}
                    onChange={e => setItemCost(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Primary Supplier
                  </label>
                  <input
                    type="text"
                    value={itemSupplierName}
                    onChange={e => setItemSupplierName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                  Description / Specification
                </label>
                <textarea
                  value={itemDescription}
                  onChange={e => setItemDescription(e.target.value)}
                  rows={2}
                  placeholder="Material specs, dimensions, usage details..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-xl hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Save Item SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: EDIT SUPPLY ITEM */}
      {/* ------------------------------------------------------------- */}
      {showEditItemModal && editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-amber-200">
                Edit Supply SKU: {editingItem.sku}
              </h3>
              <button
                onClick={() => setShowEditItemModal(false)}
                className="text-zinc-500 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateItemSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={e =>
                      setEditingItem({ ...editingItem, category: e.target.value as any })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                  >
                    {SUPPLY_CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    value={editingItem.unit}
                    onChange={e => setEditingItem({ ...editingItem, unit: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.currentStock}
                    onChange={e =>
                      setEditingItem({ ...editingItem, currentStock: Number(e.target.value) })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Reorder Alert
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.reorderLevel}
                    onChange={e =>
                      setEditingItem({ ...editingItem, reorderLevel: Number(e.target.value) })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Unit Cost (NPR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.estimatedUnitCost}
                    onChange={e =>
                      setEditingItem({ ...editingItem, estimatedUnitCost: Number(e.target.value) })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                  Supplier Name
                </label>
                <input
                  type="text"
                  value={editingItem.supplierName}
                  onChange={e => setEditingItem({ ...editingItem, supplierName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditItemModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-xl hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 5: LOG SUPPLY / PACKAGING USAGE */}
      {/* ------------------------------------------------------------- */}
      {showUsageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-200">
                  Log Box & Supply Usage
                </h3>
                <p className="text-xs text-zinc-400">
                  Deducts packaging items from current stock for orders or showroom display.
                </p>
              </div>
              <button
                onClick={() => setShowUsageModal(false)}
                className="text-zinc-500 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogUsageSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                  Select Supply Item
                </label>
                <select
                  value={usageItemId}
                  onChange={e => setUsageItemId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                  required
                >
                  {supplyItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Stock: {item.currentStock} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Quantity Consumed
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageQty}
                    onChange={e => setUsageQty(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                    Used For
                  </label>
                  <select
                    value={usageFor}
                    onChange={e => setUsageFor(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                  >
                    <option value="Sales Packaging">Sales Packaging</option>
                    <option value="Showroom Display">Showroom Display</option>
                    <option value="Customer Gift">Customer Gift</option>
                    <option value="Damaged / Expired">Damaged / Expired</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                  Linked Sales Invoice # (Optional)
                </label>
                <input
                  type="text"
                  value={usageInvoice}
                  onChange={e => setUsageInvoice(e.target.value)}
                  placeholder="e.g. PWTN-2026-0089"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={usageNotes}
                  onChange={e => setUsageNotes(e.target.value)}
                  placeholder="e.g. Given with Rolex Daytona walk-in order"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowUsageModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-xl hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Log & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3-STEP SECURITY TIMED DELETION MODALS */}
      {/* ------------------------------------------------------------- */}
      {deletePurchaseTarget && (
        <DeleteVerificationModal
          isOpen={!!deletePurchaseTarget}
          onClose={() => setDeletePurchaseTarget(null)}
          onConfirm={handleDeletePurchaseVerified}
          title="Delete Supply Purchase Order"
          itemName={`Invoice #${deletePurchaseTarget.invoiceNumber} (NPR ${deletePurchaseTarget.cost.toLocaleString()})`}
          itemType="Purchase Order"
          detailsText={`Supplier: ${deletePurchaseTarget.supplierName} • Total Spend: NPR ${deletePurchaseTarget.cost.toLocaleString()}. Deleting will automatically adjust item stock levels and revert related ledger entries.`}
          requiredTimes={3}
          lockDurationSeconds={3}
        />
      )}

      {deleteItemTarget && (
        <DeleteVerificationModal
          isOpen={!!deleteItemTarget}
          onClose={() => setDeleteItemTarget(null)}
          onConfirm={handleDeleteItemVerified}
          title="Delete Supply Catalog Item"
          itemName={`${deleteItemTarget.name} (${deleteItemTarget.sku})`}
          itemType="Catalog Item"
          detailsText={`Category: ${deleteItemTarget.category} • Current Stock: ${deleteItemTarget.currentStock} ${deleteItemTarget.unit}. This action cannot be undone.`}
          requiredTimes={3}
          lockDurationSeconds={3}
        />
      )}
    </div>
  );
};
