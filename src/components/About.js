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
            Hi, I'm RJ Shaheen, the photographer behind RS Photography. My journey began when I was just 16, 
            the day my father handed me his old film camera as we attended my first car show in Atlanta. 
            Something clicked that day – not just the shutter, but a passion that would define my future.
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
            Based in Cumming, Georgia, I've spent the last 5 years developing a style that captures not just the 
            metal and chrome, but the soul and character of every automobile I photograph. From muscle cars rumbling 
            through the North Georgia mountains to exotic supercars against Atlanta's skyline, each shoot is a new adventure.
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
            I believe every car has a story – whether it's a restored classic passed down through generations or a 
            new build representing years of dreams and dedication. My mission is to tell these stories through my lens,
            creating images that you'll proudly display for years to come.
          </p>
          
          <div style={{
            marginTop: '30px',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: 'var(--color-accent-light)',
            borderRadius: '10px',
            '@media (max-width: 768px)': {
              textAlign: 'center'
            }
          }}>
            <h4 style={{
              fontSize: '1.2rem',
              marginBottom: '15px',
              color: 'var(--color-accent)',
              fontWeight: '500'
            }}>Get In Touch</h4>
            
            <div style={{
              fontSize: '1rem',
              marginBottom: '10px'
            }}>
              <strong>Email:</strong> rj.shaheen03@gmail.com
            </div>
            
            <div style={{
              fontSize: '1rem',
              marginBottom: '10px'
            }}>
              <strong>Phone:</strong> (678)-428-2235
            </div>
            
            <div style={{
              fontSize: '1rem'
            }}>
              <strong>Location:</strong> Cumming, GA
            </div>
          </div>
          
          <div style={{
            marginTop: '30px',
            display: 'flex',
            gap: '25px',
            '@media (max-width: 768px)': {
              justifyContent: 'center'
            }
          }}>
            {[
              { name: 'Instagram', url: 'https://www.instagram.com/rs.photography03/', icon: 'instagram' }
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