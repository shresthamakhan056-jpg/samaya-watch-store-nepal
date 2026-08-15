import React, { useState, useEffect } from 'react';
import { Video, Image as ImageIcon, Plus, Trash2, ToggleLeft, ToggleRight, Sparkles, Upload, Layout, Eye, Save, CheckCircle2, MapPin, Phone, RotateCcw, FileText, Globe, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeleteVerificationModal } from './DeleteVerificationModal';
import { CMSVideo, FooterLinkItem } from '../../types';
import { compressImageFile } from '../../utils/imageCompressor';
import { TikTokIcon, InstagramIcon, FacebookIcon, OFFICIAL_TIKTOK_URL, OFFICIAL_INSTAGRAM_URL, OFFICIAL_FACEBOOK_URL, resolveSocialUrl, openSocialUrl } from '../SocialIcons';

export const MarketingCMS: React.FC = () => {
  const { videos, updateHeroVideo, banners, addBanner, toggleBannerActive, deleteBanner, homepageContent, updateHomepageContent, currentUser } = useApp();
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'video' | 'sliders'>('content');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Homepage Content Form State
  const [contentForm, setContentForm] = useState(homepageContent);
  const [saveStatus, setSaveStatus] = useState('');

  // Sync contentForm when homepageContent in context changes (e.g., from Firestore load)
  useEffect(() => {
    setContentForm(homepageContent);
  }, [homepageContent]);

  // Hero Video Form
  const currentVideo: CMSVideo = videos[0] || {
    id: 'vid-1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-luxury-watch-41551-large.mp4',
    title: 'Masterpiece Mechanics 2026 Showcase',
    slogan: 'Timeless Precision Crafted for the Connoisseur',
    active: true
  };

  const [vidUrl, setVidUrl] = useState(homepageContent.heroVideoUrl || currentVideo.videoUrl);

  // New Banner Form
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop');
  const [bannerType, setBannerType] = useState<'Slider' | 'Banner' | 'Popup'>('Slider');

  // Footer Links Handlers
  const currentFooterLinks: FooterLinkItem[] = contentForm.footerLinks || [
    {
      id: 'link-privacy',
      label: 'Privacy Policy',
      active: true,
      content: 'Kalpa Luxury Timepieces values your privacy. All customer data, purchase records, and warranty registrations are securely stored and encrypted under strict data privacy protocols in our automated ERP engine.'
    },
    {
      id: 'link-terms',
      label: 'Terms of Service',
      active: true,
      content: 'All timepieces sold by Kalpa Luxury come with verified digital QR certificates. Returns or exchanges must be presented with the original digital warranty QR code and untouched security seal within 7 days of purchase.'
    }
  ];

  const handleUpdateFooterLink = (id: string, field: keyof FooterLinkItem, value: any) => {
    const updated = currentFooterLinks.map(link => link.id === id ? { ...link, [field]: value } : link);
    setContentForm({ ...contentForm, footerLinks: updated });
  };

  const handleToggleFooterLink = (id: string) => {
    const updated = currentFooterLinks.map(link => link.id === id ? { ...link, active: !link.active } : link);
    setContentForm({ ...contentForm, footerLinks: updated });
  };

  const handleDeleteFooterLink = (id: string) => {
    const updated = currentFooterLinks.filter(link => link.id !== id);
    setContentForm({ ...contentForm, footerLinks: updated });
  };

  const handleAddFooterLink = () => {
    const newLink: FooterLinkItem = {
      id: `link-${Date.now()}`,
      label: 'New Policy / Guide',
      active: true,
      content: 'Enter detailed text for this policy or guide...'
    };
    setContentForm({ ...contentForm, footerLinks: [...currentFooterLinks, newLink] });
  };

  // Save Homepage Text Content
  const handleSaveHomepageContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageContent(contentForm);
    setSaveStatus('✅ Homepage text & settings saved live!');
    setTimeout(() => setSaveStatus(''), 5000);
  };

  const [isUploading, setIsUploading] = useState(false);

  // Video File Upload Handler - Firestore Sync + Server Upload Fallback
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        setIsUploading(false);
        return;
      }

      // 1. If video is <= 800KB, save Base64 data URL directly into Firestore cloud DB so it syncs across published links!
      if (file.size <= 800 * 1024) {
        setVidUrl(dataUrl);
        setContentForm(prev => ({ ...prev, heroVideoUrl: dataUrl }));
        updateHeroVideo({
          id: currentVideo.id || 'vid-1',
          title: 'Custom Uploaded Showcase Video',
          videoUrl: dataUrl,
          slogan: contentForm.heroHeadlineLine2,
          active: true
        });
        updateHomepageContent({ heroVideoUrl: dataUrl });
        setIsUploading(false);
        alert('🎉 Success! Your video is saved directly to Firestore Cloud Database!\n\nIt is now live and synced automatically across all devices and the published shared URL.');
        return;
      }

      // 2. If video is > 800KB, upload to server for editor preview & inform about published links
      try {
        const response = await fetch('/api/upload-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData: dataUrl,
            fileName: file.name,
            mimeType: file.type
          })
        });

        const result = await response.json();
        const hostedUrl = result.url || dataUrl;

        setVidUrl(hostedUrl);
        setContentForm(prev => ({ ...prev, heroVideoUrl: hostedUrl }));
        updateHeroVideo({
          id: currentVideo.id || 'vid-1',
          title: 'Custom Uploaded Showcase Video',
          videoUrl: hostedUrl,
          slogan: contentForm.heroHeadlineLine2,
          active: true
        });
        updateHomepageContent({ heroVideoUrl: hostedUrl });
        alert('ℹ️ Video Uploaded for Preview!\n\nNote: The published share link runs on a separate public cloud instance. Because this video file exceeds 800KB, local container files cannot cross over to the published URL.\n\n👉 For guaranteed 100% video playback on the published URL across all devices, select a smaller video (<800KB), enter a public MP4 web URL, or choose one of our 1-click Luxury Stream Presets below!');
      } catch (err) {
        console.error('Server video upload error:', err);
        setVidUrl(dataUrl);
        setContentForm(prev => ({ ...prev, heroVideoUrl: dataUrl }));
        updateHeroVideo({
          id: currentVideo.id || 'vid-1',
          title: 'Custom Uploaded Showcase Video',
          videoUrl: dataUrl,
          slogan: contentForm.heroHeadlineLine2,
          active: true
        });
        updateHomepageContent({ heroVideoUrl: dataUrl });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Video URL Update Handler
  const handleUpdateVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setContentForm(prev => ({ ...prev, heroVideoUrl: vidUrl }));
    updateHeroVideo({
      id: currentVideo.id || 'vid-1',
      title: 'Masterpiece Showcase',
      videoUrl: vidUrl,
      slogan: contentForm.heroHeadlineLine2,
      active: true
    });
    updateHomepageContent({ heroVideoUrl: vidUrl });
    alert('Hero background video URL updated live on homepage across all published links!');
  };

  // Preset Video Selection Handler
  const handleSelectPresetVideo = (presetUrl: string, presetTitle: string) => {
    setVidUrl(presetUrl);
    setContentForm(prev => ({ ...prev, heroVideoUrl: presetUrl }));
    updateHeroVideo({
      id: currentVideo.id || 'vid-1',
      title: presetTitle,
      videoUrl: presetUrl,
      slogan: contentForm.heroHeadlineLine2,
      active: true
    });
    updateHomepageContent({ heroVideoUrl: presetUrl });
    alert(`🎉 Selected "${presetTitle}"! This video stream is now live and 100% synced across both preview and published shared links!`);
  };

  // Banner Image File Upload - Direct Base64 Firestore Cloud Sync
  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1600, 1600, 0.88);
      if (compressedDataUrl) {
        setBannerImage(compressedDataUrl);
      }
    } catch (err) {
      console.error('Failed to compress banner image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle || !bannerImage) return;

    addBanner({
      title: bannerTitle,
      subtitle: bannerSubtitle,
      imageUrl: bannerImage,
      priority: banners.length + 1,
      active: true,
      type: bannerType
    });

    setShowBannerModal(false);
    setBannerTitle('');
    setBannerSubtitle('');
  };

  return (
    <div className="space-y-8 text-white">
      {/* Module Title */}
      <div className="bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Dynamic Homepage CMS & Media Manager</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Update homepage text, upload promotional videos & photo slides live in real-time synced directly to Firestore.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'content' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Homepage Content</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'video' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Stream Upload</span>
          </button>
          <button
            onClick={() => setActiveTab('sliders')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'sliders' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photo Slides ({banners.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: HOMEPAGE TEXT CONTENT CMS */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSaveHomepageContent} className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-200 flex items-center gap-2">
                <Layout className="w-5 h-5 text-amber-400" />
                <span>Text Content & Notice Bar Settings</span>
              </h3>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
              >
                <Save className="w-4 h-4" />
                <span>Save Live</span>
              </button>
            </div>

            {saveStatus && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* UNDER MAINTENANCE MODE CONFIGURATION */}
            <div className={`p-4 rounded-xl border transition-all space-y-3 ${
              contentForm.maintenanceMode 
                ? 'bg-amber-950/40 border-amber-500/60' 
                : 'bg-zinc-950/80 border-zinc-800'
            }`}>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${contentForm.maintenanceMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span className="text-zinc-100 font-serif font-bold text-sm">Under Maintenance Public Mode</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextMode = !contentForm.maintenanceMode;
                      setContentForm(prev => ({ ...prev, maintenanceMode: nextMode }));
                      updateHomepageContent({ maintenanceMode: nextMode });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${
                      contentForm.maintenanceMode 
                        ? 'bg-amber-500 text-zinc-950' 
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-700'
                    }`}
                  >
                    {contentForm.maintenanceMode ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-zinc-950" />
                        <span>Maintenance ENABLED</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-zinc-400" />
                        <span>Maintenance DISABLED (Live)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono text-xs">Custom Maintenance Notice Message (Displayed to Visitors):</label>
                <textarea
                  rows={2}
                  value={contentForm.maintenanceNotice || ''}
                  onChange={(e) => setContentForm({ ...contentForm, maintenanceNotice: e.target.value })}
                  placeholder="We are currently performing scheduled maintenance to upgrade our system. For inquiries and purchases, please contact us on WhatsApp (+977 9823680863) or social channels."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-amber-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-mono font-bold">Top Showroom Notice Bar Text:</label>
              <textarea
                rows={2}
                value={contentForm.showroomNotice}
                onChange={(e) => setContentForm({ ...contentForm, showroomNotice: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-amber-300"
              />
            </div>

            {/* Brand Title & Location */}
            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3">
              <span className="text-amber-400 font-mono font-bold text-[11px] uppercase block">Store Brand & Location Banner:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Brand Title Line 1:</label>
                  <input
                    type="text"
                    value={contentForm.brandTitle || 'कल्प'}
                    onChange={(e) => setContentForm({ ...contentForm, brandTitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-amber-100 font-bold"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Brand Subtitle / Country Tag:</label>
                  <input
                    type="text"
                    value={contentForm.brandSubtitle || 'NEPAL'}
                    onChange={(e) => setContentForm({ ...contentForm, brandSubtitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Store Location Subtitle:</label>
                <input
                  type="text"
                  value={contentForm.locationSubtitle || 'EXCLUSIVELY SERVING NEPAL'}
                  onChange={(e) => setContentForm({ ...contentForm, locationSubtitle: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Certified Badge Text:</label>
                <input
                  type="text"
                  value={contentForm.certifiedImporterBadge}
                  onChange={(e) => setContentForm({ ...contentForm, certifiedImporterBadge: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Hero Title Line 1:</label>
                <input
                  type="text"
                  value={contentForm.heroHeadlineLine1}
                  onChange={(e) => setContentForm({ ...contentForm, heroHeadlineLine1: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-mono">Hero Title Line 2 / Slogan:</label>
              <input
                type="text"
                value={contentForm.heroHeadlineLine2}
                onChange={(e) => setContentForm({ ...contentForm, heroHeadlineLine2: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-amber-400 font-bold"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-mono">Hero Subheadline / Description:</label>
              <textarea
                rows={3}
                value={contentForm.heroSubheadline}
                onChange={(e) => setContentForm({ ...contentForm, heroSubheadline: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Button 1 Label:</label>
                <input
                  type="text"
                  value={contentForm.exploreCollectionButtonText}
                  onChange={(e) => setContentForm({ ...contentForm, exploreCollectionButtonText: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono">Button 2 Label:</label>
                <input
                  type="text"
                  value={contentForm.verifyWarrantyButtonText}
                  onChange={(e) => setContentForm({ ...contentForm, verifyWarrantyButtonText: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-mono">Social Channel Footer Subtitle:</label>
              <input
                type="text"
                value={contentForm.socialChannelsText}
                onChange={(e) => setContentForm({ ...contentForm, socialChannelsText: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-amber-400 font-mono"
              />
            </div>

            {/* OFFICIAL SOCIAL CHANNELS & DIRECT URLS */}
            <div className="p-4 bg-zinc-950/80 border border-amber-500/30 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200 font-serif font-bold text-sm">Official Social Channels & Direct URLs</span>
                </div>
                <button
                  type="button"
                  onClick={() => setContentForm({
                    ...contentForm,
                    tiktokLink: OFFICIAL_TIKTOK_URL,
                    instagramLink: OFFICIAL_INSTAGRAM_URL,
                    facebookLink: OFFICIAL_FACEBOOK_URL
                  })}
                  className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reset to official brand profile links"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Official Links</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* TikTok URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-300 font-mono text-xs flex items-center gap-1.5 font-bold">
                      <span className="w-5 h-5 rounded bg-zinc-900 flex items-center justify-center text-white">
                        <TikTokIcon className="w-3.5 h-3.5" />
                      </span>
                      <span>TikTok Official Page URL:</span>
                    </label>
                    <button
                      type="button"
                      onClick={(e) => openSocialUrl(resolveSocialUrl('tiktok', contentForm.tiktokLink), e)}
                      className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="url"
                    value={contentForm.tiktokLink || ''}
                    onChange={(e) => setContentForm({ ...contentForm, tiktokLink: e.target.value })}
                    placeholder={OFFICIAL_TIKTOK_URL}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 text-xs font-mono"
                  />
                </div>

                {/* Instagram URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-300 font-mono text-xs flex items-center gap-1.5 font-bold">
                      <span className="w-5 h-5 rounded bg-zinc-900 flex items-center justify-center text-pink-400">
                        <InstagramIcon className="w-3.5 h-3.5" />
                      </span>
                      <span>Instagram Official Page URL:</span>
                    </label>
                    <button
                      type="button"
                      onClick={(e) => openSocialUrl(resolveSocialUrl('instagram', contentForm.instagramLink), e)}
                      className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="url"
                    value={contentForm.instagramLink || ''}
                    onChange={(e) => setContentForm({ ...contentForm, instagramLink: e.target.value })}
                    placeholder={OFFICIAL_INSTAGRAM_URL}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 text-xs font-mono"
                  />
                </div>

                {/* Facebook URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-300 font-mono text-xs flex items-center gap-1.5 font-bold">
                      <span className="w-5 h-5 rounded bg-zinc-900 flex items-center justify-center text-blue-400">
                        <FacebookIcon className="w-3.5 h-3.5" />
                      </span>
                      <span>Facebook Official Page URL:</span>
                    </label>
                    <button
                      type="button"
                      onClick={(e) => openSocialUrl(resolveSocialUrl('facebook', contentForm.facebookLink), e)}
                      className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="url"
                    value={contentForm.facebookLink || ''}
                    onChange={(e) => setContentForm({ ...contentForm, facebookLink: e.target.value })}
                    placeholder={OFFICIAL_FACEBOOK_URL}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC SHOWROOM CARD CMS */}
            <div className="p-4 bg-zinc-950/80 border border-amber-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200 font-serif font-bold text-sm">Flagship Showroom Details Card</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setContentForm({
                      ...contentForm,
                      showroomEnabled: !(contentForm.showroomEnabled ?? true)
                    })}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      (contentForm.showroomEnabled ?? true) 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {(contentForm.showroomEnabled ?? true) ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-400" />
                        <span>Showroom Card Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-rose-400" />
                        <span>Showroom Card Hidden (Deleted)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    title="Restore default showroom text"
                    onClick={() => setContentForm({
                      ...contentForm,
                      showroomEnabled: true,
                      showroomTag: 'Flagship Showroom • Kathmandu, Nepal',
                      showroomTitle: 'Kathmandu Flagship Showroom',
                      showroomDescription: 'Experience the finest timepieces in an exclusive, private environment. Our watch specialists are ready to guide your selection.',
                      showroomAddress: '📍 Address: Kathmandu, Nepal',
                      showroomContact: '📞 Phone: +977 9823680863 | ✉️ Email: Kalpa9761@gmail.com | Hours: 10:00 AM - 7:30 PM (Sun - Fri)',
                      showroomPhone: '9779823680863',
                      showroomButtonText: 'Contact Showroom Representative'
                    })}
                    className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Clear/Delete Showroom Content"
                    onClick={() => setContentForm({
                      ...contentForm,
                      showroomTag: '',
                      showroomTitle: '',
                      showroomDescription: '',
                      showroomAddress: '',
                      showroomContact: '',
                      showroomPhone: '',
                      showroomButtonText: ''
                    })}
                    className="p-1 rounded bg-zinc-900 border border-zinc-800 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {(contentForm.showroomEnabled ?? true) && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1 font-mono">Showroom Tag / Header:</label>
                      <input
                        type="text"
                        value={contentForm.showroomTag ?? 'Flagship Showroom • Kathmandu, Nepal'}
                        onChange={(e) => setContentForm({ ...contentForm, showroomTag: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-amber-300 font-mono"
                        placeholder="Flagship Showroom • Kathmandu, Nepal"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1 font-mono">Showroom Title:</label>
                      <input
                        type="text"
                        value={contentForm.showroomTitle ?? 'Durbar Marg Flagship Showroom'}
                        onChange={(e) => setContentForm({ ...contentForm, showroomTitle: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-amber-100 font-bold"
                        placeholder="Durbar Marg Flagship Showroom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-mono">Description / Subtitle:</label>
                    <textarea
                      rows={2}
                      value={contentForm.showroomDescription ?? ''}
                      onChange={(e) => setContentForm({ ...contentForm, showroomDescription: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300"
                      placeholder="Experience the finest timepieces..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1 font-mono">📍 Address Line:</label>
                      <input
                        type="text"
                        value={contentForm.showroomAddress ?? ''}
                        onChange={(e) => setContentForm({ ...contentForm, showroomAddress: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-amber-200"
                        placeholder="📍 Address: Opposite Annapurna Hotel..."
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1 font-mono">📞 Phone & Opening Hours:</label>
                      <input
                        type="text"
                        value={contentForm.showroomContact ?? ''}
                        onChange={(e) => setContentForm({ ...contentForm, showroomContact: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300"
                        placeholder="📞 Phone: +977 9823680863 | Opening Hours..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1 font-mono">Representative WhatsApp Number:</label>
                      <input
                        type="text"
                        value={contentForm.showroomPhone ?? '9779823680863'}
                        onChange={(e) => setContentForm({ ...contentForm, showroomPhone: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 font-mono"
                        placeholder="9779823680863"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1 font-mono">Button Label:</label>
                      <input
                        type="text"
                        value={contentForm.showroomButtonText ?? 'Contact Showroom Representative'}
                        onChange={(e) => setContentForm({ ...contentForm, showroomButtonText: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 font-bold"
                        placeholder="Contact Showroom Representative"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DYNAMIC FOOTER & LEGAL SETTINGS */}
            <div className="p-4 bg-zinc-950/80 border border-amber-500/30 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200 font-serif font-bold text-sm">Footer Content & Policy Guides</span>
                </div>
              </div>

              {/* 1. Importer Brand Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-400 font-mono text-xs">1. Brand Importer Tagline / Description:</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      title="Restore default description"
                      onClick={() => setContentForm({
                        ...contentForm,
                        footerBrandDescription: 'Nepal’s leading luxury timepiece importer & digital warranty pioneer. Specializing in Rolex, Omega, Patek Philippe, Tissot, and Audemars Piguet with verified digital certificates.'
                      })}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore Default
                    </button>
                    <button
                      type="button"
                      title="Clear / Delete description text"
                      onClick={() => setContentForm({ ...contentForm, footerBrandDescription: '' })}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-rose-400 hover:text-rose-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete Text
                    </button>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={contentForm.footerBrandDescription ?? ''}
                  onChange={(e) => setContentForm({ ...contentForm, footerBrandDescription: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 text-xs"
                  placeholder="Enter brand tagline / importer description..."
                />
              </div>

              {/* 2. Copyright Notice & ERP Engine */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-400 font-mono text-xs">2. Copyright & Engine Notice:</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      title="Restore default copyright"
                      onClick={() => setContentForm({
                        ...contentForm,
                        footerCopyrightText: '© 2026 कल्प • Kalpa Luxury Timepieces. All Rights Reserved. Built with Automated ERP & Digital QR Warranty Engine.'
                      })}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore Default
                    </button>
                    <button
                      type="button"
                      title="Clear / Delete copyright text"
                      onClick={() => setContentForm({ ...contentForm, footerCopyrightText: '' })}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-rose-400 hover:text-rose-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete Text
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={contentForm.footerCopyrightText ?? ''}
                  onChange={(e) => setContentForm({ ...contentForm, footerCopyrightText: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 text-xs font-mono"
                  placeholder="Enter copyright notice..."
                />
              </div>

              {/* 3. Dynamic Footer Policy Links */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-serif font-bold text-xs flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>3. Policy & Information Links ({currentFooterLinks.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFooterLink}
                    className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentFooterLinks.map((link, idx) => (
                    <div key={link.id} className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-[10px] font-mono text-amber-500 font-bold">#{idx + 1}</span>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateFooterLink(link.id, 'label', e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-amber-100 font-bold w-full max-w-xs"
                            placeholder="Link Title (e.g., Privacy Policy)"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleFooterLink(link.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                              link.active
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {link.active ? (
                              <>
                                <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-3.5 h-3.5 text-rose-400" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteFooterLink(link.id)}
                            className="p-1 rounded bg-zinc-950 border border-zinc-800 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Delete this policy link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 block mb-0.5">Policy / Guide Modal Content:</label>
                        <textarea
                          rows={2}
                          value={link.content || ''}
                          onChange={(e) => handleUpdateFooterLink(link.id, 'content', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-300"
                          placeholder="Detailed content shown in dialog when clicked by visitors..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-widest hover:scale-[1.01] transition-transform cursor-pointer"
              >
                Save & Publish All Homepage Text
              </button>
            </div>
          </form>

          {/* Live Preview Card */}
          <div className="bg-zinc-900/90 rounded-2xl border border-amber-500/30 p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Eye className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif text-lg font-bold text-amber-200">
                Live Preview (What Visitors See)
              </h3>
            </div>

            <div className="bg-[#0A0A0B] border border-amber-500/20 rounded-xl overflow-hidden text-center space-y-4 p-6 relative">
              {/* Header Preview */}
              <div className="p-3 bg-zinc-950 border-b border-amber-500/20 flex flex-col items-center">
                <div className="font-serif text-base tracking-widest text-amber-100 uppercase font-bold flex items-center gap-1.5">
                  {contentForm.brandTitle || 'कल्प'} <span className="text-amber-500 text-[10px] px-1 py-0.5 border border-amber-500/40 rounded bg-amber-500/10">{contentForm.brandSubtitle || ''}</span>
                </div>
                <div className="text-[9px] tracking-widest text-amber-400/80 uppercase font-light mt-0.5">
                  {contentForm.locationSubtitle || 'DURBAR MARG • JHAMSIKHEL'}
                </div>
              </div>

              {/* Top Banner Notice */}
              <div className="bg-amber-950/80 border border-amber-500/30 py-1 px-3 rounded text-[11px] text-amber-300">
                {contentForm.showroomNotice}
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] tracking-widest uppercase font-bold">
                {contentForm.certifiedImporterBadge}
              </div>

              <h1 className="font-serif text-2xl font-bold text-amber-100">
                {contentForm.heroHeadlineLine1}
                <span className="block text-amber-400 text-lg mt-1 font-serif">
                  {contentForm.heroHeadlineLine2}
                </span>
              </h1>

              <p className="text-xs text-zinc-300 font-light max-w-md mx-auto">
                {contentForm.heroSubheadline}
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button className="px-5 py-2.5 bg-zinc-900 border border-amber-500/40 text-amber-300 font-bold text-xs rounded uppercase">
                  {contentForm.verifyWarrantyButtonText}
                </button>
              </div>

              <p className="text-[10px] text-amber-400 font-mono">
                {contentForm.socialChannelsText}
              </p>

              {/* Live Preview of Showroom Details Card */}
              {(contentForm.showroomEnabled ?? true) && (
                <div className="mt-6 p-4 rounded-xl bg-zinc-950 border border-amber-500/30 text-left space-y-2">
                  {contentForm.showroomTag && (
                    <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{contentForm.showroomTag}</span>
                    </div>
                  )}
                  {contentForm.showroomTitle && (
                    <h4 className="font-serif text-sm font-bold text-amber-100">
                      {contentForm.showroomTitle}
                    </h4>
                  )}
                  {contentForm.showroomDescription && (
                    <p className="text-[11px] text-zinc-300">
                      {contentForm.showroomDescription}
                    </p>
                  )}
                  <div className="text-[10px] font-mono text-zinc-400 space-y-1 pt-1 border-t border-zinc-800">
                    {contentForm.showroomAddress && <p className="text-amber-200">{contentForm.showroomAddress}</p>}
                    {contentForm.showroomContact && <p>{contentForm.showroomContact}</p>}
                  </div>
                  <div className="pt-2">
                    <div className="px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold text-[10px] uppercase inline-flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{contentForm.showroomButtonText || 'Contact Showroom Representative'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HERO VIDEO MANAGER */}
      {activeTab === 'video' && (
        <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Video className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-amber-200">
              Hero Video Stream & Local Video Upload
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              {/* Local File Upload Button */}
              <div className="p-4 bg-zinc-950 border border-dashed border-amber-500/40 rounded-xl space-y-2 text-center">
                <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="font-bold text-amber-200">Upload Video File from Computer / Mobile</h4>
                <p className="text-[11px] text-zinc-400">Select MP4 video file to upload directly to free Google Cloud hosting.</p>
                <label className={`inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 font-bold rounded-lg transition-colors ${isUploading ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:bg-amber-400'}`}>
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving to Google Cloud...</span>
                    </>
                  ) : (
                    <span>Choose Video File</span>
                  )}
                  <input
                    type="file"
                    disabled={isUploading}
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-zinc-500 text-[10px] uppercase font-mono">OR USE VIDEO URL</span>
                <div className="flex-grow border-t border-zinc-800"></div>
              </div>

              <form onSubmit={handleUpdateVideoUrl} className="space-y-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Video Stream URL (MP4):</label>
                  <input
                    type="text"
                    required
                    value={vidUrl}
                    onChange={(e) => setVidUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-mono text-[11px]"
                    placeholder="https://.../video.mp4"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Save Video Stream URL
                </button>
              </form>

              {/* 1-Click Luxury Video Presets (Guaranteed to sync on Published Shared URL) */}
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="text-[11px] font-bold text-amber-300 font-serif flex items-center justify-between">
                  <span>✨ 1-Click Luxury Watch Video Presets</span>
                  <span className="text-[9px] text-amber-500 font-mono uppercase bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">100% Shared Link Ready</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetVideo('https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-watch-mechanism-42861-large.mp4', 'Swiss Mechanism Movement')}
                    className="p-2 bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 rounded-lg text-left text-[10px] text-zinc-300 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-amber-400">⚙️ Watch Gear Mechanism</div>
                    <div className="text-[9px] text-zinc-500">Swiss Mechanical Movement</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPresetVideo('https://assets.mixkit.co/videos/preview/mixkit-checking-the-time-on-a-luxury-gold-watch-41527-large.mp4', 'Gold Luxury Chronograph')}
                    className="p-2 bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 rounded-lg text-left text-[10px] text-zinc-300 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-amber-400">⌚ Gold Luxury Chronograph</div>
                    <div className="text-[9px] text-zinc-500">Gold Wrist Showcase</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPresetVideo('https://assets.mixkit.co/videos/preview/mixkit-gears-of-a-pocket-watch-working-42863-large.mp4', 'Horology Gears')}
                    className="p-2 bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 rounded-lg text-left text-[10px] text-zinc-300 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-amber-400">🕰️ Horology Gear Train</div>
                    <div className="text-[9px] text-zinc-500">Intricate Internal Movement</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPresetVideo('https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-gold-wrist-watch-41528-large.mp4', 'Executive Gold Timepiece')}
                    className="p-2 bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 rounded-lg text-left text-[10px] text-zinc-300 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-amber-400">✨ Executive Gold Timepiece</div>
                    <div className="text-[9px] text-zinc-500">Showroom Luxury Unboxing</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Player Preview */}
            <div className="space-y-2">
              <label className="text-xs text-amber-400 font-mono font-bold block">Current Active Video Stream Preview:</label>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-amber-500/30 bg-black">
                {vidUrl && vidUrl.trim() !== '' ? (
                  <video
                    key={vidUrl}
                    src={vidUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                    No active video URL configured
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROMOTIONAL BANNERS & PHOTO SLIDERS */}
      {activeTab === 'sliders' && (
        <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif text-lg font-bold text-amber-200">
                Homepage Sliders & Seasonal Photo Offers ({banners.length})
              </h3>
            </div>

            <button
              onClick={() => setShowBannerModal(true)}
              className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs uppercase cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map(b => (
              <div key={b.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex gap-4 items-center">
                <img
                  src={b.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
                  alt={b.title || 'Slide'}
                  className="w-24 h-20 rounded-lg object-cover border border-amber-500/30 shrink-0"
                />
                <div className="space-y-1 flex-1 text-xs">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    {b.type}
                  </span>
                  <h4 className="font-bold text-zinc-100">{b.title}</h4>
                  <p className="text-zinc-400 text-[11px] line-clamp-1">{b.subtitle}</p>
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => toggleBannerActive(b.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${b.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}
                    >
                      {b.active ? 'Published' : 'Unpublished'}
                    </button>
                    {currentUser.role === 'Super Admin' && (
                      <button
                        onClick={() => setDeleteTarget({ id: b.id, name: b.title || 'Slide Banner' })}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer p-1 rounded hover:bg-rose-500/10"
                        title="Delete Banner (Super Admin Only)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW BANNER MODAL */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F0F12] border border-amber-500/40 rounded-2xl max-w-md w-full text-white p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-amber-100">Upload Photo Slide Banner</h3>
            <form onSubmit={handleAddBanner} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Campaign Type:</label>
                <select value={bannerType} onChange={(e) => setBannerType(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200">
                  <option value="Slider">Homepage Slider</option>
                  <option value="Banner">Section Banner</option>
                  <option value="Popup">Popup Offer</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Campaign Title *</label>
                <input type="text" required value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Subtitle / Description</label>
                <input type="text" value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200" />
              </div>

              <div className="space-y-2">
                <label className="text-zinc-400 block font-mono font-bold">Select Photo File from Device *</label>
                <div className="p-4 bg-zinc-950 border border-dashed border-amber-500/50 rounded-xl text-center space-y-2">
                  <Upload className="w-7 h-7 text-amber-400 mx-auto" />
                  <p className="text-[11px] text-zinc-300">Click below to upload JPG, PNG, or WEBP photo directly from your phone or computer.</p>
                  <label className="inline-block px-4 py-2 bg-amber-500 text-zinc-950 font-bold rounded-lg cursor-pointer hover:bg-amber-400 text-xs uppercase tracking-wider">
                    <span>Choose Photo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {bannerImage && (
                <div className="space-y-1">
                  <span className="text-[11px] text-amber-400 font-mono font-bold block">Photo Preview:</span>
                  <div className="w-full h-32 rounded-xl border border-amber-500/30 overflow-hidden bg-black">
                    <img src={bannerImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowBannerModal(false)} className="px-3 py-1.5 bg-zinc-900 text-zinc-400 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-500 font-bold text-zinc-950 rounded uppercase cursor-pointer">Publish Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2-STEP DELETE VERIFICATION MODAL (SUPER ADMIN ONLY) */}
      <DeleteVerificationModal
        isOpen={!!deleteTarget}
        title="Delete Photo Slide Banner"
        itemName={deleteTarget?.name || ''}
        detailsText="Deleting this banner will remove it permanently from the homepage slideshow."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteBanner(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />

    </div>
  );
};

