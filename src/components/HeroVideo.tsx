import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, ShieldCheck, ChevronRight, Sparkles, ArrowRight, Star, ChevronLeft, Watch } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

interface HeroVideoProps {
  setActiveTab: (tab: string) => void;
  onOrderWatch: (product: Product) => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ setActiveTab, onOrderWatch }) => {
  const { products, banners, videos, homepageContent } = useApp();
  const [isMuted, setIsMuted] = useState(true);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideoUrl = videos[0]?.videoUrl || homepageContent.heroVideoUrl;

  const activeBanners = banners.filter(b => b.active);

  // Auto-play slide photo carousel every 4 seconds
  React.useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx(prev => (prev + 1) % activeBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-[#0A0A0B] text-white">
      {/* 1. HERO FULLSCREEN VIDEO SHOWCASE */}
      <div className="relative w-full h-[88vh] min-h-[580px] overflow-hidden flex items-center justify-center border-b border-amber-500/20">
        {/* Background Video or Image Fallback */}
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
            className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-75 contrast-110"
          >
            <source src={currentVideoUrl} type="video/mp4" onError={() => setVideoError(true)} />
            Your browser does not support HTML5 video.
          </video>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop"
            alt="Showroom Hero"
            className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-75 contrast-110"
          />
        )}

        {/* Dark Luxury Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Audio Mute/Unmute Floating Button */}
        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 z-20 bg-zinc-950/80 border border-amber-500/40 text-amber-300 hover:text-amber-200 px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:border-amber-400"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
          <span>{isMuted ? 'Unmute Sound' : 'Audio On'}</span>
        </button>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs tracking-widest uppercase font-semibold backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{homepageContent.certifiedImporterBadge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-amber-100 leading-tight">
            {homepageContent.heroHeadlineLine1}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mt-2">
              {homepageContent.heroHeadlineLine2}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            {homepageContent.heroSubheadline}
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('warranty')}
              className="px-8 py-3.5 rounded-lg bg-zinc-950/80 border border-amber-500/50 text-amber-300 hover:text-amber-100 font-bold text-sm tracking-wider uppercase backdrop-blur-md hover:bg-amber-500/10 transition-all flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-900/30 hover:scale-105"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>{homepageContent.verifyWarrantyButtonText}</span>
            </button>
          </div>

          <p className="text-xs text-amber-400/90 font-mono pt-2">
            {homepageContent.socialChannelsText}
          </p>
        </div>
      </div>

      {/* 2. AUTO SLIDING BANNERS CAROUSEL */}
      {activeBanners.length > 0 && (
        <div className="relative bg-[#0F0F12] border-b border-amber-500/20 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div
              onClick={() => setActiveTab('gallery')}
              className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-zinc-950 h-[260px] sm:h-[380px] md:h-[460px] flex items-center justify-center group cursor-pointer"
            >
              <img
                src={activeBanners[activeBannerIdx]?.imageUrl}
                alt={activeBanners[activeBannerIdx]?.title || 'Offer Banner'}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />

              {/* Navigation controls */}
              {activeBanners.length > 1 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-4 right-4 flex items-center gap-2 z-10 bg-black/70 border border-amber-500/30 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg"
                >
                  <button
                    onClick={() => setActiveBannerIdx(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
                    className="w-7 h-7 rounded-full bg-zinc-900/90 border border-amber-500/40 text-amber-300 flex items-center justify-center hover:bg-amber-500/30 transition-colors cursor-pointer"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-amber-300 font-mono font-bold px-1">
                    {activeBannerIdx + 1} / {activeBanners.length}
                  </span>
                  <button
                    onClick={() => setActiveBannerIdx(prev => (prev === activeBanners.length - 1 ? 0 : prev + 1))}
                    className="w-7 h-7 rounded-full bg-zinc-900/90 border border-amber-500/40 text-amber-300 flex items-center justify-center hover:bg-amber-500/30 transition-colors cursor-pointer"
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
    </div>
  );
};
