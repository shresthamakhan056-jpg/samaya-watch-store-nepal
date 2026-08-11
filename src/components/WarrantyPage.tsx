import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, Phone, Watch, Sparkles, QrCode, Wrench, Plus, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DigitalWarrantyCard } from './DigitalWarrantyCard';
import { Warranty } from '../types';

export const WarrantyPage: React.FC = () => {
  const { warranties, getWarrantyByIdOrMobile, getWarrantiesByMobile, logVerification, submitClaim, claims } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const [matchingList, setMatchingList] = useState<Warranty[]>([]);

  // Public Claim Submission Modal State
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimCategory, setClaimCategory] = useState('Movement Mechanism');
  const [claimProblem, setClaimProblem] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState<string | null>(null);

  // Parse URL query parameter (e.g., ?code=WRN-2026-0101)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') || params.get('id') || params.get('mobile');
    if (code) {
      setQuery(code);
      handleSearch(code);
    }
  }, [warranties]);

  const handleSearch = (searchVal?: string) => {
    const term = (searchVal !== undefined ? searchVal : query).trim();
    if (!term) return;

    setSearched(true);
    const foundDirect = getWarrantyByIdOrMobile(term);

    if (foundDirect) {
      setSelectedWarranty(foundDirect);
      setMatchingList([foundDirect]);
      logVerification(foundDirect.id, term.includes('WRN') ? 'QR Scan / Direct ID' : 'Mobile Query', 'Success');
    } else {
      const list = getWarrantiesByMobile(term);
      if (list.length > 0) {
        setMatchingList(list);
        setSelectedWarranty(list[0]);
        logVerification(list[0].id, 'Mobile Lookup', 'Success');
      } else {
        setSelectedWarranty(null);
        setMatchingList([]);
        logVerification(term, 'Public Query', 'Failed');
      }
    }
  };

  const handleSubmitPublicClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarranty || !claimProblem) return;

    const result = submitClaim({
      warrantyId: selectedWarranty.id,
      customerId: selectedWarranty.customerId,
      customerName: selectedWarranty.customerName,
      customerMobile: selectedWarranty.customerMobile,
      productId: selectedWarranty.productId,
      productBrand: selectedWarranty.productBrand,
      productModel: selectedWarranty.productModel,
      serialNumber: selectedWarranty.serialNumber,
      invoiceNumber: selectedWarranty.invoiceNumber,
      purchaseDate: selectedWarranty.warrantyStart,
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

  // Find customer's active claims for this warranty
  const customerClaims = selectedWarranty
    ? claims.filter(c => c.warrantyId === selectedWarranty.id)
    : [];

  return (
    <div className="bg-[#0A0A0B] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER HERO - BRANDED AS "कल्प" */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono uppercase tracking-widest shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>कल्प • Automated Digital Warranty Verification</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100 tracking-tight">
            कल्प Warranty & Service Portal
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Enter your 10-digit mobile number, Warranty ID, or Scan QR Code. Instantly retrieve official digital guarantees, submit service claims, and track live repairs.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-zinc-900/90 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Phone className="w-5 h-5 text-amber-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Mobile (e.g. 9851234567) or Warranty ID (WRN-2026-0101)..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Verify કल्प Record</span>
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
            <span className="text-[11px] text-zinc-500">Quick Demo Verification:</span>
            <button
              onClick={() => {
                setQuery('9851234567');
                handleSearch('9851234567');
              }}
              className="px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer text-[11px]"
            >
              Rolex (9851234567)
            </button>
            <button
              onClick={() => {
                setQuery('9801987654');
                handleSearch('9801987654');
              }}
              className="px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer text-[11px]"
            >
              Omega (9801987654)
            </button>
            <button
              onClick={() => {
                setQuery('WRN-2026-0103');
                handleSearch('WRN-2026-0103');
              }}
              className="px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer text-[11px]"
            >
              Tissot ID (WRN-2026-0103)
            </button>
          </div>
        </div>

        {/* CLAIM SUCCESS NOTIFICATION */}
        {claimSubmitted && (
          <div className="bg-emerald-950/90 border-2 border-emerald-500/60 p-4 rounded-2xl flex items-center justify-between text-emerald-200 text-xs font-mono">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-sm text-emerald-100">Service Claim Successfully Registered!</div>
                <div>Claim ID: <span className="font-bold text-amber-300">{claimSubmitted}</span>. Our horologist team has been notified.</div>
              </div>
            </div>
            <button onClick={() => setClaimSubmitted(null)} className="text-emerald-400 hover:text-white text-base">✕</button>
          </div>
        )}

        {/* SEARCH RESULTS DISPLAY */}
        {searched && (
          <div className="space-y-6">
            {matchingList.length > 1 && (
              <div className="bg-zinc-900 p-4 rounded-xl border border-amber-500/30">
                <span className="text-xs font-mono text-amber-400 font-bold block mb-2">
                  Multiple Digital Warranties Found ({matchingList.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {matchingList.map(w => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWarranty(w)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                        selectedWarranty?.id === w.id
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {w.productBrand} {w.productModel} ({w.id})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedWarranty ? (
              <div className="space-y-6">
                <DigitalWarrantyCard warranty={selectedWarranty} />

                {/* CUSTOMER ACTION BANNER FOR CLAIM SUBMISSION */}
                <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-amber-200 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-amber-400" />
                      <span>Require Timepiece Repair or Maintenance?</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Submit an automated digital service claim directly to our horologist team under Warranty #{selectedWarranty.id}.
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

                {/* CUSTOMER CLAIM TRACKER */}
                {customerClaims.length > 0 && (
                  <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
                    <h4 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      <span>Live Claims & Service Trackers ({customerClaims.length})</span>
                    </h4>

                    <div className="space-y-3 font-mono text-xs">
                      {customerClaims.map(c => (
                        <div key={c.id} className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-300">Claim ID: {c.id}</span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              c.status === 'Submitted' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                              c.status === 'Ready for Collection' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse' :
                              'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            }`}>
                              {c.status}
                            </span>
                          </div>

                          <div className="text-zinc-300">Category: {c.category}</div>
                          <div className="text-zinc-400 text-[11px]">Issue: {c.problemDescription}</div>

                          {c.repair && (
                            <div className="p-2 bg-zinc-900 rounded text-[11px] text-emerald-300 font-sans mt-2">
                              <strong>Horologist Action:</strong> {c.repair.actionTaken}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-zinc-900/80 border border-rose-500/40 rounded-2xl p-8 text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-rose-200">No Verified Warranty Record Found</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  We could not locate any active sales invoice or warranty certificate matching query <strong className="text-amber-300 font-mono">"{query}"</strong>.
                </p>
                <p className="text-[11px] text-zinc-500">
                  If you recently purchased a timepiece from our boutique, please contact our support team to verify your invoice finalized status.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* PUBLIC CLAIM SUBMISSION MODAL */}
      {showClaimForm && selectedWarranty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif text-lg font-bold text-amber-100">Submit Digital Service Claim</h3>
              <button onClick={() => setShowClaimForm(false)} className="text-zinc-400">✕</button>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1">
              <div>Warranty ID: <strong className="text-amber-200">{selectedWarranty.id}</strong></div>
              <div>Watch: <strong className="text-zinc-100">{selectedWarranty.productBrand} {selectedWarranty.productModel}</strong></div>
              <div>Serial No: <strong className="text-amber-300 font-mono">{selectedWarranty.serialNumber}</strong></div>
            </div>

            <form onSubmit={handleSubmitPublicClaim} className="space-y-3 text-xs">
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
                <label className="text-zinc-400 block mb-1">Detailed Problem Description *</label>
                <textarea
                  required
                  rows={3}
                  value={claimProblem}
                  onChange={(e) => setClaimProblem(e.target.value)}
                  placeholder="Describe the exact issue you are experiencing with your watch..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowClaimForm(false)} className="px-3 py-1.5 bg-zinc-900 rounded text-zinc-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded uppercase">Register Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
