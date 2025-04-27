import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './config';

// Constants for free tier limits
const MAX_STORAGE_BYTES = 1 * 1024 * 1024 * 1024; // 1GB in bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file

// Check if adding a new file would exceed storage limit
const checkStorageLimit = async (fileSize) => {
  try {
    const storageRef = ref(storage);
    const result = await listAll(storageRef);
    
    // Get total size of existing files
    let totalSize = 0;
    for (const item of result.items) {
      const metadata = await item.getMetadata();
      totalSize += metadata.size;
    }
    
    // Check if adding new file would exceed limit
    if (totalSize + fileSize > MAX_STORAGE_BYTES) {
      throw new Error('Storage limit exceeded. Please delete some photos first.');
    }
    
    return true;
  } catch (error) {
    console.error('Error checking storage limit:', error);
    throw error;
  }
};

// Upload a photo to Firebase Storage
export const uploadPhoto = async (file, section) => {
  try {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }
    
    // Check storage limit
    await checkStorageLimit(file.size);
    
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${section}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, filename);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

// Delete a photo from Firebase Storage
export const deletePhoto = async (photoURL) => {
  try {
    // Extract the path from the URL
    const path = photoURL.split('/o/')[1].split('?')[0];
    const decodedPath = decodeURIComponent(path);
    const storageRef = ref(storage, decodedPath);
    
    // Delete the file
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}; 