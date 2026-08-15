import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, VolumeX, ShieldCheck, ChevronRight, Sparkles, ArrowRight, 
  ChevronLeft, Watch, Search, MapPin, Phone, CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Warranty } from '../types';
import { TikTokIcon, InstagramIcon, FacebookIcon, OFFICIAL_TIKTOK_URL, OFFICIAL_INSTAGRAM_URL, OFFICIAL_FACEBOOK_URL } from './SocialIcons';

interface HeroVideoProps {
  setActiveTab: (tab: string) => void;
  onOrderWatch?: (product: Product) => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ setActiveTab }) => {
  const { products, banners, videos, homepageContent, getWarrantyByIdOrMobile } = useApp();
  const [isMuted, setIsMuted] = useState(true);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Quick Warranty Check state on Home Page
  const [quickWarrantyQuery, setQuickWarrantyQuery] = useState('');
  const [quickWarrantyResult, setQuickWarrantyResult] = useState<Warranty | null | 'not_found'>(null);

  const currentVideoUrl = videos[0]?.videoUrl || homepageContent.heroVideoUrl;
  const activeBanners = banners.filter(b => b.active);

  // Auto-play banner slide carousel
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx(prev => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleQuickWarrantySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickWarrantyQuery.trim()) return;
    const result = getWarrantyByIdOrMobile(quickWarrantyQuery);
    setQuickWarrantyResult(result || 'not_found');
  };

  return (
    <div className="bg-[#070709] text-white selection:bg-amber-500 selection:text-black">
      
      {/* 1. CINEMATIC FULLSCREEN HERO VIDEO & HEADLINE */}
      <div className="relative w-full h-[90vh] min-h-[620px] overflow-hidden flex items-center justify-center border-b border-amber-500/20">
        
        {/* Background Video / Fallback Image */}
        {!videoError ? (
          <video
            ref={videoRef}
            key={currentVideoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            poster="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-[0.7] contrast-125 transition-transform duration-1000"
          >
            <source src={currentVideoUrl} type="video/mp4" onError={() => setVideoError(true)} />
          </video>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop"
            alt="Showroom Hero"
            className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-[0.7] contrast-125"
          />
        )}

        {/* Dark Luxury Vignette & Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/50 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Audio Mute/Unmute Floating Button */}
        <button
          onClick={toggleMute}
          className="absolute top-8 right-8 z-20 bg-zinc-950/80 border border-amber-500/40 text-amber-300 hover:text-amber-100 px-4 py-2 rounded-full text-xs font-mono font-semibold backdrop-blur-md flex items-center gap-2.5 transition-all cursor-pointer shadow-2xl hover:border-amber-400 hover:scale-105"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Unmute Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              <span>Audio Playing</span>
            </>
          )}
        </button>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs tracking-widest uppercase font-mono font-semibold backdrop-blur-md shadow-2xl shadow-amber-950/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{homepageContent.certifiedImporterBadge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.15]">
            {homepageContent.heroHeadlineLine1}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mt-2">
              {homepageContent.heroHeadlineLine2}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            {homepageContent.heroSubheadline}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('gallery')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 hover:text-black font-serif font-bold text-sm tracking-wider uppercase backdrop-blur-md transition-all flex items-center gap-2.5 cursor-pointer shadow-xl shadow-amber-900/40 hover:scale-105 active:scale-95"
            >
              <Watch className="w-5 h-5 text-zinc-950" />
              <span>Explore Watch Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              className="px-8 py-4 rounded-xl bg-zinc-950/90 border border-amber-500/50 text-amber-300 hover:text-amber-100 font-serif font-bold text-sm tracking-wider uppercase backdrop-blur-md hover:bg-amber-500/10 transition-all flex items-center gap-2.5 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>{homepageContent.verifyWarrantyButtonText}</span>
            </button>
          </div>

          <div className="pt-4 flex flex-col items-center justify-center gap-3">
            <div className="text-xs text-amber-300 font-mono tracking-wider flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{homepageContent.socialChannelsText || 'Direct Order Channels:'}</span>
            </div>

            {/* Official Social Channel Direct Link Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <a
                href={homepageContent.tiktokLink || OFFICIAL_TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-black text-zinc-200 hover:text-white border border-zinc-700 hover:border-pink-500/60 transition-all flex items-center gap-2 text-xs font-mono backdrop-blur-md shadow-lg group"
                title="Open Official TikTok Store"
              >
                <TikTokIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>TikTok (@kalpa9741)</span>
              </a>

              <a
                href={homepageContent.instagramLink || OFFICIAL_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-zinc-200 hover:text-pink-400 border border-zinc-700 hover:border-pink-500/60 transition-all flex items-center gap-2 text-xs font-mono backdrop-blur-md shadow-lg group"
                title="Open Official Instagram Page"
              >
                <InstagramIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Instagram (@kalpa_watch)</span>
              </a>

              <a
                href={homepageContent.facebookLink || OFFICIAL_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-zinc-200 hover:text-blue-400 border border-zinc-700 hover:border-blue-500/60 transition-all flex items-center gap-2 text-xs font-mono backdrop-blur-md shadow-lg group"
                title="Open Official Facebook Page"
              >
                <FacebookIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Facebook Page</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PROMOTIONAL OFFERS & BANNERS CAROUSEL */}
      {activeBanners.length > 0 && (
        <div className="bg-[#0c0c0f] border-y border-amber-500/20 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-100">
                  Exclusive Store Promotions & Offers
                </h2>
              </div>
              <span className="text-xs font-mono text-amber-400/80">
                Slide {activeBannerIdx + 1} of {activeBanners.length}
              </span>
            </div>

            <div
              onClick={() => setActiveTab('gallery')}
              className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-zinc-950 h-[280px] sm:h-[400px] md:h-[480px] flex items-center justify-center group cursor-pointer"
            >
              <img
                src={activeBanners[activeBannerIdx]?.imageUrl}
                alt={activeBanners[activeBannerIdx]?.title || 'Promotional Banner'}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />

              {/* Navigation Controls Overlay */}
              {activeBanners.length > 1 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-6 right-6 flex items-center gap-2 z-10 bg-black/80 border border-amber-500/40 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl"
                >
                  <button
                    onClick={() => setActiveBannerIdx(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-amber-500/40 text-amber-300 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors cursor-pointer"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-amber-300 font-mono font-bold px-2">
                    {activeBannerIdx + 1} / {activeBanners.length}
                  </span>
                  <button
                    onClick={() => setActiveBannerIdx(prev => (prev === activeBanners.length - 1 ? 0 : prev + 1))}
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-amber-500/40 text-amber-300 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors cursor-pointer"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. INSTANT DIGITAL WARRANTY QUICK LOOKUP WIDGET */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono uppercase tracking-widest border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Immutable Verification Engine</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-amber-100">
              Instant Digital QR Warranty Check
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Verify watch authenticity, original sales date, serial number, and active warranty status directly from our central ERP database.
            </p>
          </div>

          <form onSubmit={handleQuickWarrantySearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Enter Warranty ID (e.g. WRN-2026-0101) or Mobile..."
                value={quickWarrantyQuery}
                onChange={(e) => {
                  setQuickWarrantyQuery(e.target.value);
                  setQuickWarrantyResult(null);
                }}
                className="w-full bg-zinc-950 border border-amber-500/40 focus:border-amber-400 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-serif font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Verify Status</span>
            </button>
          </form>

          {/* Search Result Display */}
          {quickWarrantyResult === 'not_found' && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs space-y-1 max-w-2xl">
              <div className="font-bold font-mono">⚠️ No Active Warranty Certificate Found</div>
              <p>Please double-check your Warranty ID or Mobile Number. You can also view sample card <span onClick={() => { setQuickWarrantyQuery('WRN-2026-0101'); handleQuickWarrantySearch({ preventDefault: () => {} } as any); }} className="underline font-mono text-amber-300 cursor-pointer">WRN-2026-0101</span>.</p>
            </div>
          )}

          {quickWarrantyResult && quickWarrantyResult !== 'not_found' && (
            <div className="p-5 rounded-2xl bg-zinc-950/90 border border-emerald-500/40 text-zinc-200 space-y-3 max-w-2xl shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VERIFIED GENUINE TIMEPIECE</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                  {quickWarrantyResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Watch Model</span>
                  <span className="font-serif font-bold text-amber-200">{quickWarrantyResult.productBrand} - {quickWarrantyResult.productModel}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Serial No</span>
                  <span className="font-mono text-zinc-300">{quickWarrantyResult.serialNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Valid From (Sales Date)</span>
                  <span className="font-mono text-zinc-300">{quickWarrantyResult.warrantyStart}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Expiry Date</span>
                  <span className="font-mono text-amber-300 font-bold">{quickWarrantyResult.warrantyEnd}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Warranty ID</span>
                  <span className="font-mono text-amber-400">{quickWarrantyResult.id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Owner Name</span>
                  <span className="font-mono text-zinc-300">{quickWarrantyResult.customerName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setActiveTab('warranty')}
                  className="text-xs font-mono font-bold text-amber-400 hover:text-amber-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Digital Certificate View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DURBAR MARG SHOWROOM LOCATION CARD */}
      {(homepageContent.showroomEnabled ?? true) && (
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="space-y-4 max-w-xl">
              {homepageContent.showroomTag && (
                <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />
                  <span>{homepageContent.showroomTag}</span>
                </div>
              )}
              {homepageContent.showroomTitle && (
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-amber-100">
                  {homepageContent.showroomTitle}
                </h2>
              )}
              {homepageContent.showroomDescription && (
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {homepageContent.showroomDescription}
                </p>
              )}
              <div className="pt-2 space-y-1.5 text-xs font-mono text-zinc-400">
                {homepageContent.showroomAddress && (
                  <p className="text-amber-200 font-bold">{homepageContent.showroomAddress}</p>
                )}
                {homepageContent.showroomContact && (
                  <p>{homepageContent.showroomContact}</p>
                )}
              </div>
            </div>

            <div className="shrink-0 space-y-3 w-full md:w-auto">
              <a
                href={`https://wa.me/${(homepageContent.showroomPhone || '9779823680863').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-serif font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <Phone className="w-4 h-4" />
                <span>{homepageContent.showroomButtonText || 'Contact Showroom Representative'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
