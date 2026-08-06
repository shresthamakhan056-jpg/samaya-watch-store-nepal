import React, { useState } from 'react';
import { ShieldCheck, Search, Wrench, CheckCircle, AlertTriangle, XCircle, Plus, Eye, Download, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Warranty, WarrantyStatus } from '../../types';
import { exportWarrantyReport, exportWarrantyReportPDF } from '../../utils/reportExporter';

export const WarrantyModule: React.FC = () => {
  const { warranties, updateWarrantyStatus, addServiceHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showServiceModal, setShowServiceModal] = useState<string | null>(null);

  // Service form
  const [issue, setIssue] = useState('');
  const [repairDetails, setRepairDetails] = useState('');
  const [technician, setTechnician] = useState('Master Horologist K.B. Gurung');
  const [remarks, setRemarks] = useState('');

  const filteredWarranties = warranties.filter(w =>
    w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.customerMobile.includes(searchTerm) ||
    w.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showServiceModal || !issue || !repairDetails) return;

    addServiceHistory(showServiceModal, {
      serviceDate: new Date().toISOString().substring(0, 10),
      issue,
      repairDetails,
      technician,
      remarks
    });

    setShowServiceModal(null);
    setIssue('');
    setRepairDetails('');
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Digital Warranty Master Records</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Automated QR warranties generated directly from Sales invoices. Manage status and record boutique service history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportWarrantyReportPDF(warranties)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={() => exportWarrantyReport(warranties)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search Warranty ID, Mobile, Serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">Warranty ID</th>
                <th className="p-3">Customer & Mobile</th>
                <th className="p-3">Watch & Serial No</th>
                <th className="p-3">Validity Period</th>
                <th className="p-3">Status</th>
                <th className="p-3">Service Logs</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredWarranties.map(w => (
                <tr key={w.id} className="hover:bg-zinc-800/40">
                  <td className="p-3 font-bold text-amber-200">{w.id}</td>
                  <td className="p-3 font-sans">
                    <div className="font-bold text-zinc-100">{w.customerName}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{w.customerMobile}</div>
                  </td>
                  <td className="p-3 font-sans">
                    <div className="font-bold text-zinc-200">{w.productBrand} {w.productModel}</div>
                    <div className="text-[11px] text-amber-300 font-mono">SN: {w.serialNumber}</div>
                  </td>
                  <td className="p-3">
                    <div>Start: {w.warrantyStart}</div>
                    <div className="text-amber-400 font-bold">End: {w.warrantyEnd}</div>
                  </td>
                  <td className="p-3">
                    <select
                      value={w.status}
                      onChange={(e) => updateWarrantyStatus(w.id, e.target.value as WarrantyStatus)}
                      className={`text-[10px] font-bold rounded px-2 py-1 bg-zinc-950 border ${
                        w.status === 'Active' ? 'text-emerald-400 border-emerald-500/50' :
                        w.status === 'Expired' ? 'text-amber-400 border-amber-500/50' :
                        'text-rose-400 border-rose-500/50'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Void">Void</option>
                    </select>
                  </td>
                  <td className="p-3 font-sans">
                    <span className="text-xs text-zinc-400">
                      {w.serviceHistory?.length || 0} Service Record(s)
                    </span>
                  </td>
                  <td className="p-3 text-right font-sans">
                    <button
                      onClick={() => setShowServiceModal(w.id)}
                      className="px-2.5 py-1.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Log Service</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SERVICE LOG MODAL */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-amber-100">Log Horology Service Record</h3>
              <button onClick={() => setShowServiceModal(null)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Issue / Inspection *</label>
                <input
                  type="text"
                  required
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="e.g. Routine Accuracy Calibration & Water Resistance Test"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Repair / Maintenance Action Details *</label>
                <textarea
                  required
                  rows={3}
                  value={repairDetails}
                  onChange={(e) => setRepairDetails(e.target.value)}
                  placeholder="e.g. Pressure tested up to 300m, demagnetized and calibrated to +0.8s/day."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 resize-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Technician / Horologist Name</label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowServiceModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded uppercase">Save Service Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
