import React from 'react';

const Header = () => {
  return (
    <header style={{
      padding: '50px 0 30px',
      textAlign: 'center',
      borderBottom: '1px solid var(--color-subtle)',
      marginBottom: '60px',
      position: 'relative',
      background: 'linear-gradient(180deg, rgba(245,245,245,0.3) 0%, rgba(255,255,255,1) 100%)'
    }}>
      {/* Social Media Icons */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '15px',
        zIndex: '2'
      }}>
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Instagram" 
          className="social-icon"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" 
            fill="var(--color-accent)"/>
          </svg>
        </a>
        
        <a 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Twitter" 
          className="social-icon"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" 
            fill="var(--color-accent)"/>
          </svg>
        </a>
        
        <a 
          href="https://pinterest.com" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Pinterest" 
          className="social-icon"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" 
            fill="var(--color-accent)"/>
          </svg>
        </a>
        
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="LinkedIn" 
          className="social-icon"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" 
            fill="var(--color-accent)"/>
          </svg>
        </a>
      </div>
      
      <div className="logo" style={{ 
        marginBottom: '15px',
        animation: 'fadeIn 1s ease-out',
        position: 'relative' 
      }}>
        <svg width="70" height="70" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="23" stroke="var(--color-accent)" strokeWidth="2"/>
          <circle cx="25" cy="25" r="15" stroke="var(--color-accent)" strokeWidth="1.5"/>
          <circle cx="25" cy="25" r="8" fill="var(--color-accent)" fillOpacity="0.3"/>
        </svg>
      </div>
      
      <h1 style={{
        fontSize: '2.8rem',
        fontWeight: 400,
        letterSpacing: '6px',
        margin: '0 0 10px 0',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-heading)',
        position: 'relative',
        display: 'inline-block'
      }}>
        APERTURE
        <span style={{
          position: 'absolute',
          bottom: '-5px',
          left: '25%',
          width: '50%',
          height: '1px',
          background: 'var(--color-accent)',
          opacity: '0.5'
        }}></span>
      </h1>
      
      <p style={{
        fontSize: '1rem',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'var(--color-accent)',
        fontWeight: 300,
        margin: '0 0 30px 0'
      }}>
        Photography Portfolio
      </p>
      
      <div className="decoration" style={{
        width: '40px',
        height: '2px',
        background: 'var(--color-accent)',
        margin: '0 auto',
        opacity: 0.7
      }}></div>
    </header>
  );
};

export default Header; 