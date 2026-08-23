export function isUsableImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('media-hosting.imagekit.io')) return false;
  return true;
}

export function preloadImage(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}
