import React, { useState, useEffect } from 'react';
import { Video, Image as ImageIcon, Plus, Trash2, ToggleLeft, ToggleRight, Sparkles, Upload, Layout, Eye, Save, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeleteVerificationModal } from './DeleteVerificationModal';
import { CMSVideo } from '../../types';

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

  // Save Homepage Text Content
  const handleSaveHomepageContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageContent(contentForm);
    setSaveStatus('✅ Homepage text saved & published live across the boutique app!');
    setTimeout(() => setSaveStatus(''), 5000);
  };

  // Video File Upload Handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert('Video file size is too large (max 50MB). Please select a smaller MP4 or provide a video URL.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setVidUrl(dataUrl);
        setContentForm(prev => ({ ...prev, heroVideoUrl: dataUrl }));
        updateHeroVideo({
          id: currentVideo.id || 'vid-1',
          title: 'Custom Admin Uploaded Showcase Video',
          videoUrl: dataUrl,
          slogan: contentForm.heroHeadlineLine2,
          active: true
        });
        updateHomepageContent({ heroVideoUrl: dataUrl });
        alert('Video uploaded successfully and published live!');
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
    alert('Hero background video URL updated live on homepage!');
  };

  // Banner Image File Upload
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setBannerImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
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
              <span className="text-amber-400 font-mono font-bold text-[11px] uppercase block">Boutique Brand & Location Banner:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-mono">Brand Title Line 1:</label>
                  <input
                    type="text"
                    value={contentForm.brandTitle || 'PREMIUM WATCH'}
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
                <label className="text-zinc-400 block mb-1 font-mono">Boutique Location Subtitle:</label>
                <input
                  type="text"
                  value={contentForm.locationSubtitle || 'DURBAR MARG • JHAMSIKHEL'}
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
                  {contentForm.brandTitle || 'PREMIUM WATCH'} <span className="text-amber-500 text-[10px] px-1 py-0.5 border border-amber-500/40 rounded bg-amber-500/10">{contentForm.brandSubtitle || 'NEPAL'}</span>
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
                <p className="text-[11px] text-zinc-400">Select MP4 video file to upload as the promotional background.</p>
                <label className="inline-block px-4 py-2 bg-amber-500 text-zinc-950 font-bold rounded-lg cursor-pointer hover:bg-amber-400">
                  Choose Video File
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Save Video Stream URL
                </button>
              </form>
            </div>

            {/* Video Player Preview */}
            <div className="space-y-2">
              <label className="text-xs text-amber-400 font-mono font-bold block">Current Active Video Stream Preview:</label>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-amber-500/30 bg-black">
                <video
                  key={vidUrl}
                  src={vidUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
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
                <img src={b.imageUrl} alt={b.title} className="w-24 h-20 rounded-lg object-cover border border-amber-500/30 shrink-0" />
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

