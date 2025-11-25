// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCGLCWBQ1YdNYF0VYYlI403GkYojyC6J1E',
  authDomain: 'dog-velog.firebaseapp.com',
  projectId: 'dog-velog',
  storageBucket: 'dog-velog.firebasestorage.app',
  messagingSenderId: '258374777454',
  appId: '1:258374777454:web:16a5affda7ef037461447f',
  measurementId: 'G-FZ0QF72XRF',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, auth, storage, firestore };
