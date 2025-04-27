import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import About from './components/About';
import Gallery from './components/Gallery';
import Navigation from './components/Navigation';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { checkSession } from './auth/authUtils';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check for existing session on load
  useEffect(() => {
    const checkAdminAuth = async () => {
      const isAuthenticated = await checkSession();
      setIsAdmin(isAuthenticated);
      
      // If the user has a valid session and tries to access the admin panel
      if (isAuthenticated && window.location.hash === '#admin') {
        setActiveTab('admin');
      }
    };
    
    checkAdminAuth();
  }, []);

  // Handle logout from admin panel
  const handleLogout = () => {
    setActiveTab('home');
    setIsAdmin(false);
    // Update URL to remove any potential #admin hash
    if (window.location.hash) {
      window.history.pushState("", document.title, window.location.pathname);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <About />
            <div style={{ textAlign: 'center', margin: '60px 0' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                marginBottom: '20px'
              }}>Featured Work</h2>
              <p style={{
                fontSize: '1.05rem',
                maxWidth: '600px',
                margin: '0 auto 40px',
                color: 'var(--color-text)',
                opacity: 0.8,
                fontWeight: 300,
                lineHeight: 1.6
              }}>
                A curated collection of my best photography across various styles and subjects.
                Click on the Portfolio tab to explore all my work.
              </p>
              <button 
                onClick={() => setActiveTab('portfolio')}
                style={{
                  background: 'var(--color-accent)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '5px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 5px 15px rgba(166, 124, 82, 0.2)'
                }}
              >
                VIEW FULL PORTFOLIO
              </button>
            </div>
          </>
        );
      case 'portfolio':
        return <Gallery />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return isAdmin ? <AdminPanel onLogout={handleLogout} /> : <div>Not authorized</div>;
      default:
        return <About />;
    }
  };

  // Handle successful login
  const handleLogin = () => {
    setShowLoginModal(false);
    setIsAdmin(true);
    setActiveTab('admin');
    // Update URL with a hash to allow for bookmarking/sharing the admin panel
    window.location.hash = 'admin';
  };

  return (
    <div className="App" style={{ 
      backgroundColor: 'var(--color-background)', 
      color: 'var(--color-text)',
      minHeight: '100vh',
      position: 'relative',
    }}>
      {/* Background accent elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '5%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'var(--color-subtle)',
        opacity: 0.4,
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'var(--color-subtle)',
        opacity: 0.3,
        zIndex: 0
      }}></div>
      
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {renderContent()}
        
        {/* Admin Link */}
        {activeTab !== 'admin' && (
          <div style={{ 
            textAlign: 'center', 
            margin: '40px 0 0',
            opacity: 0.5,
            fontSize: '0.85rem' 
          }}>
            <button 
              onClick={() => setShowLoginModal(true)} 
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.85rem',
                color: 'var(--color-text)',
                opacity: 0.7,
                transition: 'opacity 0.3s ease',
                padding: '8px'
              }}
            >
              Site Admin
            </button>
          </div>
        )}
        
        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)} 
            onLogin={handleLogin}
          />
        )}
        
        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--color-text)',
          opacity: 0.7,
          fontSize: '0.9rem',
          borderTop: '1px solid var(--color-subtle)',
          marginTop: '60px'
        }}>
          <p>© {new Date().getFullYear()} Aperture Photography. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
