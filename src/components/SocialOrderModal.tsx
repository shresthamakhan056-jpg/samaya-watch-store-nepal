import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Phone, Send, ArrowUpRight, ShieldCheck, Watch } from 'lucide-react';
import { Product } from '../types';

interface SocialOrderModalProps {
  product: Product | null;
  onClose: () => void;
}

export const SocialOrderModal: React.FC<SocialOrderModalProps> = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const orderMessage = `Namaste! I would like to inquire/order the following watch from Premium Watch Store Nepal:\n\nBrand: ${product.brand}\nModel: ${product.model}\nSKU: ${product.sku}\nDial/Case: ${product.dialColor} (${product.caseSize})\nWarranty: ${product.warrantyMonths} Months Digital QR Warranty\n\nPlease inform availability and delivery timeline. Thank you!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedMsg = encodeURIComponent(orderMessage);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-lg w-full text-white shadow-2xl p-6 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full bg-zinc-900 border border-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Watch className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">Direct Order Inquiry</span>
            <h3 className="font-serif text-xl font-bold text-amber-100">{product.brand} {product.model}</h3>
            <p className="text-xs text-zinc-400">Digital QR Warranty: <span className="text-amber-300 font-bold font-mono">{product.warrantyMonths} Months</span></p>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200/90 mb-5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            We do not accept website checkouts. Tap any social channel below to message our official sales team directly with your order inquiry!
          </div>
        </div>

        {/* Watch Quick Summary */}
        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800/80 mb-5 flex gap-3 items-center">
          <img src={product.images[0]} alt={product.model} className="w-16 h-16 rounded-lg object-cover border border-amber-500/20 bg-black" />
          <div className="text-xs space-y-0.5">
            <div className="text-amber-400 font-bold uppercase">{product.brand}</div>
            <div className="text-zinc-200 font-semibold">{product.model}</div>
            <div className="text-zinc-400 font-mono text-[11px]">{product.movement} • {product.caseSize} • {product.warrantyMonths} Months Warranty</div>
          </div>
        </div>

        {/* Pre-filled Order Message Copy Box */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-300">Generated Inquiry Details:</label>
            <button
              onClick={copyToClipboard}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={orderMessage}
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-300 focus:outline-none resize-none"
          />
        </div>

        {/* Social Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={`https://wa.me/9779851012345?text=${encodedMsg}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">📱 Order via WhatsApp (+977-9851012345)</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-500/50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">🎵 Order via TikTok (@watchstorenepal_official)</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-900 via-pink-900 to-rose-900 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">📸 Order via Instagram (@premiumwatchstore.nepal)</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">💬 Order via Facebook Messenger</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
