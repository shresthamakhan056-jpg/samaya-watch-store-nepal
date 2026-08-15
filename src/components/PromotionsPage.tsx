import React from 'react';
import { Sparkles, Calendar, ArrowRight, Tag, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PromotionsPageProps {
  setActiveTab: (tab: string) => void;
}

const DEFAULT_PROMOTIONS = [
  {
    id: 'promo-1',
    title: 'Swiss Automatic Chronograph Masterpiece',
    subtitle: 'Precision Co-Axial Escapement with Sapphire Crystal & 100M Water Resistance',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    type: 'Seasonal Promotion',
    active: true
  },
  {
    id: 'promo-2',
    title: 'Executive Rose Gold & Emerald Dial Edition',
    subtitle: 'Crafted for the Discerning Collector with Automated Digital QR Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
    type: 'Limited Edition',
    active: true
  },
  {
    id: 'promo-3',
    title: 'Horology Elegance • Certified Nepal Importer',
    subtitle: 'Direct Showroom Sourcing in Kathmandu with Immutable ERP Authentication',
    imageUrl: 'https://images.unsplash.com/photo-1547996160-71dfa6358462?q=80&w=1600&auto=format&fit=crop',
    type: 'Flagship Event',
    active: true
  }
];

export const PromotionsPage: React.FC<PromotionsPageProps> = ({ setActiveTab }) => {
  const { banners } = useApp();
  const activeBanners = banners.filter(b => b.active);
  const displayBanners = activeBanners.length > 0 ? activeBanners : DEFAULT_PROMOTIONS;

  return (
    <div className="bg-[#0A0A0B] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5" />
            <span>Seasonal Offers & Exclusive Importer Deals</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100">
            Promotions & Limited Seasonal Banners
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Special offers and luxury bundles managed live from our ERP Marketing CMS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-zinc-900 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between group"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden bg-black">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-amber-500 text-zinc-950 text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded shadow">
                  {banner.type || 'Special'} Campaign
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-serif text-xl font-bold text-amber-100">{banner.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">{banner.subtitle}</p>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-amber-400/90 font-mono flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Direct Social Inquiry Valid
                  </span>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>View Showcase</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

