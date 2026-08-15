import React, { useState } from 'react';
import {
  ListTree,
  Plus,
  Search,
  Download,
  Trash2,
  Lock,
  Unlock,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  DollarSign,
  Edit,
  SlidersHorizontal,
  X,
  ArrowRight,
  ShieldCheck,
  FileText,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Account, AccountCategory, AccountGroup } from '../../../types';
import { exportChartOfAccountsPDF, exportToCSV } from '../../../utils/reportExporter';
import { DeleteVerificationModal } from '../DeleteVerificationModal';

export const ChartOfAccountsView: React.FC = () => {
  const {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    journalEntries,
    resetAccountsToDefault
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  
  // Feedback toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State for Add / Edit
  const [formCode, setFormCode] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<AccountCategory>('Assets');
  const [formGroup, setFormGroup] = useState<AccountGroup>('Current Assets');
  const [formType, setFormType] = useState<string>('Bank');
  const [formOpeningBalance, setFormOpeningBalance] = useState<string>('0');
  const [formCurrentBalance, setFormCurrentBalance] = useState<string>('0');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formIsSystem, setFormIsSystem] = useState<boolean>(false);
  const [formErrorMessage, setFormErrorMessage] = useState<string>('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const filteredAccounts = accounts.filter(acc => {
    if (selectedCategory !== 'ALL' && acc.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      acc.code.toLowerCase().includes(q) ||
      acc.name.toLowerCase().includes(q) ||
      (acc.group && acc.group.toLowerCase().includes(q)) ||
      acc.type.toLowerCase().includes(q) ||
      (acc.description && acc.description.toLowerCase().includes(q))
    );
  });

  const categories: AccountCategory[] = ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'];

  const handleOpenAddModal = (cat?: AccountCategory) => {
    const targetCat = cat || 'Assets';
    setFormCategory(targetCat);
    if (targetCat === 'Assets') {
      setFormGroup('Current Assets');
      setFormType('Bank');
      setFormCode(String(1000 + Math.floor(Math.random() * 899)));
    } else if (targetCat === 'Liabilities') {
      setFormGroup('Current Liabilities');
      setFormType('A/P');
      setFormCode(String(2000 + Math.floor(Math.random() * 899)));
    } else if (targetCat === 'Equity') {
      setFormGroup('Capital & Equity');
      setFormType('Equity');
      setFormCode(String(3000 + Math.floor(Math.random() * 899)));
    } else if (targetCat === 'Revenue') {
      setFormGroup('Operating Revenue');
      setFormType('Sales');
      setFormCode(String(4000 + Math.floor(Math.random() * 899)));
    } else {
      setFormGroup('Administrative & General Expenses');
      setFormType('Expenses');
      setFormCode(String(5000 + Math.floor(Math.random() * 899)));
    }
    setFormName('');
    setFormOpeningBalance('0');
    setFormCurrentBalance('0');
    setFormDescription('');
    setFormIsSystem(false);
    setFormErrorMessage('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (acc: Account) => {
    setEditingAccount(acc);
    setFormCode(acc.code);
    setFormName(acc.name);
    setFormCategory(acc.category);
    setFormGroup((acc.group as AccountGroup) || (acc.category === 'Assets' ? 'Current Assets' : acc.category === 'Liabilities' ? 'Current Liabilities' : acc.category === 'Equity' ? 'Capital & Equity' : acc.category === 'Revenue' ? 'Operating Revenue' : 'Administrative & General Expenses'));
    setFormType(acc.type || 'Bank');
    setFormOpeningBalance(String(acc.openingBalance || 0));
    setFormCurrentBalance(String(acc.balance || 0));
    setFormDescription(acc.description || '');
    setFormIsSystem(!!acc.isSystem);
    setFormErrorMessage('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) {
      setFormErrorMessage('Account Code and Account Name are required.');
      return;
    }

    // Check code uniqueness
    if (accounts.some(a => a.code === formCode.trim())) {
      setFormErrorMessage(`Account code "${formCode.trim()}" is already assigned to another account head.`);
      return;
    }

    const opBal = parseFloat(formOpeningBalance) || 0;
    addAccount({
      code: formCode.trim(),
      name: formName.trim(),
      category: formCategory,
      group: formGroup,
      type: formType,
      initialBalance: opBal,
      description: formDescription.trim() || undefined
    });

    setShowAddModal(false);
    showToast(`Account head [${formCode.trim()}] "${formName.trim()}" created successfully.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    if (!formCode.trim() || !formName.trim()) {
      setFormErrorMessage('Account Code and Account Name are required.');
      return;
    }

    const opBal = parseFloat(formOpeningBalance) || 0;
    const curBal = parseFloat(formCurrentBalance) || 0;

    const result = updateAccount(editingAccount.id, {
      code: formCode.trim(),
      name: formName.trim(),
      category: formCategory,
      group: formGroup,
      type: formType,
      openingBalance: opBal,
      balance: curBal,
      description: formDescription.trim() || undefined,
      isSystem: formIsSystem
    });

    if ('error' in result) {
      setFormErrorMessage(result.error);
      return;
    }

    setEditingAccount(null);
    showToast(`Account head [${formCode.trim()}] "${formName.trim()}" updated successfully.`);
  };

  const handleDeleteConfirm = (force: boolean = false) => {
    if (!deletingAccount) return;

    const res = deleteAccount(deletingAccount.id, force);
    if (!res.success) {
      showToast(res.error || 'Failed to delete account.', 'error');
    } else {
      showToast(`Account head [${deletingAccount.code}] "${deletingAccount.name}" removed successfully.`);
      setDeletingAccount(null);
    }
  };

  const handleExportPDF = () => {
    exportChartOfAccountsPDF(accounts);
  };

  const handleExportCSV = () => {
    const rows = accounts.map(a => ({
      Code: a.code,
      Name: a.name,
      Category: a.category,
      Group: a.group || a.category,
      Type: a.type,
      Opening_Balance: a.openingBalance || 0,
      Current_Balance: a.balance || 0,
      Is_System: a.isSystem ? 'Yes' : 'No'
    }));
    exportToCSV(rows, `Chart_Of_Accounts_${new Date().toISOString().substring(0, 10)}`);
  };

  // Count journal entry references for the deleting account
  const referencingEntriesCount = deletingAccount
    ? journalEntries.filter(je => je.lines?.some(l => l.accountId === deletingAccount.id || l.accountCode === deletingAccount.code)).length
    : 0;

  return (
    <div id="chart-of-accounts-view" className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl border text-sm flex items-center justify-between shadow-xl animate-fadeIn ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center space-x-2.5">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ListTree className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                GENERAL LEDGER MASTER CONFIGURATION
              </span>
              <h2 className="text-lg font-bold text-white">
                Chart of Accounts Head Alteration & Management
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total {accounts.length} GL account heads. Alter, customize, edit codes/titles, or manage balances across all Swiss/Nepal accounting categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Account Head</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Categories ({accounts.length})
          </button>
          {categories.map(cat => {
            const count = accounts.filter(a => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Search code, account name, group, type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Accounts List Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold w-24">Code</th>
                <th className="py-3.5 px-3 font-semibold">Account Title / Heading</th>
                <th className="py-3.5 px-3 font-semibold w-28">Category</th>
                <th className="py-3.5 px-3 font-semibold w-48">Statement Group</th>
                <th className="py-3.5 px-3 font-semibold w-28">Type</th>
                <th className="py-3.5 px-3 font-semibold w-32 text-right">Opening (NPR)</th>
                <th className="py-3.5 px-3 font-semibold w-36 text-right">Current Balance</th>
                <th className="py-3.5 px-4 font-semibold w-24 text-center">Alter Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAccounts.map(acc => {
                return (
                  <tr key={acc.id} className="hover:bg-slate-800/40 transition group">
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      <div className="flex items-center space-x-1.5">
                        {acc.isSystem && (
                          <span title="Standard System Ledger Account">
                            <Lock className="w-3 h-3 text-amber-500/70" />
                          </span>
                        )}
                        <span>{acc.code}</span>
                      </div>
                    </td>

                    {/* Name & Description */}
                    <td className="py-3.5 px-3 font-medium text-white">
                      <div className="font-semibold text-slate-100 flex items-center space-x-1.5">
                        <span>{acc.name}</span>
                      </div>
                      {acc.description && (
                        <div className="text-[10px] text-slate-400 font-normal line-clamp-1">{acc.description}</div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        acc.category === 'Assets' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        acc.category === 'Liabilities' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        acc.category === 'Equity' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        acc.category === 'Revenue' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {acc.category}
                      </span>
                    </td>

                    {/* Statement Group */}
                    <td className="py-3.5 px-3 text-slate-300 font-medium">
                      {acc.group || acc.category}
                    </td>

                    {/* Account Type */}
                    <td className="py-3.5 px-3 text-slate-400">
                      {acc.type}
                    </td>

                    {/* Opening Balance */}
                    <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                      NPR {(acc.openingBalance || 0).toLocaleString()}
                    </td>

                    {/* Current Balance */}
                    <td className={`py-3.5 px-3 text-right font-mono font-bold ${
                      acc.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      NPR {acc.balance.toLocaleString()}
                    </td>

                    {/* Action Buttons: Alter / Edit & Delete */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(acc)}
                          className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 rounded-lg transition cursor-pointer border border-transparent hover:border-amber-500/40"
                          title="Alter / Modify Account Head"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => setDeletingAccount(acc)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition cursor-pointer border border-transparent hover:border-rose-500/40"
                          title="Delete / Remove Account Head"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <div>No account heads found matching your filter or search query.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ALTER / EDIT ACCOUNT HEAD */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Alter Account Head: [{editingAccount.code}] {editingAccount.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modify heading title, category, financial group, codes, or balances.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEditingAccount(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrorMessage && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Account Code <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    placeholder="e.g. 1010, 5010"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Account Category <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Assets">Assets (1000-1999)</option>
                    <option value="Liabilities">Liabilities (2000-2999)</option>
                    <option value="Equity">Equity (3000-3999)</option>
                    <option value="Revenue">Revenue (4000-4999)</option>
                    <option value="Expenses">Expenses (5000-5999)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Account Name / Heading Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Cash in Hand, Operating Bank Account"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Financial Statement Group</label>
                  <select
                    value={formGroup}
                    onChange={e => setFormGroup(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Current Assets">Current Assets</option>
                    <option value="Fixed Assets">Fixed Assets</option>
                    <option value="Current Liabilities">Current Liabilities</option>
                    <option value="Long-term Liabilities">Long-term Liabilities</option>
                    <option value="Capital & Equity">Capital & Equity</option>
                    <option value="Operating Revenue">Operating Revenue</option>
                    <option value="Direct Cost & COGS">Direct Cost & COGS</option>
                    <option value="Administrative & General Expenses">Administrative & General</option>
                    <option value="Selling & Distribution Expenses">Selling & Distribution</option>
                    <option value="Financial & Bank Charges">Financial & Bank</option>
                    <option value="Taxation">Taxation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Account Type</label>
                  <input
                    type="text"
                    value={formType}
                    onChange={e => setFormType(e.target.value)}
                    placeholder="e.g. Bank, Cash, Inventory, Expenses"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Opening Balance (NPR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formOpeningBalance}
                    onChange={e => setFormOpeningBalance(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Current Balance (NPR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formCurrentBalance}
                    onChange={e => setFormCurrentBalance(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description / Internal Notes</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Additional accounting notes, purpose or bank account number..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* System Lock Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  {formIsSystem ? (
                    <Lock className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">Standard System Head Protection</span>
                    <span className="text-[10px] text-slate-400">Lock to indicate default system head for automated vouchers</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formIsSystem}
                  onChange={e => setFormIsSystem(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded bg-slate-900 border-slate-700 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Alterations</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW ACCOUNT HEAD */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Create Chart of Accounts Heading
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add a new GL account to the double-entry general ledger hierarchy
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrorMessage && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Account Code <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    placeholder="e.g. 1050 / 5110"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Account Category <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Assets">Assets (1000-1999)</option>
                    <option value="Liabilities">Liabilities (2000-2999)</option>
                    <option value="Equity">Equity (3000-3999)</option>
                    <option value="Revenue">Revenue (4000-4999)</option>
                    <option value="Expenses">Expenses (5000-5999)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Account Name / Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Luxury Watch Servicing Tools"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Statement Group</label>
                  <select
                    value={formGroup}
                    onChange={e => setFormGroup(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Current Assets">Current Assets</option>
                    <option value="Fixed Assets">Fixed Assets</option>
                    <option value="Current Liabilities">Current Liabilities</option>
                    <option value="Long-term Liabilities">Long-term Liabilities</option>
                    <option value="Capital & Equity">Capital & Equity</option>
                    <option value="Operating Revenue">Operating Revenue</option>
                    <option value="Direct Cost & COGS">Direct Cost & COGS</option>
                    <option value="Administrative & General Expenses">Administrative & General</option>
                    <option value="Selling & Distribution Expenses">Selling & Distribution</option>
                    <option value="Financial & Bank Charges">Financial & Bank</option>
                    <option value="Taxation">Taxation</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Account Type</label>
                  <input
                    type="text"
                    value={formType}
                    onChange={e => setFormType(e.target.value)}
                    placeholder="e.g. Bank, Cash, Inventory, Expenses"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Opening Balance (NPR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formOpeningBalance}
                  onChange={e => setFormOpeningBalance(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Optional notes or context for this account head..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Create Account Head
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION (3-TIMES VERIFIED WITH TIMED LOCK) */}
      {deletingAccount && (
        <DeleteVerificationModal
          isOpen={!!deletingAccount}
          title="Delete Chart of Accounts Head"
          itemName={`[${deletingAccount.code}] ${deletingAccount.name}`}
          itemType="General Ledger Account Head"
          detailsText={`Category: ${deletingAccount.category} • Current Balance: NPR ${deletingAccount.balance.toLocaleString()} • Linked Journal Vouchers: ${referencingEntriesCount}. Deleting will remove this account code from the ledger tree.`}
          requiredTimes={3}
          lockDurationSeconds={3}
          onClose={() => setDeletingAccount(null)}
          onConfirm={() => handleDeleteConfirm(referencingEntriesCount > 0)}
        />
      )}

    </div>
  );
};
