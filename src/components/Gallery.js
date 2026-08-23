import React, { useState, useEffect } from 'react';
import SectionSelector from './SectionSelector';
import { getPhotos, getSections, gallerySectionsOnly, isUnassignedSection } from '../firebase/db';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState('');
  const [failedIds, setFailedIds] = useState(() => new Set());

  // Fetch sections from database
  useEffect(() => {
    const loadSections = async () => {
      try {
        const loadedSections = await getSections();
        const sortedSections = gallerySectionsOnly(loadedSections).sort((a, b) =>
          a.label.localeCompare(b.label)
        );
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
        setLoading(true);
        
        // Fetch photos based on active section
        const photosData = activeSection === 'all' ? await getPhotos() : await getPhotos(activeSection);
        setPhotos(photosData);
        setFailedIds(new Set());
        setError('');
      } catch (error) {
        console.error('Error loading photos:', error);
        setError('Failed to load photos. Please try again later.');
      } finally {
        setLoading(false);
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
    setSelectedPhoto(null);
    setActiveSection(sectionId);
  };

  const visiblePhotos = filteredPhotos.filter((photo) => {
    if (failedIds.has(photo.id)) return false;
    if (isUnassignedSection(photo.section)) return false;
    const src = photo.thumbnailUrl || photo.url || '';
    // Expired ImageKit hosts hang the browser; skip them.
    if (src.includes('media-hosting.imagekit.io')) return false;
    return Boolean(src);
  });

  const openPhotoDetail = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoDetail = () => {
    setSelectedPhoto(null);
  };

  return (
    <section id="portfolio" className="fade-in gallery-container" style={{
      maxWidth: '1200px',
      margin: '0 auto 100px',
      padding: '0 20px',
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
      ) : visiblePhotos.length === 0 ? (
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
          {visiblePhotos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="gallery-item"
              style={{
                overflow: 'hidden',
                borderRadius: '5px',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                background: 'var(--color-subtle)',
                aspectRatio: photo.aspectRatio ? `${photo.aspectRatio}` : undefined,
              }}
              onClick={() => openPhotoDetail(photo)}
            >
              <div style={{
                position: 'relative',
                overflow: 'hidden',
              }}>
                <img 
                  src={photo.thumbnailUrl || photo.url} 
                  alt={photo.alt || 'Automotive photography'} 
                  loading={index < 6 ? 'eager' : 'lazy'}
                  fetchPriority={index < 3 ? 'high' : 'auto'}
                  decoding="async"
                  width={photo.width || undefined}
                  height={photo.height || undefined}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                    background: 'var(--color-subtle)',
                  }}
                  onError={() => {
                    setFailedIds((prev) => {
                      const next = new Set(prev);
                      next.add(photo.id);
                      return next;
                    });
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
            padding: '20px',
            overflow: 'auto'
          }}
          onClick={closePhotoDetail}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90%',
              width: 'auto',
              animation: 'fadeIn 0.3s ease-out',
              margin: '40px auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: 'sticky',
                top: '0px',
                right: '0px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 1001,
                padding: '5px 15px',
                borderRadius: '50%',
                float: 'right',
                marginBottom: '10px'
              }}
              onClick={closePhotoDetail}
            >
              ×
            </button>
            <img 
              src={selectedPhoto.fullUrl || selectedPhoto.url} 
              alt={selectedPhoto.alt || 'Photography'}
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '1200px',
                maxHeight: '80vh',
                objectFit: 'contain',
                boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
                border: '5px solid white',
                display: 'block'
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
    </section>
  );
};

export default Gallery; 