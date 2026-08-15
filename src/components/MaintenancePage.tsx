import React from 'react';
import { ShieldCheck, MessageSquare, Phone, Mail, Lock, Clock, Sparkles, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import kalpaLogo from '../assets/kalpa_logo.jpg';
import { openWhatsApp, OFFICIAL_BOUTIQUE_WHATSAPP } from '../utils/whatsappService';
import { TikTokIcon, InstagramIcon, FacebookIcon, OFFICIAL_TIKTOK_URL, OFFICIAL_INSTAGRAM_URL, OFFICIAL_FACEBOOK_URL } from './SocialIcons';

interface MaintenancePageProps {
  setIsAdminOpen: (open: boolean) => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ setIsAdminOpen }) => {
  const { homepageContent } = useApp();

  const handleWhatsAppContact = () => {
    openWhatsApp(
      OFFICIAL_BOUTIQUE_WHATSAPP,
      'Namaste कल्प Watch Store, I would like to inquire about watch models, current orders, or service.'
    );
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={kalpaLogo}
            alt="कल्प Logo"
            className="w-12 h-12 rounded-full border-2 border-amber-500/40 object-cover shadow-lg shadow-amber-500/20"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/kalpa_logo.jpg'; }}
          />
          <div>
            <span className="font-serif text-xl font-bold tracking-widest text-amber-100 uppercase block">
              {homepageContent.brandTitle || 'कल्प'}
            </span>
            <span className="text-[10px] font-mono text-amber-400/80 tracking-widest uppercase block">
              {homepageContent.locationSubtitle || 'EXCLUSIVELY SERVING NEPAL'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer shadow-md"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>ERP Portal Access</span>
        </button>
      </header>

      {/* Main Maintenance Hero Container */}
      <main className="relative z-10 max-w-3xl mx-auto w-full px-6 py-12 text-center space-y-8 my-auto">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase shadow-inner">
          <Clock className="w-4 h-4 animate-spin text-amber-400" style={{ animationDuration: '6s' }} />
          <span>Scheduled System Upgrades Underway</span>
        </div>

        {/* Headlines */}
        <div className="space-y-4">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-500">
            We Are Improving Your Luxury Experience
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {homepageContent.maintenanceNotice || 
              'Our digital platform is currently undergoing scheduled system enhancement. Our watch specialists and concierge support remain 100% active.'}
          </p>
        </div>

        {/* Address and Direct Contact Card */}
        <div className="bg-[#0F0F12]/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 text-left">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Direct Concierge & Sales Channels</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open for WhatsApp Inquiries
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleWhatsAppContact}
              className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all cursor-pointer group flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-mono uppercase text-emerald-400 block font-bold">Official WhatsApp</span>
                <span className="text-sm font-bold text-white block truncate">+977 9823680863</span>
                <span className="text-[11px] text-zinc-400 block">Instant watch consultation & orders</span>
              </div>
            </button>

            <a
              href="tel:+9779823680863"
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-mono uppercase text-amber-400 block font-bold">Direct Phone Line</span>
                <span className="text-sm font-bold text-white block truncate">+977 9823680863</span>
                <span className="text-[11px] text-zinc-400 block">Sunday to Friday 10:00 AM - 7:30 PM</span>
              </div>
            </a>
          </div>

          {/* Showroom Address */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center gap-3 text-xs text-zinc-300">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-200 block">Showroom Location:</span>
              <span>Address: Kathmandu, Nepal</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-zinc-800/80 text-xs">
            <span className="text-zinc-400 font-mono text-xs">Official Social Channels:</span>
            <a
              href={homepageContent.tiktokLink || OFFICIAL_TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-zinc-200 hover:text-white border border-zinc-800 hover:border-pink-500/50 transition-all font-mono flex items-center gap-2 group"
              title="Official TikTok Page"
            >
              <TikTokIcon className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white group-hover:scale-110 transition-transform" />
              <span>TikTok</span>
            </a>
            <a
              href={homepageContent.instagramLink || OFFICIAL_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-pink-400 border border-zinc-800 hover:border-pink-500/50 transition-all font-mono flex items-center gap-2 group"
              title="Official Instagram Page"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-zinc-300 group-hover:text-pink-400 group-hover:scale-110 transition-transform" />
              <span>Instagram</span>
            </a>
            <a
              href={homepageContent.facebookLink || OFFICIAL_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-blue-400 border border-zinc-800 hover:border-blue-500/50 transition-all font-mono flex items-center gap-2 group"
              title="Official Facebook Page"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-zinc-300 group-hover:text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Facebook</span>
            </a>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-zinc-500 font-mono border-t border-zinc-900 max-w-7xl mx-auto w-full">
        <p>© 2026 कल्प • Kalpa Luxury Timepieces. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
