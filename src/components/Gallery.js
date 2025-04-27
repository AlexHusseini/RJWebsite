import React, { useState, useEffect } from 'react';
import SectionSelector from './SectionSelector';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Define photography sections
  const sections = [
    { id: 'landscape', title: 'Landscape' },
    { id: 'portrait', title: 'Portrait' },
    { id: 'street', title: 'Street' },
    { id: 'architecture', title: 'Architecture' }
  ];

  useEffect(() => {
    // Create photos data with sections
    const photoData = [
      { id: 1, src: '/images/photo1.jpg', alt: 'Mountain vista at sunset', section: 'landscape', title: 'Mountain Light' },
      { id: 2, src: '/images/photo2.jpg', alt: 'Serene lake reflection', section: 'landscape', title: 'Reflections' },
      { id: 3, src: '/images/photo3.jpg', alt: 'Portrait of a young woman', section: 'portrait', title: 'Contemplation' },
      { id: 4, src: '/images/photo4.jpg', alt: 'Man in urban setting', section: 'portrait', title: 'City Dweller' },
      { id: 5, src: '/images/photo5.jpg', alt: 'Busy street scene', section: 'street', title: 'Urban Movement' },
      { id: 6, src: '/images/photo6.jpg', alt: 'Street vendor at work', section: 'street', title: 'Daily Life' },
      { id: 7, src: '/images/photo7.jpg', alt: 'Modern building exterior', section: 'architecture', title: 'Modernism' },
      { id: 8, src: '/images/photo8.jpg', alt: 'Historic architecture detail', section: 'architecture', title: 'Classical Forms' },
      { id: 9, src: '/images/photo9.jpg', alt: 'Dramatic mountain landscape', section: 'landscape', title: 'Majesty' }
    ];
    
    setPhotos(photoData);
    
    // Add a small delay to simulate loading and trigger fade-in animation
    setTimeout(() => {
      setLoaded(true);
    }, 300);
  }, []);

  // Filter photos based on active section
  const filteredPhotos = activeSection === 'all' 
    ? photos 
    : photos.filter(photo => photo.section === activeSection);

  const handleSectionChange = (sectionId) => {
    setLoaded(false);
    setSelectedPhoto(null);
    
    // Small delay to allow fade-out animation
    setTimeout(() => {
      setActiveSection(sectionId);
      setLoaded(true);
    }, 300);
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
                src={photo.src} 
                alt={photo.alt} 
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

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div 
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
              src={selectedPhoto.src} 
              alt={selectedPhoto.alt}
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