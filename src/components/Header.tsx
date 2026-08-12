import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Menu, X, UserCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import kalpaLogo from '../assets/kalpa_logo.jpg';

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

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'warranty', label: 'Warranty Verification', highlight: true },
    { id: 'promotions', label: 'Promotions' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Top Banner Notice - Light Professional Bar */}
      <div className="bg-slate-900 py-1.5 px-4 text-xs text-slate-200 text-center flex items-center justify-center gap-2 font-sans border-b border-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-medium tracking-wide">
          {homepageContent.showroomNotice || 'Official Digital Warranty Verification Portal • Durbar Marg, Kathmandu'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button 
            onClick={() => { setActiveTab('home'); setIsAdminOpen(false); }}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900 p-0.5 shadow-md border border-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img 
                src={kalpaLogo} 
                alt="कल्प Official Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/kalpa_logo.jpg'; }}
              />
            </div>
            <div>
              <div className="font-serif text-2xl tracking-tight text-slate-900 font-bold flex items-center gap-2">
                {(!homepageContent.brandTitle || homepageContent.brandTitle.includes('समय') || homepageContent.brandTitle.includes('SAMAYA') || homepageContent.brandTitle.includes('PREMIUM')) ? 'कल्प' : homepageContent.brandTitle}
                <span className="text-amber-700 text-xs px-2 py-0.5 border border-amber-300 rounded-md bg-amber-50 font-sans font-semibold">
                  WARRANTY PORTAL
                </span>
              </div>
              <div className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold font-sans">
                {homepageContent.locationSubtitle || 'OFFICIAL TIMEPIECE VERIFICATION ENGINE'}
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsAdminOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  !isAdminOpen && activeTab === item.id
                    ? 'bg-slate-900 text-amber-300 shadow-sm'
                    : item.highlight
                    ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.id === 'warranty' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Right Controls / Admin Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
                setIsAdminOpen(!isAdminOpen);
                if (!isAdminOpen) setActiveTab('admin');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 ${
                isAdminOpen
                  ? 'bg-slate-900 text-amber-300 border-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isAdminOpen ? 'Storefront' : 'ERP Portal'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsAdminOpen(false);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-between ${
                activeTab === item.id && !isAdminOpen
                  ? 'bg-slate-900 text-amber-300'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                {item.id === 'warranty' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                {item.label}
              </span>
            </button>
          ))}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                setIsAdminOpen(!isAdminOpen);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Switch to ERP Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
