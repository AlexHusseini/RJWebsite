import React, { useState, useRef, useEffect } from 'react';
import { logout } from '../auth/authUtils';
import { 
  getPhotos, 
  addPhoto, 
  deletePhoto as deletePhotoFromDb, 
  getSections, 
  addSection, 
  deleteSection, 
  updatePhotoSection 
} from '../firebase/db';
import { uploadPhoto, deletePhoto } from '../firebase/storage';

const AdminPanel = ({ onLogout }) => {
  const [photos, setPhotos] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    section: '',
    alt: '',
    url: ''
  });
  const [newSection, setNewSection] = useState({
    id: '',
    label: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Load photos and sections on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedPhotos, loadedSections] = await Promise.all([
          getPhotos(),
          getSections()
        ]);
        
        // If no sections exist in Firestore, add only the essential ones
        if (loadedSections.length === 0) {
          // Only add the uncategorized section by default
          const essentialSections = [
            { id: 'uncategorized', label: 'Uncategorized' }
          ];
          
          console.log('No sections found, adding essential sections');
          for (const section of essentialSections) {
            try {
              await addSection(section);
              console.log(`Added essential section: ${section.id}`);
            } catch (e) {
              console.error(`Failed to add essential section ${section.id}:`, e);
            }
          }
          setSections(essentialSections);
        } else {
          // Check if uncategorized section exists, add it if not
          const hasUncategorized = loadedSections.some(section => section.id === 'uncategorized');
          if (!hasUncategorized) {
            console.log('Adding missing uncategorized section');
            const uncategorizedSection = { id: 'uncategorized', label: 'Uncategorized' };
            await addSection(uncategorizedSection);
            setSections([...loadedSections, uncategorizedSection]);
          } else {
            setSections(loadedSections);
          }
        }
        
        setPhotos(loadedPhotos);
        setError(null);
      } catch (error) {
        console.error("Error loading data:", error);
        setError('Error loading data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredPhotos = activeTab === 'all' 
    ? photos 
    : photos.filter(photo => photo.section === activeTab);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPhoto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection(prev => ({
      ...prev,
      [name]: value,
      id: name === 'label' ? value.toLowerCase().replace(/\s+/g, '-') : prev.id
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(prev => ({
        ...prev,
        file: file
      }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto.url) {
      setError('Please provide an image URL');
      return;
    }
    
    if (!newPhoto.section) {
      setError('Please select a category for the photo');
      return;
    }

    setIsLoading(true);
    try {
      // Add photo data to Firestore
      const photoData = {
        url: newPhoto.url,
        section: newPhoto.section,
        title: newPhoto.title || 'Untitled',
        alt: newPhoto.alt || 'Photography image',
        timestamp: new Date().toISOString()
      };

      await addPhoto(photoData);

      // Reset form and update UI
      setNewPhoto({
        title: '',
        section: '',
        alt: '',
        url: ''
      });

      // Reload photos to ensure UI is updated
      const updatedPhotos = await getPhotos();
      setPhotos(updatedPhotos);

      setShowSuccess('Photo added successfully!');
    } catch (error) {
      console.error('Error adding photo:', error);
      setError('Failed to add photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!newSection.label) {
        setShowSuccess('Please fill in all fields');
        return;
      }
      if (sections.some(section => section.id === newSection.id)) {
        setShowSuccess('Section ID already exists');
        return;
      }
      const addedSection = await addSection({ id: newSection.id, label: newSection.label });
      setSections(prevSections => [...prevSections, addedSection]);
      // Reset form
      setNewSection({
        id: '',
        label: ''
      });
      setShowSuccess('Section added successfully!');
    } catch (error) {
      console.error('Error adding section:', error);
      setShowSuccess('Error adding section. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowSuccess('');
      }, 3000);
    }
  };

  const handleDeletePhoto = async (photoId, photoURL) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Only try to delete from storage if the URL is a Firebase Storage URL
      if (photoURL && photoURL.includes('firebasestorage.googleapis.com')) {
        await deletePhoto(photoURL);
      }
      // Always delete from Firestore
      await deletePhotoFromDb(photoId);

      // Update UI
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
      setShowSuccess('Photo deleted successfully!');
    } catch (error) {
      console.error('Error deleting photo:', error);
      setError('Failed to delete photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSection = async (id) => {
    // Don't allow deletion of uncategorized section
    if (id === 'uncategorized') {
      setError("The 'Uncategorized' section cannot be deleted as it's required for the system.");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this section? All photos in this section will be moved to "Uncategorized".')) {
      setIsLoading(true);
      try {
        // First remove the section from UI to provide immediate feedback
        setSections(prevSections => prevSections.filter(section => section.id !== id));
        
        // Move photos to uncategorized
        const photosToUpdate = photos.filter(photo => photo.section === id);
        if (photosToUpdate.length > 0) {
          console.log(`Moving ${photosToUpdate.length} photos to uncategorized section`);
          // Update local state first for immediate UI feedback
          setPhotos(prevPhotos => 
            prevPhotos.map(photo => 
              photo.section === id ? { ...photo, section: 'uncategorized' } : photo
            )
          );
          
          // Then update in database
          for (const photo of photosToUpdate) {
            try {
              await updatePhotoSection(photo.id, 'uncategorized');
              console.log(`Updated photo ${photo.id} to uncategorized section`);
            } catch (error) {
              console.error(`Failed to update photo ${photo.id}:`, error);
              // Continue with other photos even if one fails
            }
          }
        }
        
        // Mark section as deleted
        console.log(`Attempting to delete section: ${id}`);
        await deleteSection(id);
        
        setShowSuccess('Section deleted successfully!');
      } catch (error) {
        console.error("Error deleting section:", error);
        setError(`Error deleting section: ${error.message}`);
        
        // Reload sections to ensure UI is in sync with database, but keep the original error
        try {
          const currentSections = await getSections();
          setSections(currentSections);
        } catch (e) {
          console.error("Failed to reload sections after error:", e);
        }
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          setShowSuccess('');
          setError(null);
        }, 3000);
      }
    }
  };

  const handleMovePhoto = async (photoId, newSectionId) => {
    if (!newSectionId) return;
    
    setIsLoading(true);
    try {
      // Update the photo section in the database
      await updatePhotoSection(photoId, newSectionId);
      
      // Update local state
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => 
          photo.id === photoId ? { ...photo, section: newSectionId } : photo
        )
      );
      
      setShowSuccess(`Photo moved to ${sections.find(s => s.id === newSectionId)?.label} successfully!`);
    } catch (error) {
      console.error('Error moving photo:', error);
      setError(`Failed to move photo: ${error.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowSuccess('');
        setError(null);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <p>Loading...</p>
        {error && (
          <p style={{ color: 'red' }}>{error}</p>
        )}
      </div>
    );
  }

  return (
    <section className="fade-in" style={{
      maxWidth: '1100px',
      margin: '0 auto 80px',
      padding: '0 20px',
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        position: 'relative'
      }}>
        <button 
          onClick={() => {
            logout();
            if (onLogout) onLogout();
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: '1px solid var(--color-subtle)',
            padding: '8px 15px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            color: 'var(--color-text)',
            opacity: 0.7,
            transition: 'all 0.3s ease',
          }}
        >
          Log Out
        </button>
        
        <h2 style={{
          fontSize: '2.2rem',
          fontWeight: '400',
          marginBottom: '15px',
          letterSpacing: '1px',
          color: 'var(--color-text)'
        }}>Admin Panel</h2>
        
        <div style={{
          width: '40px',
          height: '2px',
          background: 'var(--color-accent)',
          margin: '0 auto 20px',
          opacity: 0.7
        }}></div>
        
        <p style={{
          maxWidth: '600px',
          margin: '0 auto',
          color: 'var(--color-text)',
          opacity: 0.8,
          fontWeight: 300,
          fontSize: '1.1rem',
          lineHeight: 1.6
        }}>
          Manage your photography portfolio by adding or removing images and sections.
        </p>
      </div>

      {showSuccess && (
        <div style={{
          backgroundColor: 'rgba(75, 181, 67, 0.1)',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#4BB543',
            fontWeight: '500',
            margin: 0
          }}>{showSuccess}</p>
        </div>
      )}

      {/* Section Management */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        padding: '30px',
        marginBottom: '50px'
      }}>
        <h3 style={{
          fontSize: '1.4rem',
          marginBottom: '20px',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-accent)'
        }}>Manage Sections</h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Add Section Form */}
          <div>
            <form onSubmit={handleAddSection}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="sectionLabel"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.9rem',
                    opacity: 0.8
                  }}
                >
                  Section Name
                </label>
                <input
                  type="text"
                  id="sectionLabel"
                  name="label"
                  value={newSection.label}
                  onChange={handleSectionInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '5px',
                    border: '1px solid var(--color-subtle)',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'var(--color-accent)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '5px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  letterSpacing: '1px',
                  width: '100%'
                }}
              >
                ADD SECTION
              </button>
            </form>
          </div>

          {/* Section List */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              marginBottom: '15px',
              color: 'var(--color-text)'
            }}>Current Sections</h4>
            
            <div style={{
              display: 'grid',
              gap: '10px'
            }}>
              {sections.map(section => (
                <div key={section.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 15px',
                  background: 'var(--color-subtle)',
                  borderRadius: '5px'
                }}>
                  <span>{section.label}</span>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff4444',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '5px 10px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Management */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '40px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        padding: '30px',
        marginBottom: '50px',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
        }
      }}>
        {/* Add Photo Form */}
        <div style={{
          borderRight: '1px solid var(--color-subtle)',
          paddingRight: '30px',
          '@media (max-width: 768px)': {
            borderRight: 'none',
            borderBottom: '1px solid var(--color-subtle)',
            paddingRight: 0,
            paddingBottom: '30px',
            marginBottom: '30px'
          }
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            marginBottom: '20px',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-accent)'
          }}>Add New Photo</h3>
          
          <form onSubmit={handleAddPhoto}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="title"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}
              >
                Photo Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newPhoto.title}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '5px',
                  border: '1px solid var(--color-subtle)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="section"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}
              >
                Category
              </label>
              <select
                id="section"
                name="section"
                value={newPhoto.section}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '5px',
                  border: '1px solid var(--color-subtle)',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select a category</option>
                {sections.map(section => (
                  <option key={section.id} value={section.id}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="alt"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}
              >
                Photo Description
              </label>
              <input
                type="text"
                id="alt"
                name="alt"
                value={newPhoto.alt}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '5px',
                  border: '1px solid var(--color-subtle)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label
                htmlFor="url"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}
              >
                Image URL
              </label>
              <input
                type="text"
                id="url"
                name="url"
                value={newPhoto.url}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '5px',
                  border: '1px solid var(--color-subtle)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
                placeholder="Paste a direct image URL (e.g. from Imgur, Cloudinary, etc.)"
              />
              {newPhoto.url && (
                <div style={{ marginTop: '10px' }}>
                  <img src={newPhoto.url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </div>
              )}
            </div>
            
            <button
              type="submit"
              style={{
                background: 'var(--color-accent)',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '5px',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                letterSpacing: '1px',
                width: '100%'
              }}
            >
              ADD PHOTO
            </button>
          </form>
        </div>
        
        {/* Photo Management */}
        <div>
          <h3 style={{
            fontSize: '1.4rem',
            marginBottom: '20px',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-accent)'
          }}>Manage Photos</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'inline-block',
                marginRight: '10px',
                marginBottom: '8px',
                fontSize: '0.9rem',
                opacity: 0.8
              }}
            >
              Filter by:
            </label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              style={{
                padding: '8px 15px',
                borderRadius: '5px',
                border: '1px solid var(--color-subtle)',
                fontSize: '0.9rem',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Photos</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {filteredPhotos.map(photo => (
              <div key={photo.id} style={{
                position: 'relative',
                borderRadius: '5px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={photo.url} 
                  alt={photo.alt}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '10px',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '5px' }}>{photo.title}</div>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ opacity: 0.8 }}>
                      {sections.find(s => s.id === photo.section)?.label}
                    </div>
                    <div style={{
                      position: 'relative',
                      marginLeft: '8px',
                      width: '100px'
                    }}>
                      <select
                        onChange={(e) => handleMovePhoto(photo.id, e.target.value)}
                        value=""
                        style={{
                          padding: '3px 8px',
                          fontSize: '0.8rem',
                          borderRadius: '3px',
                          border: '1px solid rgba(166, 124, 82, 0.5)',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        <option value="" disabled>Move to...</option>
                        {sections
                          .filter(s => s.id !== photo.section)
                          .map(section => (
                            <option key={section.id} value={section.id}>
                              {section.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePhoto(photo.id, photo.url)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255,68,68,0.9)',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel; 