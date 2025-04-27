import React from 'react';

const Header = () => {
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
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginBottom: '30px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <img
            src="/images/car_profile.jpg"
            alt="Classic Porsche"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '32px',
          color: 'var(--color-accent)',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          RJ Shaheen
        </h1>

        <div style={{
          width: '80px',
          height: '2px',
          backgroundColor: 'var(--color-accent)',
          margin: '0 auto 20px',
          opacity: 0.7
        }}></div>

        <div style={{
          padding: '0 20px',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '15px'
          }}>
            Hi, I'm RJ. I'm a passionate automotive photographer based in New York, specializing in classic cars, sports cars, and custom builds. My work aims to capture the elegance, power, and unique character of exceptional automobiles.
          </p>
          
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            I've been photographing cars professionally for over 5 years, and my work has been featured in various automotive exhibitions and publications. When I'm not behind the camera, you can find me at car shows, racetracks, or exploring scenic driving routes.
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
            <a 
              href="https://twitter.com"
              style={{
                color: 'var(--color-text)',
                textDecoration: 'none',
                borderBottom: '2px solid var(--color-accent)',
                padding: '0 3px 3px',
                fontSize: '16px'
              }}
            >
              Twitter
            </a>
            <a 
              href="https://behance.net"
              style={{
                color: 'var(--color-text)',
                textDecoration: 'none',
                borderBottom: '2px solid var(--color-accent)',
                padding: '0 3px 3px',
                fontSize: '16px'
              }}
            >
              Behance
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 