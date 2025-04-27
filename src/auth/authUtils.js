// Advanced security utilities for authentication
// Note: This is still client-side authentication, which is not truly secure
// For real applications, use server-side authentication

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  getIdTokenResult
} from 'firebase/auth';
import app from '../firebase/init';

const auth = getAuth(app);

// Session timeout duration (30 minutes in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Track last activity time
let lastActivityTime = Date.now();

// Update last activity time on user interaction
const updateLastActivity = () => {
  lastActivityTime = Date.now();
};

// Check if session has timed out
const checkSessionTimeout = () => {
  const currentTime = Date.now();
  if (currentTime - lastActivityTime > SESSION_TIMEOUT) {
    // Session has timed out, sign out the user
    signOut(auth);
    return true;
  }
  return false;
};

// Set up activity listeners
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', updateLastActivity);
  window.addEventListener('keypress', updateLastActivity);
  window.addEventListener('click', updateLastActivity);
  window.addEventListener('scroll', updateLastActivity);
}

// Sign in with email and password
export const verifyCredentials = async (email, password) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log("Authentication attempt started");
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    updateLastActivity(); // Update activity time on successful login
    
    // Get token result to check custom claims
    try {
      const tokenResult = await getIdTokenResult(userCredential.user);
      
      // Check admin privileges
      if (tokenResult.claims.admin === true) {
        return userCredential.user;
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log("User does not have admin privileges");
        }
        await signOut(auth);
        return null;
      }
    } catch (claimError) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Error checking admin privileges");
      }
      await signOut(auth);
      return null;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Authentication failed");
    }
    return null;
  }
};

// Check if user is logged in and has admin privileges
export const checkSession = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        try {
          // Check for session timeout
          if (checkSessionTimeout()) {
            resolve(false);
            return;
          }
          
          const tokenResult = await getIdTokenResult(user);
          resolve(tokenResult.claims.admin === true);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log("Error checking session claims");
          }
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
};

// Create auth session is no longer needed as Firebase handles this
export const createSession = () => {
  // This is handled by Firebase Authentication
  return true;
};

// Logout function
export const logout = () => {
  return signOut(auth);
}; 