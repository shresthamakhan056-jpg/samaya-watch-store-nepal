import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, AlertCircle, Calculator, FileText, ArrowRightLeft, CreditCard, DollarSign } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Account, VoucherType } from '../../../types';

interface UniversalVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: VoucherType;
  onVoucherPosted?: (entryNumber: string) => void;
}

interface VoucherLineForm {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  particulars: string;
}

export const UniversalVoucherModal: React.FC<UniversalVoucherModalProps> = ({
  isOpen,
  onClose,
  initialType = 'Journal Voucher',
  onVoucherPosted
}) => {
  const {
    accounts,
    customers,
    suppliers,
    costCenters,
    postVoucher,
    currentUser
  } = useApp();

  const [voucherType, setVoucherType] = useState<VoucherType>(initialType);
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [reference, setReference] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('Durbar Marg Flagship Showroom');
  const [partyType, setPartyType] = useState<'None' | 'Customer' | 'Supplier'>('None');
  const [partyName, setPartyName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Preset Helper
  const getInitialLinesForType = (type: VoucherType): VoucherLineForm[] => {
    const cashAcc = accounts.find(a => a.code === '1010') || accounts[0];
    const bankAcc = accounts.find(a => a.code === '1020') || accounts[0];
    const arAcc = accounts.find(a => a.code === '1100') || accounts[0];
    const apAcc = accounts.find(a => a.code === '2010') || accounts[0];
    const revAcc = accounts.find(a => a.code === '4010') || accounts[0];
    const expAcc = accounts.find(a => a.code === '5040') || accounts.find(a => a.category === 'Expenses') || accounts[0];

    if (type === 'Customer Receipt') {
      return [
        { accountId: bankAcc.id, accountCode: bankAcc.code, accountName: bankAcc.name, debit: 0, credit: 0, particulars: 'Receipt via Bank / Wallet' },
        { accountId: arAcc.id, accountCode: arAcc.code, accountName: arAcc.name, debit: 0, credit: 0, particulars: 'Settlement of Customer Account Receivable' }
      ];
    } else if (type === 'Supplier Payment') {
      return [
        { accountId: apAcc.id, accountCode: apAcc.code, accountName: apAcc.name, debit: 0, credit: 0, particulars: 'Discharge of Supplier Accounts Payable' },
        { accountId: bankAcc.id, accountCode: bankAcc.code, accountName: bankAcc.name, debit: 0, credit: 0, particulars: 'Bank / Cash Disbursement' }
      ];
    } else if (type === 'Expense Voucher') {
      return [
        { accountId: expAcc.id, accountCode: expAcc.code, accountName: expAcc.name, debit: 0, credit: 0, particulars: 'Expense Incurred' },
        { accountId: bankAcc.id, accountCode: bankAcc.code, accountName: bankAcc.name, debit: 0, credit: 0, particulars: 'Payment Source' }
      ];
    } else if (type === 'Contra / Transfer') {
      return [
        { accountId: bankAcc.id, accountCode: bankAcc.code, accountName: bankAcc.name, debit: 0, credit: 0, particulars: 'Deposit into Destination Account' },
        { accountId: cashAcc.id, accountCode: cashAcc.code, accountName: cashAcc.name, debit: 0, credit: 0, particulars: 'Withdrawal from Source Account' }
      ];
    } else if (type === 'Sales Return') {
      return [
        { accountId: revAcc.id, accountCode: revAcc.code, accountName: revAcc.name, debit: 0, credit: 0, particulars: 'Sales Return & Allowance' },
        { accountId: arAcc.id, accountCode: arAcc.code, accountName: arAcc.name, debit: 0, credit: 0, particulars: 'Credit to Customer Account' }
      ];
    } else if (type === 'Purchase Return') {
      const invAcc = accounts.find(a => a.code === '1200') || accounts[0];
      return [
        { accountId: apAcc.id, accountCode: apAcc.code, accountName: apAcc.name, debit: 0, credit: 0, particulars: 'Debit to Supplier Account' },
        { accountId: invAcc.id, accountCode: invAcc.code, accountName: invAcc.name, debit: 0, credit: 0, particulars: 'Inventory Stock Return' }
      ];
    }

    return [
      { accountId: cashAcc.id, accountCode: cashAcc.code, accountName: cashAcc.name, debit: 0, credit: 0, particulars: '' },
      { accountId: revAcc.id, accountCode: revAcc.code, accountName: revAcc.name, debit: 0, credit: 0, particulars: '' }
    ];
  };

  const [lines, setLines] = useState<VoucherLineForm[]>(() => getInitialLinesForType(initialType));

  if (!isOpen) return null;

  const handleTypeChange = (newType: VoucherType) => {
    setVoucherType(newType);
    setLines(getInitialLinesForType(newType));
    if (newType === 'Customer Receipt') setPartyType('Customer');
    else if (newType === 'Supplier Payment') setPartyType('Supplier');
  };

  const handleAccountChange = (index: number, accountId: string) => {
    const target = accounts.find(a => a.id === accountId);
    if (!target) return;
    setLines(prev => prev.map((l, i) => i === index ? {
      ...l,
      accountId: target.id,
      accountCode: target.code,
      accountName: target.name
    } : l));
  };

  const handleAmountChange = (index: number, field: 'debit' | 'credit', value: string) => {
    const num = Math.max(0, parseFloat(value) || 0);
    setLines(prev => prev.map((l, i) => {
      if (i !== index) return l;
      if (field === 'debit') {
        return { ...l, debit: num, credit: num > 0 ? 0 : l.credit };
      } else {
        return { ...l, credit: num, debit: num > 0 ? 0 : l.debit };
      }
    }));
  };

  const handleParticularsChange = (index: number, text: string) => {
    setLines(prev => prev.map((l, i) => i === index ? { ...l, particulars: text } : l));
  };

  const handleAddLine = () => {
    const defaultAcc = accounts[0];
    setLines(prev => [
      ...prev,
      {
        accountId: defaultAcc.id,
        accountCode: defaultAcc.code,
        accountName: defaultAcc.name,
        debit: 0,
        credit: 0,
        particulars: ''
      }
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) {
      setErrorMsg('A double-entry voucher must have at least 2 lines (Debit and Credit).');
      return;
    }
    setLines(prev => prev.filter((_, i) => i !== index));
  };

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const difference = Math.abs(Math.round((totalDebit - totalCredit) * 100) / 100);
  const isBalanced = totalDebit > 0 && difference < 0.05;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isBalanced) {
      setErrorMsg(`Unbalanced Entry: Total Debit (NPR ${totalDebit.toLocaleString()}) does not match Total Credit (NPR ${totalCredit.toLocaleString()}). Difference: NPR ${difference.toLocaleString()}`);
      return;
    }

    if (totalDebit <= 0) {
      setErrorMsg('Total voucher amount must be greater than NPR 0.');
      return;
    }

    const desc = description.trim() || `${voucherType}${partyName ? ` - ${partyName}` : ''}`;
    const ref = reference.trim() || `${voucherType.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const res = postVoucher({
      date,
      voucherType,
      sourceModule: 'Accounting',
      description: desc,
      reference: ref,
      costCenterName: selectedCostCenter,
      createdBy: currentUser.name,
      lines: lines.map(l => ({
        accountId: l.accountId,
        accountCode: l.accountCode,
        accountName: l.accountName,
        debit: l.debit,
        credit: l.credit,
        particulars: l.particulars
      }))
    });

    if (res.error) {
      setErrorMsg(res.error);
      return;
    }

    if (onVoucherPosted && res.entry) {
      onVoucherPosted(res.entry.entryNumber);
    }

    onClose();
  };

  return (
    <div id="universal-voucher-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Double-Entry Accounting Voucher</h2>
              <p className="text-xs text-slate-400">Record compliant General Ledger financial transactions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-3 text-rose-300 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Voucher Header Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
            {/* Voucher Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Voucher Type</label>
              <select
                value={voucherType}
                onChange={e => handleTypeChange(e.target.value as VoucherType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Customer Receipt">Customer Receipt (Payment Received)</option>
                <option value="Supplier Payment">Supplier Payment (Vendor Payout)</option>
                <option value="Expense Voucher">Expense Voucher (Operating Disbursement)</option>
                <option value="Journal Voucher">Journal Voucher (General / Adjustments)</option>
                <option value="Contra / Transfer">Contra / Transfer (Bank & Cash Transfer)</option>
                <option value="Sales Return">Sales Return / Credit Note</option>
                <option value="Purchase Return">Purchase Return / Debit Note</option>
                <option value="Fixed Asset Purchase">Fixed Asset Acquisition</option>
                <option value="Depreciation Entry">Depreciation Write-off</option>
                <option value="Year-End Adjustment">Year-End Adjustment / Accrual</option>
              </select>
            </div>

            {/* Voucher Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Posting Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Reference / Cheque #</label>
              <input
                type="text"
                placeholder="e.g. CHQ-9902 / INV-1002"
                value={reference}
                onChange={e => setReference(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Cost Center */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Cost Center / Branch</label>
              <select
                value={selectedCostCenter}
                onChange={e => setSelectedCostCenter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {costCenters.map(cc => (
                  <option key={cc.id} value={cc.name}>{cc.name} ({cc.code})</option>
                ))}
                {costCenters.length === 0 && (
                  <option value="Durbar Marg Flagship Showroom">Durbar Marg Flagship Showroom</option>
                )}
              </select>
            </div>
          </div>

          {/* Party Selection & Narration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Party / Payee / Customer Name</label>
              <div className="flex space-x-2">
                <select
                  value={partyType}
                  onChange={e => {
                    setPartyType(e.target.value as any);
                    setPartyName('');
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 w-32 focus:outline-none focus:border-amber-500"
                >
                  <option value="None">Direct / Other</option>
                  <option value="Customer">Customer</option>
                  <option value="Supplier">Supplier</option>
                </select>

                {partyType === 'Customer' ? (
                  <select
                    value={partyName}
                    onChange={e => setPartyName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Select Customer --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.mobile})</option>
                    ))}
                  </select>
                ) : partyType === 'Supplier' ? (
                  <select
                    value={partyName}
                    onChange={e => setPartyName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.contactPerson})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter party or payee name (optional)"
                    value={partyName}
                    onChange={e => setPartyName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">General Description / Narration</label>
              <input
                type="text"
                placeholder="Narration explaining business transaction context..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Double Entry Lines Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Journal Entry Lines (Double-Entry Debit & Credit)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddLine}
                className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line</span>
              </button>
            </div>

            <div className="border border-slate-700/80 rounded-xl overflow-hidden bg-slate-950/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800/70 border-b border-slate-700 text-slate-300">
                    <th className="py-3 px-4 w-60">Account Head</th>
                    <th className="py-3 px-3">Particulars / Line Memo</th>
                    <th className="py-3 px-3 w-36 text-right">Debit (NPR)</th>
                    <th className="py-3 px-3 w-36 text-right">Credit (NPR)</th>
                    <th className="py-3 px-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="p-3">
                        <select
                          value={line.accountId}
                          onChange={e => handleAccountChange(idx, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                              [{acc.code}] {acc.name} ({acc.category})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          placeholder="Line particulars..."
                          value={line.particulars}
                          onChange={e => handleParticularsChange(idx, e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={line.debit === 0 ? '' : line.debit}
                          onChange={e => handleAmountChange(idx, 'debit', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-right text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={line.credit === 0 ? '' : line.credit}
                          onChange={e => handleAmountChange(idx, 'credit', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-right text-rose-400 font-mono focus:outline-none focus:border-rose-500"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                          title="Remove line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900/90 font-bold border-t border-slate-700 text-slate-200">
                    <td colSpan={2} className="py-3 px-4 text-right uppercase tracking-wider text-xs">
                      Total Movement:
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400 text-sm">
                      NPR {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-rose-400 text-sm">
                      NPR {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Equilibrium Status Indicator Card */}
          <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            isBalanced
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center space-x-3">
              {isBalanced ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold text-sm">
                  {isBalanced
                    ? 'Strict Double-Entry Balance Satisfied (Debit = Credit)'
                    : 'Unbalanced Journal Voucher (Debit ≠ Credit)'}
                </p>
                <p className="text-xs opacity-80">
                  {isBalanced
                    ? `Ready to post directly into General Ledger and financial statements.`
                    : `Discrepancy of NPR ${difference.toLocaleString(undefined, { minimumFractionDigits: 2 })}. Adjust Debit or Credit lines to balance.`}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isBalanced ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                Diff: NPR {difference.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isBalanced}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition flex items-center space-x-2 shadow-lg ${
                isBalanced
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Post Double-Entry Voucher</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
