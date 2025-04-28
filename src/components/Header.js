import React, { useState, useEffect } from 'react';
import { getSettings } from '../firebase/db';

const Header = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsData = await getSettings();
        if (settingsData && settingsData.profilePhoto) {
          setProfilePhoto(settingsData.profilePhoto);
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  return (
    <header style={{
      width: '100%',
      maxWidth: '100%',
      padding: '20px 20px 30px',
      overflow: 'hidden',
      backgroundColor: '#fff'
    }}>
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className="profile-image-container" style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginBottom: '30px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-subtle)'
        }}>
          {profilePhoto && (
            <img
              src={profilePhoto}
              alt="Profile"
              className="profile-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
            />
          )}
          {loading && (
            <div style={{
              position: 'absolute',
              width: '100%', 
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-subtle)',
              color: 'var(--color-text)',
              opacity: 0.7
            }}>
              Loading...
            </div>
          )}
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '32px',
          color: 'var(--color-accent)',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          RS Photography
        </h1>

        <div style={{
          width: '80px',
          height: '2px',
          backgroundColor: 'var(--color-accent)',
          margin: '0 auto 20px',
          opacity: 0.7
        }}></div>

        <p style={{
          textAlign: 'center',
          maxWidth: '600px',
          fontSize: '16px',
          lineHeight: '1.7',
          marginBottom: '20px',
          color: 'var(--color-text)',
          opacity: 0.9
        }}>
          Capturing the soul of automobiles across Georgia and beyond. From classic muscle to modern exotics, I bring your pride and joy to life through the lens.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px'
        }}>
          <a 
            href="https://www.instagram.com/rs.photography03/"
            style={{
              color: 'var(--color-text)',
              textDecoration: 'none',
              borderBottom: '2px solid var(--color-accent)',
              padding: '0 3px 3px',
              fontSize: '16px'
            }}
          >
            Instagram
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header; 