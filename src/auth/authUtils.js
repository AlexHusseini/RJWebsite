// Advanced security utilities for authentication
// Note: This is still client-side authentication, which is not truly secure
// For real applications, use server-side authentication

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  getIdTokenResult
} from 'firebase/auth';
import firebaseConfig from '../firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign in with email and password
export const verifyCredentials = async (email, password) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log("Authentication attempt started");
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
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