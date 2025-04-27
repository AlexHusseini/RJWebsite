const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2jiJGAjSQAjxMXTf8Px4rdIR-tn0xeAc",
  authDomain: "photography-website-ad90f.firebaseapp.com",
  projectId: "photography-website-ad90f",
  storageBucket: "photography-website-ad90f.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890",
  databaseURL: "https://photography-website-ad90f-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);

// Sample photo data
const samplePhotos = [
  {
    title: 'Mountain Vista',
    section: 'landscape',
    alt: 'A breathtaking view of mountains at sunset',
    src: 'photo1.jpg'
  },
  {
    title: 'Serene Lake',
    section: 'landscape',
    alt: 'A peaceful lake reflecting the surrounding mountains',
    src: 'photo2.jpg'
  },
  {
    title: 'Portrait Study',
    section: 'portrait',
    alt: 'A thoughtful portrait of a young woman',
    src: 'photo3.jpg'
  },
  {
    title: 'Urban Portrait',
    section: 'portrait',
    alt: 'A man in an urban setting',
    src: 'photo4.jpg'
  },
  {
    title: 'City Life',
    section: 'street',
    alt: 'A busy street scene in the city',
    src: 'photo5.jpg'
  },
  {
    title: 'Street Vendor',
    section: 'street',
    alt: 'A street vendor at work',
    src: 'photo6.jpg'
  },
  {
    title: 'Modern Architecture',
    section: 'architecture',
    alt: 'A modern building exterior',
    src: 'photo7.jpg'
  },
  {
    title: 'Historic Building',
    section: 'architecture',
    alt: 'A historic architecture detail',
    src: 'photo8.jpg'
  }
];

async function addSamplePhotos() {
  try {
    for (const photo of samplePhotos) {
      console.log(`Processing photo: ${photo.title}`);
      
      // Read the image file
      const imagePath = path.join(__dirname, '..', 'public', 'images', photo.src);
      console.log(`Reading file from: ${imagePath}`);
      const imageBuffer = fs.readFileSync(imagePath);

      // Create file metadata including the content type
      const metadata = {
        contentType: 'image/jpeg',
      };

      // Upload to Firebase Storage
      const timestamp = Date.now();
      const filename = `${photo.section}/${timestamp}_${photo.src}`;
      console.log(`Uploading to Firebase Storage as: ${filename}`);
      const storageRef = ref(storage, filename);
      
      // Upload the file and metadata
      const snapshot = await uploadBytes(storageRef, imageBuffer, metadata);
      console.log('Uploaded a blob or file!');
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(`Got download URL: ${downloadURL}`);

      // Add to Firestore
      console.log(`Adding to Firestore...`);
      await addDoc(collection(db, 'photos'), {
        title: photo.title,
        section: photo.section,
        alt: photo.alt,
        url: downloadURL,
        createdAt: new Date().toISOString()
      });

      console.log(`Added photo: ${photo.title}`);
    }

    console.log('All sample photos added successfully!');
  } catch (error) {
    console.error('Error adding sample photos:', error);
    console.error('Error details:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.serverResponse) console.error('Server response:', error.serverResponse);
  }
}

addSamplePhotos(); 