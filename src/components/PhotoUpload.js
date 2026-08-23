// Drag-and-drop, multi-file upload with previews, per-file progress,
// automatic compression, and stored dimensions so the gallery never crops.

import React, { useState, useRef, useCallback } from 'react';
import {
  uploadImageToCloudinary,
  cloudinaryDeliveryUrl,
  DEFAULT_CLOUD_NAME,
  DEFAULT_UPLOAD_PRESET,
} from '../utils/cloudinary';
import { addPhoto, UNASSIGNED_SECTION } from '../firebase/db';
import { processImage, formatBytes, isImageFile } from '../utils/imageUtils';

const PhotoUpload = ({ section, onUploadComplete }) => {
  const [queue, setQueue] = useState([]);      // [{ id, file, previewUrl, status, progress, error }]
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  // ---- Adding files -------------------------------------------------------

  const [skipNotice, setSkipNotice] = useState('');

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList);
    const images = files.filter(isImageFile);
    const rejected = files.length - images.length;
    setSkipNotice(rejected > 0 ? `${rejected} file${rejected === 1 ? '' : 's'} skipped (not an image)` : '');

    const items = images.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
      error: null,
      savings: null,
    }));

    setQueue((prev) => [...prev, ...items]);
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = ''; // allow re-selecting the same file
  };

  // ---- Drag and drop ------------------------------------------------------

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  // ---- Queue management ---------------------------------------------------

  const removeItem = (id) => {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateItem = (id, patch) => {
    setQueue((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const clearCompleted = () => {
    setQueue((prev) => {
      prev.filter((i) => i.status === 'done').forEach((i) => URL.revokeObjectURL(i.previewUrl));
      return prev.filter((i) => i.status !== 'done');
    });
  };

  const resolvedCloudName = DEFAULT_CLOUD_NAME;
  const resolvedPreset = DEFAULT_UPLOAD_PRESET;

  // ---- Upload -------------------------------------------------------------

  const uploadAll = async () => {
    if (!resolvedCloudName || !resolvedPreset) return;
    const targetSection = section || UNASSIGNED_SECTION;
    setUploading(true);

    for (const item of queue.filter((i) => i.status === 'pending' || i.status === 'error')) {
      try {
        updateItem(item.id, { status: 'processing', progress: 10, error: null });

        const processed = await processImage(item.file);

        updateItem(item.id, { status: 'uploading', progress: 40 });

        const baseName = item.file.name.replace(/\.[^.]+$/, '');
        const uniqueName = `${baseName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const uploaded = await uploadImageToCloudinary(
          new File([processed.full], `${uniqueName}.${processed.extension}`, {
            type: processed.full.type,
          }),
          { cloudName: resolvedCloudName, uploadPreset: resolvedPreset }
        );

        updateItem(item.id, { progress: 85 });

        const thumbURL = cloudinaryDeliveryUrl(
          uploaded,
          'c_limit,w_800,q_auto,f_auto'
        );
        const fullURL = cloudinaryDeliveryUrl(
          uploaded,
          'c_limit,w_2000,q_auto,f_auto'
        );

        const title = baseName.replace(/[-_]/g, ' ');
        await addPhoto({
          url: fullURL,
          thumbnailUrl: thumbURL,
          fullUrl: fullURL,
          width: processed.width,
          height: processed.height,
          aspectRatio: processed.aspectRatio,
          title,
          alt: title,
          section: targetSection,
          uploadedAt: new Date().toISOString(),
        });

        updateItem(item.id, {
          status: 'done',
          progress: 100,
          savings: `${formatBytes(processed.originalSize)} → ${formatBytes(processed.processedSize)}`,
        });
      } catch (err) {
        updateItem(item.id, { status: 'error', error: err.message, progress: 0 });
      }
    }

    setUploading(false);
    if (onUploadComplete) onUploadComplete();
  };

  // ---- Render -------------------------------------------------------------

  const pendingCount = queue.filter((i) => i.status === 'pending' || i.status === 'error').length;
  const doneCount = queue.filter((i) => i.status === 'done').length;

  return (
    <div className="photo-upload">
      <div
        className={`dropzone${isDragging ? ' dropzone--active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#000' : '#ccc'}`,
          borderRadius: 8,
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? '#f5f5f5' : '#fafafa',
          transition: 'all 0.2s ease',
        }}
      >
        <p style={{ margin: 0, fontSize: '1.05rem' }}>
          {isDragging ? 'Drop photos here' : 'Drag photos here, or click to browse'}
        </p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#777' }}>
          JPG, PNG, WebP, HEIC — drop a whole folder if you want. They compress automatically.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.heic,.heif,.avif"
          multiple
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>
      {skipNotice && (
        <p style={{ fontSize: '0.85rem', color: '#a60', margin: '0.75rem 0 0' }}>{skipNotice}</p>
      )}

      {queue.length > 0 && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '0.75rem',
              marginTop: '1.25rem',
            }}
          >
            {queue.map((item) => (
              <div key={item.id} style={{ position: 'relative' }}>
                <img
                  src={item.previewUrl}
                  alt=""
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    borderRadius: 6,
                    opacity: item.status === 'done' ? 0.55 : 1,
                    display: 'block',
                  }}
                />

                {item.status !== 'done' && !uploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    aria-label="Remove"
                    style={{
                      position: 'absolute', top: 4, right: 4,
                      background: 'rgba(0,0,0,0.65)', color: '#fff',
                      border: 'none', borderRadius: '50%',
                      width: 22, height: 22, cursor: 'pointer', lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                )}

                {(item.status === 'processing' || item.status === 'uploading') && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 4, background: 'rgba(255,255,255,0.4)',
                    borderRadius: '0 0 6px 6px', overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${item.progress}%`, height: '100%',
                      background: '#000', transition: 'width 0.3s ease',
                    }} />
                  </div>
                )}

                {item.status === 'done' && (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', color: '#fff',
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                  }}>
                    ✓
                  </div>
                )}

                {item.status === 'error' && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(180,0,0,0.75)',
                    color: '#fff', fontSize: '0.7rem', padding: 6,
                    display: 'flex', alignItems: 'center', textAlign: 'center',
                    borderRadius: 6,
                  }}>
                    {item.error}
                  </div>
                )}

                {item.savings && (
                  <p style={{ fontSize: '0.65rem', color: '#666', margin: '4px 0 0', textAlign: 'center' }}>
                    {item.savings}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', alignItems: 'center' }}>
            <button
              onClick={uploadAll}
              disabled={uploading || pendingCount === 0}
              className="upload-button"
              style={{ padding: '0.6rem 1.4rem', cursor: uploading ? 'wait' : 'pointer' }}
            >
              {uploading
                ? 'Uploading…'
                : `Upload ${pendingCount} photo${pendingCount === 1 ? '' : 's'}`}
            </button>

            {doneCount > 0 && !uploading && (
              <button onClick={clearCompleted} style={{ padding: '0.6rem 1rem' }}>
                Clear {doneCount} finished
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoUpload;
