import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, Phone, Watch, Sparkles, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DigitalWarrantyCard } from './DigitalWarrantyCard';
import { Warranty } from '../types';

export const WarrantyPage: React.FC = () => {
  const { warranties, getWarrantyByIdOrMobile, getWarrantiesByMobile } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const [matchingList, setMatchingList] = useState<Warranty[]>([]);

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
    } else {
      const list = getWarrantiesByMobile(term);
      if (list.length > 0) {
        setMatchingList(list);
        setSelectedWarranty(list[0]);
      } else {
        setSelectedWarranty(null);
        setMatchingList([]);
      }
    }
  };

  return (
    <div className="bg-[#0A0A0B] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono uppercase tracking-widest shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Official Digital Warranty Portal</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100">
            Verify Your Timepiece Authenticity
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Enter your 10-digit mobile number, Warranty ID, or Serial Number below. The system automatically retrieves your digital guarantee card from our verified sales database.
          </p>
        </div>

        {/* Search Input Card */}
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
                placeholder="Enter Mobile Number (e.g. 9851234567) or Warranty ID (WRN-2026-...)"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl pl-12 pr-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Verify Warranty</span>
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>Test Samples:</span>
            <button
              onClick={() => {
                setQuery('9851234567');
                handleSearch('9851234567');
              }}
              className="px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
            >
              Rolex (9851234567)
            </button>

            <button
              onClick={() => {
                setQuery('9801987654');
                handleSearch('9801987654');
              }}
              className="px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
            >
              Omega (9801987654)
            </button>

            <button
              onClick={() => {
                setQuery('WRN-2026-0103');
                handleSearch('WRN-2026-0103');
              }}
              className="px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
            >
              Tissot ID (WRN-2026-0103)
            </button>
          </div>
        </div>

        {/* Search Results Display */}
        {searched && (
          <div className="space-y-6">
            {matchingList.length > 1 && (
              <div className="bg-zinc-900 p-4 rounded-xl border border-amber-500/30">
                <span className="text-xs font-mono text-amber-400 font-bold block mb-2">
                  Multiple Warranty Cards Found for Mobile Number ({matchingList.length}):
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
              <DigitalWarrantyCard warranty={selectedWarranty} />
            ) : (
              <div className="bg-zinc-900/80 border border-rose-500/40 rounded-2xl p-8 text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-rose-200">No Verified Warranty Record Found</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  We could not locate any active sales invoice or warranty certificate matching query <strong className="text-amber-300 font-mono">"{query}"</strong>.
                </p>
                <p className="text-[11px] text-zinc-500">
                  If you recently purchased a timepiece, please contact our sales desk via our official social handles (TikTok, Instagram, or Facebook) to ensure your sales estimate bill has been finalized.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
