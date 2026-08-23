import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import About from './components/About';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { checkSession } from './auth/authUtils';
import { getSettings } from './firebase/db';
import { isUsableImageUrl, preloadImage } from './utils/imageUrls';

const MIN_SPLASH_MS = 1100;
const MAX_WAIT_MS = 6000;

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [settings, setSettings] = useState(null);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
  
  useEffect(() => {
    let cancelled = false;
    const started = Date.now();

    const finish = async () => {
      const wait = Math.max(0, MIN_SPLASH_MS - (Date.now() - started));
      await new Promise((resolve) => setTimeout(resolve, wait));
      if (!cancelled) setReady(true);
    };

    const boot = async () => {
      try {
        const settingsData = await Promise.race([
          getSettings(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), MAX_WAIT_MS)),
        ]).catch(() => null);

        if (settingsData) setSettings(settingsData);

        const urls = [];
        if (settingsData && isUsableImageUrl(settingsData.profilePhoto)) {
          urls.push(settingsData.profilePhoto);
        }
        if (settingsData?.homepagePhotos) {
          urls.push(...settingsData.homepagePhotos.filter(isUsableImageUrl).slice(0, 3));
        }

        if (urls.length) {
          await Promise.race([
            Promise.all(urls.map(preloadImage)),
            new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
          ]);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        await finish();
      }
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const splash = document.getElementById('boot-splash');
    document.body.classList.add('site-ready');
    if (splash) {
      splash.classList.add('is-leaving');
      const timer = setTimeout(() => {
        splash.remove();
      }, 750);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [ready]);

  // Check for existing session on load
  useEffect(() => {
    const checkAdminAuth = async () => {
      const isAuthenticated = await checkSession();
      setIsAdmin(isAuthenticated);
      
      if (isAuthenticated && window.location.hash === '#admin') {
        setActiveTab('admin');
      }
    };
    
    checkAdminAuth();
  }, []);

  // Open admin from the quiet footer link (#admin)
  useEffect(() => {
    const applyHash = () => {
      if (window.location.hash !== '#admin') return;
      if (isAdmin) {
        setActiveTab((tab) => (tab === 'admin' ? tab : 'admin'));
      } else {
        setShowLoginModal(true);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [isAdmin]);

  const handleLogout = useCallback(() => {
    setActiveTab('home');
    setIsAdmin(false);
    if (window.location.hash) {
      window.history.pushState("", document.title, window.location.pathname);
    }
  }, []);

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div id="home" className="fade-in">
            <section style={{
              maxWidth: '1200px',
              margin: '0 auto 60px',
              padding: '40px 20px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ 
                textAlign: 'center',
                marginBottom: '40px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 400,
                  marginBottom: '20px',
                  color: 'var(--color-accent)'
                }}>Welcome</h2>
                <div className="section-divider"></div>
                <p style={{
                  fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                  maxWidth: '700px',
                  margin: '0 auto 40px',
                  color: 'var(--color-text)',
                  fontWeight: 300,
                  lineHeight: 1.6
                }}>
                  I'm RS, a professional automotive photographer based in Georgia. 
                  I specialize in capturing the essence and beauty of automobiles, 
                  from classic vintage cars to modern sports cars and everything in between.
                </p>
                <div>
                  <button 
                    onClick={() => handleTabClick('contact')}
                    style={{
                      display: 'inline-block',
                      padding: '12px 30px',
                      backgroundColor: 'var(--color-accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
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
              <div className="featured-images-container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '60px'
              }}>
                {settings && settings.homepagePhotos && 
                 settings.homepagePhotos.filter(isUsableImageUrl).map((img, index) => (
                  <div key={index} className="featured-image-item" style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 15px 30px var(--color-shadow)',
                    transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    height: '0',
                    paddingBottom: '75%',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-10px)'
                    }
                  }}>
                    <img 
                      src={img} 
                      alt="" 
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
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
        return <About profilePhoto={settings?.profilePhoto} />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return isAdmin ? <AdminPanel onLogout={handleLogout} /> : <div>Not authorized</div>;
      default:
        return <About profilePhoto={settings?.profilePhoto} />;
    }
  };

  // Handle successful login
  const handleLogin = useCallback(() => {
    setShowLoginModal(false);
    setIsAdmin(true);
    setActiveTab('admin');
    if (window.location.hash !== '#admin') {
      window.location.hash = 'admin';
    }
  }, []);

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
    <div
      className={`App${ready ? ' is-ready' : ''}`}
      style={{
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
        <Header profilePhoto={settings?.profilePhoto} />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main style={{
          flex: '1 0 auto',
          width: '100%'
        }}>
          {renderContent()}
        </main>
        
        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal 
            onClose={() => {
              setShowLoginModal(false);
              if (window.location.hash === '#admin') {
                window.history.pushState('', document.title, window.location.pathname);
              }
            }} 
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
