import React, { useState, useEffect } from 'react';
import { verifyCredentials, createSession, checkSession } from '../auth/authUtils';

const LoginModal = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user already has a valid session
  useEffect(() => {
    if (checkSession()) {
      onLogin();
    }
  }, [onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate credentials
      const isValid = verifyCredentials(username, password);
      
      if (isValid) {
        // Create and store session
        const token = createSession();
        localStorage.setItem('adminSession', token);
        
        // Navigate to admin panel
        onLogin();
      } else {
        setError('Invalid username or password');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        width: '90%',
        maxWidth: '400px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            opacity: 0.7
          }}
        >
          ×
        </button>
        
        <h2 style={{
          fontSize: '1.8rem',
          marginBottom: '25px',
          textAlign: 'center',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-heading)'
        }}>
          Admin Login
        </h2>
        
        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            color: '#f44336',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="username" 
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                opacity: 0.8
              }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '5px',
                border: '1px solid var(--color-subtle)',
                fontSize: '1rem',
                outline: 'none',
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label 
              htmlFor="password" 
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
                opacity: 0.8
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '5px',
                border: '1px solid var(--color-subtle)',
                fontSize: '1rem',
                outline: 'none',
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading ? '#cccccc' : 'var(--color-accent)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'all 0.3s ease',
              letterSpacing: '1px'
            }}
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 