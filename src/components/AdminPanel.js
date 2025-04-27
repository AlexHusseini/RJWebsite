import React, { useState, useRef } from 'react';
import { logout } from '../auth/authUtils';

const AdminPanel = ({ onLogout }) => {
  const [photos, setPhotos] = useState([
    { id: 1, src: '/images/photo1.jpg', title: 'Mountain Light', section: 'landscape', alt: 'Mountain vista at sunset' },
    { id: 2, src: '/images/photo2.jpg', title: 'Reflections', section: 'landscape', alt: 'Serene lake reflection' },
    { id: 3, src: '/images/photo3.jpg', title: 'Contemplation', section: 'portrait', alt: 'Portrait of a young woman' },
    { id: 4, src: '/images/photo4.jpg', title: 'City Dweller', section: 'portrait', alt: 'Man in urban setting' },
    { id: 5, src: '/images/photo5.jpg', title: 'Urban Movement', section: 'street', alt: 'Busy street scene' },
    { id: 6, src: '/images/photo6.jpg', title: 'Daily Life', section: 'street', alt: 'Street vendor at work' },
    { id: 7, src: '/images/photo7.jpg', title: 'Modernism', section: 'architecture', alt: 'Modern building exterior' },
    { id: 8, src: '/images/photo8.jpg', title: 'Classical Forms', section: 'architecture', alt: 'Historic architecture detail' },
    { id: 9, src: '/images/photo9.jpg', title: 'Majesty', section: 'landscape', alt: 'Dramatic mountain landscape' }
  ]);

  const [activeTab, setActiveTab] = useState('all');
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    section: 'landscape',
    alt: '',
    file: null
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const sections = [
    { id: 'landscape', label: 'Landscape' },
    { id: 'portrait', label: 'Portrait' },
    { id: 'street', label: 'Street' },
    { id: 'architecture', label: 'Architecture' }
  ];

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

  const handleAddPhoto = (e) => {
    e.preventDefault();
    
    // In a real app, you would upload the file to a server here
    // For this demo, we'll just add it to our local state
    
    const newId = photos.length > 0 ? Math.max(...photos.map(p => p.id)) + 1 : 1;
    
    const photoToAdd = {
      id: newId,
      src: previewUrl || '/images/placeholder.jpg', // In real app, this would be the uploaded image URL
      title: newPhoto.title,
      section: newPhoto.section,
      alt: newPhoto.alt
    };
    
    setPhotos(prevPhotos => [...prevPhotos, photoToAdd]);
    
    // Reset form
    setNewPhoto({
      title: '',
      section: 'landscape',
      alt: '',
      file: null
    });
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleDeletePhoto = (id) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
    }
  };

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
          Easily manage your photography portfolio by adding or removing images.
        </p>
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
          
          {showSuccess && (
            <div style={{
              backgroundColor: 'rgba(75, 181, 67, 0.1)',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <p style={{
                color: '#4BB543',
                fontWeight: '500',
                margin: 0
              }}>Photo added successfully!</p>
            </div>
          )}
          
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
                htmlFor="photo"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}
              >
                Upload Photo
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                required
                style={{
                  width: '100%',
                  marginBottom: '10px'
                }}
              />
              
              {previewUrl && (
                <div style={{
                  width: '100%',
                  marginTop: '10px',
                  borderRadius: '5px',
                  overflow: 'hidden',
                }}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover'
                    }} 
                  />
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
              Filter by Category:
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
            maxHeight: '500px',
            overflowY: 'auto',
            padding: '10px',
            border: '1px solid var(--color-subtle)',
            borderRadius: '5px'
          }}>
            {filteredPhotos.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', opacity: 0.7 }}>
                No photos in this category.
              </p>
            ) : (
              filteredPhotos.map(photo => (
                <div 
                  key={photo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px',
                    padding: '15px',
                    borderRadius: '5px',
                    backgroundColor: 'var(--color-background)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}
                >
                  <img 
                    src={photo.src} 
                    alt={photo.alt}
                    style={{
                      width: '80px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginRight: '15px'
                    }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{photo.title}</h4>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      textTransform: 'capitalize',
                      opacity: 0.7 
                    }}>
                      Category: {photo.section}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #ff6b6b',
                      color: '#ff6b6b',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        backgroundColor: '#ff6b6b',
                        color: 'white'
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Instructions for Client */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        padding: '30px',
      }}>
        <h3 style={{
          fontSize: '1.4rem',
          marginBottom: '20px',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-accent)',
          textAlign: 'center'
        }}>How to Use This Admin Panel</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '25px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
          }
        }}>
          <div style={{
            textAlign: 'center',
            padding: '25px 15px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '500', color: 'var(--color-accent)' }}>1</span>
            </div>
            <h4 style={{ marginBottom: '10px' }}>Add Your Photo</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Fill out the form with your photo title, choose a category, add a description, and upload your image file.
            </p>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '25px 15px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '500', color: 'var(--color-accent)' }}>2</span>
            </div>
            <h4 style={{ marginBottom: '10px' }}>Manage Gallery</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Use the filter to view photos by category. You can remove any photo from the collection by clicking the delete button.
            </p>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '25px 15px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '500', color: 'var(--color-accent)' }}>3</span>
            </div>
            <h4 style={{ marginBottom: '10px' }}>View Your Site</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              After making changes, visit your website to see your updated portfolio. Your changes will be visible in the appropriate category.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel; 