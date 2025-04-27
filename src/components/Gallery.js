import React, { useState, useEffect } from 'react';
import SectionSelector from './SectionSelector';
import { getPhotos } from '../firebase/db';
import { getSections } from '../firebase/db';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [sections, setSections] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState('');

  // Fetch sections from database
  useEffect(() => {
    const loadSections = async () => {
      try {
        const loadedSections = await getSections();
        // Sort sections (keeping 'uncategorized' at the end if it exists)
        const sortedSections = loadedSections.sort((a, b) => {
          if (a.id === 'uncategorized') return 1;
          if (b.id === 'uncategorized') return -1;
          return a.label.localeCompare(b.label);
        });
        setSections(sortedSections);
      } catch (error) {
        console.error('Error loading sections:', error);
        setError('Failed to load gallery sections. Please try again later.');
      }
    };
    
    loadSections();
  }, []);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoaded(false);
        setLoading(true);
        
        // Fetch photos based on active section
        const photosData = activeSection === 'all' ? await getPhotos() : await getPhotos(activeSection);
        setPhotos(photosData);
        setError('');
      } catch (error) {
        console.error('Error loading photos:', error);
        setError('Failed to load photos. Please try again later.');
      } finally {
        setLoading(false);
        // Add a small delay to trigger fade-in animation
        setTimeout(() => {
          setLoaded(true);
        }, 300);
      }
    };

    if (sections.length > 0 || activeSection === 'all') {
      loadPhotos();
    }
  }, [activeSection, sections.length]);

  // Filter photos based on active section
  const filteredPhotos = activeSection === 'all' 
    ? photos 
    : photos.filter(photo => photo.section === activeSection);

  const handleSectionChange = (sectionId) => {
    setLoaded(false);
    setSelectedPhoto(null);
    setActiveSection(sectionId);
  };

  const openPhotoDetail = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoDetail = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="gallery-container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      position: 'relative'
    }}>
      <SectionSelector 
        sections={sections} 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      {error && (
        <div style={{
          textAlign: 'center',
          color: '#ff4444',
          margin: '20px 0',
          padding: '10px',
          background: 'rgba(255,68,68,0.1)',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--color-text)',
          fontSize: '1.1rem'
        }}>
          Loading photos...
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--color-text)',
          fontSize: '1.1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <h3 style={{ 
            marginBottom: '10px',
            color: 'var(--color-accent)',
            fontWeight: '400'
          }}>
            Coming Soon
          </h3>
          <p style={{ 
            margin: '0',
            opacity: '0.8',
            lineHeight: '1.6'
          }}>
            {activeSection === 'all' 
              ? 'The photo gallery is currently being curated. Please check back soon for amazing photography content.'
              : `The ${activeSection} section is currently being curated. Please check back soon for amazing ${activeSection} photography.`
            }
          </p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="gallery-item"
              style={{
                overflow: 'hidden',
                borderRadius: '5px',
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                transitionDelay: `${(photo.id % 5) * 0.1}s`,
                marginBottom: '5px',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                background: 'white'
              }}
              onClick={() => openPhotoDetail(photo)}
            >
              <div style={{
                position: 'relative',
                overflow: 'hidden',
                paddingBottom: '75%', // 4:3 aspect ratio
              }}>
                <img 
                  src={photo.url} 
                  alt={photo.alt || 'Photography'} 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                  padding: '20px 15px 12px',
                  color: 'white',
                  textAlign: 'left',
                  transform: 'translateY(100%)',
                  transition: 'transform 0.3s ease',
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(100%)';
                  e.currentTarget.style.opacity = 0;
                }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '5px', fontWeight: 500 }}>{photo.title}</h3>
                  <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>{photo.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection !== 'all' && (
        <div className="section-description" style={{
          textAlign: 'center',
          marginBottom: '40px',
          maxWidth: '700px',
          margin: '0 auto 50px'
        }}>
          <p style={{ 
            fontSize: '1.05rem', 
            fontWeight: '300',
            color: 'var(--color-text)',
            lineHeight: 1.8,
            fontStyle: 'italic'
          }}>
            {activeSection === 'landscape' && 'Capturing the vast beauty of natural landscapes, from majestic mountains to serene seascapes, revealing the timeless splendor of our world.'}
            {activeSection === 'portrait' && 'Intimate portrait photography that goes beyond appearance to reveal the essence, emotions, and stories behind each face.'}
            {activeSection === 'street' && 'Authentic moments of urban life, candid interactions, and the poetry of everyday scenes found in the rhythm of city streets.'}
            {activeSection === 'architecture' && 'Exploring the artistry of built environments, from historic structures to contemporary designs, highlighting form, light, and human ingenuity.'}
          </p>
        </div>
      )}

      {selectedPhoto && (
        <div 
          className="photo-detail"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={closePhotoDetail}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              animation: 'fadeIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 1001
              }}
              onClick={closePhotoDetail}
            >
              ×
            </button>
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.alt || 'Photography'}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
                border: '5px solid white'
              }}
            />
            <div style={{
              background: 'white',
              padding: '20px',
              textAlign: 'left'
            }}>
              <h3 style={{ 
                margin: '0 0 10px 0', 
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem' 
              }}>
                {selectedPhoto.title}
              </h3>
              <p style={{ margin: 0, fontWeight: 300, fontSize: '1rem' }}>{selectedPhoto.alt}</p>
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'var(--color-text)', 
                opacity: 0.7,
                marginTop: '10px',
                fontStyle: 'italic',
                textTransform: 'capitalize'
              }}>
                {selectedPhoto.section} Photography
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 