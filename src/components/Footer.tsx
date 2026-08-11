import React from 'react';
import { Watch, ShieldCheck, ArrowUpRight } from 'lucide-react';
import kalpaLogo from '../assets/kalpa_logo.jpg';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setIsAdminOpen: (open: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ setIsAdminOpen }) => {
  return (
    <footer className="bg-[#050506] text-zinc-400 border-t border-amber-500/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-800 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                <img src={kalpaLogo} alt="कल्प Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
              </div>
              <span className="font-serif text-xl tracking-wider text-amber-100 font-bold uppercase">
                कल्प <span className="text-amber-500">• LUXURY TIMEPIECES</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              Nepal’s leading luxury timepiece importer & digital warranty pioneer. Specializing in Rolex, Omega, Patek Philippe, Tissot, and Audemars Piguet with verified digital certificates.
            </p>
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
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  <span className="flex items-center gap-2">🎵 TikTok (@watchstorenepal_official)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  <span className="flex items-center gap-2">📸 Instagram (@premiumwatchstore.nepal)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 transition-colors"
                >
                  <span className="flex items-center gap-2">💬 Facebook Messenger</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <div>
            © 2026 कल्प • Kalpa Luxury Timepiece Boutique. All Rights Reserved. Built with Automated ERP & Digital QR Warranty Engine.
          </div>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Swiss Watch Care Guide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
