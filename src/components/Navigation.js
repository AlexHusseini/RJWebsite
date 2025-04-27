import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'HOME' },
    { id: 'portfolio', label: 'PORTFOLIO' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' }
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
      marginBottom: '30px'
    }}>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '40px',
        padding: 0,
        margin: 0
      }}>
        {tabs.map(tab => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text)',
                fontSize: '0.9rem',
                letterSpacing: '2px',
                padding: '8px 0',
                cursor: 'pointer',
                position: 'relative',
                fontWeight: activeTab === tab.id ? '500' : '400',
                transition: 'color 0.3s ease',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent'
              }}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 