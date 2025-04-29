import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      padding: '30px 20px',
      textAlign: 'center',
      borderTop: '1px solid var(--color-subtle)',
      marginTop: '50px',
      color: 'var(--color-text)',
      opacity: 0.8,
      fontSize: '0.9rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p>© {currentYear} RS Photography. All rights reserved.</p>
        <p style={{ marginTop: '8px' }}>
          Designed & Developed by{' '}
          <a 
            href="https://alexhusseini.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'opacity 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.opacity = 0.7}
            onMouseOut={(e) => e.target.style.opacity = 1}
          >
            Alexander Husseini
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 