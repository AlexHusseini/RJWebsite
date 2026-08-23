// Resize + compress images in the browser before uploading to Firebase Storage.
// Also extracts real dimensions so the gallery can lay photos out without cropping.

const THUMB_MAX = 800;
const FULL_MAX = 2000;
const QUALITY = 0.82;

function getSize(img) {
  return {
    w: img.naturalWidth || img.width,
    h: img.naturalHeight || img.height,
  };
}

async function loadImage(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      if (bitmap.width && bitmap.height) return bitmap;
    } catch {
      // Fall through to <img> for formats createImageBitmap rejects.
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This format needs to be a JPG, PNG, or WebP. Export from your phone as JPG and try again.'));
    };
    img.src = url;
  });
}

function resizeToBlob(img, maxDimension, mimeType, quality) {
  const { w, h } = getSize(img);
  const scale = Math.min(1, maxDimension / Math.max(w, h));
  const targetW = Math.round(w * scale);
  const targetH = Math.round(h * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve({ blob, width: targetW, height: targetH })
                     : reject(new Error('Canvas export failed'))),
      mimeType,
      quality
    );
  });
}

function supportsWebP() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
}

export async function processImage(file) {
  const img = await loadImage(file);
  const { w: originalWidth, h: originalHeight } = getSize(img);

  const mime = supportsWebP() ? 'image/webp' : 'image/jpeg';

  const [thumb, full] = await Promise.all([
    resizeToBlob(img, THUMB_MAX, mime, QUALITY),
    resizeToBlob(img, FULL_MAX, mime, QUALITY),
  ]);

  if (typeof img.close === 'function') img.close();

  return {
    thumb: thumb.blob,
    full: full.blob,
    width: originalWidth,
    height: originalHeight,
    aspectRatio: originalWidth / originalHeight,
    originalSize: file.size,
    processedSize: thumb.blob.size + full.blob.size,
    extension: mime === 'image/webp' ? 'webp' : 'jpg',
  };
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|bmp|heic|heif|avif|tiff?)$/i;

export function isImageFile(file) {
  if (file.type && file.type.startsWith('image/')) return true;
  return IMAGE_EXTENSIONS.test(file.name || '');
}
