import React, { useState, useEffect } from 'react';
import { getPhotos, deletePhoto as deletePhotoFromFirestore } from '../firebase/firestore';
import { deletePhoto as deletePhotoFromStorage } from '../firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import PhotoUpload from './PhotoUpload';

const PhotoGallery = ({ section }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const photosList = await getPhotos(section);
      setPhotos(photosList);
    } catch (error) {
      setError('Failed to load photos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [section]);

  const handleDelete = async (photo) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      // Delete from Storage
      await deletePhotoFromStorage(photo.url);
      
      // Delete from Firestore
      await deletePhotoFromFirestore(photo.id);
      
      // Update local state
      setPhotos(photos.filter(p => p.id !== photo.id));
    } catch (error) {
      setError('Failed to delete photo: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading photos...</div>;
  }

  return (
    <div className="photo-gallery">
      {error && <p className="error">{error}</p>}
      
      {currentUser && (
        <PhotoUpload 
          section={section} 
          onUploadComplete={loadPhotos}
        />
      )}

      <div className="photos-grid">
        {photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <img src={photo.url} alt={`Photo in ${section}`} />
            {currentUser && (
              <button 
                onClick={() => handleDelete(photo)}
                className="delete-button"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery; 