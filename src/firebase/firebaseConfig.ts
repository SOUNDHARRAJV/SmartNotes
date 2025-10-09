import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzIwRTP2Dlv_AtPlQjkM6mTFgH4g3JSyQ",
  authDomain: "smartnotes-b278e.firebaseapp.com",
  projectId: "smartnotes-b278e",
  storageBucket: "smartnotes-b278e.appspot.com", 
  messagingSenderId: "152910152746",
  appId: "1:152910152746:web:34bf5f9b4c734678e46f53",
  measurementId: "G-WJ6DR1VEF1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firestore reference with settings to avoid network issues in some environments
export const db = getFirestore(app);

// Storage reference
export const storage = getStorage(app);

// Auth reference
export const auth = getAuth(app);
