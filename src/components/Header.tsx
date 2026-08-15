import React, { useState } from 'react';
import { ShieldCheck, Watch, ShoppingBag, Radio, Sparkles, UserCheck, Menu, X, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import kalpaLogo from '../assets/kalpa_logo.jpg';
import { TikTokIcon, InstagramIcon, FacebookIcon, resolveSocialUrl, openSocialUrl } from './SocialIcons';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminOpen,
  setIsAdminOpen
}) => {
  const { homepageContent } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tiktokUrl = resolveSocialUrl('tiktok', homepageContent.tiktokLink);
  const instagramUrl = resolveSocialUrl('instagram', homepageContent.instagramLink);
  const facebookUrl = resolveSocialUrl('facebook', homepageContent.facebookLink);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'promotions', label: 'Promotions' },
    { id: 'warranty', label: 'Warranty Verification', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-amber-500/20 text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 py-1.5 px-4 text-xs border-b border-amber-500/20 text-amber-200/90 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          {homepageContent.showroomNotice}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => { setActiveTab('home'); setIsAdminOpen(false); }}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-xl shadow-amber-900/40 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img 
                src={kalpaLogo} 
                alt="कल्प Official Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/kalpa_logo.jpg'; }}
              />
            </div>
            <div>
              <div className="font-serif text-2xl tracking-wider text-amber-100 font-bold flex items-center gap-2">
                {(!homepageContent.brandTitle || homepageContent.brandTitle.includes('समय') || homepageContent.brandTitle.includes('SAMAYA') || homepageContent.brandTitle.includes('PREMIUM')) ? 'कल्प' : homepageContent.brandTitle} {homepageContent.brandSubtitle ? <span className="text-amber-500 text-xs px-1.5 py-0.5 border border-amber-500/40 rounded bg-amber-500/10">{homepageContent.brandSubtitle}</span> : null}
              </div>
              <div className="text-[10px] tracking-widest text-amber-400/80 uppercase font-light">
                {homepageContent.locationSubtitle || 'EXCLUSIVELY SERVING NEPAL'}
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsAdminOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  !isAdminOpen && activeTab === item.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                    : item.highlight
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30'
                    : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.id === 'warranty' && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Right Controls / Admin Portal Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Social quick icons */}
            <div className="flex items-center gap-2 border-r border-amber-500/20 pr-3 mr-1">
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openSocialUrl(tiktokUrl, e)}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-black hover:border-pink-500/50 transition-all shadow-sm group cursor-pointer"
                title="Follow us on TikTok (@kalpa9741)"
              >
                <TikTokIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openSocialUrl(instagramUrl, e)}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-pink-400 hover:border-pink-500/50 hover:bg-gradient-to-tr hover:from-amber-500/20 hover:to-pink-500/20 transition-all shadow-sm group cursor-pointer"
                title="Follow us on Instagram (@kalpa_watch)"
              >
                <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openSocialUrl(facebookUrl, e)}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-950/40 transition-all shadow-sm group cursor-pointer"
                title="Visit our Facebook Page"
              >
                <FacebookIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>

            {/* Admin Switcher Button */}
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isAdminOpen
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900 text-amber-400 border border-amber-500/40 hover:bg-amber-500/10'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{isAdminOpen ? 'Store Showroom' : 'ERP Admin Portal'}</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30"
            >
              {isAdminOpen ? 'Showroom' : 'ERP Admin'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0B] border-b border-amber-500/20 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsAdminOpen(false);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  !isAdminOpen && activeTab === item.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.id === 'warranty' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                  {item.label}
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Social Links */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-center gap-3">
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openSocialUrl(tiktokUrl, e)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white cursor-pointer"
            >
              <TikTokIcon className="w-4 h-4" />
              <span>TikTok</span>
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openSocialUrl(instagramUrl, e)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-pink-400 cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openSocialUrl(facebookUrl, e)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-blue-400 cursor-pointer"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
