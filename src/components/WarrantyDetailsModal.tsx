import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, AlertCircle, CheckCircle, Phone, Search, MessageSquare, Wrench, Plus, Clock, ExternalLink } from 'lucide-react';
import { Warranty } from '../types';
import { DigitalWarrantyCard } from './DigitalWarrantyCard';
import { useApp } from '../context/AppContext';
import { formatWarrantyVerificationRequestMessage, openWhatsApp, OFFICIAL_STORE_WHATSAPP } from '../utils/whatsappService';

interface WarrantyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  warranties: Warranty[];
  errorMessage?: string | null;
  onOpenWarrantyPage?: () => void;
}

export const WarrantyDetailsModal: React.FC<WarrantyDetailsModalProps> = ({
  isOpen,
  onClose,
  query,
  warranties,
  errorMessage,
  onOpenWarrantyPage
}) => {
  const { submitClaim, claims } = useApp();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimCategory, setClaimCategory] = useState('Movement Mechanism');
  const [claimProblem, setClaimProblem] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState<string | null>(null);

  // Reset selectedIndex whenever warranties or modal opening changes
  React.useEffect(() => {
    setSelectedIndex(0);
    setShowClaimForm(false);
    setClaimSubmitted(null);
  }, [warranties, isOpen]);

  // Listen for Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentWarranty = warranties.length > 0 ? (warranties[selectedIndex] || warranties[0]) : null;
  const customerClaims = currentWarranty ? claims.filter(c => c.warrantyId === currentWarranty.id) : [];

  const handleWhatsAppVerify = () => {
    const msg = formatWarrantyVerificationRequestMessage(query || 'Warranty Search');
    openWhatsApp(OFFICIAL_STORE_WHATSAPP, msg);
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWarranty || !claimProblem.trim()) return;

    const result = submitClaim({
      warrantyId: currentWarranty.id,
      customerId: currentWarranty.customerId,
      customerName: currentWarranty.customerName,
      customerMobile: currentWarranty.customerMobile,
      productId: currentWarranty.productId,
      productBrand: currentWarranty.productBrand,
      productModel: currentWarranty.productModel,
      serialNumber: currentWarranty.serialNumber,
      invoiceNumber: currentWarranty.invoiceNumber,
      purchaseDate: currentWarranty.warrantyStart,
      category: claimCategory,
      problemDescription: claimProblem
    });

    if ('error' in result) {
      alert(result.error);
    } else {
      setClaimSubmitted(result.id);
      setShowClaimForm(false);
      setClaimProblem('');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl bg-[#0F0F12] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                <span>कल्प Digital Warranty Record</span>
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                Verified Query: <span className="text-amber-300 font-semibold">{query}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Error: Name search disallowed */}
          {errorMessage && (
            <div className="p-5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold font-mono text-sm text-rose-100">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Verification Policy Notice</span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-300">{errorMessage}</p>
            </div>
          )}

          {/* Not Found Screen */}
          {!errorMessage && warranties.length === 0 && (
            <div className="text-center py-10 px-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-rose-950/50 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="font-serif text-xl font-bold text-zinc-100">
                  No Active Warranty Certificate Found
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We could not find any active warranty record for <strong>"{query}"</strong>. 
                  Please confirm that you typed your registered 10-digit customer mobile number (e.g. 9823680863) or official Warranty Number (e.g. WRN-2026-0101).
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleWhatsAppVerify}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Request Verification via WhatsApp</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-mono font-bold uppercase transition cursor-pointer"
                >
                  Try Different Search
                </button>
              </div>
            </div>
          )}

          {/* If Multiple Warranties exist for this mobile number */}
          {warranties.length > 1 && (
            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-amber-500/30 space-y-2">
              <div className="text-xs font-mono text-amber-400 font-bold flex items-center justify-between">
                <span>Multiple Registered Timepieces ({warranties.length}):</span>
                <span className="text-[10px] text-zinc-400">Click to switch record</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {warranties.map((w, idx) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      selectedIndex === idx
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-900/30'
                        : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    {w.productBrand} {w.productModel} • <span className="font-bold">{w.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Success Claim Banner */}
          {claimSubmitted && (
            <div className="bg-emerald-950/90 border border-emerald-500/60 p-4 rounded-2xl flex items-center justify-between text-emerald-200 text-xs font-mono">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-emerald-100">Service Claim Successfully Registered!</div>
                  <div>Claim ID: <span className="font-bold text-amber-300">{claimSubmitted}</span>. Our master watchmaker has been assigned.</div>
                </div>
              </div>
              <button onClick={() => setClaimSubmitted(null)} className="text-emerald-400 hover:text-white text-base">✕</button>
            </div>
          )}

          {/* Render Digital Warranty Card */}
          {currentWarranty && (
            <div className="space-y-6">
              <DigitalWarrantyCard warranty={currentWarranty} />

              {/* Service Claim CTA */}
              <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>Need Maintenance or Warranty Service?</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Submit a certified service claim under Warranty #{currentWarranty.id}.
                  </p>
                </div>

                <button
                  onClick={() => setShowClaimForm(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Service Claim</span>
                </button>
              </div>

              {/* Active Service Claims Tracker */}
              {customerClaims.length > 0 && (
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                  <h5 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Active Claims for this Timepiece ({customerClaims.length})</span>
                  </h5>
                  <div className="space-y-2">
                    {customerClaims.map(c => (
                      <div key={c.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-zinc-200">{c.category} • Claim #{c.id}</div>
                          <div className="text-zinc-400 text-[11px]">{c.problemDescription}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          c.status === 'Collected / Closed' || c.status === 'Ready for Collection' ? 'bg-emerald-500/20 text-emerald-300' :
                          c.status === 'In Repair' || c.status === 'Approved' ? 'bg-blue-500/20 text-blue-300' :
                          c.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Claim Form Popup */}
          {showClaimForm && currentWarranty && (
            <div className="p-6 bg-zinc-950 border border-amber-500/40 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h4 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>New Service Claim for {currentWarranty.productBrand} {currentWarranty.productModel}</span>
                </h4>
                <button
                  onClick={() => setShowClaimForm(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitClaim} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Issue Category:</label>
                  <select
                    value={claimCategory}
                    onChange={(e) => setClaimCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Movement Mechanism">Movement Mechanism (Time loss / stopped)</option>
                    <option value="Water Ingress / Condensation">Water Ingress / Condensation</option>
                    <option value="Dial / Hands / Index">Dial / Hands / Index Alignment</option>
                    <option value="Bezel / Crown / Pusher">Bezel / Crown / Pusher Repair</option>
                    <option value="Strap / Clasp / Bracelet">Strap / Clasp / Bracelet Link</option>
                    <option value="Battery / Power Reserve">Battery / Power Reserve Check</option>
                    <option value="Other Horological Concern">Other Horological Concern</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Problem Description:</label>
                  <textarea
                    required
                    rows={3}
                    value={claimProblem}
                    onChange={(e) => setClaimProblem(e.target.value)}
                    placeholder="Describe what happened or the issue with the watch..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg"
                  >
                    Submit Official Claim
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs text-zinc-500 font-mono shrink-0">
          <span>🔒 कल्प Direct ERP Integration</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
