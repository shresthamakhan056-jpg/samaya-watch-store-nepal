import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, VolumeX, ShieldCheck, ChevronRight, Sparkles, ArrowRight, 
  ChevronLeft, Watch, Search, MapPin, Phone, CheckCircle2, 
  ExternalLink, ShoppingBag, Eye, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Warranty } from '../types';
import { TikTokIcon, InstagramIcon, FacebookIcon, resolveSocialUrl, openSocialUrl } from './SocialIcons';
import kalpaLogo from '../assets/kalpa_logo.jpg';
import { KALPA_LOGO_DATA_URL } from '../assets/logoData';

interface HeroVideoProps {
  setActiveTab: (tab: string) => void;
  onOrderWatch?: (product: Product) => void;
}

const DEFAULT_HIGH_RES_BANNERS = [
  {
    id: 'def-banner-1',
    title: 'Swiss Automatic Chronograph Masterpiece',
    subtitle: 'Precision Co-Axial Escapement with Sapphire Crystal & 100M Water Resistance',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'def-banner-2',
    title: 'Executive Rose Gold & Emerald Dial Edition',
    subtitle: 'Crafted for the Discerning Collector with Automated Digital QR Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'def-banner-3',
    title: 'Horology Elegance • Certified Nepal Importer',
    subtitle: 'Direct Showroom Sourcing in Kathmandu with Immutable ERP Authentication',
    imageUrl: 'https://images.unsplash.com/photo-1547996160-71dfa6358462?q=80&w=1600&auto=format&fit=crop',
    active: true
  }
];

