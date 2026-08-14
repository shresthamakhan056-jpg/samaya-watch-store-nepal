import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Eye,
  Download,
  FileText,
  Clock,
  UserCheck,
  RotateCcw,
  Calendar,
  Sparkles,
  QrCode,
  Smartphone,
  Send,
  Sliders,
  Settings,
  Check,
  ShieldAlert,
  Award,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Warranty,
  WarrantyStatus,
  WarrantyClaim,
  ClaimStatus,
  WarrantyReplacement,
  WarrantyExtension
} from '../../types';
import { exportWarrantyReport, exportWarrantyReportPDF } from '../../utils/reportExporter';
import { formatWarrantyCertificateMessage, formatWarrantyClaimStatusMessage, openWhatsApp, OFFICIAL_BOUTIQUE_WHATSAPP } from '../../utils/whatsappService';

export const WarrantyModule: React.FC = () => {
  const {
    warranties,
    updateWarrantyStatus,
    activateWarranty,
    addServiceHistory,
    claims,
    submitClaim,
    updateClaimStatus,
    addInspection,
    approveClaim,
    updateRepair,
    passQualityCheck,
    collectClaim,
    replacements,
    createReplacement,
    extensions,
    extendWarranty,
    verificationLogs,
    notificationTemplates,
    updateNotificationTemplates,
    warrantySettings,
    updateWarrantySettings,
    products,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'warranties' | 'claims' | 'replacements' | 'logs' | 'settings'>('warranties');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals state
  const [showServiceModal, setShowServiceModal] = useState<string | null>(null);
  const [showClaimModal, setShowClaimModal] = useState<Warranty | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState<WarrantyClaim | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<WarrantyClaim | null>(null);
  const [showRepairModal, setShowRepairModal] = useState<WarrantyClaim | null>(null);
  const [showQCModal, setShowQCModal] = useState<WarrantyClaim | null>(null);
  const [showCollectionModal, setShowCollectionModal] = useState<WarrantyClaim | null>(null);
  const [showReplacementModal, setShowReplacementModal] = useState<Warranty | null>(null);
  const [showExtensionModal, setShowExtensionModal] = useState<Warranty | null>(null);

  // Forms
  const [serviceIssue, setServiceIssue] = useState('');
  const [serviceDetails, setServiceDetails] = useState('');
  const [serviceTech, setServiceTech] = useState('Master Horologist K.B. Gurung');

  // Claim Submit Form
  const [claimCategory, setClaimCategory] = useState('Movement Mechanism');
  const [claimProblem, setClaimProblem] = useState('');

  // Inspection Form
  const [inspectionCoverage, setInspectionCoverage] = useState<'Covered' | 'Partially Covered' | 'Not Covered'>('Covered');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [inspectionCost, setInspectionCost] = useState(0);

  // Approval Form
  const [approvalDecision, setApprovalDecision] = useState<'Approved' | 'Partially Approved' | 'Rejected'>('Approved');
  const [approvalNotes, setApprovalNotes] = useState('');

  // Repair Form
  const [repairDiagnosis, setRepairDiagnosis] = useState('');
  const [repairAction, setRepairAction] = useState('');
  const [repairParts, setRepairParts] = useState('');
  const [repairCost, setRepairCost] = useState(0);

  // QC Checklist
  const [qcTimekeeping, setQcTimekeeping] = useState(true);
  const [qcWater, setQcWater] = useState(true);
  const [qcCrown, setQcCrown] = useState(true);
  const [qcAesthetic, setQcAesthetic] = useState(true);

  // Collection
  const [collectionOtp, setCollectionOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  // Replacement Form
  const [replacementProductId, setReplacementProductId] = useState('');
  const [replacementSerial, setReplacementSerial] = useState('');
  const [replacementReason, setReplacementReason] = useState('');

  // Extension Form
  const [extensionMonths, setExtensionMonths] = useState(6);
  const [extensionReason, setExtensionReason] = useState('Loyalty Promotion Extension');

  // Filter Warranties
  const filteredWarranties = warranties.filter(w => {
    const matchesSearch =
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customerMobile.includes(searchTerm) ||
      w.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Active') return matchesSearch && w.status === 'Active';
    if (statusFilter === 'Pending') return matchesSearch && w.activationStatus === 'Pending';
    if (statusFilter === 'Expired') return matchesSearch && w.status === 'Expired';
    if (statusFilter === 'Void') return matchesSearch && w.status === 'Void';
    return matchesSearch;
  });

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showServiceModal || !serviceIssue || !serviceDetails) return;

    addServiceHistory(showServiceModal, {
      serviceDate: new Date().toISOString().substring(0, 10),
      issue: serviceIssue,
      repairDetails: serviceDetails,
      technician: serviceTech,
      remarks: 'Boutique Routine Inspection'
    });

    setShowServiceModal(null);
    setServiceIssue('');
    setServiceDetails('');
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showClaimModal || !claimProblem) return;

    submitClaim({
      warrantyId: showClaimModal.id,
      customerId: showClaimModal.customerId,
      customerName: showClaimModal.customerName,
      customerMobile: showClaimModal.customerMobile,
      productId: showClaimModal.productId,
      productBrand: showClaimModal.productBrand,
      productModel: showClaimModal.productModel,
      serialNumber: showClaimModal.serialNumber,
      invoiceNumber: showClaimModal.invoiceNumber,
      purchaseDate: showClaimModal.warrantyStart,
      category: claimCategory,
      problemDescription: claimProblem
    });

    setShowClaimModal(null);
    setClaimProblem('');
  };

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showInspectionModal) return;

    addInspection(showInspectionModal.id, {
      inspector: currentUser.name,
      inspectionDate: new Date().toISOString().substring(0, 10),
      coverage: inspectionCoverage,
      notes: inspectionNotes || 'Technical inspection performed.',
      payableAmount: inspectionCost
    });

    setShowInspectionModal(null);
    setInspectionNotes('');
  };

  const handleSaveApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showApprovalModal) return;

    approveClaim(showApprovalModal.id, {
      approvedBy: currentUser.name,
      approvalDate: new Date().toISOString().substring(0, 10),
      status: approvalDecision,
      notes: approvalNotes
    });

    setShowApprovalModal(null);
  };

  const handleSaveRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRepairModal) return;

    updateRepair(showRepairModal.id, {
      technician: currentUser.name,
      assignedAt: new Date().toISOString(),
      diagnosis: repairDiagnosis,
      actionTaken: repairAction,
      partsUsed: repairParts,
      cost: repairCost,
      completionDate: new Date().toISOString().substring(0, 10)
    });

    setShowRepairModal(null);
    setRepairDiagnosis('');
    setRepairAction('');
    setRepairParts('');
  };

  const handleSaveQC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showQCModal) return;

    const allPassed = qcTimekeeping && qcWater && qcCrown && qcAesthetic;

    passQualityCheck(showQCModal.id, {
      checkedBy: currentUser.name,
      checkDate: new Date().toISOString().substring(0, 10),
      timekeepingPassed: qcTimekeeping,
      waterResistancePassed: qcWater,
      crownDatePassed: qcCrown,
      aestheticPassed: qcAesthetic,
      passed: allPassed
    });

    setShowQCModal(null);
  };

  const handleConfirmCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCollectionModal) return;

    collectClaim(showCollectionModal.id, {
      collectedAt: new Date().toISOString(),
      staffName: currentUser.name,
      otpVerified: true,
      customerConfirmation: true
    });

    setShowCollectionModal(null);
    setOtpVerified(false);
    setCollectionOtp('');
  };

  const handleExecuteReplacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReplacementModal || !replacementProductId || !replacementSerial) return;

    const prod = products.find(p => p.id === replacementProductId);

    createReplacement({
      originalWarrantyId: showReplacementModal.id,
      originalProductId: showReplacementModal.productId,
      replacementProductId,
      replacementProductName: prod ? `${prod.brand} ${prod.model}` : 'Replacement Timepiece',
      replacementSerialNumber: replacementSerial,
      reason: replacementReason || 'Defective unit replaced under warranty policy.',
      approvedBy: currentUser.name
    });

    setShowReplacementModal(null);
    setReplacementProductId('');
    setReplacementSerial('');
    setReplacementReason('');
  };

  const handleExecuteExtension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showExtensionModal) return;

    const currentExpiry = new Date(showExtensionModal.extendedEnd || showExtensionModal.warrantyEnd);
    currentExpiry.setMonth(currentExpiry.getMonth() + extensionMonths);

    extendWarranty({
      warrantyId: showExtensionModal.id,
      originalExpiry: showExtensionModal.warrantyEnd,
      extensionMonths,
      newExpiry: currentExpiry.toISOString().substring(0, 10),
      reason: extensionReason,
      approvedBy: currentUser.name
    });

    setShowExtensionModal(null);
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/40 rounded-xl text-amber-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
                <span>कल्प Digital Warranty Management System</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">AUTOMATED V2</span>
              </h2>
              <p className="text-xs text-zinc-400">
                End-to-End Automated Lifecycle: Sale ➔ QR Generation ➔ Verification ➔ Service Claim ➔ Inspection ➔ Repair ➔ Collection
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportWarrantyReportPDF(warranties)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>PDF Ledger</span>
          </button>
          <button
            onClick={() => exportWarrantyReport(warranties)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>CSV Export</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('warranties')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'warranties'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Digital Warranties ({warranties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
            activeTab === 'claims'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Claims & Repairs ({claims.length})</span>
          {claims.filter(c => c.status === 'Submitted' || c.status === 'Under Inspection').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-1" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('replacements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'replacements'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replacements & Extensions</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Verification Logs ({verificationLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Templates & Rules</span>
        </button>
      </div>

      {/* TAB 1: MASTER WARRANTIES */}
      {activeTab === 'warranties' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono uppercase">Filter Status:</span>
              {['All', 'Active', 'Pending', 'Expired', 'Void'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Warranty ID, Mobile, Serial, Invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Warranty & QR</th>
                    <th className="p-3">Customer & Mobile</th>
                    <th className="p-3">Timepiece & Serial</th>
                    <th className="p-3">Validity & End Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Claims</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {filteredWarranties.map(w => (
                    <tr key={w.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-amber-200 flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-amber-400" />
                          <span>{w.id}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500">Invoice: {w.invoiceNumber}</div>
                      </td>
                      <td className="p-3 font-sans">
                        <div className="font-bold text-zinc-100">{w.customerName}</div>
                        <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-emerald-400" />
                          <span>{w.customerMobile}</span>
                        </div>
                      </td>
                      <td className="p-3 font-sans">
                        <div className="font-bold text-zinc-200">{w.productBrand} {w.productModel}</div>
                        <div className="text-[11px] text-amber-300 font-mono">SN: {w.serialNumber}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-zinc-400">Issued: {w.warrantyStart}</div>
                        <div className="text-amber-400 font-bold">Expires: {w.extendedEnd || w.warrantyEnd}</div>
                        {w.extendedEnd && (
                          <div className="text-[10px] text-emerald-400 font-mono">+ Extended</div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
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

                          {w.activationStatus === 'Pending' && (
                            <button
                              onClick={() => activateWarranty(w.id)}
                              className="px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 text-[10px] font-bold hover:bg-emerald-400 cursor-pointer"
                            >
                              Activate Now
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-sans">
                        <div className="text-xs font-bold text-zinc-200">{w.claimCount || 0} Claim(s)</div>
                        <div className="text-[10px] text-zinc-500">{w.serviceHistory?.length || 0} Service Log(s)</div>
                      </td>
                      <td className="p-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const msg = formatWarrantyCertificateMessage(w);
                              openWhatsApp(w.customerMobile, msg);
                            }}
                            title="Send Verified Guarantee to Customer WhatsApp"
                            className="px-2 py-1 rounded bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-400" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => setShowClaimModal(w)}
                            title="Register Warranty Service Claim"
                            className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Claim</span>
                          </button>
                          <button
                            onClick={() => setShowServiceModal(w.id)}
                            title="Log Service Record"
                            className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 text-xs font-bold cursor-pointer"
                          >
                            <Wrench className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setShowExtensionModal(w)}
                            title="Extend Warranty"
                            className="px-2 py-1 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold cursor-pointer"
                          >
                            <Clock className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setShowReplacementModal(w)}
                            title="Issue Watch Replacement"
                            className="px-2 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-bold cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLAIMS & REPAIRS PIPELINE */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">Submitted Claims</div>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
                {claims.filter(c => c.status === 'Submitted').length}
              </div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">Under Inspection</div>
              <div className="text-2xl font-bold text-sky-400 font-mono mt-1">
                {claims.filter(c => c.status === 'Under Inspection' || c.status === 'Approved').length}
              </div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">In Repair & QC</div>
              <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">
                {claims.filter(c => c.status === 'In Repair' || c.status === 'Quality Check').length}
              </div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">Ready for Collection</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                {claims.filter(c => c.status === 'Ready for Collection').length}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Claim ID</th>
                    <th className="p-3">Warranty & Customer</th>
                    <th className="p-3">Watch & Category</th>
                    <th className="p-3">Problem Description</th>
                    <th className="p-3">Pipeline Status</th>
                    <th className="p-3 text-right">Action Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {claims.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-500 font-sans">
                        No warranty claims registered yet. Claims can be submitted directly by customers via QR portal or created above.
                      </td>
                    </tr>
                  ) : (
                    claims.map(c => (
                      <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-amber-300">{c.id}</div>
                          <div className="text-[10px] text-zinc-500">{c.submittedAt.substring(0, 10)}</div>
                        </td>
                        <td className="p-3 font-sans">
                          <div className="font-bold text-zinc-100">{c.customerName}</div>
                          <div className="text-[11px] text-amber-400 font-mono">W: {c.warrantyId}</div>
                        </td>
                        <td className="p-3 font-sans">
                          <div className="font-bold text-zinc-200">{c.productBrand} {c.productModel}</div>
                          <div className="text-[10px] text-indigo-400 font-mono">{c.category}</div>
                        </td>
                        <td className="p-3 font-sans max-w-xs">
                          <p className="text-xs text-zinc-300 line-clamp-2">{c.problemDescription}</p>
                          {c.inspection && (
                            <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                              Inspector: {c.inspection.inspector} ({c.inspection.coverage})
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${
                            c.status === 'Submitted' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                            c.status === 'Under Inspection' ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' :
                            c.status === 'Approved' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' :
                            c.status === 'In Repair' ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' :
                            c.status === 'Quality Check' ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' :
                            c.status === 'Ready for Collection' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse' :
                            c.status === 'Collected / Closed' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                            'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-sans">
                          {c.status === 'Submitted' && (
                            <button
                              onClick={() => setShowInspectionModal(c)}
                              className="px-3 py-1 rounded bg-sky-500 text-zinc-950 font-bold text-xs hover:bg-sky-400 cursor-pointer"
                            >
                              Inspect
                            </button>
                          )}
                          {c.status === 'Under Inspection' && (
                            <button
                              onClick={() => setShowApprovalModal(c)}
                              className="px-3 py-1 rounded bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-400 cursor-pointer"
                            >
                              Approve / Decision
                            </button>
                          )}
                          {c.status === 'Approved' && (
                            <button
                              onClick={() => setShowRepairModal(c)}
                              className="px-3 py-1 rounded bg-purple-500 text-white font-bold text-xs hover:bg-purple-400 cursor-pointer"
                            >
                              Assign Repair
                            </button>
                          )}
                          {c.status === 'In Repair' && (
                            <button
                              onClick={() => setShowRepairModal(c)}
                              className="px-3 py-1 rounded bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
                            >
                              Update Repair Log
                            </button>
                          )}
                          {c.status === 'Quality Check' && (
                            <button
                              onClick={() => setShowQCModal(c)}
                              className="px-3 py-1 rounded bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 cursor-pointer"
                            >
                              Run QC Check
                            </button>
                          )}
                          {c.status === 'Ready for Collection' && (
                            <button
                              onClick={() => setShowCollectionModal(c)}
                              className="px-3 py-1 rounded bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
                            >
                              Deliver & Collect
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPLACEMENTS & EXTENSIONS */}
      {activeTab === 'replacements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>Watch Replacement Ledger ({replacements.length})</span>
            </h3>

            {replacements.length === 0 ? (
              <p className="text-xs text-zinc-500">No watch unit replacements issued yet.</p>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {replacements.map(r => (
                  <div key={r.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <div className="flex justify-between font-bold text-amber-300">
                      <span>Ref: {r.id}</span>
                      <span>{r.date}</span>
                    </div>
                    <div className="text-zinc-300 mt-1">Original Warranty: {r.originalWarrantyId}</div>
                    <div className="text-emerald-400 mt-0.5">New Timepiece: {r.replacementProductName} (SN: {r.replacementSerialNumber})</div>
                    <div className="text-zinc-500 text-[10px] mt-1">Reason: {r.reason} | Approved by: {r.approvedBy}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-indigo-200 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Warranty Extension Ledger ({extensions.length})</span>
            </h3>

            {extensions.length === 0 ? (
              <p className="text-xs text-zinc-500">No term extensions granted yet.</p>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {extensions.map(e => (
                  <div key={e.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <div className="flex justify-between font-bold text-indigo-300">
                      <span>Warranty: {e.warrantyId}</span>
                      <span>+{e.extensionMonths} Months</span>
                    </div>
                    <div className="text-zinc-300 mt-1">Original Expiry: {e.originalExpiry} ➔ Extended Expiry: <span className="text-amber-400">{e.newExpiry}</span></div>
                    <div className="text-zinc-500 text-[10px] mt-1">Reason: {e.reason} | Approved by: {e.approvedBy}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: VERIFICATION LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-amber-200 flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <span>Real-Time Customer Verification Log</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">Tracks all public QR scans and mobile verification queries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300 font-mono">
              <thead className="bg-zinc-950 text-amber-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Warranty ID</th>
                  <th className="p-3">Verification Method</th>
                  <th className="p-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {verificationLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-zinc-500 font-sans">
                      No customer verification queries logged yet. Verification attempts appear live here.
                    </td>
                  </tr>
                ) : (
                  verificationLogs.map(log => (
                    <tr key={log.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 text-zinc-400">{log.timestamp.replace('T', ' ').substring(0, 19)}</td>
                      <td className="p-3 text-amber-300 font-bold">{log.warrantyId}</td>
                      <td className="p-3">{log.method}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.result === 'Success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: TEMPLATES & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Warranty Engine Rules</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Default Warranty Duration (Months)</label>
                <input
                  type="number"
                  value={warrantySettings.defaultWarrantyMonths}
                  onChange={(e) => updateWarrantySettings({ defaultWarrantyMonths: parseInt(e.target.value) || 12 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Expiry Reminder Trigger (Days Before Expiry)</label>
                <input
                  type="number"
                  value={warrantySettings.expiryReminderDays}
                  onChange={(e) => updateWarrantySettings({ expiryReminderDays: parseInt(e.target.value) || 30 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Warranty ID Prefix</label>
                <input
                  type="text"
                  value={warrantySettings.warrantyPrefix}
                  onChange={(e) => updateWarrantySettings({ warrantyPrefix: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Claim ID Prefix</label>
                <input
                  type="text"
                  value={warrantySettings.claimPrefix}
                  onChange={(e) => updateWarrantySettings({ claimPrefix: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-200 flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" />
              <span>Automated Notification Templates</span>
            </h3>

            <div className="space-y-3 text-xs">
              {notificationTemplates.map(tmpl => (
                <div key={tmpl.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <div className="font-bold text-amber-300 font-mono">{tmpl.title}</div>
                  <p className="text-zinc-400 text-[11px]">{tmpl.body}</p>
                  <div className="text-[10px] text-zinc-500 font-mono">Channels: {tmpl.channels.join(', ')}</div>
                </div>
              ))}
            </div>

            {/* WhatsApp Business Live Gateway Status */}
            <div className="mt-4 p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-2 font-mono uppercase">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Official WhatsApp Business Gateway
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ONLINE & ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Official Boutique WhatsApp Number: <strong className="text-amber-300 font-mono">+{OFFICIAL_BOUTIQUE_WHATSAPP}</strong>
              </p>
              <div className="text-[10px] text-zinc-500">
                Supports instantaneous customer estimate bill dispatches, warranty QR certificates, and live verification queries.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: SERVICE HISTORY */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-amber-100">Log Boutique Horologist Service</h3>
              <button onClick={() => setShowServiceModal(null)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Service / Maintenance Subject *</label>
                <input
                  type="text"
                  required
                  value={serviceIssue}
                  onChange={(e) => setServiceIssue(e.target.value)}
                  placeholder="e.g. Movement Calibration & Gasket Replacement"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Detailed Technical Action *</label>
                <textarea
                  required
                  rows={3}
                  value={serviceDetails}
                  onChange={(e) => setServiceDetails(e.target.value)}
                  placeholder="e.g. Demagnetized balance wheel, pressure tested up to 10 ATM."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 resize-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Horologist / Technician</label>
                <input
                  type="text"
                  value={serviceTech}
                  onChange={(e) => setServiceTech(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowServiceModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded uppercase">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER CLAIM */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-amber-100">Register Warranty Service Claim</h3>
              <button onClick={() => setShowClaimModal(null)} className="text-zinc-400">✕</button>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1">
              <div className="font-bold text-amber-200">Warranty: {showClaimModal.id}</div>
              <div className="text-zinc-300">Customer: {showClaimModal.customerName} ({showClaimModal.customerMobile})</div>
              <div className="text-zinc-400">Watch: {showClaimModal.productBrand} {showClaimModal.productModel}</div>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Issue Category *</label>
                <select
                  value={claimCategory}
                  onChange={(e) => setClaimCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                >
                  <option value="Movement Mechanism">Movement / Automatic Mechanism Failure</option>
                  <option value="Time Accuracy">Inaccurate Timekeeping / Gaining or Losing Seconds</option>
                  <option value="Water Resistance">Moisture Fogging / Water Leakage</option>
                  <option value="Crown & Date">Crown Stuck / Date Wheel Jammed</option>
                  <option value="Other Defect">Other Manufacturing Defect</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Customer Problem Description *</label>
                <textarea
                  required
                  rows={3}
                  value={claimProblem}
                  onChange={(e) => setClaimProblem(e.target.value)}
                  placeholder="Describe the exact issue observed by customer..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowClaimModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded uppercase">Submit Claim to Pipeline</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INSPECTION */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-sky-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-sky-100">Horology Technical Inspection</h3>
              <button onClick={() => setShowInspectionModal(null)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleSaveInspection} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Warranty Coverage Determination *</label>
                <select
                  value={inspectionCoverage}
                  onChange={(e) => setInspectionCoverage(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-bold"
                >
                  <option value="Covered">Covered 100% Under Warranty</option>
                  <option value="Partially Covered">Partially Covered (Customer pays parts only)</option>
                  <option value="Not Covered">Not Covered (External impact or user tampering)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Inspector Technical Notes *</label>
                <textarea
                  required
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Findings upon disassembling case back and testing movement balance..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 resize-none"
                />
              </div>

              {inspectionCoverage !== 'Covered' && (
                <div>
                  <label className="text-zinc-400 block mb-1">Estimated Customer Payable Amount (NPR)</label>
                  <input
                    type="number"
                    value={inspectionCost}
                    onChange={(e) => setInspectionCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowInspectionModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-sky-500 text-zinc-950 font-bold rounded uppercase">Save Inspection Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: MANAGER APPROVAL */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-indigo-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-indigo-100">Manager Approval Gate</h3>
              <button onClick={() => setShowApprovalModal(null)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleSaveApproval} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Final Approval Decision *</label>
                <select
                  value={approvalDecision}
                  onChange={(e) => setApprovalDecision(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-bold"
                >
                  <option value="Approved">Approve for Technical Repair</option>
                  <option value="Partially Approved">Approve Partial Waiver</option>
                  <option value="Rejected">Reject Claim</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Approval Comments</label>
                <textarea
                  rows={2}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Manager notes..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowApprovalModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-500 text-white font-bold rounded uppercase">Submit Decision</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: REPAIR LOG */}
      {showRepairModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-purple-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-purple-100">Technician Repair Work Log</h3>
              <button onClick={() => setShowRepairModal(null)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleSaveRepair} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Diagnosis Findings *</label>
                <input
                  type="text"
                  required
                  value={repairDiagnosis}
                  onChange={(e) => setRepairDiagnosis(e.target.value)}
                  placeholder="e.g. Worn escapement jewel / loose hairspring"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Action Taken / Service Details *</label>
                <textarea
                  required
                  rows={3}
                  value={repairAction}
                  onChange={(e) => setRepairAction(e.target.value)}
                  placeholder="Replaced wheel, oiled pivot points with Moebius Swiss oil, calibrated beat rate..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 resize-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Swiss Genuine Parts Used</label>
                <input
                  type="text"
                  value={repairParts}
                  onChange={(e) => setRepairParts(e.target.value)}
                  placeholder="e.g. Escapement Wheel Ref #401"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowRepairModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-purple-500 text-white font-bold rounded uppercase">Complete Repair & Send to QC</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: QC CHECKLIST */}
      {showQCModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-400/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-amber-100">Quality Check Protocol Gate</h3>
              <button onClick={() => setShowQCModal(null)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleSaveQC} className="space-y-3 text-xs">
              <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qcTimekeeping}
                    onChange={(e) => setQcTimekeeping(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>1. Timekeeping & Amplitude Test Passed (+/- 2s/day)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qcWater}
                    onChange={(e) => setQcWater(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>2. Pressure Chamber Water Resistance Test Passed</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qcCrown}
                    onChange={(e) => setQcCrown(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>3. Crown Winding & Quickset Date Mechanism Smooth</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qcAesthetic}
                    onChange={(e) => setQcAesthetic(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>4. Case Cleanliness & Aesthetic Inspection Passed</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowQCModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-400 text-zinc-950 font-bold rounded uppercase">Finalize QC Gate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: COLLECTION */}
      {showCollectionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-emerald-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-emerald-100">Customer Delivery & Collection</h3>
              <button onClick={() => setShowCollectionModal(null)} className="text-zinc-400">✕</button>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1">
              <div>Customer: <strong className="text-zinc-100">{showCollectionModal.customerName}</strong></div>
              <div>Mobile: <strong className="text-emerald-400 font-mono">{showCollectionModal.customerMobile}</strong></div>
              <div>Simulated OTP Code: <span className="font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded text-amber-300">889210</span></div>
            </div>

            <form onSubmit={handleConfirmCollection} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Enter Customer OTP for Verification *</label>
                <input
                  type="text"
                  required
                  value={collectionOtp}
                  onChange={(e) => setCollectionOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono text-center text-sm tracking-widest"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCollectionModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-500 text-zinc-950 font-bold rounded uppercase">Verify OTP & Deliver Watch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: REPLACEMENT */}
      {showReplacementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-rose-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-rose-100">Issue Watch Replacement Unit</h3>
              <button onClick={() => setShowReplacementModal(null)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleExecuteReplacement} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Select Replacement Watch Product *</label>
                <select
                  required
                  value={replacementProductId}
                  onChange={(e) => setReplacementProductId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                >
                  <option value="">-- Choose Stock Watch --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.brand} {p.model} ({p.dialColor}) - Stock: {p.stock}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">New Serial Number *</label>
                <input
                  type="text"
                  required
                  value={replacementSerial}
                  onChange={(e) => setReplacementSerial(e.target.value)}
                  placeholder="e.g. SN-2026-NEW-99"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Replacement Reason</label>
                <textarea
                  rows={2}
                  value={replacementReason}
                  onChange={(e) => setReplacementReason(e.target.value)}
                  placeholder="Reason for full unit replacement..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowReplacementModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-rose-500 text-white font-bold rounded uppercase">Issue Unit Replacement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: EXTENSION */}
      {showExtensionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-indigo-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-indigo-100">Grant Extended Warranty Term</h3>
              <button onClick={() => setShowExtensionModal(null)} className="text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleExecuteExtension} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Extension Duration (Months) *</label>
                <select
                  value={extensionMonths}
                  onChange={(e) => setExtensionMonths(parseInt(e.target.value) || 6)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 font-bold font-mono"
                >
                  <option value={3}>+ 3 Months Extension</option>
                  <option value={6}>+ 6 Months Extension</option>
                  <option value={12}>+ 12 Months Extension (1 Year)</option>
                  <option value={24}>+ 24 Months Extension (2 Years)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Extension Justification / Campaign</label>
                <input
                  type="text"
                  value={extensionReason}
                  onChange={(e) => setExtensionReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowExtensionModal(null)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-500 text-white font-bold rounded uppercase">Grant Extension</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
