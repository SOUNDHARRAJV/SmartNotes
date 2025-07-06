// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJzqz3jPoKkqIfp9EFJ_OorZgdmSECiMc",
  authDomain: "smartnotes-976f0.firebaseapp.com",
  projectId: "smartnotes-976f0",
  storageBucket: "smartnotes-976f0.firebasestorage.app",
  messagingSenderId: "1032890078530",
  appId: "1:1032890078530:web:ed890dae4afc15b5b8e4db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
