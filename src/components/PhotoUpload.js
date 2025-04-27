import React, { useState } from 'react';
import { uploadPhoto } from '../firebase/storage';
import { addPhoto } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const PhotoUpload = ({ section, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid image file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Upload to Firebase Storage
      const photoURL = await uploadPhoto(file, section);

      // Add to Firestore
      await addPhoto({
        url: photoURL,
        section,
        uploadedBy: currentUser.uid,
        uploadedAt: new Date().toISOString()
      });

      setFile(null);
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      setError('Failed to upload photo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="photo-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />
      {file && (
        <button 
          onClick={handleUpload}
          disabled={loading}
          className="upload-button"
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PhotoUpload; 