import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2jiJGAjSQAjxMXTf8Px4rdIR-tn0xeAc",
  authDomain: "photography-website-ad90f.firebaseapp.com",
  projectId: "photography-website-ad90f",
  storageBucket: "photography-website-ad90f.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890",
  databaseURL: "https://photography-website-ad90f-default-rtdb.firebaseio.com"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firestore
export const db = getFirestore(app);

export default app; 