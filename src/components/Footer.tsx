import React, { useState } from 'react';
import { ShieldCheck, ArrowUpRight, X, FileText } from 'lucide-react';
import kalpaLogo from '../assets/kalpa_logo.jpg';
import { useApp } from '../context/AppContext';
import { FooterLinkItem } from '../types';
import { TikTokIcon, InstagramIcon, FacebookIcon, OFFICIAL_TIKTOK_URL, OFFICIAL_INSTAGRAM_URL, OFFICIAL_FACEBOOK_URL } from './SocialIcons';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setIsAdminOpen: (open: boolean) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const { homepageContent } = useApp();
  const [activeModalLink, setActiveModalLink] = useState<FooterLinkItem | null>(null);

  const activeLinks = (homepageContent.footerLinks || []).filter(link => link.active);

  const brandDescription = homepageContent.footerBrandDescription ?? 
    'Nepal’s leading luxury timepiece importer & digital warranty pioneer. Specializing in Rolex, Omega, Patek Philippe, Tissot, and Audemars Piguet with verified digital certificates.';

  const copyrightText = homepageContent.footerCopyrightText ?? 
    '© 2026 कल्प • Kalpa Luxury Timepieces. All Rights Reserved. Built with Automated ERP & Digital QR Warranty Engine.';

  return (
    <footer className="bg-[#050506] text-zinc-400 border-t border-amber-500/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-800 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                <img src={kalpaLogo} alt="कल्प Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/kalpa_logo.jpg'; }} />
              </div>
              <span className="font-serif text-xl tracking-wider text-amber-100 font-bold uppercase">
                कल्प <span className="text-amber-500">• LUXURY TIMEPIECES</span>
              </span>
            </div>
            
            {brandDescription && (
              <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                {brandDescription}
              </p>
            )}

            <div className="pt-2 flex items-center gap-3 text-xs text-amber-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Single Source of Truth ERP & QR Warranty Verification</span>
            </div>
          </div>

          {/* Col 2: Order Channels */}
          <div>
            <h4 className="text-sm font-serif uppercase tracking-widest text-amber-200 font-semibold mb-4 border-b border-amber-500/20 pb-2 inline-block">
              Official Order Channels
            </h4>
            <p className="text-xs text-zinc-400 mb-4">
              We do not sell through direct online checkout. Please contact our official channels:
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={homepageContent.tiktokLink || OFFICIAL_TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-pink-500/40 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-pink-500/50 group-hover:text-white transition-colors">
                      <TikTokIcon className="w-3.5 h-3.5" />
                    </span>
                    <span>TikTok (@kalpa9741)</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href={homepageContent.instagramLink || OFFICIAL_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-pink-500/40 hover:bg-zinc-900 text-zinc-300 hover:text-pink-300 transition-all group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-pink-500/50 group-hover:text-pink-400 transition-colors">
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </span>
                    <span>Instagram (@kalpa_watch)</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href={homepageContent.facebookLink || OFFICIAL_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-blue-500/40 hover:bg-zinc-900 text-zinc-300 hover:text-blue-300 transition-all group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors">
                      <FacebookIcon className="w-3.5 h-3.5" />
                    </span>
                    <span>Facebook Page (कल्प Luxury)</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and dynamic policy links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          {copyrightText && (
            <div>
              {copyrightText}
            </div>
          )}

          {activeLinks.length > 0 && (
            <div className="flex flex-wrap gap-4 items-center">
              {activeLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.url) {
                      window.open(link.url, '_blank');
                    } else {
                      setActiveModalLink(link);
                    }
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer underline-offset-4 hover:underline"
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POLICY / GUIDE OVERLAY MODAL */}
      {activeModalLink && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-amber-100">
                  {activeModalLink.label}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalLink(null)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 font-sans max-h-96 overflow-y-auto pr-2">
              <p>
                {activeModalLink.content || 'No detailed content provided for this policy.'}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex justify-end">
              <button
                onClick={() => setActiveModalLink(null)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
