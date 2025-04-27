import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const db = getFirestore();

export const getPhotos = async (section) => {
  try {
    const photosRef = collection(db, 'photos');
    const q = query(photosRef, where('section', '==', section));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting photos:', error);
    throw error;
  }
};

export const addPhoto = async (photoData) => {
  try {
    const photosRef = collection(db, 'photos');
    const docRef = await addDoc(photosRef, {
      ...photoData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding photo:', error);
    throw error;
  }
};

export const deletePhoto = async (photoId) => {
  try {
    const photoRef = doc(db, 'photos', photoId);
    await deleteDoc(photoRef);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}; 