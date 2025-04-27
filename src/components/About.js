import React from 'react';

const About = () => {
  return (
    <section id="about" className="fade-in" style={{
      maxWidth: '1000px',
      margin: '0 auto 100px',
      padding: '0 30px',
      lineHeight: '1.8',
      position: 'relative'
    }}>
      {/* Background accent elements */}
      <div className="float-animation" style={{
        position: 'absolute',
        top: '15%',
        right: '-10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(78, 124, 138, 0.05) 0%, rgba(78, 124, 138, 0.02) 70%, transparent 100%)',
        zIndex: -1,
        animationDuration: '15s'
      }}></div>
      
      <div className="float-animation" style={{
        position: 'absolute',
        bottom: '10%',
        left: '-15%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(78, 124, 138, 0.05) 0%, rgba(78, 124, 138, 0.02) 70%, transparent 100%)',
        zIndex: -1,
        animationDuration: '18s',
        animationDelay: '1s'
      }}></div>
      
      <div className="card" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(250px, 350px) 1fr',
        gap: '60px',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        overflow: 'visible',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
          textAlign: 'center',
          gap: '40px',
          display: 'flex',
          flexDirection: 'column'
        }
      }}>
        <div style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}>
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '-15px',
            right: '15px',
            bottom: '15px',
            border: '2px solid var(--color-accent)',
            borderRadius: '50%',
            zIndex: -1,
            opacity: 0.4,
            transform: 'translateZ(-10px)'
          }}></div>
          
          <div className="photo-container" style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '50%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 0 0 5px rgba(255,255,255,0.7), 0 0 0 1px rgba(78, 124, 138, 0.2)',
            transformStyle: 'preserve-3d',
            transform: 'rotateY(5deg) rotateX(2deg)',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'rotateY(0deg) rotateX(0deg)'
            }
          }}>
            <img 
              src="/images/car_profile.jpg" 
              alt="Classic Silver Porsche" 
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '1/1',
                objectFit: 'cover',
                transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              padding: '5px',
              background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.4), transparent 60%, rgba(0, 0, 0, 0.1))',
              pointerEvents: 'none'
            }}></div>
          </div>
        </div>
        
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            top: '-30px',
            left: '0',
            fontSize: '5rem',
            opacity: '0.05',
            color: 'var(--color-accent)',
            fontFamily: 'Georgia, serif',
            zIndex: -1
          }}>
            "
          </span>
          
          <h3 style={{
            fontSize: '2.2rem',
            marginBottom: '25px',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-accent)',
            position: 'relative',
            display: 'inline-block',
            fontWeight: '500'
          }}>
            About Me
            <span style={{
              position: 'absolute',
              bottom: '-8px',
              left: '0',
              width: '60%',
              height: '3px',
              background: 'linear-gradient(to right, var(--color-accent), transparent)',
              opacity: '0.7'
            }}></span>
          </h3>
          
          <p style={{ 
            fontSize: '1.15rem',
            fontWeight: 300,
            color: 'var(--color-text)',
            lineHeight: 1.9,
            marginBottom: '25px',
            position: 'relative',
            zIndex: 1
          }}>
            Hi, I'm RJ Shaheen, a passionate automotive photographer based in New York with over 5 years of professional experience. 
            I specialize in capturing the elegance and power of classic cars, sports cars, and custom builds.
          </p>
          
          <p style={{ 
            fontSize: '1.15rem',
            fontWeight: 300,
            color: 'var(--color-text)',
            lineHeight: 1.9,
            marginBottom: '25px',
            position: 'relative',
            zIndex: 1
          }}>
            My approach combines technical precision with artistic composition to highlight the unique personality of each vehicle. 
            Whether it's the timeless curves of vintage classics or the aggressive lines of modern supercars, 
            I strive to create images that evoke emotion and showcase automotive design at its finest.
          </p>
          
          <p style={{ 
            fontSize: '1.15rem',
            fontWeight: 300,
            color: 'var(--color-text)',
            lineHeight: 1.9,
            marginBottom: '30px',
            position: 'relative',
            zIndex: 1
          }}>
            My work has been featured in various automotive exhibitions and publications including Road & Track, Classic Driver, and Petrolicious. 
            When I'm not behind the camera, you can find me at car shows, racetracks, or exploring scenic driving routes with my own collection of classic cars.
          </p>
          
          <div style={{
            marginTop: '30px',
            display: 'flex',
            gap: '25px',
            '@media (max-width: 768px)': {
              justifyContent: 'center'
            }
          }}>
            {[
              { name: 'Instagram', url: 'https://www.instagram.com/rs.photography03/', icon: 'instagram' },
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
                    fontSize: '1rem',
                    fontWeight: 500,
                    letterSpacing: '1px',
                    borderBottom: '2px solid var(--color-accent)',
                    paddingBottom: '5px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
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