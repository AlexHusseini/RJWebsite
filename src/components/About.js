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
      <div className="section-header">
        <h2 className="section-title">About the Photographer</h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="card" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 300px) 1fr',
        gap: '50px',
        alignItems: 'center',
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
              boxShadow: '0 5px 15px var(--color-shadow)',
              transition: 'transform 0.5s ease, box-shadow 0.5s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 10px 25px var(--color-shadow)'
              }
            }}
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <h3 style={{
            fontSize: '1.8rem',
            marginBottom: '20px',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-accent)',
            position: 'relative',
            display: 'inline-block'
          }}>
            RJ Shaheen
            <span style={{
              position: 'absolute',
              bottom: '-5px',
              left: '0',
              width: '40%',
              height: '2px',
              background: 'var(--color-accent)',
              opacity: '0.5'
            }}></span>
          </h3>
          
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
            gap: '20px',
            '@media (max-width: 768px)': {
              justifyContent: 'center'
            }
          }}>
            {[
              { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
              { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
              { name: 'Behance', url: 'https://behance.net', icon: 'behance' }
            ].map(social => (
              <div key={social.name} className="about-social">
                <a 
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
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {social.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 