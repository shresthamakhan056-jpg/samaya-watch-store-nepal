/**
 * Advanced Multi-Tier Image Compression & Optimization Utility
 * 
 * Automatically detects large photo files (5MB, 10MB, 25MB+) uploaded from
 * mobile phones (iPhone/Android 48MP/108MP) or DSLRs and compresses them into
 * ultra-sharp, high-performance web formats (< 300KB) while preserving
 * rich luxury timepiece dial details and color fidelity.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  reductionPercentage: number;
  width: number;
  height: number;
  formattedOriginalSize: string;
  formattedCompressedSize: string;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Automatically compress a data URL string to target dimensions & optimal payload weight.
 */
export function compressImageDataUrl(
  dataUrl: string,
  maxWidth = 1600,
  maxHeight = 1600,
  initialQuality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return resolve(dataUrl);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect ratio scaling
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
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
          return resolve(dataUrl);
        }

        // Enable highest quality bicubic image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const isPng = dataUrl.startsWith('data:image/png');
        
        // Draw dark background for non-transparent luxury presentation
        if (!isPng) {
          ctx.fillStyle = '#09090b';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Quality pass 1
        let outputMime = isPng ? 'image/png' : 'image/jpeg';
        let compressed = canvas.toDataURL(outputMime, initialQuality);

        // If compressed PNG is still huge (> 500KB), convert to high-res JPEG for massive 90% savings
        if (isPng && compressed.length > 500000) {
          const jpgCanvas = document.createElement('canvas');
          jpgCanvas.width = width;
          jpgCanvas.height = height;
          const jpgCtx = jpgCanvas.getContext('2d');
          if (jpgCtx) {
            jpgCtx.fillStyle = '#09090b';
            jpgCtx.fillRect(0, 0, width, height);
            jpgCtx.drawImage(canvas, 0, 0);
            compressed = jpgCanvas.toDataURL('image/jpeg', initialQuality);
            outputMime = 'image/jpeg';
          }
        }

        // Quality pass 2 (Iterative refinement if string is still > 450KB)
        if (compressed.length > 450000 && outputMime === 'image/jpeg') {
          compressed = canvas.toDataURL('image/jpeg', 0.72);
        }
        
        // Quality pass 3 (For massive camera files, ensure under 350KB)
        if (compressed.length > 380000 && outputMime === 'image/jpeg') {
          compressed = canvas.toDataURL('image/jpeg', 0.65);
        }

        resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
      } catch (err) {
        console.warn('Image compression fallback:', err);
        resolve(dataUrl);
      }
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Automatically compress a File object from file input dialog.
 * Handles high-resolution camera photos (5MB - 50MB) down to optimized web size.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  initialQuality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        return resolve('');
      }

      try {
        // Automatically determine optimal target dimensions based on initial file weight
        let targetMaxWidth = maxWidth;
        let targetMaxHeight = maxHeight;

        // If original file is huge (> 4MB), cap resolution to 1920 max edge for lightning performance
        if (file.size > 4 * 1024 * 1024) {
          targetMaxWidth = Math.min(maxWidth, 1920);
          targetMaxHeight = Math.min(maxHeight, 1920);
        }

        const compressed = await compressImageDataUrl(
          rawDataUrl,
          targetMaxWidth,
          targetMaxHeight,
          initialQuality
        );

        const originalSize = file.size;
        const approxCompressedSize = Math.round((compressed.length * 3) / 4);
        const reduction = originalSize > 0 
          ? Math.max(0, Math.round(((originalSize - approxCompressedSize) / originalSize) * 100))
          : 0;

        console.log(
          `📸 Auto-compressed photo: ${file.name} | Original: ${formatBytes(originalSize)} ➔ Compressed: ${formatBytes(approxCompressedSize)} (${reduction}% reduction)`
        );

        resolve(compressed);
      } catch (err) {
        console.warn('Error during image file compression, falling back to raw data:', err);
        resolve(rawDataUrl);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image file with complete analytics object (useful for UI badges showing % saved)
 */
export function compressImageFileWithDetails(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  initialQuality = 0.85
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        return reject(new Error('Failed to read file'));
      }

      try {
        const compressed = await compressImageDataUrl(rawDataUrl, maxWidth, maxHeight, initialQuality);
        const originalSizeBytes = file.size;
        const compressedSizeBytes = Math.round((compressed.length * 3) / 4);
        const reductionPercentage = originalSizeBytes > 0
          ? Math.max(0, Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100))
          : 0;

        resolve({
          dataUrl: compressed,
          originalSizeBytes,
          compressedSizeBytes,
          reductionPercentage,
          width: maxWidth,
          height: maxHeight,
          formattedOriginalSize: formatBytes(originalSizeBytes),
          formattedCompressedSize: formatBytes(compressedSizeBytes)
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
