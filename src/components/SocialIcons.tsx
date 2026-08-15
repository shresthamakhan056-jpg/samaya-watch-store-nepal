import React from 'react';

// Exact Official Brand Social Channel Links
export const OFFICIAL_TIKTOK_URL = 'https://www.tiktok.com/@kalpa9741?_r=1&_t=ZS-98taScxEoaG';
export const OFFICIAL_FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61593414713179';
export const OFFICIAL_INSTAGRAM_URL = 'https://www.instagram.com/kalpa_watch?igsh=Z3Vva2hrM2MzbGYz';

/**
 * Resolves a social link to ensure it's a valid official destination URL,
 * replacing empty or obsolete generic placeholders.
 */
export const resolveSocialUrl = (type: 'tiktok' | 'instagram' | 'facebook', configuredUrl?: string): string => {
  if (!configuredUrl || typeof configuredUrl !== 'string' || configuredUrl.trim() === '') {
    if (type === 'tiktok') return OFFICIAL_TIKTOK_URL;
    if (type === 'instagram') return OFFICIAL_INSTAGRAM_URL;
    if (type === 'facebook') return OFFICIAL_FACEBOOK_URL;
  }
  const clean = configuredUrl.trim();
  
  // Upgrade old generic links to official brand URLs
  if (type === 'tiktok' && (clean === 'https://tiktok.com' || clean === 'https://www.tiktok.com' || clean === 'http://tiktok.com' || clean === 'http://www.tiktok.com' || clean.endsWith('tiktok.com/'))) {
    return OFFICIAL_TIKTOK_URL;
  }
  if (type === 'instagram' && (clean === 'https://instagram.com' || clean === 'https://www.instagram.com' || clean === 'http://instagram.com' || clean === 'http://www.instagram.com' || clean.endsWith('instagram.com/'))) {
    return OFFICIAL_INSTAGRAM_URL;
  }
  if (type === 'facebook' && (clean === 'https://facebook.com' || clean === 'https://www.facebook.com' || clean === 'http://facebook.com' || clean === 'http://www.facebook.com' || clean.endsWith('facebook.com/'))) {
    return OFFICIAL_FACEBOOK_URL;
  }
  
  return clean.startsWith('http') ? clean : `https://${clean}`;
};

/**
 * Direct safe navigation to external social URL (works inside iframes, popups, and direct web views)
 */
export const openSocialUrl = (url: string, e?: React.MouseEvent) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (!url) return;
  
  const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  
  try {
    const opened = window.open(validUrl, '_blank', 'noopener,noreferrer');
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      // In case iframe sandboxing blocks window.open, trigger anchor click directly
      const tempAnchor = document.createElement('a');
      tempAnchor.href = validUrl;
      tempAnchor.target = '_blank';
      tempAnchor.rel = 'noopener noreferrer';
      document.body.appendChild(tempAnchor);
      tempAnchor.click();
      document.body.removeChild(tempAnchor);
    }
  } catch {
    // Ultimate fallback
    window.location.href = validUrl;
  }
};

// Crisp SVG Icons for TikTok, Instagram, and Facebook
export const TikTokIcon: React.FC<{ className?: string; size?: number }> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.89c.35 0 .68.06.99.17V9.33a6.33 6.33 0 0 0-.99-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.65a8.28 8.28 0 0 0 4.76 1.48V6.69h-1z" />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string; size?: number }> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string; size?: number }> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
