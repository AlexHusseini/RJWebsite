export function isUsableImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('media-hosting.imagekit.io')) return false;
  return true;
}
