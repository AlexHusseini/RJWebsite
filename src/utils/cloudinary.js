export const DEFAULT_CLOUD_NAME = 'lotcw8ij';
export const DEFAULT_UPLOAD_PRESET = 'rs-photos';

export async function uploadImageToCloudinary(file, { cloudName, uploadPreset }) {
  if (!cloudName || !uploadPreset) {
    throw new Error('Photo upload is not configured.');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: 'POST', body: form }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed');
  }
  return data;
}

export function cloudinaryDeliveryUrl(uploaded, transform) {
  const original = uploaded.secure_url || uploaded.url;
  if (!original) {
    throw new Error('Cloudinary did not return an image URL');
  }
  return original.replace('/upload/', `/upload/${transform}/`);
}
