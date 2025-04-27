import React from 'react';

const SectionSelector = ({ sections, activeSection, onSectionChange }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '60px'
    }}>
      <h2 style={{
        fontSize: '2.2rem',
        fontWeight: '400',
        letterSpacing: '1px',
        marginBottom: '15px',
        fontFamily: 'var(--font-heading)'
      }}>
        Portfolio
      </h2>
      
      <div style={{
        width: '40px',
        height: '2px',
        background: 'var(--color-accent)',
        margin: '0 auto 30px',
        opacity: 0.7
      }}></div>
      
      <p style={{
        maxWidth: '600px',
        margin: '0 auto 30px',
        color: 'var(--color-text)',
        opacity: 0.8,
        fontWeight: 300,
        fontSize: '1.05rem'
      }}>
        Explore my collection of photographs across different categories.
        Each image tells a unique story captured through my lens.
      </p>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px 25px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => onSectionChange('all')}
          style={{
            background: 'none',
            border: 'none',
            color: activeSection === 'all' ? 'var(--color-accent)' : 'var(--color-text)',
            borderBottom: activeSection === 'all' ? '2px solid var(--color-accent)' : '2px solid transparent',
            padding: '8px 4px',
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontWeight: activeSection === 'all' ? '500' : '400',
            letterSpacing: '1.5px',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
        >
          ALL WORKS
        </button>
        
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            style={{
              background: 'none',
              border: 'none',
              color: activeSection === section.id ? 'var(--color-accent)' : 'var(--color-text)',
              borderBottom: activeSection === section.id ? '2px solid var(--color-accent)' : '2px solid transparent',
              padding: '8px 4px',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: activeSection === section.id ? '500' : '400',
              letterSpacing: '1.5px',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            {section.title.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionSelector; 