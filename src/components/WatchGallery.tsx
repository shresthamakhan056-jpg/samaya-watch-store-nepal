import React, { useState } from 'react';
import { Search, Filter, Grid, LayoutList, Video, ArrowRight, ShieldCheck, Sparkles, Watch as WatchIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, MovementType, Gender } from '../types';

interface WatchGalleryProps {
  onOrderWatch: (product: Product) => void;
}

export const WatchGallery: React.FC<WatchGalleryProps> = ({ onOrderWatch }) => {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedMovement, setSelectedMovement] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'cards' | 'video'>('grid');

  const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];
  const movements = ['All', 'Co-Axial Automatic', 'Automatic', 'Manual Wind', 'Quartz', 'Smartwatch'];
  const genders = ['All', 'Men', 'Women', 'Unisex'];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.dialColor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    const matchesMovement = selectedMovement === 'All' || p.movement === selectedMovement;
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender;

    return matchesSearch && matchesBrand && matchesMovement && matchesGender;
  });

  return (
    <div className="bg-[#0A0A0B] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Gallery Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono uppercase tracking-widest border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Catalogue • Nepal Importer</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100">
            The Masterpiece Watch Gallery
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Browse certified luxury timepieces. All sales generate an immutable Digital QR Warranty Card upon order approval.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-4 space-y-4 shadow-xl">
          {/* Top row search & view switcher */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search brand, model, SKU or dial color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid' ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Grid</span>
              </button>

              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'cards' ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Bottom row filter tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80">
            <div>
              <label className="text-[11px] text-amber-400/90 font-mono uppercase block mb-1">Brand:</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
              >
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-amber-400/90 font-mono uppercase block mb-1">Movement:</label>
              <select
                value={selectedMovement}
                onChange={(e) => setSelectedMovement(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
              >
                {movements.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-amber-400/90 font-mono uppercase block mb-1">Gender:</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
              >
                {genders.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>Showing {filteredProducts.length} Timepieces</span>
          <span className="text-amber-400">Order Channel: TikTok / IG / FB / WhatsApp</span>
        </div>

        {/* Gallery Views */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <WatchIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-zinc-300">No timepieces match your criteria</h3>
            <p className="text-xs text-zinc-500 mt-1">Try clearing filters or searching another model.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((watch) => (
              <div
                key={watch.id}
                className="bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-amber-500/50 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black mb-3">
                    <img
                      src={watch.images[0]}
                      alt={watch.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow ${
                        watch.status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        watch.status === 'Low Stock' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {watch.status} ({watch.stock})
                      </span>
                    </div>

                    <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur border border-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded">
                      SKU: {watch.sku}
                    </span>
                  </div>

                  <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                    {watch.brand} • {watch.collection}
                  </div>
                  <h3 className="font-serif text-base font-bold text-zinc-100 line-clamp-1 mb-1">
                    {watch.model}
                  </h3>

                  <div className="text-xs text-zinc-400 space-y-1 mb-3">
                    <div>Dial: <span className="text-zinc-200">{watch.dialColor}</span></div>
                    <div>Movement: <span className="text-zinc-200">{watch.movement}</span></div>
                    <div>Case: <span className="text-zinc-200">{watch.caseMaterial} ({watch.caseSize})</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Digital QR Warranty:</span>
                    <span className="text-amber-400 font-bold">
                      {watch.warrantyMonths} Months
                    </span>
                  </div>

                  <button
                    onClick={() => onOrderWatch(watch)}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow hover:shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Order via TikTok / IG / FB</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-4">
            {filteredProducts.map((watch) => (
              <div
                key={watch.id}
                className="bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-amber-500/50 p-4 transition-all flex flex-col md:flex-row gap-6 items-center justify-between"
              >
                <div className="flex items-center gap-4 w-full md:w-2/3">
                  <img
                    src={watch.images[0]}
                    alt={watch.model}
                    className="w-24 h-24 rounded-xl object-cover border border-amber-500/30 bg-black shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                      {watch.brand} • {watch.collection}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-zinc-100">
                      {watch.model}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {watch.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono pt-1">
                      <span>Dial: {watch.dialColor}</span>
                      <span>•</span>
                      <span>{watch.movement}</span>
                      <span>•</span>
                      <span>{watch.caseSize}</span>
                      <span>•</span>
                      <span className="text-amber-300 font-bold">{watch.warrantyMonths} Months Warranty</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-1/3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800">
                  <div className="text-right">
                    <span className="text-[11px] text-zinc-400 block font-mono">Digital QR Warranty</span>
                    <span className="font-serif text-base font-bold text-amber-300">
                      Verified Authentic
                    </span>
                  </div>

                  <button
                    onClick={() => onOrderWatch(watch)}
                    className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Order via TikTok / IG / FB</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
