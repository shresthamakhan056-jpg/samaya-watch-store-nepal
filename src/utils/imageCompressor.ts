/**
 * Utility to compress base64 images or Image files using HTML5 Canvas.
 * Optimized for ultra-sharp, high-resolution luxury timepiece photography
 * while keeping payload sizes under Firestore and localStorage quotas.
 */

export function compressImageDataUrl(
  dataUrl: string,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve) => {
    // If empty or not a data URL, return as is
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return resolve(dataUrl);
    }

    // If string length is already small (< 200,000 chars ~ 200KB), return as is for max clarity
    if (dataUrl.length < 200000) {
      return resolve(dataUrl);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
          return resolve(dataUrl);
        }

        // Enable high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Check if image is PNG with possible transparency
        const isPng = dataUrl.startsWith('data:image/png');
        if (!isPng) {
          ctx.fillStyle = '#070709';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Use JPEG with high quality 0.88 or PNG
        const outputMime = isPng ? 'image/png' : 'image/jpeg';
        const compressed = canvas.toDataURL(outputMime, quality);

        // Return whichever is smaller or if compressed is valid
        resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
      } catch (err) {
        console.warn('Canvas image compression fallback, using original dataUrl:', err);
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function compressImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        return resolve('');
      }
      try {
        const compressed = await compressImageDataUrl(rawDataUrl, maxWidth, maxHeight, quality);
        resolve(compressed);
      } catch (err) {
        resolve(rawDataUrl);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

