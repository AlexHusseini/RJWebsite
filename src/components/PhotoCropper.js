import React, { useEffect, useRef, useState } from 'react';

const MIN = 48;
const ASPECTS = [
  { id: 'free', label: 'Free', value: null },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '4:3', label: '4:3', value: 4 / 3 },
  { id: '3:2', label: '3:2', value: 3 / 2 },
  { id: '16:9', label: '16:9', value: 16 / 9 },
];

function clampCrop(next, imgW, imgH, aspect) {
  let { x, y, w, h } = next;
  w = Math.max(MIN, Math.min(w, imgW));
  h = Math.max(MIN, Math.min(h, imgH));
  if (aspect) {
    if (w / h > aspect) w = h * aspect;
    else h = w / aspect;
    w = Math.max(MIN, Math.min(w, imgW));
    h = Math.max(MIN, Math.min(h, imgH));
    if (w / h > aspect) w = h * aspect;
    else h = w / aspect;
  }
  x = Math.max(0, Math.min(x, imgW - w));
  y = Math.max(0, Math.min(y, imgH - h));
  return { x, y, w, h };
}

function fitAspect(imgW, imgH, aspect) {
  if (!aspect) {
    return clampCrop({ x: imgW * 0.08, y: imgH * 0.08, w: imgW * 0.84, h: imgH * 0.84 }, imgW, imgH, null);
  }
  let w = imgW;
  let h = w / aspect;
  if (h > imgH) {
    h = imgH;
    w = h * aspect;
  }
  return {
    x: (imgW - w) / 2,
    y: (imgH - h) / 2,
    w,
    h,
  };
}

const PhotoCropper = ({ src, onCancel, onApply, busy }) => {
  const imgRef = useRef(null);
  const dragRef = useRef(null);
  const [crop, setCrop] = useState({ x: 20, y: 20, w: 160, h: 160 });
  const [aspectId, setAspectId] = useState('free');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  const aspect = ASPECTS.find((item) => item.id === aspectId)?.value ?? null;

  const syncDefault = (nextAspect = aspect) => {
    const img = imgRef.current;
    if (!img?.clientWidth) return;
    setCrop(fitAspect(img.clientWidth, img.clientHeight, nextAspect));
    setReady(true);
  };

  useEffect(() => {
    setReady(false);
    setError('');
  }, [src]);

  const onPointerDown = (mode) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const img = imgRef.current;
    if (!img) return;
    dragRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      crop: { ...crop },
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    const img = imgRef.current;
    if (!drag || !img) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    const imgW = img.clientWidth;
    const imgH = img.clientHeight;
    let next = { ...drag.crop };

    if (drag.mode === 'move') {
      next.x += dx;
      next.y += dy;
    } else {
      if (drag.mode.includes('e')) next.w += dx;
      if (drag.mode.includes('s')) next.h += dy;
      if (drag.mode.includes('w')) {
        next.x += dx;
        next.w -= dx;
      }
      if (drag.mode.includes('n')) {
        next.y += dy;
        next.h -= dy;
      }
    }
    setCrop(clampCrop(next, imgW, imgH, aspect));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const apply = () => {
    const img = imgRef.current;
    if (!img) return;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    onApply(img, {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      w: crop.w * scaleX,
      h: crop.h * scaleY,
    });
  };

  return (
    <div className="photo-cropper">
      <div className="photo-cropper-aspects">
        {ASPECTS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`admin-chip${aspectId === item.id ? ' is-active' : ''}`}
            onClick={() => {
              setAspectId(item.id);
              syncDefault(item.value);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="photo-cropper-stage">
        <div className="photo-cropper-frame">
          <img
            ref={imgRef}
            src={src}
            alt=""
            crossOrigin="anonymous"
            onLoad={() => syncDefault()}
            onError={() => setError('Could not open this photo for cropping. Upload it through this panel first.')}
            draggable={false}
          />
          {ready && (
            <div
              className="photo-crop-box"
              style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
              onPointerDown={onPointerDown('move')}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {['nw', 'ne', 'sw', 'se'].map((handle) => (
                <span
                  key={handle}
                  className={`photo-crop-handle photo-crop-handle--${handle}`}
                  onPointerDown={onPointerDown(handle)}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
      <p className="admin-help">Drag the box to move it. Pull the corners to crop tighter.</p>
      <div className="admin-modal-actions">
        <button type="button" className="admin-chip" onClick={onCancel} disabled={busy}>
          Cancel crop
        </button>
        <button type="button" onClick={apply} disabled={!ready || Boolean(error) || busy}>
          {busy ? 'SAVING…' : 'APPLY CROP'}
        </button>
      </div>
    </div>
  );
};

export default PhotoCropper;
