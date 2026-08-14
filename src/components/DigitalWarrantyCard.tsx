import React, { useRef } from 'react';
import { ShieldCheck, Watch, Calendar, QrCode, User, Phone, FileText, Download, Printer, CheckCircle, AlertTriangle, Clock, Wrench, Sparkles, Building2, MessageSquare } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Warranty } from '../types';
import { formatWarrantyCertificateMessage, openWhatsApp } from '../utils/whatsappService';

interface DigitalWarrantyCardProps {
  warranty: Warranty;
  onPrint?: () => void;
}

export const DigitalWarrantyCard: React.FC<DigitalWarrantyCardProps> = ({ warranty }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate remaining days
  const today = new Date();
  const endDate = new Date(warranty.warrantyEnd);
  const diffTime = endDate.getTime() - today.getTime();
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const msg = formatWarrantyCertificateMessage(warranty);
    openWhatsApp(warranty.customerMobile, msg);
  };

  return (
    <div className="space-y-6">
      {/* Action buttons (Print / Download / WhatsApp) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-amber-400 font-bold">Verified Warranty Record</span>
          <span className="text-xs text-zinc-500">• Single Source of Truth from ERP Sales</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSendWhatsApp}
            className="px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-sm"
            title="Send Verified Guarantee to Registered Mobile Number via WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Send to Customer WhatsApp</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Warranty Card</span>
          </button>
        </div>
      </div>

      {/* LUXURY DIGITAL WARRANTY CARD */}
      <div
        ref={cardRef}
        className="relative bg-gradient-to-br from-[#0F0F12] via-[#141419] to-[#0A0A0B] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-white overflow-hidden"
      >
        {/* Background Hologram Graphic Effect */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header: Store Logo & Status Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-amber-500/30 gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-lg shadow-amber-900/40 flex items-center justify-center">
              <div className="w-full h-full bg-[#0A0A0B] rounded-[14px] flex items-center justify-center">
                <Watch className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-amber-100 tracking-widest uppercase">
                समय- THE WATCH <span className="text-amber-500">STORE</span>
              </div>
              <div className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase">
                OFFICIAL DIGITAL GUARANTEE CERTIFICATE
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-2 shadow-lg ${
              warranty.status === 'Active' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' :
              warranty.status === 'Expired' ? 'bg-amber-950/80 text-amber-300 border-amber-500/50' :
              'bg-rose-950/80 text-rose-300 border-rose-500/50'
            }`}>
              {warranty.status === 'Active' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
              <span>{warranty.status} Warranty</span>
            </div>
          </div>
        </div>

        {/* Card Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 relative z-10">
          
          {/* Left Details: Customer & Invoice */}
          <div className="space-y-4 lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/90 block mb-1">
                  Warranty ID
                </span>
                <span className="font-mono text-base font-bold text-amber-200">
                  {warranty.id}
                </span>
              </div>

              <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/90 block mb-1">
                  Invoice Number
                </span>
                <span className="font-mono text-base font-bold text-zinc-200">
                  {warranty.invoiceNumber}
                </span>
              </div>

              <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/90 block mb-1">
                  Customer Name & Mobile
                </span>
                <span className="font-semibold text-sm text-zinc-100 block">
                  {warranty.customerName}
                </span>
                <span className="font-mono text-xs text-amber-300/90">
                  {warranty.customerMobile}
                </span>
              </div>

              <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/90 block mb-1">
                  Authorized Dealer Boutique
                </span>
                <span className="text-xs text-zinc-200 font-medium">
                  {warranty.dealerName}
                </span>
              </div>

            </div>

            {/* Watch Spec Banner */}
            <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Timepiece Specifications
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Serial No: <strong className="text-amber-300">{warranty.serialNumber}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Brand</span>
                  <span className="font-bold text-amber-100 text-sm">{warranty.productBrand}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Model</span>
                  <span className="font-semibold text-zinc-200">{warranty.productModel}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Dial / Case</span>
                  <span className="text-zinc-300">{warranty.dialColor}</span>
                </div>
              </div>
            </div>

            {/* Warranty Period Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-zinc-950/90 p-4 rounded-xl border border-zinc-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Valid From (Sales Date)</span>
                <span className="font-mono text-xs font-bold text-zinc-200">{warranty.warrantyStart}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Expiry Date</span>
                <span className="font-mono text-xs font-bold text-amber-300">{warranty.warrantyEnd}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Remaining Warranty</span>
                <span className={`font-mono text-sm font-bold ${remainingDays > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {remainingDays > 0 ? `${remainingDays} Days Left` : 'Warranty Expired'}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: QR CODE & Security Seal */}
          <div className="bg-zinc-950 p-6 rounded-2xl border border-amber-500/30 flex flex-col items-center justify-between text-center space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              Instant QR Verification
            </span>

            {/* QR Code SVG */}
            <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-amber-400 inline-block">
              <QRCodeSVG
                value={warranty.qrCodeUrl || `https://samaya-watch-store-nepal.ai.studio/warranty?code=${warranty.id}`}
                size={140}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
              />
            </div>

            <div className="text-[11px] font-mono text-zinc-400 leading-tight">
              Scan QR code with smartphone camera to open live verification portal.
            </div>

            <div className="pt-2 border-t border-zinc-800 w-full text-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-amber-400/90">
                <Sparkles className="w-3 h-3" />
                Immutable Digital Seal
              </span>
            </div>
          </div>

        </div>

        {/* SERVICE HISTORY SECTION */}
        <div className="mt-8 pt-6 border-t border-amber-500/20 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-200">
              Boutique Service & Inspection History ({warranty.serviceHistory?.length || 0})
            </h4>
          </div>

          {!warranty.serviceHistory || warranty.serviceHistory.length === 0 ? (
            <div className="bg-zinc-950/60 rounded-xl p-4 text-center border border-zinc-800 text-xs text-zinc-500 font-mono">
              No repair or maintenance service recorded yet. Watch is in pristine factory condition.
            </div>
          ) : (
            <div className="space-y-3">
              {warranty.serviceHistory.map((srv) => (
                <div key={srv.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-amber-400">
                    <span>Date: {srv.serviceDate}</span>
                    <span>Technician: {srv.technician}</span>
                  </div>
                  <div className="font-semibold text-zinc-200">Issue/Inspection: {srv.issue}</div>
                  <div className="text-zinc-400">Action: {srv.repairDetails}</div>
                  {srv.remarks && <div className="text-amber-200/80 italic text-[11px]">Note: {srv.remarks}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WARRANTY TERMS & CONDITIONS (घडी वारेन्टीका सर्तहरू) */}
        <div className="mt-8 pt-6 border-t border-amber-500/30 relative z-10 bg-zinc-950/80 p-5 sm:p-6 rounded-2xl border border-amber-500/20 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
            <FileText className="w-4 h-4 text-amber-400" />
            <h4 className="font-serif text-base font-bold text-amber-200 tracking-wide">
              घडी वारेन्टीका सर्तहरू (Terms & Conditions)
            </h4>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                १
              </span>
              <span className="pt-0.5">वारेन्टी खरिद मितिदेखि लागू हुनेछ।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                २
              </span>
              <span className="pt-0.5">ग्लास, स्ट्र्याप, ब्याट्री, क्राउन (नब), बटन, केस तथा सामान्य घिसावट मा वारेन्टी लागू हुने छैन।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                ३
              </span>
              <span className="pt-0.5">लडेको, ठोक्किएको, च्यापिएको, फुटेको वा बाहिरी क्षतिमा वारेन्टी लागू हुने छैन।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                ४
              </span>
              <span className="pt-0.5">पानी, आगो, रसायन, अत्यधिक गर्मी वा चिसोबाट भएको क्षति वारेन्टीमा समावेश हुने छैन।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                ५
              </span>
              <span className="pt-0.5">अन्यत्र मर्मत वा खोलिएको घडीको वारेन्टी स्वतः रद्द हुनेछ।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                ६
              </span>
              <span className="pt-0.5">वारेन्टी अन्तर्गत आवश्यक परे मर्मत (Service) मात्र गरिनेछ। नयाँ घडी साटिने छैन।</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                ७
              </span>
              <span className="pt-0.5">ग्राहकको लापरवाही वा गलत प्रयोगबाट भएको क्षतिमा वारेन्टी लागू हुने छैन।</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
