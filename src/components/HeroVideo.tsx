import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, CheckCircle2, Award, Lock, MapPin, Phone, 
  ExternalLink, Sparkles, ChevronRight, ChevronLeft, ArrowRight,
  FileCheck2, RefreshCw, QrCode, AlertCircle, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Warranty } from '../types';

interface HeroVideoProps {
  setActiveTab: (tab: string) => void;
  onOrderWatch?: (product: any) => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ setActiveTab }) => {
  const { banners, getWarrantyByIdOrMobile } = useApp();

  // Active promotional/showroom banner for the single image slide
  const activeBanners = banners.filter(b => b.active);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // Warranty Quick Lookup State on Homepage
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Warranty | null | 'not_found'>(null);

  // Default sample warranty query for instant demonstration
  useEffect(() => {
    // Perform initial look up for quick sample preview if desired or default null
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getWarrantyByIdOrMobile(searchQuery);
    setSearchResult(found || 'not_found');
  };

  const handleQuickSampleClick = (sampleId: string) => {
    setSearchQuery(sampleId);
    const found = getWarrantyByIdOrMobile(sampleId);
    setSearchResult(found || 'not_found');
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-amber-200 selection:text-slate-900">
      
      {/* 1. HERO SECTION - WARRANTY VERIFICATION SYSTEM HEADLINE */}
      <div className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        
        {/* Subtle Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Main System Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OFFICIAL TIMEPIECE DIGITAL WARRANTY VERIFICATION PORTAL</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Verify Your Timepiece Authenticity & Digital Warranty
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Instant, single-source verification for luxury imported timepieces in Nepal. Search by Warranty ID, Watch Serial Number, or Customer Mobile to access your official digital certificate.
          </p>

          {/* Quick Action Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verifiable Serial Records</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>QR Digital Certificate</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Official ERP Single Source</span>
            </span>
          </div>

        </div>
      </div>

      {/* 2. PRIMARY WARRANTY VERIFICATION SEARCH ENGINE (CENTRAL FOCUS) */}
      <div className="max-w-4xl mx-auto -mt-8 px-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>Instant Warranty Lookup</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your Warranty ID, Watch Serial Number, or Mobile Number below
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-500">Sample Records:</span>
              <button
                type="button"
                onClick={() => handleQuickSampleClick('WRN-2026-0101')}
                className="text-xs font-mono px-2.5 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 transition-colors cursor-pointer"
              >
                WRN-2026-0101
              </button>
            </div>
          </div>

          {/* Search Bar Input */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Enter Warranty ID (e.g. WRN-2026-0101) or Mobile Number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchResult(null);
                }}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 font-mono focus:outline-none transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-serif font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 shrink-0 hover:scale-[1.01]"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Verify Warranty</span>
            </button>
          </form>

          {/* Search Results Display Area */}
          {searchResult === 'not_found' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>No Warranty Certificate Record Found</span>
              </div>
              <p className="text-slate-600">
                Please double-check your Warranty ID or Customer Mobile Number. If you recently purchased your timepiece, please contact our showroom representative or try sample record <span onClick={() => handleQuickSampleClick('WRN-2026-0101')} className="underline font-mono text-blue-700 cursor-pointer font-bold">WRN-2026-0101</span>.
              </p>
            </div>
          )}

          {searchResult && searchResult !== 'not_found' && (
            <div className="p-6 rounded-xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>VERIFIED GENUINE DIGITAL WARRANTY CERTIFICATE</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase w-max">
                  STATUS: {searchResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Watch Model</span>
                  <span className="font-serif font-bold text-amber-300 text-sm">{searchResult.productBrand} - {searchResult.productModel}</span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Serial Number</span>
                  <span className="font-mono text-slate-200 text-sm font-semibold">{searchResult.serialNumber}</span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Warranty Valid From</span>
                  <span className="font-mono text-slate-200 text-sm">{searchResult.warrantyStart}</span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Warranty Expiry Date</span>
                  <span className="font-mono text-emerald-400 text-sm font-bold">{searchResult.warrantyEnd}</span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Warranty Certificate ID</span>
                  <span className="font-mono text-amber-300 text-sm font-bold">{searchResult.id}</span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Registered Owner</span>
                  <span className="font-mono text-slate-200 text-sm">{searchResult.customerName}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-slate-400 font-mono">Invoice Ref: {searchResult.invoiceNumber}</span>
                <button
                  onClick={() => setActiveTab('warranty')}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>View Full Digital Certificate</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* 3. SINGLE IMAGE SLIDE / SHOWROOM BANNER DISPLAY (As specifically requested: "just one image slide only") */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-widest font-mono">
                Boutique Gallery & Showroom
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Flagship Boutique Showcase
              </h2>
            </div>
            {activeBanners.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlideIdx(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
                  className="p-2 rounded-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors shadow-sm cursor-pointer"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-500 font-semibold px-1">
                  {currentSlideIdx + 1} / {activeBanners.length}
                </span>
                <button
                  onClick={() => setCurrentSlideIdx(prev => (prev === activeBanners.length - 1 ? 0 : prev + 1))}
                  className="p-2 rounded-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors shadow-sm cursor-pointer"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Single Image Banner Slide Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white h-[280px] sm:h-[380px] md:h-[420px] flex items-center justify-center group">
            <img
              src={
                activeBanners[currentSlideIdx]?.imageUrl ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop'
              }
              alt={activeBanners[currentSlideIdx]?.title || 'Showroom Slide'}
              className="w-full h-full object-cover transition-transform duration-500"
            />
            
            {/* Banner Caption Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/90 text-slate-950 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Durbar Marg Flagship Showroom</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  {activeBanners[currentSlideIdx]?.title || 'Nepal’s Premier Luxury Timepiece Destination'}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. HOW DIGITAL WARRANTY VERIFICATION WORKS (3 SIMPLE STEPS) */}
      <div className="bg-white border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-900 font-semibold">
              3-Step Verification Protocol
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How Digital QR Verification Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Every sales invoice registered in our ERP system automatically issues an immutable digital warranty certificate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-300 font-bold font-mono text-base flex items-center justify-center shrink-0">
                01
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Scan QR or Input ID</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan the QR code printed on your official purchase card or enter your Warranty ID/Mobile number above.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-300 font-bold font-mono text-base flex items-center justify-center shrink-0">
                02
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">ERP Database Match</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The verification engine cross-references serial numbers, dispatch dates, and registered customer details in real-time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-300 font-bold font-mono text-base flex items-center justify-center shrink-0">
                03
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Instant Verified Certificate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View your active status, remaining coverage period, and download or print your official Digital QR Certificate.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 5. VERIFICATION SYSTEM ADVANTAGES */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-slate-900 text-sm">Authenticity Guarantee</h4>
            <p className="text-xs text-slate-600">
              Eliminates counterfeit risks with verified serial records mapped to official import invoices.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-slate-900 text-sm">Instant Mobile QR Scan</h4>
            <p className="text-xs text-slate-600">
              Scan with any mobile camera for immediate verification on the go without physical paperwork.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-slate-900 text-sm">Exact Coverage Countdown</h4>
            <p className="text-xs text-slate-600">
              Tracks exact sales date, active duration, and remaining warranty coverage days precisely.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-slate-900 text-sm">Full Service History</h4>
            <p className="text-xs text-slate-600">
              Records official showroom battery replacements, strap adjustments, and pressure tests.
            </p>
          </div>

        </div>
      </div>

      {/* 6. SHOWROOM & SUPPORT BANNER */}
      <div className="max-w-6xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-300 uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Flagship Showroom • Kathmandu</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Need Assistance with Your Warranty?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Visit our Durbar Marg showroom opposite Annapurna Hotel or message our dedicated team on WhatsApp for warranty support and timepiece verification.
            </p>
          </div>

          <div className="shrink-0 space-y-2 w-full md:w-auto">
            <a
              href="https://wa.me/9779851234567"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Warranty Helpdesk</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
