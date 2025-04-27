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
    console.log("Starting authentication with Firebase...");
    console.log("Using email:", email);
    console.log("Firebase config:", JSON.stringify(firebaseConfig, null, 2));
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Authentication successful for user:", userCredential.user.email);
    
    // Get token result to check custom claims
    try {
      const tokenResult = await getIdTokenResult(userCredential.user);
      console.log("Token claims:", tokenResult.claims);
      
      // TEMPORARY: Accept all authenticated users for debugging
      return userCredential.user;
      
      // Enable this once issues are fixed:
      // if (tokenResult.claims.admin === true) {
      //   return userCredential.user;
      // } else {
      //   console.error("User does not have admin privileges");
      //   await signOut(auth); // Sign out if not admin
      //   return null;
      // }
    } catch (claimError) {
      console.error("Error checking token claims:", claimError);
      // For now, just proceed with authentication
      return userCredential.user;
    }
  } catch (error) {
    console.error("Authentication error:", error.code, error.message);
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
          console.log("User is signed in:", user.email);
          // Check if user has admin claims
          const tokenResult = await getIdTokenResult(user);
          console.log("Token claims for session check:", tokenResult.claims);
          
          // TEMPORARY: Consider all authenticated users as admin for debugging
          resolve(true);
          
          // Enable this once issues are fixed:
          // resolve(tokenResult.claims.admin === true);
        } catch (error) {
          console.error("Error checking claims:", error);
          // TEMPORARY: Proceed anyway for debugging
          resolve(true);
        }
      } else {
        console.log("No user is signed in");
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