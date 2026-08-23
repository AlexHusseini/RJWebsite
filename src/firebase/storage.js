import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Processed files are already compressed; this is just a safety cap.
const MAX_FILE_SIZE = 12 * 1024 * 1024;

export const uploadPhoto = async (file, section) => {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File is still too large after compression. Try a smaller photo.');
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^\w.-]+/g, '_');
    const filename = `${section}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, filename);

    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

export const deletePhoto = async (photoURL) => {
  try {
    if (!photoURL || !photoURL.includes('/o/')) return;
    const path = photoURL.split('/o/')[1].split('?')[0];
    const decodedPath = decodeURIComponent(path);
    const storageRef = ref(storage, decodedPath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};
