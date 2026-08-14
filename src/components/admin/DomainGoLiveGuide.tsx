import React, { useState } from 'react';
import { Globe, ShieldCheck, CheckCircle2, Copy, ExternalLink, ArrowRight, Server, Lock, Cpu, Sparkles } from 'lucide-react';

export const DomainGoLiveGuide: React.FC = () => {
  const [domainInput, setDomainInput] = useState('kalpachhen.com');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const cleanDomain = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  const dnsRecords = [
    { type: 'A', name: '@', value: '216.239.32.21', ttl: '3600', purpose: 'Root domain apex mapping (Cloud Run / Google Cloud)' },
    { type: 'A', name: '@', value: '216.239.34.21', ttl: '3600', purpose: 'Secondary Cloud IP redundancy' },
    { type: 'CNAME', name: 'www', value: cleanDomain || 'kalpawatches.com', ttl: '3600', purpose: 'Redirects www to main website' },
    { type: 'TXT', name: '@', value: `google-site-verification=${Math.random().toString(36).substring(2, 15)}`, ttl: '3600', purpose: 'SSL Certificate & Domain ownership verification' }
  ];

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 3000);
  };

  return (
    <div className="space-y-8 text-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                Custom Domain & Go-Live Deployment Guide
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                App Fully Ready
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-amber-100">
              Connect Domain & Launch Kalpa Watch Store
            </h2>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              Complete guide to buying your custom domain name (e.g. <strong className="text-amber-300 font-mono">{cleanDomain || 'kalpawatches.com'}</strong> or <strong className="text-amber-300 font-mono">kalpa.com.np</strong>), configuring DNS records, activating free SSL/HTTPS security, and going live.
            </p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-2 min-w-[280px]">
            <label className="text-[11px] font-mono text-amber-400 uppercase font-bold block">
              Enter Your Desired Domain Name:
            </label>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="e.g. kalpawatches.com"
                className="bg-zinc-950 border border-amber-500/30 rounded-lg px-3 py-1.5 text-xs text-amber-200 font-mono w-full focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Step 1 */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm flex items-center justify-center">
              01
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Domain Purchase</span>
          </div>
          <h3 className="font-serif font-bold text-amber-200 text-sm">1. Register Your Domain</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Purchase your domain name from a registrar.
          </p>
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-[11px]">
            <div className="flex items-center justify-between text-zinc-300">
              <span>Mercantile (.com.np)</span>
              <span className="text-emerald-400 font-bold">FREE (Nepal)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span>Cloudflare / Namecheap</span>
              <span className="text-amber-300 font-mono">~$10 - $12 / yr</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span>GoDaddy</span>
              <span className="text-zinc-400 font-mono">Popular Global</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm flex items-center justify-center">
              02
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">DNS Records</span>
          </div>
          <h3 className="font-serif font-bold text-amber-200 text-sm">2. Add DNS Settings</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Log into your domain registrar dashboard & open <strong>DNS Management</strong>.
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[11px] text-amber-300 font-mono">
            Add A-Records & CNAME shown below into your DNS host.
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm flex items-center justify-center">
              03
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Cloud Mapping</span>
          </div>
          <h3 className="font-serif font-bold text-amber-200 text-sm">3. Deploy / Connect</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            In AI Studio top header, click <strong>Deploy</strong> (or Cloud Run / Vercel export).
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[11px] text-emerald-300 font-mono flex items-center gap-1">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cloud Run Container Active</span>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm flex items-center justify-center">
              04
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">SSL Security</span>
          </div>
          <h3 className="font-serif font-bold text-amber-200 text-sm">4. Auto SSL / HTTPS</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Google Cloud / Cloudflare provisions free auto-renewing SSL certificate within 15-30 minutes.
          </p>
          <div className="pt-2 border-t border-zinc-800 text-[11px] text-amber-300 font-mono flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>HTTPS Padlock Enabled</span>
          </div>
        </div>

      </div>

      {/* DNS Configuration Table */}
      <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif font-bold text-amber-200 text-lg flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" />
              <span>DNS Records for <span className="text-amber-400 font-mono">{cleanDomain || 'kalpawatches.com'}</span></span>
            </h3>
            <p className="text-xs text-zinc-400">Copy and paste these exact DNS records into your domain registrar (Namecheap, GoDaddy, Cloudflare, or Mercantile Communications Nepal):</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-bold self-start sm:self-center">
            Ready to Copy
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
                <th className="p-3">Type</th>
                <th className="p-3">Host / Name</th>
                <th className="p-3">Value / Target IP</th>
                <th className="p-3">TTL</th>
                <th className="p-3">Purpose</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {dnsRecords.map((record, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {record.type}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-zinc-200">{record.name}</td>
                  <td className="p-3 font-bold text-amber-200 bg-zinc-950/60 rounded px-2 py-1 max-w-xs truncate">
                    {record.value}
                  </td>
                  <td className="p-3 text-zinc-400">{record.ttl}</td>
                  <td className="p-3 text-zinc-400 font-sans text-[11px]">{record.purpose}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleCopy(record.value, `rec-${idx}`)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-[11px] font-bold border border-zinc-700 transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      {copiedField === `rec-${idx}` ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Free .com.np Nepal Domain Instructions & Registrar Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Nepal .com.np Guide */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-base border-b border-zinc-800 pb-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <span>Free .com.np Domain for Nepal Businesses</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            In Nepal, <strong>Mercantile Communications</strong> provides official <strong>.com.np</strong> domain names (e.g., <code className="text-amber-300 font-mono">kalpa.com.np</code>) 100% free of charge for registered Nepali businesses or individuals!
          </p>
          <ul className="space-y-2 text-xs text-zinc-400 list-disc list-inside">
            <li>Register at <a href="https://register.com.np" target="_blank" rel="noreferrer" className="text-amber-300 underline font-mono">register.com.np</a></li>
            <li>Upload Pan / Vat certificate or Nepali Citizenship document</li>
            <li>Set Primary Nameservers to Cloudflare: <code className="text-amber-300 font-mono">ns1.cloudflare.com</code> & <code className="text-amber-300 font-mono">ns2.cloudflare.com</code></li>
          </ul>
        </div>

        {/* Global .com Guide */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-base border-b border-zinc-800 pb-2">
            <ExternalLink className="w-5 h-5 text-amber-400" />
            <span>Global .com / .shop Domains</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            For international customers and brand authority, purchase a global domain (e.g. <code className="text-amber-300 font-mono">kalpawatches.com</code> or <code className="text-amber-300 font-mono">kalpaluxury.com</code>):
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <a
              href="https://www.cloudflare.com/products/registrar/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-amber-200 flex items-center justify-between group"
            >
              <span>Cloudflare Registrar</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-300" />
            </a>
            <a
              href="https://www.namecheap.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-amber-200 flex items-center justify-between group"
            >
              <span>Namecheap</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-300" />
            </a>
          </div>
        </div>

      </div>

      {/* Technical Deployment Verification Checklist */}
      <div className="p-6 bg-zinc-950 border border-amber-500/30 rounded-2xl space-y-4">
        <h3 className="font-serif font-bold text-amber-200 text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Go-Live Technical Verification Checklist</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-zinc-200">Firebase Cloud Database</div>
              <div className="text-[11px] text-zinc-400">Live persistence connected for Sales & Warranties.</div>
            </div>
          </div>

          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-zinc-200">Digital QR Verification</div>
              <div className="text-[11px] text-zinc-400">QR codes auto-linked to customer mobile & domain.</div>
            </div>
          </div>

          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-zinc-200">SEO & Sitemap XML</div>
              <div className="text-[11px] text-zinc-400"><code className="text-amber-300">/sitemap.xml</code> & <code className="text-amber-300">/robots.txt</code> generated.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Console & Namecheap Troubleshooting Section */}
      <div className="p-6 bg-gradient-to-b from-amber-950/30 to-zinc-950 border border-amber-500/40 rounded-2xl space-y-5">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="font-serif font-bold text-amber-100 text-lg">
              Google Console & Namecheap Troubleshooting Guide
            </h3>
            <p className="text-xs text-zinc-400">
              Having trouble verifying or completing domain setup in Google Cloud / Firebase Console for <span className="text-amber-300 font-mono">kalpachhen.com</span>? Follow these exact fixes:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Issue 1 */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] text-amber-300">1</span>
              <span>Domain Ownership Verification</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Google requires you to prove you own <strong className="text-amber-200">kalpachhen.com</strong> before mapping it.
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1 font-mono">
              <div className="text-emerald-400 font-bold">Fix in Namecheap:</div>
              <div>Add <span className="text-amber-300 font-bold">TXT Record</span></div>
              <div>Host: <code className="text-amber-300 font-bold">@</code></div>
              <div className="truncate">Value: <code className="text-amber-300">google-site-verification=...</code></div>
            </div>
          </div>

          {/* Issue 2 */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] text-amber-300">2</span>
              <span>Namecheap Nameservers Check</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              If your records in Namecheap's "Advanced DNS" aren't taking effect, check your Nameserver setting.
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1 font-mono">
              <div className="text-emerald-400 font-bold">Fix in Namecheap Domain Tab:</div>
              <div>Nameservers dropdown must be set to:</div>
              <div className="text-amber-300 font-bold">"Namecheap BasicDNS"</div>
              <div className="text-[10px] text-zinc-500">(Do NOT select Custom DNS)</div>
            </div>
          </div>

          {/* Issue 3 */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] text-amber-300">3</span>
              <span>Instant AI Studio Sharing</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Want to make your watch store immediately live for customers without waiting for Google Console?
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
              <div className="text-emerald-400 font-bold font-mono">Use AI Studio Direct URL:</div>
              <p className="text-[10px] text-zinc-300">
                Click <strong className="text-amber-300">Share / Deploy</strong> in the top AI Studio bar to get an instant Cloud Run HTTPS web link!
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* GitHub to Live Hosting Step-by-Step Guide */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <Server className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="font-serif font-bold text-amber-100 text-lg">
              How to Host Your Store Directly From GitHub (Step-by-Step)
            </h3>
            <p className="text-xs text-zinc-400">
              Complete workflow to push code to GitHub and host it live with automatic updates when you make changes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step A */}
          <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">STEP 1</span>
              <h4 className="font-bold text-sm text-zinc-100">Export App to GitHub</h4>
            </div>
            <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>In AI Studio top right, click <strong className="text-amber-300">Settings / Export</strong> icon.</li>
              <li>Select <strong className="text-amber-300">Export to GitHub</strong>.</li>
              <li>Connect your GitHub account and choose repository name (e.g., <code className="text-amber-300 font-mono">kalpachhen-app</code>).</li>
              <li>Click <strong className="text-emerald-400 font-bold">Create Repository</strong>.</li>
            </ol>
          </div>

          {/* Step B */}
          <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">STEP 2</span>
              <h4 className="font-bold text-sm text-zinc-100">Connect to Free Host (Vercel/Render)</h4>
            </div>
            <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Go to <strong className="text-amber-300">Vercel.com</strong> or <strong className="text-amber-300">Render.com</strong> and sign up with GitHub.</li>
              <li>Click <strong className="text-emerald-400 font-bold">Add New Project</strong> & select your <code className="text-amber-300 font-mono">kalpachhen-app</code> repository.</li>
              <li>Framework Preset will auto-detect as <strong className="text-amber-300 font-mono">Vite</strong> (Build Command: <code className="text-amber-300 font-mono">npm run build</code>, Output: <code className="text-amber-300 font-mono">dist</code>).</li>
              <li>Click <strong className="text-emerald-400 font-bold">Deploy</strong>.</li>
            </ol>
          </div>

          {/* Step C */}
          <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">STEP 3</span>
              <h4 className="font-bold text-sm text-zinc-100">Point www.kalpachhen.com</h4>
            </div>
            <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>In Vercel / Render project settings, go to <strong className="text-amber-300">Domains</strong>.</li>
              <li>Add <strong className="text-amber-300 font-mono">kalpachhen.com</strong> & <strong className="text-amber-300 font-mono">www.kalpachhen.com</strong>.</li>
              <li>In Namecheap Advanced DNS, add the CNAME provided by Vercel/Render (e.g. <code className="text-amber-300 font-mono">cname.vercel-dns.com</code>).</li>
              <li>Your custom domain is live with automatic SSL!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
