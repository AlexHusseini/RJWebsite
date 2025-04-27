import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'HOME' },
    { id: 'portfolio', label: 'PORTFOLIO' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' }
  ];
  
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    
    // Add a small delay to ensure the component is rendered before scrolling
    setTimeout(() => {
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // If there's no specific element with that ID, scroll to top for home
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      padding: '15px 10px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px'
      }}>
        {tabs.map(tab => (
          <li key={tab.id}>
            <button
              onClick={() => handleTabClick(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text)',
                fontWeight: activeTab === tab.id ? '500' : '400',
                fontSize: '14px',
                padding: '8px 12px',
                cursor: 'pointer',
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