export const HeroVideo: React.FC<HeroVideoProps> = ({ setActiveTab, onOrderWatch }) => {
  const { products, banners, videos, homepageContent, getWarrantyByIdOrMobile } = useApp();
  const [isMuted, setIsMuted] = useState(true);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Quick Warranty Check state on Home Page
  const [quickWarrantyQuery, setQuickWarrantyQuery] = useState('');
  const [quickWarrantyResult, setQuickWarrantyResult] = useState<Warranty | null | 'not_found'>(null);

  const currentVideoUrl = videos[0]?.videoUrl || homepageContent.heroVideoUrl;
  const configuredBanners = banners.filter(b => b.active);
  const activeBanners = configuredBanners.length > 0 ? configuredBanners : DEFAULT_HIGH_RES_BANNERS;

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

  const [quickSearchError, setQuickSearchError] = useState<string | null>(null);

  const handleQuickWarrantySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = quickWarrantyQuery.trim();
    if (!raw) return;

    setQuickSearchError(null);
    const cleanUpper = raw.toUpperCase();
    const hasLetters = /[A-Za-z]/.test(raw);

    // If user enters customer name or alphabetical text that does not start with WRN
    if (hasLetters && !cleanUpper.startsWith('WRN')) {
      setQuickWarrantyResult('not_found');
      setQuickSearchError('Verification by Customer Name is strictly disabled. Please enter your Registered 10-digit Mobile Number or official Warranty Number.');
      return;
    }

    const result = getWarrantyByIdOrMobile(raw);
    setQuickWarrantyResult(result || 'not_found');
  };

  const featuredProducts = products.filter(p => p.isFeatured || p.status === 'In Stock').slice(0, 8);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  return (
    <div className="bg-[#070709] text-white selection:bg-amber-500 selection:text-black">
      
      {/* 1. CINEMATIC FULLSCREEN HERO VIDEO & HEADLINE */}
      <div className="relative w-full min-h-[640px] lg:min-h-[750px] overflow-hidden flex items-center justify-center border-b border-amber-500/20 py-16">
        
        {/* Background Video / Fallback Image with vibrant high clarity */}
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
            className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-[0.82] contrast-110 transition-transform duration-1000"
          >
            <source src={currentVideoUrl} type="video/mp4" onError={() => setVideoError(true)} />
          </video>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop"
            alt="Showroom Hero"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-[0.82] contrast-110"
          />
        )}

        {/* Crisp Luxury Vignette & Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        {/* Audio Mute/Unmute Floating Button */}
        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 z-20 bg-zinc-950/85 border border-amber-500/40 text-amber-300 hover:text-amber-100 px-4 py-2 rounded-full text-xs font-mono font-semibold backdrop-blur-md flex items-center gap-2.5 transition-all cursor-pointer shadow-2xl hover:border-amber-400 hover:scale-105"
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
          
          {/* Prominent Official Store Logo Emblem */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-1 shadow-2xl shadow-amber-500/30 flex items-center justify-center overflow-hidden border border-amber-300/50 backdrop-blur-md hover:scale-105 transition-transform duration-300">
              <img
                src={kalpaLogo || KALPA_LOGO_DATA_URL}
                alt="कल्प Official Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = KALPA_LOGO_DATA_URL; }}
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs tracking-widest uppercase font-mono font-semibold backdrop-blur-md shadow-2xl shadow-amber-950/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{homepageContent.certifiedImporterBadge}</span>
            </div>
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
                href={resolveSocialUrl('tiktok', homepageContent.tiktokLink)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openSocialUrl(resolveSocialUrl('tiktok', homepageContent.tiktokLink), e)}
                className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-black text-zinc-200 hover:text-white border border-zinc-700 hover:border-pink-500/60 transition-all flex items-center gap-2 text-xs font-mono backdrop-blur-md shadow-lg group cursor-pointer"
                title="Open Official TikTok Store (@kalpa9741)"
              >
                <TikTokIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>TikTok (@kalpa9741)</span>
              </a>

              <a
                href={resolveSocialUrl('instagram', homepageContent.instagramLink)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openSocialUrl(resolveSocialUrl('instagram', homepageContent.instagramLink), e)}
                className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-zinc-200 hover:text-pink-400 border border-zinc-700 hover:border-pink-500/60 transition-all flex items-center gap-2 text-xs font-mono backdrop-blur-md shadow-lg group cursor-pointer"
                title="Open Official Instagram Page (@kalpa_watch)"
              >
                <InstagramIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Instagram (@kalpa_watch)</span>
              </a>

              <a
                href={resolveSocialUrl('facebook', homepageContent.facebookLink)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openSocialUrl(resolveSocialUrl('facebook', homepageContent.facebookLink), e)}
                className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-zinc-200 hover:text-blue-400 border border-zinc-700 hover:border-blue-500/60 transition-all flex items-center gap-2 text-xs font-mono backdrop-blur-md shadow-lg group cursor-pointer"
                title="Open Official Facebook Page (कल्प Luxury)"
              >
                <FacebookIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Facebook Page</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMOTIONAL OFFERS & BANNERS CAROUSEL */}
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
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />

              {/* Slide text banner overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold rounded-full w-fit mb-2">
                  FEATURED LUXURY SPOTLIGHT
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-2">
                  {activeBanners[activeBannerIdx]?.title}
                </h3>
                {activeBanners[activeBannerIdx]?.subtitle && (
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
                    {activeBanners[activeBannerIdx]?.subtitle}
                  </p>
                )}
              </div>

              {/* Navigation Controls Overlay */}
              {activeBanners.length > 1 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-6 right-6 flex items-center gap-2 z-10 bg-black/85 border border-amber-500/40 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl"
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

      {/* 4. INSTANT DIGITAL WARRANTY QUICK LOOKUP WIDGET */}
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
              Verify watch authenticity, original sales date, serial number, and active warranty status using your <strong>Registered Mobile Number</strong> or official <strong>Warranty Number</strong>.
            </p>
          </div>

          <form onSubmit={handleQuickWarrantySearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Enter Registered Mobile (e.g. 9823680863) or Warranty Number (WRN-2026-0101)..."
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
          {quickSearchError && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs space-y-1 max-w-2xl">
              <div className="font-bold font-mono">⚠️ Verification By Name Not Allowed</div>
              <p>{quickSearchError}</p>
            </div>
          )}

          {!quickSearchError && quickWarrantyResult === 'not_found' && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs space-y-1 max-w-2xl">
              <div className="font-bold font-mono">⚠️ No Active Warranty Certificate Found</div>
              <p>Verification is strictly restricted to your <strong>Registered Mobile Number</strong> or official <strong>Warranty Number</strong>. Please check and try again.</p>
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

      {/* 5. KATHMANDU SHOWROOM LOCATION CARD */}
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

