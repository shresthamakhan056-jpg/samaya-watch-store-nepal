import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-[#0A0A0B] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Flagship Luxury Showrooms
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100">
            Visit Our Showrooms in Nepal
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Experience our full collection in person or reach our horology consultants via official social channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Showroom 1 */}
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-amber-100">Durbar Marg Flagship Showroom</h3>
            <p className="text-xs text-zinc-300">Opposite Annapurna Hotel, Durbar Marg, Kathmandu, Nepal</p>
            
            <div className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+977 9823680863 (WhatsApp / Call)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Kalpa9761@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Sunday - Friday: 10:00 AM - 7:30 PM</span>
              </div>
            </div>
          </div>

          {/* Showroom 2 */}
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-amber-100">Jhamsikhel Showroom & Service Lab</h3>
            <p className="text-xs text-zinc-300">Near British School, Jhamsikhel, Lalitpur, Nepal</p>
            
            <div className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+977 9823680863</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Kalpa9761@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Sunday - Friday: 10:30 AM - 7:00 PM</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
