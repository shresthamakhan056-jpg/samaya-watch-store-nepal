import React from 'react';
import { ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import kalpaLogo from '../assets/kalpa_logo.jpg';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setIsAdminOpen: (open: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ setIsAdminOpen }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-10 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0 border border-slate-700">
                <img src={kalpaLogo} alt="कल्प Logo" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/kalpa_logo.jpg'; }} />
              </div>
              <span className="font-serif text-xl tracking-wide text-white font-bold uppercase">
                कल्प <span className="text-amber-400 font-sans text-xs">• DIGITAL WARRANTY SYSTEM</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Nepal’s official luxury timepiece digital warranty verification portal. Verifying authentic Swiss & international watch serial numbers, sales dates, and digital certificates.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verifiable Single Source of Truth ERP Database</span>
            </div>
          </div>

          {/* Col 2: Showroom & Official Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-300 font-sans mb-3 border-b border-slate-800 pb-2 inline-block">
              Showroom & Verification Support
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Durbar Marg Flagship Boutique, Opposite Annapurna Hotel, Kathmandu.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span>📍 Location: Durbar Marg, Kathmandu</span>
                <span className="text-emerald-400 font-mono">Open 10 AM - 7:30 PM</span>
              </div>
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span>📞 Hotline: +977 9851234567</span>
                <span className="text-amber-300 font-mono">WhatsApp Support</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 कल्प • Digital QR Warranty Engine. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <span>Warranty Terms</span>
            <span>Authenticity Protocol</span>
            <span>Showroom Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
