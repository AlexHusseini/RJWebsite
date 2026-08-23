import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2jiJGAjSQAjxMXTf8Px4rdIR-tn0xeAc",
  authDomain: "photography-website-ad90f.firebaseapp.com",
  projectId: "photography-website-ad90f",
  storageBucket: "photography-website-ad90f.firebasestorage.app",
  messagingSenderId: "121884957179",
  appId: "1:121884957179:web:05ad3f527000724919135e",
  measurementId: "G-977N9PRR2R"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);

export default app;
