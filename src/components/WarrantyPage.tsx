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
      logVerification(foundDirect.id, term.includes('WRN') ? 'Warranty ID' : 'Mobile Search', 'Success');
    } else {
      const list = getWarrantiesByMobile(term);
      if (list.length > 0) {
        setMatchingList(list);
        setSelectedWarranty(list[0]);
        logVerification(list[0].id, 'Mobile Search', 'Success');
      } else {
        setSelectedWarranty(null);
        setMatchingList([]);
        logVerification(term, 'Warranty ID', 'Not Found');
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
    <div className="bg-slate-50 text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER HERO */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>कल्प • Digital QR Warranty Verification Portal</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Warranty & Service Verification
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Enter your Warranty ID, 10-digit mobile number, or Watch Serial Number to instantly retrieve official digital guarantees, submit service claims, and track live repairs.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Mobile (e.g. 9851234567) or Warranty ID (e.g. WRN-2026-0101)..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Verify Record</span>
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="text-[11px] text-slate-400">Quick Demo Records:</span>
            <button
              onClick={() => {
                setQuery('9851234567');
                handleSearch('9851234567');
              }}
              className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 cursor-pointer text-[11px]"
            >
              Rolex (9851234567)
            </button>
            <button
              onClick={() => {
                setQuery('9801987654');
                handleSearch('9801987654');
              }}
              className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 cursor-pointer text-[11px]"
            >
              Omega (9801987654)
            </button>
            <button
              onClick={() => {
                setQuery('WRN-2026-0103');
                handleSearch('WRN-2026-0103');
              }}
              className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 cursor-pointer text-[11px]"
            >
              Tissot ID (WRN-2026-0103)
            </button>
          </div>
        </div>

        {/* CLAIM SUCCESS NOTIFICATION */}
        {claimSubmitted && (
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center justify-between text-emerald-900 text-xs font-mono shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-sm text-emerald-950">Service Claim Successfully Registered!</div>
                <div>Claim ID: <span className="font-bold text-blue-900">{claimSubmitted}</span>. Our horologist team has been notified.</div>
              </div>
            </div>
            <button onClick={() => setClaimSubmitted(null)} className="text-emerald-700 hover:text-emerald-900 text-base font-bold">✕</button>
          </div>
        )}

        {/* SEARCH RESULTS DISPLAY */}
        {searched && (
          <div className="space-y-6">
            {matchingList.length > 1 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-xs font-mono text-slate-700 font-bold block mb-2">
                  Multiple Digital Warranties Found ({matchingList.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {matchingList.map(w => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWarranty(w)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                        selectedWarranty?.id === w.id
                          ? 'bg-slate-900 text-amber-300 font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-amber-600" />
                      <span>Require Timepiece Repair or Maintenance?</span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Submit an automated digital service claim directly to our horologist team under Warranty #{selectedWarranty.id}.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowClaimForm(true)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Submit Service Claim</span>
                  </button>
                </div>

                {/* CUSTOMER CLAIM TRACKER */}
                {customerClaims.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span>Live Claims & Service Trackers ({customerClaims.length})</span>
                    </h4>

                    <div className="space-y-3 font-mono text-xs">
                      {customerClaims.map(c => (
                        <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">Claim ID: {c.id}</span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              c.status === 'Submitted' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                              c.status === 'Ready for Collection' ? 'bg-emerald-100 text-emerald-900 border-emerald-300 animate-pulse' :
                              'bg-blue-100 text-blue-900 border-blue-300'
                            }`}>
                              {c.status}
                            </span>
                          </div>

                          <div className="text-slate-800">Category: {c.category}</div>
                          <div className="text-slate-600 text-[11px]">Issue: {c.problemDescription}</div>

                          {c.repair && (
                            <div className="p-2 bg-white border border-slate-200 rounded text-[11px] text-slate-800 font-sans mt-2">
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
              <div className="bg-white border border-red-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-slate-900">No Verified Warranty Record Found</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  We could not locate any active sales invoice or warranty certificate matching query <strong className="text-slate-900 font-mono">"{query}"</strong>.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* PUBLIC CLAIM SUBMISSION MODAL */}
      {showClaimForm && selectedWarranty && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full text-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-serif text-lg font-bold text-slate-900">Submit Digital Service Claim</h3>
              <button onClick={() => setShowClaimForm(false)} className="text-slate-500 font-bold hover:text-slate-800">✕</button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
              <div>Warranty ID: <strong className="text-slate-900">{selectedWarranty.id}</strong></div>
              <div>Watch: <strong className="text-slate-900">{selectedWarranty.productBrand} {selectedWarranty.productModel}</strong></div>
              <div>Serial No: <strong className="text-slate-900 font-mono">{selectedWarranty.serialNumber}</strong></div>
            </div>

            <form onSubmit={handleSubmitPublicClaim} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Service Category:</label>
                <select
                  value={claimCategory}
                  onChange={(e) => setClaimCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                >
                  <option value="Movement Mechanism">Movement Mechanism / Time Keeping</option>
                  <option value="Water Resistance">Water Resistance / Pressure Seal</option>
                  <option value="Dial & Hands">Dial, Hands & Crystal Glass</option>
                  <option value="Strap & Bracelet">Strap, Bracelet & Clasp Adjustments</option>
                  <option value="Battery Replacement">Original Swiss Battery Replacement</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Issue Description:</label>
                <textarea
                  required
                  rows={3}
                  value={claimProblem}
                  onChange={(e) => setClaimProblem(e.target.value)}
                  placeholder="Describe the issue you are experiencing..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimForm(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 text-amber-300 text-xs font-bold"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
