import React from 'react';

const About = () => {
  return (
    <section className="fade-in" style={{
      maxWidth: '900px',
      margin: '0 auto 80px',
      padding: '0 20px',
      lineHeight: '1.8',
      position: 'relative'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '50px'
      }}>
        <h2 style={{
          fontSize: '2.2rem',
          fontWeight: '400',
          marginBottom: '15px',
          letterSpacing: '1px',
          color: 'var(--color-text)'
        }}>About the Photographer</h2>
        
        <div style={{
          width: '40px',
          height: '2px',
          background: 'var(--color-accent)',
          margin: '0 auto 30px',
          opacity: 0.7
        }}></div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 300px) 1fr',
        gap: '50px',
        alignItems: 'center',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        padding: '30px',
        position: 'relative',
        zIndex: 1,
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
          textAlign: 'center'
        }
      }}>
        <div style={{
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '10px',
            bottom: '10px',
            border: '1px solid var(--color-accent)',
            borderRadius: '50%',
            zIndex: -1
          }}></div>
          <img 
            src="/images/photo1.jpg" 
            alt="Photographer" 
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '1/1',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '5px solid white',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <h3 style={{
            fontSize: '1.6rem',
            marginBottom: '20px',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-accent)'
          }}>RJ Shaheen</h3>
          
          <p style={{ 
            marginBottom: '20px', 
            fontSize: '1.05rem',
            fontWeight: 300,
            color: 'var(--color-text)',
            lineHeight: 1.8
          }}>
            Hi, I'm RJ. I'm a passionate photographer based in New York, specializing in landscape, portrait, and street photography.
            My work aims to capture the essence of genuine moments and the beauty in everyday scenes.
          </p>
          
          <p style={{ 
            fontSize: '1.05rem',
            fontWeight: 300,
            color: 'var(--color-text)',
            lineHeight: 1.8
          }}>
            I've been photographing professionally for over 5 years, and my work has been featured in various exhibitions and publications.
            When I'm not behind the camera, you can find me hiking, traveling, or exploring new coffee shops.
          </p>
          
          <div style={{
            marginTop: '25px',
            display: 'flex',
            gap: '15px',
            '@media (max-width: 768px)': {
              justifyContent: 'center'
            }
          }}>
            {[
              { name: 'Instagram', url: 'https://instagram.com' },
              { name: 'Twitter', url: 'https://twitter.com' },
              { name: 'Behance', url: 'https://behance.net' }
            ].map(social => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  borderBottom: '1px solid var(--color-accent)',
                  paddingBottom: '3px',
                  transition: 'color 0.3s ease'
                }}
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 