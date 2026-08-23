export function loadEditableImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error('Could not open this photo for cropping. Upload it through this panel first, then crop.'));
    img.src = src;
  });
}

function blobFromCanvas(canvas, mime = 'image/jpeg', quality = 0.9) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not export the cropped photo.'))),
      mime,
      quality
    );
  });
}

export async function cropToBlob(img, crop, maxSize = 2000) {
  const sx = Math.max(0, Math.round(crop.x));
  const sy = Math.max(0, Math.round(crop.y));
  const sw = Math.max(1, Math.round(crop.w));
  const sh = Math.max(1, Math.round(crop.h));
  const scale = Math.min(1, maxSize / Math.max(sw, sh));
  const dw = Math.max(1, Math.round(sw * scale));
  const dh = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement('canvas');
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  try {
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
  } catch (err) {
    throw new Error('Could not crop this photo. Upload it through this panel first, then crop.');
  }
  const blob = await blobFromCanvas(canvas);
  return { blob, width: dw, height: dh, aspectRatio: dw / dh };
}

export async function rotateToBlob(img, clockwise = true, maxSize = 2000) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const scale = Math.min(1, maxSize / Math.max(w, h));
  const srcW = Math.max(1, Math.round(w * scale));
  const srcH = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement('canvas');
  canvas.width = srcH;
  canvas.height = srcW;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (clockwise) {
    ctx.translate(srcH, 0);
    ctx.rotate(Math.PI / 2);
  } else {
    ctx.translate(0, srcW);
    ctx.rotate(-Math.PI / 2);
  }
  ctx.drawImage(img, 0, 0, srcW, srcH);
  const blob = await blobFromCanvas(canvas);
  return { blob, width: canvas.width, height: canvas.height, aspectRatio: canvas.width / canvas.height };
}
