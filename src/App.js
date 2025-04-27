import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import About from './components/About';
import Gallery from './components/Gallery';
import Navigation from './components/Navigation';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import { checkSession } from './auth/authUtils';

function App() {
  console.log('App component rendering');
  const [activeTab, setActiveTab] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    // Set the viewport height initially and on resize
    const setVH = () => {
      // First we get the viewport height and multiply it by 1% to get a value for a vh unit
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setViewportHeight(window.innerHeight);
    };
    
    // Set the height initially
    setVH();
    
    // Add event listener
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
  
  // Check for existing session on load
  useEffect(() => {
    console.log('App useEffect running');
    const checkAdminAuth = async () => {
      console.log('Checking admin auth');
      const isAuthenticated = await checkSession();
      console.log('Auth status:', isAuthenticated);
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
    console.log('Logging out');
    setActiveTab('home');
    setIsAdmin(false);
    // Update URL to remove any potential #admin hash
    if (window.location.hash) {
      window.history.pushState("", document.title, window.location.pathname);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    console.log('Rendering content for tab:', activeTab);
    switch (activeTab) {
      case 'home':
        return (
          <div id="home" className="fade-in">
            <section style={{
              maxWidth: '1200px',
              margin: '0 auto 80px',
              padding: '0 20px',
              position: 'relative'
            }}>
              {/* Hero Banner */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                marginBottom: '60px',
                position: 'relative'
              }}>
                <h1 style={{
                  fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '20px',
                  color: 'var(--color-accent)',
                  fontWeight: '400',
                  lineHeight: '1.2'
                }}>
                  Capturing Automotive Excellence
                </h1>
                
                <p style={{
                  fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                  maxWidth: '700px',
                  marginBottom: '40px',
                  color: 'var(--color-text)',
                  fontWeight: '300',
                  lineHeight: '1.6'
                }}>
                  Specializing in custom automotive photography throughout Georgia and beyond. From classic cars to modern builds, I capture the unique character of every vehicle.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '50px',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  <button 
                    onClick={() => handleTabClick('portfolio')}
                    style={{
                      background: 'var(--color-accent)',
                      color: 'white',
                      border: 'none',
                      padding: '14px 30px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      letterSpacing: '1px',
                      boxShadow: '0 8px 20px rgba(var(--color-accent-rgb), 0.3)'
                    }}
                  >
                    VIEW PORTFOLIO
                  </button>
                  
                  <button 
                    onClick={() => handleTabClick('contact')}
                    style={{
                      background: 'transparent',
                      color: 'var(--color-accent)',
                      border: '2px solid var(--color-accent)',
                      padding: '14px 30px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      letterSpacing: '1px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    GET IN TOUCH
                  </button>
                </div>
              </div>
              
              {/* Featured Images */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '60px'
              }}>
                {['/images/car_profile.jpg', '/images/car_profile.jpg', '/images/car_profile.jpg'].map((img, index) => (
                  <div key={index} style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 15px 30px var(--color-shadow)',
                    transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    height: '250px',
                    '&:hover': {
                      transform: 'translateY(-10px)'
                    }
                  }}>
                    <img 
                      src={img} 
                      alt="Featured photography" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.7s ease'
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
            
            {/* Featured Work Section */}
            <div style={{ 
              textAlign: 'center', 
              margin: '60px 0',
              padding: '0 20px',
              background: 'var(--color-subtle)',
              paddingTop: '60px',
              paddingBottom: '60px'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 400,
                marginBottom: '20px',
                color: 'var(--color-accent)'
              }}>Featured Work</h2>
              <div className="section-divider"></div>
              <p style={{
                fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                maxWidth: '700px',
                margin: '0 auto 40px',
                color: 'var(--color-text)',
                fontWeight: 300,
                lineHeight: 1.6
              }}>
                A curated collection of my best automotive photography across Georgia and the Southeast. 
                From muscle cars to exotics, I bring your automotive passion to life through my lens.
              </p>
              <button 
                onClick={() => handleTabClick('portfolio')}
                className="btn"
              >
                EXPLORE FULL PORTFOLIO
              </button>
            </div>
          </div>
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

  // Helper function for smooth scrolling
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
    <div className="App" style={{ 
      backgroundColor: 'var(--color-background)', 
      color: 'var(--color-text)',
      minHeight: '100vh',
      minHeight: 'calc(var(--vh, 1vh) * 100)',
      position: 'relative',
      maxWidth: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      {/* Background accent elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '5%',
        width: 'clamp(80px, 15vw, 150px)',
        height: 'clamp(80px, 15vw, 150px)',
        borderRadius: '50%',
        background: 'var(--color-subtle)',
        opacity: 0.4,
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: 'clamp(100px, 18vw, 180px)',
        height: 'clamp(100px, 18vw, 180px)',
        borderRadius: '50%',
        background: 'var(--color-subtle)',
        opacity: 0.3,
        zIndex: 0
      }}></div>
      
      {/* Main content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        width: '100%',
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main style={{
          flex: '1 0 auto',
          width: '100%'
        }}>
          {renderContent()}
        </main>
        
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
        <Footer />
      </div>
    </div>
  );
}

export default App;
