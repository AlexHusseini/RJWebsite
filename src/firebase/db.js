import { 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  where,
  getCountFromServer,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './config';

// Local storage keys
const PHOTOS_KEY = 'portfolio_photos';
const SECTIONS_KEY = 'portfolio_sections';

// Default sections
const DEFAULT_SECTIONS = [
  { id: 'uncategorized', label: 'Uncategorized' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'street', label: 'Street' },
  { id: 'architecture', label: 'Architecture' }
];

// Constants for free tier limits
const MAX_DAILY_READS = 50000;
const MAX_DAILY_WRITES = 20000;
const MAX_DAILY_DELETES = 20000;

// Track daily operations
let dailyReads = 0;
let dailyWrites = 0;
let dailyDeletes = 0;

// Reset counters daily
setInterval(() => {
  dailyReads = 0;
  dailyWrites = 0;
  dailyDeletes = 0;
}, 24 * 60 * 60 * 1000);

// Check operation limits
const checkOperationLimit = (operationType) => {
  switch (operationType) {
    case 'read':
      if (dailyReads >= MAX_DAILY_READS) {
        throw new Error('Daily read limit exceeded. Please try again tomorrow.');
      }
      dailyReads++;
      break;
    case 'write':
      if (dailyWrites >= MAX_DAILY_WRITES) {
        throw new Error('Daily write limit exceeded. Please try again tomorrow.');
      }
      dailyWrites++;
      break;
    case 'delete':
      if (dailyDeletes >= MAX_DAILY_DELETES) {
        throw new Error('Daily delete limit exceeded. Please try again tomorrow.');
      }
      dailyDeletes++;
      break;
  }
};

// Helper functions
const getStoredData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Photo operations
export const addPhoto = async (photoData) => {
  try {
    checkOperationLimit('write');
    const photosRef = collection(db, 'photos');
    const docRef = await addDoc(photosRef, {
      ...photoData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...photoData };
  } catch (error) {
    console.error("Error adding photo: ", error);
    throw error;
  }
};

export const deletePhoto = async (photoId) => {
  try {
    checkOperationLimit('delete');
    const photoRef = doc(db, 'photos', photoId);
    await deleteDoc(photoRef);
  } catch (error) {
    console.error("Error deleting photo: ", error);
    throw error;
  }
};

export const getPhotos = async (section = null) => {
  try {
    checkOperationLimit('read');
    const photosRef = collection(db, 'photos');
    let q = photosRef;
    
    if (section) {
      q = query(photosRef, where('section', '==', section));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting photos: ", error);
    throw error;
  }
};

// Section operations
export const addSection = async (sectionData) => {
  try {
    checkOperationLimit('write');
    
    // Check if a section with this ID already exists
    const sectionsRef = collection(db, 'sections');
    const q = query(sectionsRef, where('id', '==', sectionData.id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log(`Section with id ${sectionData.id} already exists`);
      return { id: sectionData.id, label: sectionData.label, docId: querySnapshot.docs[0].id };
    }
    
    // If not exists, add a new document (with auto-generated document ID)
    const docRef = await addDoc(sectionsRef, {
      id: sectionData.id,    // This is the section ID (like "landscape")
      label: sectionData.label,
      createdAt: new Date().toISOString()
    });
    
    return { 
      id: sectionData.id, 
      label: sectionData.label,
      docId: docRef.id 
    };
  } catch (error) {
    console.error("Error adding section: ", error);
    throw error;
  }
};

export const deleteSection = async (sectionId) => {
  try {
    // Don't allow deletion of the uncategorized section
    if (sectionId === 'uncategorized') {
      throw new Error("The 'uncategorized' section cannot be deleted");
    }
    
    checkOperationLimit('read'); // First we need to read to find the document
    
    // Find the document that has the field id equal to sectionId
    const sectionsRef = collection(db, 'sections');
    const q = query(sectionsRef, where('id', '==', sectionId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`Section ${sectionId} doesn't exist in Firestore but appears in UI. Treating as deleted.`);
      // Return success even though document doesn't exist - we'll remove it from UI
      return true;
    }
    
    // There should be only one document with this id field
    const docToDelete = querySnapshot.docs[0];
    console.log(`Found section document with ID ${docToDelete.id} for section ${sectionId}`);
    
    checkOperationLimit('delete');
    
    // Delete the document
    await deleteDoc(doc(db, 'sections', docToDelete.id));
    
    console.log(`Section ${sectionId} (document ID: ${docToDelete.id}) successfully deleted`);
    return true;
  } catch (error) {
    console.error("Error deleting section: ", error);
    throw error;
  }
};

export const getSections = async () => {
  try {
    checkOperationLimit('read');
    const sectionsRef = collection(db, 'sections');
    const querySnapshot = await getDocs(sectionsRef);
    
    // Convert Firestore documents to section objects
    // Make sure we use the 'id' field from the document data, not the document ID
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        // Ensure we always use the 'id' field from the data, not the document ID
        return {
          id: data.id, // This is the section ID ("street", "landscape", etc.)
          label: data.label,
          // Include the document ID for reference if needed later
          docId: doc.id // This is the Firestore document ID (like "xinMYMku4PxZzCDki1yy")
        };
      })
      .filter(section => !section.deleted);
  } catch (error) {
    console.error("Error getting sections: ", error);
    throw error;
  }
};

export const updatePhotoSection = async (photoId, newSectionId) => {
  try {
    checkOperationLimit('write');
    
    // Validate the section exists before updating
    const sectionsRef = collection(db, 'sections');
    const sectionQuery = query(sectionsRef, where('id', '==', newSectionId));
    const sectionSnapshot = await getDocs(sectionQuery);
    
    // If section doesn't exist and it's not "uncategorized", create it
    if (sectionSnapshot.empty && newSectionId === 'uncategorized') {
      console.log('Creating missing uncategorized section before updating photo');
      await addSection({ id: 'uncategorized', label: 'Uncategorized' });
    } else if (sectionSnapshot.empty) {
      throw new Error(`Cannot update photo to non-existent section: ${newSectionId}`);
    }
    
    // Update the photo with the new section ID
    const photoRef = doc(db, 'photos', photoId);
    await updateDoc(photoRef, { 
      section: newSectionId,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`Updated photo ${photoId} to section ${newSectionId}`);
  } catch (error) {
    console.error("Error updating photo section: ", error);
    throw error;
  }
}; 