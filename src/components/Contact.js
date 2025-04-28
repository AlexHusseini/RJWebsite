import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _honey: '' // Honeypot field
  });
  
  const [formStatus, setFormStatus] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    // Check if there's a stored submission timestamp
    const lastSubmission = localStorage.getItem('lastFormSubmission');
    if (lastSubmission) {
      const timeSinceSubmission = Date.now() - parseInt(lastSubmission, 10);
      const cooldownPeriod = 60000; // 1 minute cooldown
      
      if (timeSinceSubmission < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - timeSinceSubmission) / 1000);
        setCooldownTime(remainingTime);
        setSubmitDisabled(true);
        
        const timer = setInterval(() => {
          setCooldownTime(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setSubmitDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If honeypot field is filled, silently reject the submission
    if (formData._honey) {
      console.log('Bot submission detected');
      setFormStatus('success'); // Fake success to avoid giving feedback to bots
      return;
    }
    
    // Additional validation
    if (formData.email.includes('script') || formData.message.includes('script')) {
      setFormStatus('error');
      return;
    }
    
    // Check message length
    if (formData.message.length > 1000) {
      setFormStatus('error');
      return;
    }
    
    setFormStatus('pending');
    setSubmitDisabled(true);
    
    // Basic input sanitization
    const sanitizedData = {
      name: formData.name.trim().replace(/[<>]/g, ''),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim().replace(/[<>]/g, ''),
      message: formData.message.trim().replace(/[<>]/g, '')
    };
    
    try {
      // Send form data to Formspree
      const response = await fetch('https://formspree.io/f/xzzrzwkv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sanitizedData)
      });
      
      if (response.ok) {
        // Store submission timestamp for cooldown
        localStorage.setItem('lastFormSubmission', Date.now().toString());
        
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          _honey: ''
        });
        
        // Set cooldown
        setCooldownTime(60);
        const timer = setInterval(() => {
          setCooldownTime(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setSubmitDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus('error');
      setSubmitDisabled(false);
    }
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setFormStatus(null);
    }, 5000);
  };

  return (
    <section id="contact" className="fade-in" style={{
      maxWidth: '900px',
      margin: '0 auto 80px',
      padding: '0 20px',
    }}>
      <div className="section-header">
        <h2 className="section-title">Get In Touch</h2>
        <div className="section-divider"></div>
        <p style={{
          maxWidth: '600px',
          margin: '0 auto',
          color: 'var(--color-text)',
          opacity: 0.8,
          fontWeight: 300,
          fontSize: '1.1rem',
          lineHeight: 1.6
        }}>
          Interested in hiring me for a project or have questions about my work?
          Feel free to reach out using the form below.
        </p>
      </div>
      
      <div className="card" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '50px',
        alignItems: 'start',
        width: '100%',
        height: 'auto',
        overflow: 'visible',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
          gap: '30px',
          display: 'flex',
          flexDirection: 'column'
        }
      }}>
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '20px',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-accent)',
            position: 'relative',
            display: 'inline-block'
          }}>
            Contact Information
            <span style={{
              position: 'absolute',
              bottom: '-5px',
              left: '0',
              width: '40%',
              height: '2px',
              background: 'var(--color-accent)',
              opacity: '0.5'
            }}></span>
          </h3>
          
          <p style={{
            marginBottom: '30px',
            fontSize: '1rem',
            lineHeight: 1.8,
            opacity: 0.8,
            color: 'var(--color-text)'
          }}>
            I'm based in Cumming, Georgia but work with clients throughout the Southeast.
            Expect a response within 24-48 hours.
          </p>
          
          <div style={{ marginBottom: '30px' }}>
            <div className="contact-info-item">
              <div className="contact-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="var(--color-accent)"/>
                </svg>
              </div>
              <span>rj.shaheen03@gmail.com</span>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="var(--color-accent)"/>
                </svg>
              </div>
              <span>(678)-428-2235</span>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="var(--color-accent)"/>
                </svg>
              </div>
              <a 
                href="https://maps.google.com/?q=Cumming+GA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View location on Google Maps"
                style={{
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                  transition: 'color 0.3s ease'
                }}
              >
                Cumming, GA
              </a>
            </div>
          </div>
          
          <div style={{
            marginTop: '40px',
            display: 'flex',
            gap: '15px'
          }}>
            {[
              { name: 'Instagram', url: 'https://www.instagram.com/rs.photography03/' }
            ].map(social => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  borderBottom: '1px solid var(--color-accent)',
                  paddingBottom: '3px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.color = 'var(--color-accent)'}
                onMouseOut={(e) => e.target.style.color = 'var(--color-text)'}
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
        
        <div>
          {formStatus === 'success' ? (
            <div className="success-message">
              <p style={{
                color: '#4BB543',
                fontWeight: '500',
                marginBottom: '5px'
              }}>Message Sent!</p>
              <p style={{
                opacity: 0.8,
                color: 'var(--color-text)'
              }}>Thank you for reaching out. I'll get back to you soon.</p>
            </div>
          ) : formStatus === 'error' ? (
            <div className="error-message">
              <p style={{
                color: '#d32f2f',
                fontWeight: '500',
                marginBottom: '5px'
              }}>Something went wrong!</p>
              <p style={{
                opacity: 0.8,
                color: 'var(--color-text)'
              }}>Please try again or contact me directly via email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={150}
                />
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  maxLength={1000}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
              
              {/* Honeypot field - hidden from users but bots might fill it */}
              <div style={{ display: 'none' }}>
                <label htmlFor="_honey">Leave this empty</label>
                <input
                  type="text"
                  id="_honey"
                  name="_honey"
                  value={formData._honey}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              
              <button
                type="submit"
                className="btn"
                disabled={submitDisabled || formStatus === 'pending'}
              >
                {formStatus === 'pending' ? 'SENDING...' : 
                 cooldownTime > 0 ? `WAIT (${cooldownTime}s)` : 'SEND MESSAGE'}
              </button>
              
              {cooldownTime > 0 && formStatus !== 'pending' && formStatus !== 'success' && (
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--color-text)', 
                  opacity: 0.7,
                  marginTop: '10px' 
                }}>
                  Please wait {cooldownTime} seconds before sending another message
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact; 